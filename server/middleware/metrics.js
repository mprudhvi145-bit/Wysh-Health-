import { metrics } from "../lib/metrics.js";

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    metrics.requests++;
    metrics.latency.push(duration);
    
    // Prevent unbounded memory growth in long-running process
    if (metrics.latency.length > 5000) {
        metrics.latency.shift(); 
    }

    if (res.statusCode >= 400) {
        metrics.errors++;
    }
  });
  
  next();
};