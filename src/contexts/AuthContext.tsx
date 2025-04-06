
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      try {
        // When Supabase is connected, replace with actual authentication check
        const storedUser = localStorage.getItem('snappy_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock signup - replace with Supabase auth when connected
      const newUser = { id: `user_${Date.now()}`, email };
      localStorage.setItem('snappy_user', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock login - replace with Supabase auth when connected
      const mockUser = { id: `user_${Date.now()}`, email };
      localStorage.setItem('snappy_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Mock logout - replace with Supabase auth when connected
      localStorage.removeItem('snappy_user');
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
