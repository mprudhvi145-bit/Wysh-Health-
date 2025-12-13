export const metrics = {
  requests: 0,
  errors: 0,
  latency: [], // Array of numbers
  
  // Helper to keep memory usage low
  snapshot() {
    // Calculate p95
    const sorted = [...this.latency].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
    const p50 = sorted[Math.floor(sorted.length * 0.50)] || 0;
    
    return {
      totalRequests: this.requests,
      totalErrors: this.errors,
      p95LatencyMs: p95,
      p50LatencyMs: p50,
      errorRate: this.requests > 0 ? (this.errors / this.requests).toFixed(4) : 0
    };
  }
};