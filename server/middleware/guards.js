
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'wysh-secure-dev-secret-key-change-in-prod';

// 1. JWT Auth Guard
export const jwtAuthGuard = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// 2. Role Guard
export const roleGuard = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'User context missing' });
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const userRole = req.user.role?.toLowerCase();
  
  if (userRole === 'admin') return next();

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: `Access denied. Required role: ${allowedRoles.join(' or ')}` });
  }
  next();
};

// 3. Consent Guard (The Core Engine)
export const consentGuard = async (req, res, next) => {
  if (req.user.role === 'patient') return next();

  if (req.user.role === 'doctor') {
      const doctorId = req.user.id; 
      const patientId = req.params.patientId || req.body.patientId;

      if (!patientId) return res.status(400).json({ error: "Context missing: patientId" });

      const doctor = await prisma.doctor.findUnique({ where: { userId: doctorId } });
      if (!doctor) return res.status(403).json({ error: "Doctor profile not found" });

      // Check for Active Consent
      const activeConsent = await prisma.consent.findFirst({
          where: {
              doctorId: doctor.id,
              patientId: patientId,
              status: 'APPROVED',
              updatedAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24h validity
          }
      });

      if (activeConsent) {
          req.consent = activeConsent;
          return next();
      }

      // Check for Appointment (Implicit)
      const appointment = await prisma.encounter.findFirst({
          where: {
              doctorId: doctor.id,
              patientId: patientId,
              status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
              scheduledAt: { 
                  gte: new Date(Date.now() - 2 * 60 * 60 * 1000), 
                  lte: new Date(Date.now() + 2 * 60 * 60 * 1000) 
              }
          }
      });

      if (appointment) return next();

      return res.status(403).json({ error: "Access Denied: No active consent or appointment found." });
  }

  next();
};
