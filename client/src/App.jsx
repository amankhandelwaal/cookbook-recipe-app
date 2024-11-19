import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutUsPage';
import CreateRecipe from './pages/CreateRecipePage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  const isAuthenticated = false; // Replace with real auth logic

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/browse" 
          element={
              <BrowsePage />
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/about" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AboutPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create" 
          element={
              <CreateRecipe />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
