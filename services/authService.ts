import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types/auth';
import { config } from '../config';

const TOKEN_KEY = 'wysh_auth_token';
const USER_KEY = 'wysh_user_data';

// Determine backend URL logic similar to geminiService
const getBackendUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api/auth';
  }
  return `${config.apiBaseUrl}/auth`; // Fallback/Prod
};

export const authService = {
  // 1. Login with Credentials
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
    // Note: We don't necessarily need to store user in localStorage if we fetch 'me' on load, 
    // but keeping it for fast initial render is fine.
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  // 2. Login/Register with Google
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

  // 3. Register with Credentials
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

  // 4. Verify Session (The "Me" endpoint)
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
        localStorage.setItem(USER_KEY, JSON.stringify(data.user)); // Update local cache
        return data.user;
      } else {
        // Token invalid/expired
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return null;
      }
    } catch (e) {
      console.error("Auth check failed", e);
      // If backend is offline, maybe fallback to local storage user if desired, 
      // but strictly securely we should fail. 
      // For UX we might return the local user but mark as 'offline' in a real app.
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