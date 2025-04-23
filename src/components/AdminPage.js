import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReveal = async (e) => {
    e.preventDefault();
    
    if (!adminKey) {
      setError('Please enter the admin key');
      return;
    }
    
    if (!gender) {
      setError('Please select the actual gender');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/admin/reveal`, {
        admin_key: adminKey,
        gender
      });
      navigate('/results');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid admin key');
      } else {
        setError('Failed to reveal gender. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to AdminPage.js
    const handleReset = async () => {
        if (!adminKey) {
        setError('Please enter the admin key');
        return;
        }
        
        if (window.confirm('Are you sure you want to reset ALL votes and reveal status? This cannot be undone!')) {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/admin/reset`, {
            admin_key: adminKey
            });
            alert('Data reset successfully!');
            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 401) {
            setError('Invalid admin key');
            } else {
            setError('Failed to reset data. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
        }
    };
  
  // Then add this button below the reveal button in the JSX
  <button 
    type="button" 
    className="reset-btn" 
    onClick={handleReset} 
    disabled={loading}
  >
    Reset All Data
  </button>

  return (
    <div className="admin-container">
      <h2>Gender Reveal Admin</h2>
      <div className="warning">
        <p>⚠️ Warning: This action cannot be undone!</p>
        <p>Once you reveal the gender, all participants will see the result.</p>
      </div>
      
      <form onSubmit={handleReveal}>
        <div className="form-group">
          <label htmlFor="adminKey">Admin Key:</label>
          <input
            type="password"
            id="adminKey"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
            required
          />
        </div>
        
        <div className="form-group">
          <h3>Select the actual gender to reveal:</h3>
          <div className="gender-options">
            <button
              type="button"
              className={`gender-btn ${gender === 'boy' ? 'selected' : ''}`}
              onClick={() => setGender('boy')}
            >
              It's a BOY! 💙
            </button>
            <button
              type="button"
              className={`gender-btn ${gender === 'girl' ? 'selected' : ''}`}
              onClick={() => setGender('girl')}
            >
              It's a GIRL! 💖
            </button>
          </div>
        </div>
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit" className="reveal-btn" disabled={loading}>
          {loading ? 'Revealing...' : 'Reveal Gender Now'}
        </button>
      </form>
    </div>
  );
}

export default AdminPage;