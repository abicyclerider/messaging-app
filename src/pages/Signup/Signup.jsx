import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm/AuthForm';
import './Signup.css';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = (formData) => {
    const result = signup(formData.username, formData.email, formData.password);

    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <AuthForm mode="signup" onSubmit={handleSubmit} />

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
