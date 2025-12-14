
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';

// Observability Imports
import { requestId } from './middleware/requestId.js';
import { metricsMiddleware } from './middleware/metrics.js';
import { log } from './lib/logger.js';
import { globalLimiter } from './middleware/limiter.js';

// Bootstrap & Checks
import { envCheck } from './bootstrap/envCheck.js';
import { prisma } from './lib/prisma.js';

// Modules
import { clinicalRouter } from './modules/clinical/routes.js';
import { abdmRouter } from './modules/abdm/routes.js';
import { authRouter } from './modules/auth/routes.js'; 
import { consentRouter } from './modules/consent/routes.js';
import { emergencyRouter } from './modules/emergency/routes.js'; 
import { patientRouter } from './modules/patient/routes.js';
import { aiRouter } from './modules/ai/routes.js'; // NEW

import { jwtAuthGuard } from './middleware/guards.js';
import { errorHandler } from './middleware/error.js';
import { AuditService } from './modules/audit/service.js';

dotenv.config();

// 1. Fail-fast
envCheck();

const app = express();
const PORT = process.env.PORT || 3001;
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

// 1. Core Engine
app.use('/api/auth', authRouter);
app.use('/api/consent', consentRouter);
app.use('/api/emergency', emergencyRouter);

// 2. Domain Modules
app.use('/api/clinical', clinicalRouter);
app.use('/api/abdm', abdmRouter);
app.use('/api/patient', patientRouter);
app.use('/api/ai', aiRouter); // Registered under new path

// Audit Endpoint
app.get('/api/audit/mine', jwtAuthGuard, (req, res) => {
  const logs = AuditService.listByActor(req.user.id);
  res.json({ data: logs });
});

// Legacy/Direct AI Routes (Keep for backward compat or deprecate)
// aiRouter handles /health-insight internally now if moved, 
// but we keep the direct definition here for document-extract to use upload middleware easily in one place if not refactored.
// Actually, let's keep document-extract here for simplicity of the upload middleware binding
// or move it to aiRouter if we pass upload middleware there.
// For Step 5, we use the new `aiRouter` for logic.

// Final Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  log.info(`Wysh Care OS Server listening`, { port: PORT, env: process.env.NODE_ENV });
});
