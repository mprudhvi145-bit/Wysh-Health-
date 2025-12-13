export const log = {
  info: (msg, meta = {}) => {
    console.info(JSON.stringify({ 
      level: "info", 
      timestamp: new Date().toISOString(), 
      msg, 
      ...meta 
    }));
  },
  warn: (msg, meta = {}) => {
    console.warn(JSON.stringify({ 
      level: "warn", 
      timestamp: new Date().toISOString(), 
      msg, 
      ...meta 
    }));
  },
  error: (msg, meta = {}) => {
    console.error(JSON.stringify({ 
      level: "error", 
      timestamp: new Date().toISOString(), 
      msg, 
      ...meta 
    }));
  },
};