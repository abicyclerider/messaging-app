import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Messaging App</h1>
        <div className="navbar-user">
          <img
            src={currentUser.avatar}
            alt={`${currentUser.username}'s avatar`}
            className="navbar-avatar"
          />
          <span className="navbar-username">{currentUser.username}</span>
          <button onClick={logout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
