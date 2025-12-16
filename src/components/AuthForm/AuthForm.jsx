import { useState } from 'react';
import './AuthForm.css';

export default function AuthForm({ mode, onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username) {
      setError('Username is required');
      return;
    }

    if (mode === 'signup' && !formData.email) {
      setError('Email is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Call the onSubmit callback
    onSubmit(formData);
  };

  const isLogin = mode === 'login';

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />
      </div>

      {!isLogin && (
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
        />
      </div>

      <button type="submit" className="submit-button">
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>
    </form>
  );
}
