import React, { useState, useEffect } from 'react';

function TravelResources({ session }) {
  const user = session?.user || session?.session?.user;
  const userEmail = user?.email || user?.user_metadata?.email;
  const isAdmin = userEmail?.toLowerCase() === 'oskarznidarsic14@gmail.com';

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const fetchResources = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/resources`);
      const data = await res.json();
      setResources(data || []);
    } catch (err) {
      console.error("Error loading resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, description: newDesc, link_url: newUrl })
    });

    if (res.ok) {
      setNewTitle('');
      setNewDesc('');
      setNewUrl('');
      fetchResources();
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDesc(item.description);
    setEditUrl(item.link_url);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/resources/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, description: editDesc, link_url: editUrl })
    });

    if (res.ok) {
      setEditingId(null);
      fetchResources();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/resources/${id}`, { method: 'DELETE' });
    if (res.ok) fetchResources();
  };

  return (
    <div className="content-container">
      <h2 className="section-title">Travel Resources</h2>

      {isAdmin && !editingId && (
        <div className="admin-portal-card">
          <h3>Add New Travel Resource</h3>
          <form onSubmit={handleCreate} className="flex-column">
            <input type="text" placeholder="Resource Title (e.g., Skyscanner)" className="form-input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            <input type="url" placeholder="Resource Website URL (https://...)" className="form-input" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} required />
            <textarea placeholder="Briefly describe why this resource is helpful..." className="form-textarea" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows="3" />
            <button type="submit" className="btn btn-primary">Add Resource</button>
          </form>
        </div>
      )}

      <div className="flex-column">
        {loading ? (
          <p>Syncing travel resources index...</p>
        ) : resources.length === 0 ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No resources indexed yet.</p>
        ) : (
          resources.map((item) => (
            <div key={item.id} className="blog-post-view">
              {editingId === item.id ? (
                <form onSubmit={handleUpdate} className="flex-column">
                  <h3>Edit Travel Resource</h3>
                  <input type="text" className="form-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                  <input type="url" className="form-input" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} required />
                  <textarea className="form-textarea" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows="3" />
                  <div className="flex-row-space" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" onClick={() => setEditingId(null)} className="btn btn-muted btn-sm">Cancel</button>
                    <button type="submit" className="btn btn-success btn-sm">Save Changes</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex-row-space" style={{ marginTop: isAdmin ? '1rem' : '0' }}>
                    <h3 style={{ margin: 0 }}>
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="inline-link" style={{ fontSize: '1.5rem' }}>
                        {item.title} 🔗
                      </a>
                    </h3>
                    {isAdmin && (
                      <div className="flex-row-space" style={{ gap: '0.5rem' }}>
                        <button onClick={() => startEditing(item)} className="btn btn-secondary btn-sm">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-logout">Delete</button>
                      </div>
                    )}
                  </div>
                  {item.description && (
                    <p className="display-text-block" style={{ marginTop: '1rem' }}>
                      {item.description}
                    </p>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TravelResources;