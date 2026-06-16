// frontend/src/pages/Blog.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Blog({ session }) {
  const user = session?.user || session?.session?.user;
  const userEmail = user?.email || user?.user_metadata?.email;
  const isAdmin = userEmail?.toLowerCase() === 'oskarznidarsic14@gmail.com';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mountains');
  const [body, setBody] = useState('');

  const navigate = useNavigate();

  const fetchBlogData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/blog`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Error connecting to backend blog router API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/blog/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, body, author: 'Admin' })
    });

    if (res.ok) {
      setTitle('');
      setBody('');
      setCategory('Mountains');
      fetchBlogData();
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="content-container">
      <h2 className="section-title">Travel Log</h2>

      {isAdmin && (
        <div className="admin-portal-card">
          <h3>Publish a New Journey</h3>
          <form onSubmit={handleCreatePost} className="flex-column">
            <input type="text" placeholder="The title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Mountains">Mountains</option>
              <option value="Seas">Seas</option>
              <option value="Cities">Cities</option>
              <option value="Food">Food</option>
            </select>
            <textarea placeholder="Write the details" className="form-textarea" value={body} onChange={(e) => setBody(e.target.value)} rows="5" required />
            <button type="submit" className="btn btn-primary">Save and Publish</button>
          </form>
        </div>
      )}

      <div className="flex-column">
        <label className="form-label">Filter by Category:</label>
        <select 
          className="form-input select-filter" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
        >
          <option value="All">All Categories</option>
          <option value="Mountains">Mountains</option>
          <option value="Seas">Seas</option>
          <option value="Cities">Cities</option>
          <option value="Food">Food</option>
        </select>
      </div>

      <div className="flex-column blog-posts-list">
        {loading ? (
          <p>Syncing log entries index cache...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="tip-text">Blogs in this category coming soon.</p>
        ) : (
          filteredPosts.map((post) => (
            <article 
              key={post.id} 
              className="blog-post-view clickable-card" 
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <span className="tag">{post.category || 'Mountains'}</span>
              
              <h3 className="post-title">{post.title}</h3>
              <p className="post-meta">
                {new Date(post.created_at).toLocaleDateString()}
              </p>

              <p className="display-text-block">
                {post.body ? (post.body.split('\n').find(p => p.trim().length > 0) || '') : ''}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default Blog;