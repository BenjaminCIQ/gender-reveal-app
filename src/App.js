import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VotePage from './components/VotePage';
import ResultsPage from './components/ResultsPage';
import AdminPage from './components/AdminPage';
import AdminVotesPage from './components/AdminVotes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Baby Hall Gender Reveal</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<VotePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/admin/reveal" element={<AdminPage />} />
            <Route path="/admin/votes" element={<AdminVotesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;