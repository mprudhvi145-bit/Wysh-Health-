import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'wysh-secure-dev-secret-key-change-in-prod';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn("⚠️  WARNING: GOOGLE_CLIENT_ID is not set in server/.env. Google Auth will fail.");
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// --- In-Memory Mock Database ---
// In a real app, use MongoDB/PostgreSQL
const users = [
  {
    id: 'usr_demo_doc',
    name: 'Dr. Demo',
    email: 'doctor@wysh.com',
    password: 'password', // In prod: bcrypt hash
    role: 'doctor',
    avatar: 'https://ui-avatars.com/api/?name=Dr+Demo&background=8763FF&color=fff',
    specialty: 'Cardiology'
  }
];

// --- Middleware ---

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

app.use('/api/', limiter);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 1. Google Sign-In
app.post('/api/auth/google', async (req, res) => {
  try {
    console.log("Google token received");
    const { token, role = 'patient' } = req.body;
    
    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = users.find(u => u.email === email);

    if (!user) {
      // Register new user
      user = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        role, // Default to patient or whatever was passed
        avatar: picture,
        googleId,
        linkedGoogle: true
      };
      users.push(user);
    } else if (!user.linkedGoogle) {
      // Link existing account
      user.linkedGoogle = true;
      user.googleId = googleId;
      if (!user.avatar) user.avatar = picture;
    }

    const authToken = generateToken(user);
    res.json({ user, token: authToken });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ error: 'Invalid Google Token' });
  }
});

// 2. Email/Password Login (Mock Credentials)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user (Mock password check - use bcrypt in prod)
  const user = users.find(u => u.email === email && (u.password === password || u.password === undefined)); // undefined allow mock users created via register

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ user, token });
});

// 3. Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: `usr_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    password, // Hash this in prod!
    role: role || 'patient',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
  };

  users.push(newUser);
  const token = generateToken(newUser);
  res.status(201).json({ user: newUser, token });
});

// 4. Get Current User (Session Restore)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  // Return fresh data from DB using ID from token
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.sendStatus(404);
  res.json({ user });
});

// --- AI Service ---

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey) {
  console.error("⚠️  FATAL: GEMINI_API_KEY is not set. Please check server/.env file.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.post('/api/ai/health-insight', authenticateToken, async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: 'AI Service not configured (Missing API Key).' });
  }

  try {
    const { prompt, systemInstruction } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt provided.' });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ error: 'Prompt exceeds maximum length.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are Wysh AI, a helpful healthcare assistant.",
        maxOutputTokens: 500,
      }
    });

    return res.json({ 
      text: response.text,
      status: 'success'
    });

  } catch (error) {
    console.error('Gemini Proxy Error:', error);
    const statusCode = error.status || 500;
    const errorMessage = statusCode === 429 
      ? 'System busy, please try again.' 
      : 'Internal AI processing error.';
    return res.status(statusCode).json({ error: errorMessage });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Wysh Care AI & Auth Proxy' });
});

// --- Start Server ---

app.listen(PORT, () => {
  console.log(`Wysh Backend running on http://localhost:${PORT}`);
});