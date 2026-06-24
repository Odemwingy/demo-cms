import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  username: string;
  role: string;
  company_id: string | null;
}

interface AuthContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  selectedAirline: string;
  setSelectedAirline: (id: string) => void;
  selectedCycle: string;
  setSelectedCycle: (cycle: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedAirline, setSelectedAirline] = useState<string>('');
  const [selectedCycle, setSelectedCycle] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3001/api/auth/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) {
          const defaultUser = data.find((u: any) => u.username === 'Eric Liu') || data[0];
          setCurrentUser(defaultUser); // Default to Eric Liu
        }
      });
  }, []);

  // When user changes, reset selections
  useEffect(() => {
    setSelectedAirline('');
    setSelectedCycle('');
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      users, currentUser, setCurrentUser,
      selectedAirline, setSelectedAirline,
      selectedCycle, setSelectedCycle
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
