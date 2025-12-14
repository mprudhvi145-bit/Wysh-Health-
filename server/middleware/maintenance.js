
export const maintenanceGuard = (req, res, next) => {
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  
  if (isMaintenance) {
    // Allow Admins to bypass
    if (req.user && req.user.role === 'ADMIN') {
        return next();
    }
    
    // Allow Health Check
    if (req.path === '/health') {
        return next();
    }

    return res.status(503).json({
      error: "System Maintenance",
      message: "Wysh Care is currently in maintenance mode. Please try again later."
    });
  }
  
  next();
};
