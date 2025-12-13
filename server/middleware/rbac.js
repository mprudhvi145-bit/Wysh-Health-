export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'User context missing' });
  
  const userRole = req.user.role?.toUpperCase();
  const requiredRole = role.toUpperCase();
  
  if (userRole !== requiredRole && userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied: Insufficient privileges' });
  }
  next();
};