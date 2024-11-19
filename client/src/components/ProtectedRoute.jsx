import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem('userInfo')).jwt;

  return token ? children : <Navigate to="/auth" />;
};

export default ProtectedRoute;
