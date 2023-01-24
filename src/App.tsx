import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import { NavigationSidebar } from './components';
import { ROUTES } from './lib/router';
import { theme } from './lib/theme';
import { Dashboard, LogIn, SignUp } from './pages';

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <NavigationSidebar />
          <Routes>
            <Route path={ROUTES.BASE} element={<Navigate to={ROUTES.DASHBOARD} />} />
            <Route path={ROUTES.LOGIN} element={<LogIn />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
