import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  department?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed
  getFullName: () => string;
  getInitials: () => string;
  isAdmin: () => boolean;
  isStaff: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        
        login: (user: User, token: string) => {
          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
            isLoading: false,
          });
        },
        
        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        },
        
        updateUser: (user: User) => {
          set({ user });
        },
        
        initializeAuth: () => {
          const { token } = get();
          if (token) {
            set({ isAuthenticated: true });
          }
        },
        
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
        
        setError: (error: string | null) => {
          set({ error, isLoading: false });
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        // Computed functions
        getFullName: () => {
          const { user } = get();
          return user ? `${user.firstName} ${user.lastName}`.trim() : '';
        },
        
        getInitials: () => {
          const { user } = get();
          return user 
            ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
            : '';
        },
        
        isAdmin: () => {
          const { user } = get();
          return user?.role === UserRole.ADMIN;
        },
        
        isStaff: () => {
          const { user } = get();
          return user?.role === UserRole.STAFF;
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
); 