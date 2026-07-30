/**
 * UserContext
 * Global state for authenticated user info.
 * Fetches /api/auth/me on mount and stores firstName, lastName, email.
 * Any component can call useUser() to display or use user data.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const UserContext = createContext({
  user: null,
  userLoading: true,
  refreshUser: () => {}
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  async function fetchUser() {
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data);
    } catch (err) {
      // 401 handled by api.js interceptor (redirects to /login)
      // Any other error, just log and continue with null user
      console.error('Failed to load user:', err);
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userLoading,
        refreshUser: fetchUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}