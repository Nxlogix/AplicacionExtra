import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token'); // Verificar si hay un token de sesión

  if (!token) {
    // Si no hay token, redirigir al inicio de sesión
    return <Navigate to="/login" />;
  }

  // Si hay token, permitir el acceso
  return children;
};

export default ProtectedRoute;