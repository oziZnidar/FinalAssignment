import React, { useState, useEffect } from 'react';

function AboutMe({ session }) {
  const user = session?.user || session?.session?.user;
  const userEmail = user?.email || user?.user_metadata?.email;
  const isAdmin = userEmail?.toLowerCase() === 'oskarznidarsic14@gmail.com';

  const [aboutText, setAboutText] = useState("Loading bio data...");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAboutMe = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/about`);
      if (!res.ok) throw new Error(`HTTP status error: ${res.status}`);
      
      const data = await res.json();
      setAboutText(data?.content || "Text not loading.");
    } catch (err) {
      console.error("Error loading about me data:", err);
      setAboutText("Text not loading.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editText }) 
      });

      if (res.ok) {
        setAboutText(editText);
        setIsEditing(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to save database reference text: ${errData.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Error updating about me reference row:", err);
      alert("Network communication error. Check your backend status engine logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-container">
      <h2 className="section-title">About Me</h2>

      <div className="blog-post-view">
        {isAdmin && !isEditing && !loading && (
          <div className="flex-row-space" style={{ justifyContent: 'flex-end' }}>
            <button 
              onClick={() => { setEditText(aboutText); setIsEditing(true); }} 
              className="btn btn-secondary btn-sm"
            >
              Edit
            </button>
          </div>
        )}

        {loading && aboutText === "Loading bio data..." ? (
          <p>Syncing bio records index...</p>
        ) : isEditing ? (
          <form onSubmit={handleSave} className="flex-column" style={{ marginTop: isAdmin ? '1rem' : '0' }}>
            <textarea
              className="form-textarea"
              style={{ minHeight: '250px' }}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              disabled={loading}
              required
            />
            <div className="flex-row-space" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="btn btn-muted btn-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <p className="display-text-block" style={{ marginTop: isAdmin ? '1rem' : '0' }}>
            {aboutText}
          </p>
        )}
      </div>
    </div>
  );
}

export default AboutMe;