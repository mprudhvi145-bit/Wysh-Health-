
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
import { abdmRouter } from './modules/abdm/routes.js';
import { authRouter } from './modules/auth/routes.js'; // NEW
import { consentRouter } from './modules/consent/routes.js'; // NEW
import { emergencyRouter } from './modules/emergency/routes.js'; // NEW

import { jwtAuthGuard } from './middleware/guards.js';
import { errorHandler } from './middleware/error.js';
import { AuditService } from './modules/audit/service.js';

dotenv.config();

// 1. Fail-fast
envCheck();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const ENABLE_AI = process.env.ENABLE_AI_INSIGHTS !== 'false';

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// --- Middleware Stack ---
app.use(helmet());
app.use(requestId);
app.use(metricsMiddleware);
app.use(globalLimiter);
app.use(express.json({ limit: '100kb' }));

// Access Logger
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

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  credentials: true
}));

// --- SYSTEM ROUTES ---
app.get('/health', async (req, res) => {
    const health = {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date(),
        db: 'n/a'
    };
    try {
        await prisma.$queryRaw`SELECT 1`;
        health.db = 'connected';
    } catch (e) {
        health.db = 'disconnected';
    }
    res.json(health);
});

// --- API ROUTES ---

// 1. Core Engine (Step 2)
app.use('/api/auth', authRouter);
app.use('/api/consent', consentRouter);
app.use('/api/emergency', emergencyRouter);

// 2. Domain Modules
app.use('/api/clinical', clinicalRouter);
app.use('/api/abdm', abdmRouter);

// Audit Endpoint
app.get('/api/audit/mine', jwtAuthGuard, (req, res) => {
  const logs = AuditService.listByActor(req.user.id);
  res.json({ data: logs });
});

// --- AI ROUTES (Protected) ---
const aiRouter = express.Router();
aiRouter.use(jwtAuthGuard);
aiRouter.use(aiLimiter);

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

aiRouter.post('/health-insight', async (req, res) => {
  if (!ENABLE_AI) return res.status(403).json({ error: "AI Features Disabled" });
  if (!ai) return res.status(503).json({ error: 'AI Service Unavailable' });
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    AuditService.log(req.user.id, 'GENERATE_INSIGHT', 'gemini_flash');
    res.json({ text: response.text });
  } catch (err) {
    res.status(500).json({ error: 'AI Error' });
  }
});

aiRouter.post('/document-extract', upload.single('file'), async (req, res) => {
  if (!ENABLE_AI || !ai) return res.status(503).json({ error: 'AI Service Unavailable' });
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
    AuditService.log(req.user.id, 'EXTRACT_DOC_DATA', `doc_type:${req.body.documentType}`);
    res.json({ success: true, data: JSON.parse(jsonStr) });
  } catch (err) {
    res.status(500).json({ error: 'Extraction Failed' });
  }
});

app.use('/api/ai', aiRouter);

// Final Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  log.info(`Wysh Care OS Server listening`, { port: PORT, env: process.env.NODE_ENV });
});
