import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Navbar({ session }) {
  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const isAdmin = session?.user?.email === 'oskarznidarsic14@gmail.com'; 

  return (
    <header>
      <div className="nav-container">
        <Link to="/" className="logo">WANDERLUST</Link>
        
        <nav>
          <Link to="/about">About Me</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/resources">Travel Resources</Link>
          
          {isAdmin && (
            <Link to="/admin/dashboard" className="admin-badge-container" style={{ textDecoration: 'none' }}>
              <span className="admin-badge" style={{ cursor: 'pointer' }}>Admin</span>
            </Link>
          )}
        </nav>

        <div className="auth-actions">
          {!session ? (
            <>
              <Link to="/login" className="btn-login">Log In</Link>
              <Link to="/register" className="btn-register">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-logout">Log Out</button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;