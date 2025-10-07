export interface User {
  id: string;
  name: string;
  email: string;
  role: 'NGO' | 'Donor' | 'Admin';
  phone?: string;
  organization?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'NGO' | 'Donor' | 'Admin';
  phone: string;
  organization?: string;
}