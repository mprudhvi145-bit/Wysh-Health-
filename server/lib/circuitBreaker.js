
import { log } from './logger.js';

class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.failureThreshold = options.failureThreshold || 5;
    this.cooldownMs = options.cooldownMs || 60000; // 1 min
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.lastFailureTime = 0;
  }

  async execute(asyncFn, fallbackFn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.cooldownMs) {
        this.state = 'HALF_OPEN';
        log.warn(`[CircuitBreaker] ${this.name} is HALF_OPEN. Testing connection...`);
      } else {
        // Fast fail
        return fallbackFn ? fallbackFn() : null;
      }
    }

    try {
      const result = await asyncFn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
        log.info(`[CircuitBreaker] ${this.name} recovered. State CLOSED.`);
      }
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      
      log.error(`[CircuitBreaker] ${this.name} failure (${this.failures}/${this.failureThreshold})`, { error: error.message });

      if (this.failures >= this.failureThreshold) {
        this.state = 'OPEN';
        log.error(`[CircuitBreaker] ${this.name} OPENED. Blocking requests for ${this.cooldownMs}ms.`);
      }

      if (fallbackFn) return fallbackFn();
      throw error;
    }
  }

  getStatus() {
      return { name: this.name, state: this.state, failures: this.failures };
  }
}

// Registry
const breakers = new Map();

export const getBreaker = (name) => {
    if (!breakers.has(name)) {
        breakers.set(name, new CircuitBreaker(name));
    }
    return breakers.get(name);
};

export const getAllBreakerStats = () => {
    return Array.from(breakers.values()).map(b => b.getStatus());
};
