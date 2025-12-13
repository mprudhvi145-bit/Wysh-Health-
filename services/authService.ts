
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types/auth';

const TOKEN_KEY = 'wysh_auth_token';
const USER_KEY = 'wysh_user_data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800);

    if (credentials.email.includes('error')) {
      throw new Error('Invalid credentials');
    }

    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: credentials.email.includes('admin') ? 'admin' : credentials.email.includes('doc') ? 'doctor' : 'patient',
      avatar: `https://ui-avatars.com/api/?name=${credentials.email}&background=4D8B83&color=fff`,
      linkedGoogle: false
    };

    if (mockUser.role === 'doctor') {
      mockUser.specialty = 'General Medicine';
      mockUser.licenseNumber = 'MD-99420';
    }

    const mockToken = 'jwt_mock_' + Math.random().toString(36).substr(2);
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

    return { user: mockUser, token: mockToken };
  },

  loginWithGoogle: async (): Promise<AuthResponse> => {
    await delay(1500); // Simulate OAuth popup duration
    
    const mockUser: User = {
      id: 'usr_goog_' + Math.random().toString(36).substr(2, 9),
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'patient', // Default to patient for Google Sign-in
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
      linkedGoogle: true
    };

    const mockToken = 'jwt_goog_' + Math.random().toString(36).substr(2);
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

    return { user: mockUser, token: mockToken };
  },

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
