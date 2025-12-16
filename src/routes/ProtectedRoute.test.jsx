import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute', () => {
  it('should render children when authenticated', () => {
    const authValue = {
      isAuthenticated: true,
      currentUser: { id: 1, username: 'testuser' },
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    const authValue = {
      isAuthenticated: false,
      currentUser: null,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Should show login page instead of protected content
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});
