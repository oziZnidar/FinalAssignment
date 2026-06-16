import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentStories = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/blog`);
        const data = await res.json();
        const sorted = (data.posts || []).sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setRecentPosts(sorted.slice(0, 3));
      } catch (err) {
        console.error("Error loading home feed indices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentStories();
  }, []);

  return (
    <div className="home-bg">
      <section className="content-container" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div className="blog-post-view" style={{ padding: '3.5rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1.5rem', border: 'none' }}>
            Welcome to WanderLust
          </h1>
          <p className="display-text-block" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#475569', maxWidth: '650px', margin: '0 auto' }}>
            Your ultimate hub for travel guides, stories, and community experiences. Explore the feed, find your next destination, and share your journey.
          </p>
        </div>
      </section>

      <section className="content-container" style={{ paddingBottom: '5rem' }}>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>Recent Stories</h2>
        
        {loading ? (
          <p>Syncing latest updates feed indices...</p>
        ) : recentPosts.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#666' }}>No entries found.</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '1.5rem', 
            width: '100%' 
          }}>
            {recentPosts.map(post => (
              <div 
                key={post.id} 
                className="blog-post-view" 
                style={{ 
                  padding: '1.25rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  margin: 0,
                  boxSizing: 'border-box'
                }}
              >
                <div>
                  <span className="badge" style={{ backgroundColor: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    {post.category || 'Mountains'}
                  </span>
                  
                  <h3 
                    onClick={() => navigate(`/blog/${post.id}`)}
                    style={{ fontSize: '1.2rem', marginTop: '0.5rem', marginBottom: '0.25rem', cursor: 'pointer', color: '#1e293b', lineHeight: '1.4' }}
                  >
                    {post.title}
                  </h3>
                  
                  <small style={{ color: '#777', display: 'block' }}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </small>
                </div>

                <button 
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="btn btn-secondary btn-sm" 
                  style={{ width: '100%', marginTop: '1.25rem', padding: '0.4rem' }}
                >
                  Read More →
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;