import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { GoogleGenAI } from '@google/genai';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import multer from 'multer';

// Observability Imports
import { requestId } from './middleware/requestId.js';
import { metricsMiddleware } from './middleware/metrics.js';
import { log } from './lib/logger.js';
import { metrics } from './lib/metrics.js';
import { globalLimiter, authLimiter, aiLimiter } from './middleware/limiter.js';

// Bootstrap & Checks
import { envCheck } from './bootstrap/envCheck.js';
import { prisma } from './lib/prisma.js';

// Modules
import { clinicalRouter } from './modules/clinical/routes.js';
import { authRequired } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';
import { AuditService } from './modules/audit/service.js';

dotenv.config();

// 1. Fail-fast
envCheck();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ENABLE_AI = process.env.ENABLE_AI_INSIGHTS !== 'false';

if (process.env.USE_DB === "true") {
  log.info("System Startup", { mode: "Prisma/Postgres" });
} else {
  log.warn("System Startup", { mode: "In-Memory (Mock)" });
}

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// --- Middleware Stack ---

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. Request ID (Traceability)
app.use(requestId);

// 3. Metrics (Observability)
app.use(metricsMiddleware);

// 4. Global Rate Limit
app.use(globalLimiter);

// 5. Structured Access Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    log.info("HTTP Access", {
      reqId: req.reqId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: duration,
      userAgent: req.get('user-agent')
    });
  });
  next();
});

// 6. CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));

// --- SYSTEM ROUTES ---

app.get('/health', async (req, res) => {
    const health = {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date(),
        db: 'n/a'
    };

    if (process.env.USE_DB === 'true') {
        try {
            await prisma.$queryRaw`SELECT 1`;
            health.db = 'connected';
        } catch (e) {
            health.db = 'disconnected';
            health.status = 'degraded';
            log.error("Health Check Failed", { error: e.message });
            return res.status(503).json(health);
        }
    } else {
        health.db = 'memory_mode';
    }

    res.json(health);
});

// Internal Metrics Endpoint (Protected)
app.get('/internal/metrics', (req, res) => {
    // In production, ensure this is protected by VPN or internal network rules
    res.json(metrics.snapshot());
});

// --- API ROUTES ---
app.use('/api/clinical', clinicalRouter);

app.get('/api/audit/mine', authRequired, (req, res) => {
  const logs = AuditService.listByActor(req.user.id);
  res.json({ data: logs });
});

// --- AUTH ROUTES (Strict Rate Limit) ---
const authRouter = express.Router();
authRouter.use(authLimiter);

// DEMO ACCOUNTS - SEEDED FOR INVESTOR DEMO
const users = [
    { 
        id: 'usr_doc_1', 
        name: 'Dr. Sarah Chen', 
        email: 'doctor@wysh.demo', // Matches Demo Checklist
        role: 'doctor', 
        password: 'password', 
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300' 
    },
    { 
        id: 'usr_pat_1', 
        name: 'Alex Doe', 
        email: 'patient@wysh.demo', // Matches Demo Checklist
        role: 'patient', 
        password: 'password', 
        avatar: 'https://ui-avatars.com/api/?name=Alex+Doe&background=random' 
    }
];

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && (u.password === password || u.password === undefined));
  
  if (!user) {
      log.warn("Login Failed", { reqId: req.reqId, email });
      // Add artificial delay to mitigate timing attacks
      setTimeout(() => res.status(401).json({ error: 'Invalid credentials' }), 500);
      return;
  }
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '15m' }); // Short-lived access token
  AuditService.log(user.id, 'LOGIN', 'auth_system');
  res.json({ user, token });
});

authRouter.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User exists' });
  
  const newUser = {
    id: `usr_${Math.random().toString(36).substr(2, 9)}`,
    name, email, role, password,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
  };
  users.push(newUser);
  
  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '15m' });
  AuditService.log(newUser.id, 'REGISTER', 'auth_system');
  res.status(201).json({ user: newUser, token });
});

app.use('/api/auth', authRouter);

app.get('/api/auth/me', authRequired, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ user: user || req.user });
});

// --- AI ROUTES (Very Strict Rate Limit) ---
const aiRouter = express.Router();
aiRouter.use(authRequired);
aiRouter.use(aiLimiter); // Protect AI endpoints

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

aiRouter.post('/health-insight', async (req, res) => {
  if (!ENABLE_AI) return res.status(403).json({ error: "AI Features Disabled" });
  if (!ai) return res.status(503).json({ error: 'AI Service Unavailable' });
  
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: "Invalid prompt" });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    AuditService.log(req.user.id, 'GENERATE_INSIGHT', 'gemini_flash');
    res.json({ text: response.text });
  } catch (err) {
    log.error("AI Generation Failed", { reqId: req.reqId, error: err.message });
    res.status(500).json({ error: 'AI Error' });
  }
});

aiRouter.post('/document-extract', upload.single('file'), async (req, res) => {
  if (!ENABLE_AI) return res.status(403).json({ error: "AI Features Disabled" });
  if (!ai) return res.status(503).json({ error: 'AI Service Unavailable' });
  
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file' });
    
    // Feature: Deduplication check could go here if hashes were stored
    
    const base64 = file.buffer.toString('base64');
    const prompt = `Extract medical data (summary, diagnosis, medications, labs) in JSON from this ${req.body.documentType}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ inlineData: { mimeType: file.mimetype, data: base64 } }, { text: prompt }],
      config: { responseMimeType: 'application/json' }
    });
    
    let jsonStr = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    AuditService.log(req.user.id, 'EXTRACT_DOC_DATA', `doc_type:${req.body.documentType}`);
    res.json({ success: true, data: JSON.parse(jsonStr) });
  } catch (err) {
    log.error("AI Extraction Failed", { reqId: req.reqId, error: err.message });
    res.status(500).json({ error: 'Extraction Failed' });
  }
});

app.use('/api/ai', aiRouter);

// Final Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  log.info(`Wysh Care OS Server listening`, { port: PORT, env: process.env.NODE_ENV });
});