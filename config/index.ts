
const env = (import.meta.env || {}) as any;

export const config = {
  // Use VITE_API_BASE_URL if available (Production), else fallback to localhost (Development)
  apiBaseUrl: env.VITE_API_BASE_URL || 'http://localhost:3001/api', 
  
  environment: env.MODE || 'development',
  enableMock: env.VITE_ENABLE_MOCK === 'true', 
  timeout: 10000,
  
  // Google Client ID must be provided at build time for production
  googleClientId: env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
};