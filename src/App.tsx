
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Investor } from './pages/Investor';
import { Contact } from './pages/Contact';
import { Team } from './pages/Team';
import { Legal } from './pages/Legal'; 
import { Pricing } from './pages/Pricing'; // New Page
import { Products } from './pages/Products';
import { EMRProduct } from './pages/products/EMRProduct';
import { ABDMProduct } from './pages/products/ABDMProduct';
import { HowItWorks } from './pages/products/HowItWorks';
import { WyshIdProduct } from './pages/products/WyshIdProduct';
import { AIClinicalProduct } from './pages/products/AIClinicalProduct';
import { AIHealthDash } from './pages/AIHealthDash';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { DoctorDirectory } from './features/doctors/pages/DoctorDirectory';
import { DoctorProfile } from './features/doctors/pages/DoctorProfile';
import { BookingPage } from './features/appointments/pages/BookingPage';
import { AppointmentListPage } from './features/appointments/pages/AppointmentListPage';
import { AppointmentDetail } from './features/appointments/pages/AppointmentDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HealthRecords } from './features/patient/pages/HealthRecords';
import { SecurityPage } from './features/security/SecurityPage'; 
import { PatientManager } from './features/doctor/pages/PatientManager';
import { ScheduleManager } from './features/doctor/pages/ScheduleManager';
import { ProfilePage } from './features/profile/ProfilePage';
import { PatientPrescriptions } from './features/patient/pages/PatientPrescriptions';
import { PatientLabs } from './features/patient/pages/PatientLabs';
import { AppointmentSummary } from './features/patient/pages/AppointmentSummary';
import { AIInsights } from './features/patient/pages/AIInsights';
import { AbhaManager } from './features/patient/pages/AbhaManager';
import { EmergencyAccess } from './features/patient/pages/EmergencyAccess';
import { EmergencyPublic } from './pages/EmergencyPublic';
import { SystemHealth } from './pages/admin/SystemHealth'; 

const App: React.FC = () => {
  return (
    <ErrorBoundary>
        <AuthProvider>
        <Router>
            <Routes>
                {/* Public Emergency Route (No Layout) */}
                <Route path="/emergency-view/:wyshId" element={<EmergencyPublic />} />

                {/* Main App Routes */}
                <Route path="*" element={
                    <Layout>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/investors" element={<Investor />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/team" element={<Team />} />
                            <Route path="/legal" element={<Legal />} />
                            <Route path="/pricing" element={<Pricing />} />
                            
                            {/* Product Suite */}
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/wysh-id" element={<WyshIdProduct />} />
                            <Route path="/products/emr" element={<EMRProduct />} />
                            <Route path="/products/ai-clinical" element={<AIClinicalProduct />} />
                            <Route path="/products/abdm" element={<ABDMProduct />} />
                            <Route path="/products/how-it-works" element={<HowItWorks />} />
                            
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
                            
                            <Route path="/dashboard/insights" element={
                                <ProtectedRoute>
                                    <AIInsights />
                                </ProtectedRoute>
                            } />

                            <Route path="/dashboard/prescriptions" element={
                                <ProtectedRoute>
                                    <PatientPrescriptions />
                                </ProtectedRoute>
                            } />

                            <Route path="/dashboard/labs" element={
                                <ProtectedRoute>
                                    <PatientLabs />
                                </ProtectedRoute>
                            } />

                            <Route path="/appointments" element={
                                <ProtectedRoute>
                                    <AppointmentListPage />
                                </ProtectedRoute>
                            } />

                            <Route path="/appointments/:id" element={
                                <ProtectedRoute>
                                    <AppointmentDetail />
                                </ProtectedRoute>
                            } />

                            <Route path="/appointments/:id/summary" element={
                                <ProtectedRoute>
                                    <AppointmentSummary />
                                </ProtectedRoute>
                            } />

                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            } />

                            <Route path="/security" element={
                                <ProtectedRoute>
                                    <SecurityPage />
                                </ProtectedRoute>
                            } />

                            {/* Admin Route */}
                            <Route path="/admin/system" element={
                                <ProtectedRoute>
                                    <SystemHealth />
                                </ProtectedRoute>
                            } />

                            <Route path="/abha" element={
                                <ProtectedRoute>
                                    <AbhaManager />
                                </ProtectedRoute>
                            } />

                            {/* Patient's Emergency Settings */}
                            <Route path="/emergency" element={
                                <ProtectedRoute>
                                    <EmergencyAccess />
                                </ProtectedRoute>
                            } />

                            <Route path="/doctor/patients" element={
                                <ProtectedRoute>
                                    <PatientManager />
                                </ProtectedRoute>
                            } />

                            <Route path="/doctor/schedule" element={
                                <ProtectedRoute>
                                    <ScheduleManager />
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
                } />
            </Routes>
        </Router>
        </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
