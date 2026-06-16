import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ session }) {
  const navigate = useNavigate();
  const user = session?.user || session?.session?.user;
  const userEmail = user?.email || user?.user_metadata?.email;
  const isAdmin = userEmail?.toLowerCase() === 'oskarznidarsic14@gmail.com';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (session !== undefined && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, session, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/blog`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching dashboard logs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this blog post completely along with all associated comments?')) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/blog/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  if (session === undefined || (loading && isAdmin)) {
    return (
      <div className="content-container">
        <p className="tip-text">Verifying admin status and loading dashboard records...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="content-container">
      <h2 className="section-title">Admin Monitoring Dashboard</h2>

      <div className="panel-card">
        <form className="flex-column" onSubmit={(e) => e.preventDefault()}>
          <div className="flex-column">
            <label>Search Posts:</label>
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              className="form-input" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-column">
            <label>Sort Records:</label>
            <select 
              className="form-input" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title</option>
            </select>
          </div>
        </form>
      </div>

      <div className="flex-column">
        <div className="comment-card">
          <strong>Total Entries Tracked: {sortedPosts.length}</strong>
        </div>

        {sortedPosts.length === 0 ? (
          <p className="tip-text">No log entries match your metrics filter.</p>
        ) : (
          sortedPosts.map(post => (
            <div key={post.id} className="blog-post-view">
              <div className="flex-row-space">
                <div>
                  <span className="tag">{post.category || 'Mountains'}</span>
                  <h3 
                    className="post-title"
                    onClick={() => navigate(`/blog/${post.id}`)}
                    style={{ cursor: 'pointer', marginTop: '0.5rem', marginBottom: '0.5rem' }}
                  >
                    {post.title}
                  </h3>
                  <p className="post-meta">
                    Published: {new Date(post.created_at).toLocaleDateString()} | Comments count: {post.comments?.length || 0}
                  </p>
                </div>

                <div className="auth-actions">
                  <button onClick={() => navigate(`/blog/${post.id}`)} className="btn btn-secondary btn-sm">
                    View
                  </button>
                  <button onClick={() => handleDeletePost(post.id)} className="btn btn-logout btn-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;