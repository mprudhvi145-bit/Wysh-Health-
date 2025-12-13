import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Security Middleware ---

// 1. CORS: Allow requests from your frontend (adjust origin for production)
app.use(cors({
  origin: process.env.CLIENT_URL || '*', 
  methods: ['POST']
}));

// 2. Body Size Limit: Prevent large payload attacks
app.use(express.json({ limit: '100kb' }));

// 3. Rate Limiting: Prevent abuse (e.g., 50 requests per 15 minutes per IP)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 50, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// --- AI Service Setup ---

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Routes ---

app.post('/api/ai/health-insight', aiLimiter, async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;

    // Input Validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt provided.' });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ error: 'Prompt exceeds maximum length.' });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are Wysh AI, a helpful healthcare assistant.",
        maxOutputTokens: 500, // Limit output cost
      }
    });

    // Return structured response
    return res.json({ 
      text: response.text,
      status: 'success'
    });

  } catch (error) {
    console.error('Gemini Proxy Error:', error);
    
    // Secure Error Handling: Don't leak stack traces to client
    const statusCode = error.status || 500;
    const errorMessage = statusCode === 429 
      ? 'System busy, please try again.' 
      : 'Internal AI processing error.';

    return res.status(statusCode).json({ error: errorMessage });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Wysh Care AI Proxy' });
});

// --- Start Server ---

app.listen(PORT, () => {
  console.log(`AI Proxy Server running on http://localhost:${PORT}`);
});