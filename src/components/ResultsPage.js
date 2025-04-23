import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL;

function ResultsPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/results`);
        setResults(response.data);
        
        // Create confetti effect when gender is revealed
        if (response.data && response.data.revealed && confetti.length === 0) {
          const colors = response.data.actual_gender === 'boy' ? 
            ['#89CFF0', '#0078D7', '#42A5F5', '#1E88E5', '#FFFFFF'] : 
            ['#FFB6C1', '#FF69B4', '#E83E8C', '#FF1493', '#FFFFFF'];
          
          const newConfetti = [];
          for (let i = 0; i < 100; i++) {
            newConfetti.push({
              id: i,
              x: Math.random() * window.innerWidth,
              y: -Math.random() * 500,
              size: Math.random() * 10 + 5,
              color: colors[Math.floor(Math.random() * colors.length)],
              speed: Math.random() * 3 + 2,
              angle: Math.random() * 360
            });
          }
          setConfetti(newConfetti);
        }
      } catch (err) {
        setError('Failed to load results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    // Set up polling for updates every 5 seconds
    const interval = setInterval(fetchResults, 1000);
    return () => clearInterval(interval);
  }, [confetti.length]);

  // Animate confetti
  useEffect(() => {
    if (confetti.length === 0) return;
    
    const interval = setInterval(() => {
      setConfetti(prev => 
        prev.map(c => ({
          ...c,
          y: c.y + c.speed,
          x: c.x + Math.sin(c.angle) * 2
        })).filter(c => c.y < window.innerHeight)
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [confetti]);

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
          
          <div className="chart-container">
            <PieChart width={400} height={400}>
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
              <span className="vote-label">Boy:</span> {results.boy} votes
            </div>
            <div className="girl-votes">
              <span className="vote-label">Girl:</span> {results.girl} votes
            </div>
          </div>
          
          <p className="refresh-note">This page refreshes automatically</p>
        </div>
      )}
      
      {confetti.length > 0 && (
        <div className="confetti-container">
          {confetti.map(c => (
            <div
              key={c.id}
              className="confetti"
              style={{
                left: `${c.x}px`,
                top: `${c.y}px`,
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
                transform: `rotate(${c.angle}deg)`,
                animation: `confetti ${3 + Math.random() * 2}s linear`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultsPage;