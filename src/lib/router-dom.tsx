import React from 'react';
import { Navigate } from 'react-router-dom';

import { ROUTES } from './router';

type ProtectedRouteProps = {
  token: string | null;
  children: React.ReactElement | null;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ token, children }) => {
  if (token) {
    return children;
  } else {
    return <Navigate to={ROUTES.AUTH} replace />;
  }
};
