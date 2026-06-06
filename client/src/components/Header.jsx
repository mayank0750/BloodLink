import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, User , Menu, MessageSquare , X} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import favicon from '../assets/favicon.svg';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <img src={favicon} alt="LifeLink Logo" width={28} height={28} />
          </div>
          <span className="logo-text">LifeLink</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
          <ul className="nav-menu">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/register" className="nav-link">
                Become a Donor
              </Link>
            </li>
            <li>
              <Link to="/organ-request" className="nav-link">
                Request Organ
              </Link>
            </li>
            <li>
              <Link to="/locations" className="nav-link">
                Browse Locations
              </Link>
            </li>
            {isAuthenticated && user?.role === "admin" && (
  <li>
    <Link to="/admin/messages" className="nav-link">
      <MessageSquare size={18} />
      Messages
    </Link>
  </li>
)}

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="nav-link">
                    <User size={18} />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-outline">
                    <LogOut size={18} />
                    Logout
                  </button>
                </li>
                {user && (
                  <li>
                    <span className="nav-link" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {user.name || user.mobile}
                      {user.role === 'admin' && ' (Admin)'}
                      {user.role === 'hospital' && ' (Hospital)'}
                      {user.role === 'ngo' && ' (NGO)'}
                    </span>
                  </li>
                )}
              </>
            ) : (
              <li>
                <Link to="/login" className="btn-primary">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
