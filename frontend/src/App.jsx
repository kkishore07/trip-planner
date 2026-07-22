import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { TripPlanner } from './pages/TripPlanner';
import { ItineraryView } from './pages/ItineraryView';
import { ExpenseTracker } from './pages/ExpenseTracker';
import { WeatherRecommendations } from './pages/WeatherRecommendations';
import { TravelChecklist } from './pages/TravelChecklist';
import { AdminDashboard } from './pages/AdminDashboard';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><TripPlanner /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><WeatherRecommendations /></ProtectedRoute>} />
          <Route path="/tools" element={<ProtectedRoute><TravelChecklist /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
