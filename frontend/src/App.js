import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutMe from './pages/AboutMe';
import Blog from './pages/Blog';
import Destinations from './pages/Destinations';
import TravelResources from './pages/TravelResources';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogPostDetail from './pages/BlogPostDetail';
import Dashboard from './pages/Dashboard';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="home-bg">
        <Navbar session={session} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutMe session={session} />} />
            <Route path="/blog" element={<Blog session={session} />} />
            <Route path="/blog/:id" element={<BlogPostDetail session={session} />} />
            <Route path="/admin/dashboard" element={<Dashboard session={session} />} />
            <Route path="/destinations" element={<Destinations session={session} />} />
            <Route path="/resources" element={<TravelResources session={session} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;