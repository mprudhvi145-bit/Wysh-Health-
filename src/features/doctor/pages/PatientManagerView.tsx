
import React from 'react';
import { GlassCard, Button, Input, Loader } from '../../../components/UI';
import { Search, UserPlus, Activity, ShieldCheck, ShieldAlert } from 'lucide-react';
import { ClinicalPatient } from '../../../services/doctorService';
import OverviewTab from './tabs/OverviewTab';
import PrescriptionsTab from './tabs/PrescriptionsTab';
import LabsTab from './tabs/LabsTab';
import NotesTab from './tabs/NotesTab';
import DocumentsTab from './tabs/DocumentsTab';

interface PatientManagerViewProps {
  patients: ClinicalPatient[];
  selectedPatientId?: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSelectPatient: (patient: ClinicalPatient) => void;
  onCloseVisit: () => void;
  loading: boolean;
  activeTab: string;
  onTabChange: (tab: 'overview' | 'rx' | 'labs' | 'notes' | 'docs') => void;
  patientData?: any; // The full chart data
}

export const PatientManagerView: React.FC<PatientManagerViewProps> = ({
  patients,
  selectedPatientId,
  searchQuery,
  onSearchChange,
  onSelectPatient,
  onCloseVisit,
  loading,
  activeTab,
  onTabChange,
  patientData
}) => {
  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Clinical Console</h1>
          <p className="text-text-secondary text-sm">Patient management and clinical workflows.</p>
        </div>
        <Button variant="primary" icon={<UserPlus size={16}/>}>New Patient</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Patient List (Left Sidebar) */}
        <div className="lg:col-span-1 flex flex-col gap-4 bg-surgical-light/30 border border-white/5 rounded-2xl p-4">
          <div className="relative">
            <Input 
              placeholder="Search patients..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 !bg-black/20"
            />
            <Search className="absolute left-3 top-3.5 text-text-secondary w-5 h-5" />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {patients.length === 0 && (
                <div className="text-center py-8 text-text-secondary text-sm">No patients found.</div>
            )}
            {patients.map(p => (
              <div 
                key={p.id} 
                className={`
                  p-3 rounded-xl cursor-pointer transition-all border relative
                  ${selectedPatientId === p.id 
                    ? 'bg-teal/10 border-teal text-white' 
                    : 'bg-white/5 border-transparent text-text-secondary hover:bg-white/10 hover:text-white'}
                `}
                onClick={() => onSelectPatient(p)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold">{p.name}</h4>
                  <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded">{p.bloodType || 'N/A'}</span>
                </div>
                <p className="text-xs opacity-70 truncate">{p.chronicConditions?.join(', ') || 'Healthy'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Workspace (Right Area) */}
        <div className="lg:col-span-3">
          {patientData ? (
            loading ? (
              <div className="h-full flex items-center justify-center"><Loader text="Loading clinical history..." /></div>
            ) : (
              <GlassCard className="h-full flex flex-col !p-0 overflow-hidden bg-[#0D0F12]">
                {/* Patient Header */}
                <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row justify-between items-start gap-4">
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-teal/20 border border-teal text-teal flex items-center justify-center text-xl font-bold">
                       {patientData.name.charAt(0)}
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-white">{patientData.name}</h2>
                       <div className="flex flex-wrap gap-4 text-sm text-text-secondary mt-1 mb-2">
                          <span className="flex items-center gap-1"><Activity size={14}/> ID: {patientData.id}</span>
                          <span>Age: {patientData.age || 'N/A'}</span>
                          <span>Last Visit: {patientData.lastVisit}</span>
                       </div>
                       
                       {/* ABHA Status Indicator */}
                       {patientData.abha && patientData.abha.status === 'LINKED' ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[10px] text-orange-400 font-bold">
                             <ShieldCheck size={12} /> ABHA Linked: {patientData.abha.address}
                          </div>
                       ) : (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-text-secondary font-bold">
                             <ShieldAlert size={12} /> ABHA Missing
                          </div>
                       )}
                     </div>
                   </div>
                   
                   <div className="flex gap-2">
                       <Button variant="outline" className="h-10 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={onCloseVisit}>
                         End Visit
                       </Button>
                   </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 px-6 bg-black/20 overflow-x-auto">
                  {[
                    { key: 'overview', label: 'Overview' },
                    { key: 'notes', label: 'SOAP Notes' }, // Reordered
                    { key: 'rx', label: 'Prescriptions' },
                    { key: 'labs', label: 'Lab Orders' },
                    { key: 'docs', label: 'Documents' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => onTabChange(tab.key as any)}
                      className={`
                        px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                        ${activeTab === tab.key ? 'border-teal text-white' : 'border-transparent text-text-secondary hover:text-white'}
                      `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-black/10">
                   {activeTab === 'overview' && <OverviewTab />}
                   {activeTab === 'rx' && <PrescriptionsTab />}
                   {activeTab === 'labs' && <LabsTab />}
                   {activeTab === 'notes' && <NotesTab />}
                   {activeTab === 'docs' && <DocumentsTab />}
                </div>
              </GlassCard>
            )
          ) : (
             <div className="h-full flex items-center justify-center flex-col gap-4 text-text-secondary border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
               <Activity size={48} className="opacity-20" />
               <p>Select a patient from the roster to begin clinical session</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
