import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Welcome to Messaging App</h1>
        <p className="home-description">
          Connect with friends and colleagues in real-time. Start chatting today!
        </p>
        <div className="home-actions">
          <Link to="/login" className="home-button primary">
            Log In
          </Link>
          <Link to="/signup" className="home-button secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
