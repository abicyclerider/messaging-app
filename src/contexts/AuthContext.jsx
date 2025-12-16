import { createContext, useState } from 'react';
import { initialUsers } from '../utils/mockData';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);

  const login = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      return { success: true };
    }

    return { success: false, error: 'Invalid username or password' };
  };

  const signup = (username, email, password) => {
    // Check if username or email already exists
    const existingUser = users.find(
      (u) => u.username === username || u.email === email
    );

    if (existingUser) {
      return {
        success: false,
        error: 'Username or email already exists'
      };
    }

    // Validate inputs
    if (!username || username.length < 3) {
      return {
        success: false,
        error: 'Username must be at least 3 characters'
      };
    }

    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters'
      };
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password,
      avatar: `https://i.pravatar.cc/150?img=${users.length + 1}`,
      status: 'online',
      lastSeen: new Date(),
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = currentUser !== null;

  const value = {
    currentUser,
    users,
    login,
    signup,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
