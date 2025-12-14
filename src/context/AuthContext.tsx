
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, LoginCredentials, SignupCredentials, User, Role } from '../types/auth';
import { authService } from '../services/authService';

interface ExtendedAuthContextType extends AuthContextType {
    loginWithOtp: (identifier: string, code: string) => Promise<void>;
    requestOtp: (identifier: string) => Promise<void>;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

// Demo Users (Fallback)
const DEMO_PATIENT: User = {
    id: 'usr_pat_1',
    name: 'Alex Doe',
    email: 'alex.doe@wysh.demo',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
};

const DEMO_DOCTOR: User = {
    id: 'usr_doc_1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@wysh.demo',
    role: 'doctor',
    specialty: 'Cardiology',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
};

const DEMO_ADMIN: User = {
    id: 'usr_admin_1',
    name: 'Admin User',
    email: 'admin@wysh.demo',
    role: 'admin',
    avatar: ''
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (idToken?: string, role?: string) => {
    setIsLoading(true);
    try {
      if (!idToken) throw new Error("No Google Token provided");
      const response = await authService.loginWithGoogle(idToken, role);
      setUser(response.user);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: SignupCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.register(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (role: Role) => {
      setIsLoading(true);
      setTimeout(() => {
          if (role === 'doctor') setUser(DEMO_DOCTOR);
          else if (role === 'admin') setUser(DEMO_ADMIN);
          else setUser(DEMO_PATIENT);
          setIsAuthenticated(true);
          setIsLoading(false);
      }, 600);
  };

  const requestOtp = async (identifier: string) => {
      await authService.requestOtp(identifier);
  };

  const loginWithOtp = async (identifier: string, code: string) => {
      setIsLoading(true);
      try {
          const response = await authService.verifyOtp(identifier, code);
          setUser(response.user);
          setIsAuthenticated(true);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <AuthContext.Provider value={{ 
        user, isAuthenticated, isLoading, 
        login, loginWithGoogle, register, logout, switchRole,
        requestOtp, loginWithOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
