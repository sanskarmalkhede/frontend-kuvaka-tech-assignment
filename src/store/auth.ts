import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Auth methods
  login: (phoneNumber: string) => Promise<void>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  
  // User methods
  updateUser: (userData: Partial<User>) => void;
}

// Simulate API calls with delays
const simulateApiCall = (delay: number = 1000): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, delay));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (phoneNumber: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await simulateApiCall(1500);
          
          // For demo purposes, create a user object
          const newUser: User = {
            id: `user-${Date.now()}`,
            phoneNumber,
            isVerified: false,
            createdAt: new Date().toISOString(),
          };
          
          set({ 
            user: newUser,
            isAuthenticated: false, // Still need to verify OTP
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      verifyOTP: async (otp: string) => {
        const { user } = get();
        if (!user) return false;
        
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await simulateApiCall(1000);
          
          // For demo purposes, accept any 6-digit OTP
          const isValidOTP = otp.length === 6;
          
          if (isValidOTP) {
            set({ 
              user: { ...user, isVerified: true },
              isAuthenticated: true,
              isLoading: false 
            });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false 
        });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
    }),
    {
      name: 'auth-store',
      version: 1,
    }
  )
); 