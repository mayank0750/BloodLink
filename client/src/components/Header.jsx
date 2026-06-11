import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, User , Menu, MessageSquare ,ChevronDown , X} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import favicon from '../assets/favicon.svg';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
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
            <img src={favicon} alt="WeLifeLink Logo" width={28} height={28} />
          </div>
          <span className="logo-text">WeLifeLink</span>
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
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-outline text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-md flex items-center gap-1">
                    Logout
                  </button>
                </li>
                {user && (
                  <li style={{ position: "relative" }}>
  <button
    type="button"
    className="nav-link"
    onClick={() => setProfileOpen(!profileOpen)}
    style={{
      width: "100%",
      background: "none",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <User size={18} />
      {user?.name || user?.mobile}
    </span>

    <ChevronDown size={16} />
  </button>

  {/* {profileOpen && (
  <ul
    style={{
      position: "absolute",
      top: "100%",
      left: 0,

      listStyle: "none",
      margin: "6px 0 0 0",
      padding: "0",

      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "6px",
      width: "160px",

      zIndex: 9999,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}
  >
    <li>
      <Link
        to="/edit-profile"
        className="nav-link"
        onClick={() => {
          setProfileOpen(false);
          setMenuOpen(false);
        }}
        style={{
          display: "block",
          padding: "10px 12px",
        }}
      >
        Edit Profile
      </Link>
    </li>
  </ul>
)} */}

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
