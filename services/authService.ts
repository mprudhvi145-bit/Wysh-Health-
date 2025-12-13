
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types/auth';

const TOKEN_KEY = 'wysh_auth_token';
const USER_KEY = 'wysh_user_data';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Simulate Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800); // Simulate API call

    // Mock validation logic
    if (credentials.email.includes('error')) {
      throw new Error('Invalid credentials');
    }

    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: credentials.email.includes('admin') ? 'admin' : credentials.email.includes('doc') ? 'doctor' : 'patient',
      avatar: `https://ui-avatars.com/api/?name=${credentials.email}&background=4D8B83&color=fff`
    };

    const mockToken = 'jwt_mock_' + Math.random().toString(36).substr(2);

    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

    return { user: mockUser, token: mockToken };
  },

  // Simulate Registration
  register: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    await delay(1000);

    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: credentials.name,
      email: credentials.email,
      role: credentials.role,
      avatar: `https://ui-avatars.com/api/?name=${credentials.name}&background=8763FF&color=fff`
    };

    const mockToken = 'jwt_mock_' + Math.random().toString(36).substr(2);

    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

    return { user: mockUser, token: mockToken };
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
