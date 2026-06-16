import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function BlogPostDetail({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = session?.user || session?.session?.user;
  const userEmail = user?.email || user?.user_metadata?.email;
  const isAdmin = userEmail?.toLowerCase() === 'oskarznidarsic14@gmail.com';

  const [post, setPost] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Mountains');
  const [editBody, setEditBody] = useState('');

  const [commentInput, setCommentInput] = useState('');
  const commentUser = userEmail ? userEmail.split('@')[0] : 'Anonymous';

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/blog`);
        const data = await res.json();
        const foundPost = (data.posts || []).find(p => p.id.toString() === id.toString());
        if (foundPost) {
          setPost(foundPost);
          setEditTitle(foundPost.title);
          setEditCategory(foundPost.category || 'Mountains');
          setEditBody(foundPost.body);
        }
        setBlockedUsers(data.blockedUsers || []);
      } catch (err) {
        console.error("Error reading blog entry row:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [id]);

  const apiRequest = async (url, method, body) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.ok) window.location.reload();
  };

  if (loading) return <div className="content-container"><p>Syncing entry payload...</p></div>;
  if (!post) return <div className="content-container"><p>Entry row not verified.</p></div>;

  return (
    <div className="content-container">
      <div className="flex-row-space-nav">
        <button onClick={() => navigate('/blog')} className="btn btn-muted btn-sm">← Back to Log Feed</button>
      </div>
      
      <article className="blog-post-view relative-container">
        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); apiRequest(`/api/blog/posts/${id}`, 'PUT', { title: editTitle, category: editCategory, body: editBody }); }} className="flex-column">
            <h3>Edit Journey Log Entry</h3>
            <input type="text" className="form-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
            <select className="form-input" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="Mountains">Mountains</option>
              <option value="Seas">Seas</option>
              <option value="Cities">Cities</option>
              <option value="Food">Food</option>
            </select>
            <textarea className="form-textarea" value={editBody} onChange={(e) => setEditBody(e.target.value)} rows="6" required />
            <div className="flex-row-space-right">
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-muted btn-sm">Cancel</button>
              <button type="submit" className="btn btn-success btn-sm">Save Changes</button>
            </div>
          </form>
        ) : (
          <>
            {isAdmin && (
            <div className="admin-actions-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">Edit</button>
            </div>
            )}
            
            <span className="tag">{post.category || 'Mountains'}</span>
            <h3 className="post-title-detail">{post.title}</h3>
            <p className="post-meta">{new Date(post.created_at).toLocaleDateString()}</p>
            <p className="display-text-block post-body-spacing">{post.body}</p>
            
            <div className="flex-column feedback-section">
              <h4>Comments</h4>
              
              <div className="flex-column">
                {post.comments?.map(c => (
                  <div key={c.id} className="comment-card">
                    <div className="comment-card-header">
                      <span className={c.isBlocked ? "comment-author blocked-author" : "comment-author"}>
                        {c.user} {c.isBlocked && '(Blocked)'}
                      </span>
                      {isAdmin && (
                        <div className="flex-row-space comment-admin-buttons">
                          {!c.isBlocked && !blockedUsers.includes(c.user) && (
                            <button onClick={() => window.confirm(`Block ${c.user}?`) && apiRequest('/api/blog/block', 'POST', { username: c.user })} className="btn btn-secondary btn-sm btn-pad-xs">Block</button>
                          )}
                          <button onClick={() => window.confirm('Clear comment?') && apiRequest(`/api/blog/comments/${c.id}`, 'DELETE')} className="btn btn-logout btn-sm btn-pad-xs">Clear</button>
                        </div>
                      )}
                    </div>
                    {c.isBlocked ? (
                      <p className="comment-text-muted">[Message hidden due to account restriction]</p>
                    ) : (
                      <p className="comment-text">{c.text}</p>
                    )}
                  </div>
                ))}
              </div>
              
              {session ? (
                <form onSubmit={(e) => { e.preventDefault(); apiRequest(`/api/blog/posts/${id}/comments`, 'POST', { user: commentUser, text: commentInput }); }} className="flex-column comment-form-container">
                  <div className="flex-row-space-stretch">
                    <input type="text" placeholder={`Commenting as ${commentUser}...`} className="form-input" value={commentInput} onChange={(e) => setCommentInput(e.target.value)} required />
                    <button type="submit" className="btn btn-primary btn-sm btn-inline">Comment</button>
                  </div>
                </form>
              ) : (
                <div className="alert-danger-banner">
                  You must be <span className="inline-link clickable-text" onClick={() => navigate('/login')}>logged in</span> to write a response comment.
                </div>
              )}
            </div>
          </>
        )}
      </article>
    </div>
  );
}

export default BlogPostDetail;