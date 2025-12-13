
import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Input, Modal, Badge } from '../../../components/UI';
import { patientService, PatientProfile, Prescription } from '../../../services/patientService';
import { Search, UserPlus, FileText, Activity, Plus, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const PatientManager: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [prescribing, setPrescribing] = useState(false);
  
  // Prescription Form State
  const [meds, setMeds] = useState([{ name: '', dosage: '', frequency: '' }]);

  useEffect(() => {
    const fetchPatients = async () => {
      const data = await patientService.searchPatients(search);
      setPatients(data);
    };
    const timer = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAddMed = () => {
    setMeds([...meds, { name: '', dosage: '', frequency: '' }]);
  };

  const handlePrescribe = async () => {
    if (!selectedPatient || !user) return;
    
    await patientService.addPrescription({
      patientId: selectedPatient.id,
      doctorName: user.name,
      medications: meds.map(m => ({ ...m, duration: '30 days' })),
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
      notes: 'Prescribed via Wysh Clinical Console'
    });
    
    setPrescribing(false);
    setMeds([{ name: '', dosage: '', frequency: '' }]);
    // In real app, show success toast
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Clinical Console</h1>
          <p className="text-text-secondary text-sm">Patient management and prescription fulfillment.</p>
        </div>
        <Button variant="primary" icon={<UserPlus size={16}/>}>Add New Patient</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        
        {/* Patient List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="relative">
            <Input 
              placeholder="Search patients by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3.5 text-text-secondary w-5 h-5" />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {patients.map(p => (
              <GlassCard 
                key={p.id} 
                className={`cursor-pointer transition-all hover:bg-white/10 ${selectedPatient?.id === p.id ? 'border-teal bg-teal/5' : ''}`}
                onClick={() => setSelectedPatient(p)}
                hoverEffect={false}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold">{p.name}</h4>
                  <span className="text-xs text-text-secondary">{p.lastVisit}</span>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <p>Age: {p.age} • Blood: {p.bloodType}</p>
                  <p className="truncate">Condition: {p.chronicConditions.join(', ') || 'None'}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Patient Detail View */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <GlassCard className="h-full flex flex-col">
              <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPatient.name}</h2>
                  <div className="flex gap-4 text-sm text-text-secondary mt-1">
                    <span className="flex items-center gap-1"><Activity size={14}/> ID: {selectedPatient.id}</span>
                    <span>Age: {selectedPatient.age}</span>
                    <span className="text-teal font-bold">{selectedPatient.bloodType}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-xs">History</Button>
                  <Button variant="primary" icon={<FileText size={16}/>} onClick={() => setPrescribing(true)}>
                    Prescribe
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <h4 className="text-red-400 font-bold text-sm mb-2">Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.length > 0 ? (
                      selectedPatient.allergies.map(a => <Badge key={a} color="purple">{a}</Badge>)
                    ) : <span className="text-xs text-white">No known allergies</span>}
                  </div>
                </div>
                 <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <h4 className="text-white font-bold text-sm mb-2">Chronic Conditions</h4>
                   <div className="flex flex-wrap gap-2">
                    {selectedPatient.chronicConditions.map(c => <Badge key={c} color="teal">{c}</Badge>)}
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-black/20 rounded-lg p-4 border border-white/5">
                <h3 className="text-white font-bold mb-4">Clinical Notes</h3>
                <textarea 
                  className="w-full h-full bg-transparent text-white text-sm focus:outline-none resize-none"
                  placeholder="Type clinical observations here..."
                />
              </div>
            </GlassCard>
          ) : (
             <div className="h-full flex items-center justify-center text-text-secondary border border-dashed border-white/10 rounded-2xl">
               <p>Select a patient to view details</p>
             </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      <Modal isOpen={prescribing} onClose={() => setPrescribing(false)} title="Write Prescription">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4 p-3 bg-teal/10 rounded border border-teal/20">
             <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold">Rx</div>
             <div>
               <p className="text-white font-bold text-sm">For: {selectedPatient?.name}</p>
               <p className="text-xs text-text-secondary">Dr. {user?.name}</p>
             </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
             {meds.map((med, idx) => (
               <div key={idx} className="grid grid-cols-3 gap-2 p-3 bg-white/5 rounded-lg border border-white/5 relative group">
                 <div className="col-span-3 md:col-span-1">
                   <input 
                      placeholder="Medication Name" 
                      className="w-full bg-transparent border-b border-white/10 text-white text-sm focus:border-teal outline-none py-1"
                      value={med.name}
                      onChange={(e) => {
                        const newMeds = [...meds];
                        newMeds[idx].name = e.target.value;
                        setMeds(newMeds);
                      }}
                   />
                 </div>
                 <div>
                    <input 
                      placeholder="Dosage (e.g. 10mg)" 
                      className="w-full bg-transparent border-b border-white/10 text-white text-sm focus:border-teal outline-none py-1"
                      value={med.dosage}
                      onChange={(e) => {
                        const newMeds = [...meds];
                        newMeds[idx].dosage = e.target.value;
                        setMeds(newMeds);
                      }}
                   />
                 </div>
                 <div>
                    <input 
                      placeholder="Freq (e.g. 1-0-1)" 
                      className="w-full bg-transparent border-b border-white/10 text-white text-sm focus:border-teal outline-none py-1"
                      value={med.frequency}
                      onChange={(e) => {
                        const newMeds = [...meds];
                        newMeds[idx].frequency = e.target.value;
                        setMeds(newMeds);
                      }}
                   />
                 </div>
               </div>
             ))}
          </div>
          
          <Button variant="outline" className="w-full text-xs dashed" onClick={handleAddMed} icon={<Plus size={14}/>}>
            Add Medication
          </Button>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-4">
             <Button variant="outline" onClick={() => setPrescribing(false)}>Cancel</Button>
             <Button variant="primary" onClick={handlePrescribe} icon={<Save size={16}/>}>Sign & Send</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
