import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie } from 'recharts';

const API_URL = 'http://127.0.0.1:5000';

function ResultsPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/results`);
        setResults(response.data);
      } catch (err) {
        setError('Failed to load results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    // Set up polling for updates every 5 seconds
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Loading results...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!results) return <div className="error">No results available</div>;

  const chartData = [
    { name: 'Boy', value: results.boy, fill: '#89CFF0' },
    { name: 'Girl', value: results.girl, fill: '#FFB6C1' }
  ];

  return (
    <div className="results-container">
      {results.revealed ? (
        // Revealed results view
        <div className="reveal-results">
          <div className={`big-reveal ${results.actual_gender}`}>
            <h2>It's a {results.actual_gender.toUpperCase()}!</h2>
            {results.actual_gender === 'boy' ? '💙👶' : '💖👶'}
          </div>
          
          <div className="guesses-summary">
            <h3>Guessing Results</h3>
            <div className="guesses-container">
              <div className="correct-guesses">
                <h4>Correct Guesses</h4>
                <ul>
                  {results.correct_guesses.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </div>
              <div className="incorrect-guesses">
                <h4>Incorrect Guesses</h4>
                <ul>
                  {results.incorrect_guesses.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Live results view
        <div className="live-results">
          <h2>Live Voting Results</h2>
          <div className="results-summary">
            <p>Total votes: {results.total_votes}</p>
          </div>
          
          <div className="chart-container">
            <PieChart width={300} height={300}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              />
            </PieChart>
          </div>
          
          <div className="vote-counts">
            <div className="boy-votes">
              <span className="vote-label">Boy:</span> {results.boy} votes ({results.total_votes ? ((results.boy / results.total_votes) * 100).toFixed(1) : 0}%)
            </div>
            <div className="girl-votes">
              <span className="vote-label">Girl:</span> {results.girl} votes ({results.total_votes ? ((results.girl / results.total_votes) * 100).toFixed(1) : 0}%)
            </div>
          </div>
          
          <p className="refresh-note">This page refreshes automatically</p>
        </div>
      )}
    </div>
  );
}

export default ResultsPage;