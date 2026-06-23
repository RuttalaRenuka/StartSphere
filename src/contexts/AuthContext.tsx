import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase config will be injected by AI Studio
const firebaseConfig = {
  apiKey: "placeholder",
  authDomain: "placeholder",
  projectId: "placeholder",
  storageBucket: "placeholder",
  messagingSenderId: "placeholder",
  appId: "placeholder"
};

// Lazy init to avoid crash if config missing
let auth: any;
let db: any;

const useFirebase = false; // Toggle this if config is available

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (displayName?: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is in localStorage (Mock Auth for preview)
    const savedUser = localStorage.getItem('startsphere_user');
    let parsedUser = savedUser ? JSON.parse(savedUser) : null;
    
    // Auto-migrate or set default user profile to Renuka Ruttala 123@gmail.com
    if (!parsedUser || parsedUser.displayName?.includes('Alex') || parsedUser.email?.includes('alex')) {
      const defaultUser = {
        uid: 'mock-123',
        displayName: 'Renuka Ruttala',
        email: '123@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
      } as User;
      setUser(defaultUser);
      localStorage.setItem('startsphere_user', JSON.stringify(defaultUser));
    } else {
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (displayName?: string, email?: string) => {
    // Mock login for preview since Firebase setup failed
    const mockUser = {
      uid: 'mock-123',
      displayName: displayName || 'Renuka Ruttala',
      email: email || '123@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
    } as User;
    
    setUser(mockUser);
    localStorage.setItem('startsphere_user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('startsphere_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
