import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { NavigationSidebar } from './components';
import NotificationProvider from './lib/notifications';
import { ROUTES } from './lib/router';
import { ProtectedRoute } from './lib/router-dom';
import { theme } from './lib/theme';
import {
  AccountsView,
  AuthenticationView,
  DashboardView,
  ProfileView,
  SettingsView,
  SupportView,
} from './pages';
import { useSelector } from './redux/hooks';
import { persistor, store } from './redux/store';
import { getToken } from './redux/user/selectors';

function Router() {
  const token = useSelector(getToken);

  return (
    <BrowserRouter>
      <NavigationSidebar />
      <Routes>
        <Route path={ROUTES.BASE} element={<Navigate to={ROUTES.DASHBOARD} />} />
        <Route path={ROUTES.AUTH} element={<AuthenticationView />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute token={token}>
              <DashboardView />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USER_ACCOUNT}
          element={
            <ProtectedRoute token={token}>
              <ProfileView />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ACCOUNTS}
          element={
            <ProtectedRoute token={token}>
              <AccountsView />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SUPPORT}
          element={
            <ProtectedRoute token={token}>
              <SupportView />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoute token={token}>
              <SettingsView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <NotificationProvider>
              <Router />
            </NotificationProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
