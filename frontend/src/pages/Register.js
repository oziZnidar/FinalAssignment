import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data?.user && data.user.identities && data.user.identities.length === 0) {
      setError('An account with this email address already exists.');
    } else {
      setMessage('Registration successful! Check your email for confirmation.');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="content-container">
      <div className="blog-post-view" style={{ maxWidth: '400px', margin: '4rem auto' }}>
        <h2 className="section-title">Sign Up</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: '#22c55e', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>{message}</p>}
        <form onSubmit={handleRegister} className="flex-column">
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
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Register;