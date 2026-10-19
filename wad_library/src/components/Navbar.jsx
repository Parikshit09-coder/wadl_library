import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiShield } from 'react-icons/fi';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img src="/pict-emblem.png" alt="PICT logo" className="logo-img" />
          <span className="logo-text">PICT Digital Library</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/resources" onClick={() => setMenuOpen(false)}>E-Resources</Link></li>
          <li><Link to="/search" onClick={() => setMenuOpen(false)}>Search Papers</Link></li>
          {isAdmin && (
            <li><Link to="/admin" className="admin-link" onClick={() => setMenuOpen(false)}><FiShield /> Admin</Link></li>
          )}
          {user ? (
            <li className="user-section">
              <button className="logout-btn" onClick={handleLogout}><FiLogOut /> Logout</button>
            </li>
          ) : (
            <li><Link to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>Admin Sign In</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}
