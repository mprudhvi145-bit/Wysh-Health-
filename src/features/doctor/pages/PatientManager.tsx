
import React, { useState, useEffect } from 'react';
import { clinicalService } from '../services/clinicalService';
import { ClinicalProvider } from '../context/ClinicalContext';
import { useClinical } from '../hooks/useClinical';
import { useNotification } from '../../../context/NotificationContext';
import { ClinicalPatient } from '../../../services/doctorService';
import { PatientManagerView } from './PatientManagerView';

// Internal Component accessing Context (The Container)
const PatientManagerContainer: React.FC = () => {
  const { loadPatient, patient, loading, error, clear } = useClinical();
  const { addNotification } = useNotification();
  
  // State for Lists & UI interactions
  const [patients, setPatients] = useState<ClinicalPatient[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'rx' | 'labs' | 'notes' | 'docs'>('overview');

  // Initial Fetch & Search for Sidebar
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await clinicalService.searchPatients(search);
        setPatients(data);
      } catch (err) {
        console.error("Failed to search patients", err);
        addNotification('error', 'Failed to load patient list');
      }
    };
    const timer = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timer);
  }, [search, addNotification]);

  // Logic Handlers
  const handleSelectPatient = (p: ClinicalPatient) => {
    loadPatient(p.id);
    setActiveTab('overview');
  };

  const handleCloseVisit = () => {
      // In a real flow, this might trigger a modal first
      addNotification('success', 'Visit summary logged. Chart closed.');
      clear();
  };

  return (
    <PatientManagerView 
      patients={patients}
      selectedPatientId={patient?.id}
      searchQuery={search}
      onSearchChange={setSearch}
      onSelectPatient={handleSelectPatient}
      onCloseVisit={handleCloseVisit}
      loading={loading}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      patientData={patient}
      error={error}
    />
  );
};

// Root Page Export
export const PatientManager: React.FC = () => {
  return (
    <ClinicalProvider>
      <PatientManagerContainer />
    </ClinicalProvider>
  );
};
