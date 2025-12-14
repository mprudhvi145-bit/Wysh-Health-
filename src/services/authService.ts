
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types/auth';
import { config } from '../config';

const TOKEN_KEY = 'wysh_auth_token';
const USER_KEY = 'wysh_user_data';

const getBackendUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api/auth';
  }
  return `${config.apiBaseUrl}/auth`;
};

export const authService = {
  // --- OTP Flow ---
  requestOtp: async (identifier: string): Promise<{ message: string }> => {
    const response = await fetch(`${getBackendUrl()}/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    if (!response.ok) throw new Error('Failed to send OTP');
    return await response.json();
  },

  verifyOtp: async (identifier: string, code: string): Promise<AuthResponse> => {
    const response = await fetch(`${getBackendUrl()}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, code })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Invalid OTP');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  // --- Existing Methods ---
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${getBackendUrl()}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  loginWithGoogle: async (idToken: string, role?: string): Promise<AuthResponse> => {
    const response = await fetch(`${getBackendUrl()}/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken, role })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Google Auth failed');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  register: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${getBackendUrl()}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch(`${getBackendUrl()}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user || data.data; // Handle wrapped response
        localStorage.setItem(USER_KEY, JSON.stringify(user)); 
        return user;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return null;
      }
    } catch (e) {
      console.error("Auth check failed", e);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  }
};
