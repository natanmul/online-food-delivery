import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import PrivateRoute from './PrivateRoute.jsx';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;