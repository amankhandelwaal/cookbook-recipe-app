import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage'; // Import the landing page
import AuthPage from './pages/AuthPage'; // Import the AuthPage
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
