
const env = (import.meta.env || {}) as any;

export type DataMode = 'MOCK' | 'API';

export const config = {
  // Use VITE_API_BASE_URL if available (Production), else fallback to localhost (Development)
  apiBaseUrl: env.VITE_API_BASE_URL || 'http://localhost:3001/api', 
  
  environment: env.MODE || 'development',
  
  // Critical: Runtime Data Source Switch
  // Defaults to 'MOCK' to ensure UI works without backend unless explicitly set.
  // Use VITE_DATA_MODE='API' to enable real backend connections.
  dataMode: (env.VITE_DATA_MODE === 'API' ? 'API' : 'MOCK') as DataMode,
  
  timeout: 10000,
  
  googleClientId: env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
};
