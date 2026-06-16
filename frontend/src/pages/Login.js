import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate('/');
  };

  return (
    <div className="content-container">
      <div className="blog-post-view" style={{ maxWidth: '400px', margin: '4rem auto' }}>
        <h2 className="section-title">Log In</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleLogin} className="flex-column">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="form-input"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="form-input"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;