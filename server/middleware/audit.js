export const audit = (action, resource) => (req, res, next) => {
  const userId = req.user ? req.user.id : 'anonymous';
  console.log(`[AUDIT] ${new Date().toISOString()} | ACTION: ${action} | RESOURCE: ${resource} | ACTOR: ${userId}`);
  
  // In a real DB implementation, we would insert into the audit_logs table here.
  // For now, we rely on the console/stdout which can be piped to a logging service.
  next();
};