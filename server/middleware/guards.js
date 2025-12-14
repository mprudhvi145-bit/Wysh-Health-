
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
    
    // Optional: Check if user exists/active in DB for extra security
    // const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    // if (!user) throw new Error("User invalid");

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
  
  // Admin bypass
  if (userRole === 'admin') return next();

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: `Access denied. Required role: ${allowedRoles.join(' or ')}` });
  }
  next();
};

// 3. Consent Guard (The Core Engine)
export const consentGuard = async (req, res, next) => {
  // If user is accessing their own data, pass
  if (req.user.role === 'patient') {
      // Typically verified by ensuring req.params.patientId === req.user.patientId
      // For now, we trust the route handler to check resource ownership for patients
      return next();
  }

  // Doctors/Admins must have explicit consent
  if (req.user.role === 'doctor') {
      const doctorId = req.user.id; // Assuming user.id maps to Doctor.userId logic
      const patientId = req.params.patientId || req.body.patientId;

      if (!patientId) return res.status(400).json({ error: "Context missing: patientId" });

      // 1. Check Permanent Relationship (e.g. Assigned Doctor)
      const doctor = await prisma.doctor.findUnique({ where: { userId: doctorId } });
      if (!doctor) return res.status(403).json({ error: "Doctor profile not found" });

      // Check for Active Consent Request that is APPROVED
      const activeConsent = await prisma.consentRequest.findFirst({
          where: {
              doctorId: doctor.id,
              patientId: patientId,
              status: 'APPROVED',
              updatedAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Valid for 24 hours
          }
      });

      if (activeConsent) {
          req.consent = activeConsent;
          return next();
      }

      // 2. Check for Appointment (Implicit Consent for duration of visit)
      const appointment = await prisma.encounter.findFirst({
          where: {
              doctorId: doctor.id,
              patientId: patientId,
              status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
              scheduledAt: { 
                  gte: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                  lte: new Date(Date.now() + 2 * 60 * 60 * 1000)  // 2 hours future
              }
          }
      });

      if (appointment) return next();

      return res.status(403).json({ error: "Access Denied: No active consent or appointment found." });
  }

  next();
};
