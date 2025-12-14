
import { prisma } from '../lib/prisma.js';

export const tenantGuard = async (req, res, next) => {
  // Only applies to clinical staff (Doctors, Nurses, Admins)
  if (req.user.role !== 'DOCTOR' && req.user.role !== 'ADMIN') {
    return next();
  }

  // 1. Fetch User's Tenant Context
  const doctor = await prisma.doctor.findUnique({
    where: { userId: req.user.id },
    select: { hospitalId: true }
  });

  if (!doctor || !doctor.hospitalId) {
    // If doctor has no hospital (e.g., independent/freelance), they have global view or self-managed view.
    // For strict multi-tenancy, we might block this.
    // Here we allow but flag it in request for controllers to handle.
    req.tenantId = null;
    return next();
  }

  req.tenantId = doctor.hospitalId;

  // 2. If accessing a specific resource, check ownership
  // (This logic is usually in the controller or service layer, 
  // but we can inject filters into req for Prisma queries)
  req.tenantFilter = { hospitalId: doctor.hospitalId };

  next();
};
