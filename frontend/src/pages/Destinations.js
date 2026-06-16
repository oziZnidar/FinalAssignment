import React, { useState, useEffect } from 'react';

function Destinations({ session }) {
  const user = session?.user || session?.session?.user;
  const userEmail = user?.email || user?.user_metadata?.email;
  const isAdmin = userEmail?.toLowerCase() === 'oskarznidarsic14@gmail.com';

  const [travelLogs, setTravelLogs] = useState("Loading your travel history...");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/destinations`);
      const data = await res.json();
      
      if (data && data.content) {
        setTravelLogs(data.content);
      } else {
        setTravelLogs("No records found in database. Click edit to create one!");
      }
    } catch (err) {
      console.error("Error loading travel log:", err);
      setTravelLogs("Click edit to start writing your travel history...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 1, content: editText })
      });

      if (res.ok) {
        setTravelLogs(editText);
        setIsEditing(false);
      } else {
        alert("Could not update database reference.");
      }
    } catch (err) {
      console.error("Error updating destinations:", err);
      alert("Network error updating database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-container">
      <h2 className="section-title">Conquered countries</h2>

      {!isAdmin && !loading && (
        <p className="tip-text" style={{ textAlign: 'center' }}>
          Viewing as Guest (Detected: {userEmail || "Not Logged In"})
        </p>
      )}

      <div className="blog-post-view">
        {isAdmin && !isEditing && !loading && (
          <div className="flex-row-space" style={{ justifyContent: 'flex-end' }}>
            <button 
              onClick={() => { setEditText(travelLogs); setIsEditing(true); }} 
              className="btn btn-secondary btn-sm"
            >
              Edit
            </button>
          </div>
        )}

        {loading && travelLogs === "Loading your travel history..." ? (
          <p>Syncing travel records index...</p>
        ) : isEditing ? (
          <form onSubmit={handleSave} className="flex-column" style={{ marginTop: isAdmin ? '1rem' : '0' }}>
            <textarea
              className="form-textarea"
              style={{ minHeight: '200px' }}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              disabled={loading}
              required
            />
            <div className="flex-row-space" style={{ justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="btn btn-muted btn-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <p className="display-text-block" style={{ marginTop: isAdmin ? '1rem' : '0' }}>
            {travelLogs}
          </p>
        )}
      </div>
    </div>
  );
}

export default Destinations;