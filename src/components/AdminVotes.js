import React, { useEffect, useState } from 'react';

const API_BASE =
  process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:5000/api';

function AdminVotesPage() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVotes = async () => {
    setLoading(true);
    const response = await fetch(`api/votes`);
    const data = await response.json();
    setVotes(data);
    setLoading(false);
  };

  const deleteVote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vote?')) return;
    await fetch(`api/delete-vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchVotes(); // refresh after deletion
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  return (
    <div className="admin-votes">
      <h2>Admin Vote Panel</h2>
      {loading ? (
        <p>Loading votes...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Vote</th>
              <th>IP Address</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote) => (
              <tr key={vote.id}>
                <td>{vote.id}</td>
                <td>{vote.name}</td>
                <td>{vote.vote}</td>
                <td>{vote.ip_address}</td>
                <td>{new Date(vote.timestamp).toLocaleString()}</td>
                <td>
                  <button onClick={() => deleteVote(vote.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminVotesPage;
