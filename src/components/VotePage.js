import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function VotePage() {
  const [name, setName] = useState('');
  const [vote, setVote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!vote) {
      setError('Please select your prediction');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/vote`, {
        name: name || 'Anonymous',
        vote
      });
      navigate('/results');
    } catch (err) {
      setError('Failed to submit your vote. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vote-container">
      <h2>Make Your Prediction!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name (optional):</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        
        <div className="form-group">
          <h3>What's your prediction?</h3>
          <div className="vote-options">
            <button
              type="button"
              className={`vote-btn ${vote === 'boy' ? 'selected' : ''}`}
              onClick={() => setVote('boy')}
            >
              It's a BOY! 💙
            </button>
            <button
              type="button"
              className={`vote-btn ${vote === 'girl' ? 'selected' : ''}`}
              onClick={() => setVote('girl')}
            >
              It's a GIRL! 💖
            </button>
          </div>
        </div>
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit My Prediction'}
        </button>
      </form>
    </div>
  );
}

export default VotePage;
