
export type Role = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  linkedGoogle?: boolean;
  phone?: string;
  specialty?: string; // For doctors
  licenseNumber?: string; // For doctors
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (idToken?: string, role?: string) => Promise<void>;
  register: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  // Demo helper
  switchRole: (role: Role) => void;
}
