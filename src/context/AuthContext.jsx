import { createContext, useContext, useState } from 'react';
import { getDemoUser } from '../mockData/demoAuth';

const AuthContext = createContext(null);

// Demo: the app opens already logged-in. The "user" comes from the persona
// switcher (see mockData/demoAuth). No real auth or SSO.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getDemoUser());

  const login = async () => {
    const u = getDemoUser();
    setUser(u);
    return u;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
