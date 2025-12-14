
// Simulating Redis for the prototype
const store = new Map();
const stats = { hits: 0, misses: 0 };

export const CacheService = {
  async get(key) {
    const item = store.get(key);
    if (!item) {
      stats.misses++;
      return null;
    }
    
    if (Date.now() > item.expiry) {
      store.delete(key);
      stats.misses++;
      return null;
    }

    stats.hits++;
    return item.value;
  },

  async set(key, value, ttlSeconds = 60) {
    store.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  },

  async del(key) {
    store.delete(key);
  },

  // Pattern match deletion (expensive operation, use carefully)
  async delPattern(pattern) {
    for (const key of store.keys()) {
      if (key.includes(pattern)) {
        store.delete(key);
      }
    }
  },

  getStats() {
    return { 
        ...stats, 
        keys: store.size,
        hitRate: stats.hits + stats.misses > 0 ? (stats.hits / (stats.hits + stats.misses)).toFixed(2) : 0 
    };
  }
};
