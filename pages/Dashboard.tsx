
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PatientDashboard } from '../features/dashboard/PatientDashboard';
import { DoctorDashboard } from '../features/dashboard/DoctorDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surgical p-6">
      <div className="max-w-7xl mx-auto">
        {user?.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />}
      </div>
    </div>
  );
};
