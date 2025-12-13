import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import multer from 'multer';

// Import new modular routes
import { clinicalRouter } from './modules/clinical/routes.js';
import { authRequired } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';
import { AuditService } from './modules/audit/service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'wysh-secure-dev-secret-key-change-in-prod';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Persistence Mode Check
if (process.env.USE_DB === "true") {
  console.log("🟦 Clinical Repo: Prisma (PostgreSQL)");
} else {
  console.log("🟨 Clinical Repo: In-memory (Mock)");
}

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// --- Middleware ---

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));

// Rate Limiter
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100,
}));

// --- MOUNT MODULAR ROUTES ---
app.use('/api/clinical', clinicalRouter);

// Debug Route for Audit Logs (Dev only)
app.get('/api/audit/mine', authRequired, (req, res) => {
  const logs = AuditService.listByActor(req.user.id);
  res.json({ data: logs });
});

// --- LEGACY / AUTH / AI ROUTES (Keep in index.js for now or refactor later) ---

// Mock User DB for Auth (Sync with repo.memory.js logic ideally, but keeping simple here for Auth endpoints)
const users = [
    { id: 'usr_doc_1', name: 'Dr. Sarah Chen', email: 'doctor@wysh.com', role: 'doctor', password: 'password', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300' },
    { id: 'usr_pat_1', name: 'Alex Doe', email: 'alex@example.com', role: 'patient', password: 'password', avatar: 'https://ui-avatars.com/api/?name=Alex+Doe&background=random' }
];

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && (u.password === password || u.password === undefined));
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ user, token });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User exists' });
  
  const newUser = {
    id: `usr_${Math.random().toString(36).substr(2, 9)}`,
    name, email, role, password,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
  };
  users.push(newUser);
  
  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '24h' });
  res.status(201).json({ user: newUser, token });
});

app.get('/api/auth/me', authRequired, (req, res) => {
  // Mock finding user
  const user = users.find(u => u.id === req.user.id);
  res.json({ user: user || req.user });
});


// AI Service Routes
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.post('/api/ai/health-insight', authRequired, async (req, res) => {
  if (!ai) return res.status(503).json({ error: 'AI Service Unavailable' });
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    res.json({ text: response.text });
  } catch (err) {
    res.status(500).json({ error: 'AI Error' });
  }
});

app.post('/api/ai/document-extract', authRequired, upload.single('file'), async (req, res) => {
  if (!ai) return res.status(503).json({ error: 'AI Service Unavailable' });
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file' });
    
    const base64 = file.buffer.toString('base64');
    const prompt = `Extract medical data (summary, diagnosis, medications, labs) in JSON from this ${req.body.documentType}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ inlineData: { mimeType: file.mimetype, data: base64 } }, { text: prompt }],
      config: { responseMimeType: 'application/json' }
    });
    
    let jsonStr = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    res.json({ success: true, data: JSON.parse(jsonStr) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Extraction Failed' });
  }
});

// Use Global Error Handler (Last Middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Wysh Care OS Server running on port ${PORT}`);
});