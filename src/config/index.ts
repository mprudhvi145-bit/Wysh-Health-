
const env = (import.meta.env || {}) as any;

export type DataMode = 'MOCK' | 'API';

export const config = {
  // Use VITE_API_BASE_URL if available (Production), else fallback to localhost (Development)
  apiBaseUrl: env.VITE_API_BASE_URL || 'http://localhost:3001/api', 
  
  environment: env.MODE || 'development',
  
  // Explicit Data Mode Switch - Fixes 2.1 "Mixed Data Paths"
  // If VITE_USE_MOCK is set, we force mock services. Otherwise, we try API.
  dataMode: (env.VITE_USE_MOCK === 'true' ? 'MOCK' : 'API') as DataMode,
  
  timeout: 10000,
  
  // Google Client ID must be provided at build time for production
  googleClientId: env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
};
