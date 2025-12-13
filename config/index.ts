
export const config = {
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.wyshcare.com/v1',
  environment: process.env.NODE_ENV || 'development',
  enableMock: true, // Toggle to switch between real API and mock services
  timeout: 10000,
};
