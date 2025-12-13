
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Investor } from './pages/Investor';
import { Contact } from './pages/Contact';
import { Team } from './pages/Team';
import { AIHealthDash } from './pages/AIHealthDash';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { DoctorDirectory } from './features/doctors/pages/DoctorDirectory';
import { DoctorProfile } from './features/doctors/pages/DoctorProfile';
import { BookingPage } from './features/appointments/pages/BookingPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HealthRecords } from './features/patient/pages/HealthRecords';
import { PatientManager } from './features/doctor/pages/PatientManager';

// Placeholder for Products page
const Products = () => (
  <div className="min-h-screen flex items-center justify-center text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Product Suite</h1>
      <p className="text-text-secondary">Modules loading...</p>
    </div>
  </div>
);

// Placeholder for Doctor Schedule
const Schedule = () => (
  <div className="min-h-screen flex items-center justify-center text-white">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Schedule Management</h1>
      <p className="text-text-secondary">Calendar integration coming soon.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
        <AuthProvider>
        <Router>
            <Layout>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/investors" element={<Investor />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/team" element={<Team />} />
                <Route path="/products" element={<Products />} />
                
                {/* Doctors Public */}
                <Route path="/doctors" element={<DoctorDirectory />} />
                <Route path="/doctors/:id" element={<DoctorProfile />} />
                
                {/* Protected Routes */}
                <Route path="/book/:doctorId" element={
                    <ProtectedRoute>
                        <BookingPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/dashboard/records" element={
                    <ProtectedRoute>
                        <HealthRecords />
                    </ProtectedRoute>
                } />

                <Route path="/doctor/patients" element={
                    <ProtectedRoute>
                        <PatientManager />
                    </ProtectedRoute>
                } />

                 <Route path="/doctor/schedule" element={
                    <ProtectedRoute>
                        <Schedule />
                    </ProtectedRoute>
                } />

                <Route path="/ai-health" element={
                    <ProtectedRoute>
                        <AIHealthDash />
                    </ProtectedRoute>
                } />
                
                <Route path="/ecosystem" element={<Navigate to="/" />} />
            </Routes>
            </Layout>
        </Router>
        </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
