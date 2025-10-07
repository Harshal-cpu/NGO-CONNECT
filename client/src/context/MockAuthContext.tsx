import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginData, RegisterData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: 'mock-token' }
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, 500);
  }, []);

  const login = async (data: LoginData) => {
    // Mock login - accept any credentials
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email: data.email,
      role: 'NGO'
    };
    
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: 'mock-token' } });
  };

  const register = async (data: RegisterData) => {
    // Mock registration
    const mockUser: User = {
      id: '1',
      name: data.name,
      email: data.email,
      role: data.role as 'NGO' | 'Donor' | 'Admin'
    };
    
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: 'mock-token' } });
  };

  const logout = () => {
    localStorage.removeItem('mockUser');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useMockAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within MockAuthProvider');
  }
  return context;
};