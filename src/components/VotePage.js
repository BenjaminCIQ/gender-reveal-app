import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function VotePage() {
  const [name, setName] = useState('');
  const [vote, setVote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already voted
    const hasVoted = localStorage.getItem('gender_reveal_voted');
    if (hasVoted) {
      navigate('/results');
      return;
    }
    
    // Also check if voting is still open
    const checkVotingStatus = async () => {
      try {
        const response = await axios.get(`/results`);
        if (response.data.revealed) {
          navigate('/results');
        }
      } catch (err) {
        console.error('Failed to check voting status:', err);
      }
    };
    
    checkVotingStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!vote) {
      setError('Please select your prediction');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`api/vote`, {
        name: name || 'Anonymous',
        vote
      });
      
      // Save to local storage that user has voted
      //localStorage.setItem('gender_reveal_voted', 'true');
      //localStorage.setItem('gender_reveal_name', name || 'Anonymous');
      
      navigate('/results');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Voting has closed as gender has been revealed');
        setTimeout(() => navigate('/results'), 2000);
      } else if (err.response && err.response.status === 409) {
        setError('You have already voted');
        setTimeout(() => navigate('/results'), 2000);
      } else {
        setError('Failed to submit your vote. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vote-container">
      <h2>What do you think Babaloo is?</h2>
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
          <h3>What's your guess?</h3>
          <div className="vote-options">
            <button
              type="button"
              className={`vote-btn ${vote === 'girl' ? 'selected' : ''}`}
              onClick={() => setVote('girl')}
            >
              It's a GIRL! 💖
            </button>
            <button
              type="button"
              className={`vote-btn ${vote === 'boy' ? 'selected' : ''}`}
              onClick={() => setVote('boy')}
            >
              It's a BOY! 💙
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