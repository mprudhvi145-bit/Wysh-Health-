
const env = (import.meta.env || {}) as any;

export const config = {
  apiBaseUrl: env.VITE_API_BASE_URL || 'https://api.wyshcare.com/v1',
  environment: env.MODE || 'development',
  enableMock: true, // Toggle to switch between real API and mock services
  timeout: 10000,
};