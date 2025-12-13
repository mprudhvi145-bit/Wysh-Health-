import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Input, Modal, Badge, Loader } from '../../../components/UI';
import { patientService, Prescription } from '../../../services/patientService';
import { doctorService, ClinicalPatient, LabOrder } from '../../../services/doctorService';
import { Search, UserPlus, FileText, Activity, Plus, Save, TestTube, Clock, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';

export const PatientManager: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  // Lists & Selection
  const [patients, setPatients] = useState<ClinicalPatient[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<ClinicalPatient | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Workflow Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'rx' | 'labs'>('overview');
  
  // Modals
  const [prescribing, setPrescribing] = useState(false);
  const [orderingLab, setOrderingLab] = useState(false);
  
  // Forms
  const [meds, setMeds] = useState([{ name: '', dosage: '', frequency: '' }]);
  const [labForm, setLabForm] = useState({ testName: '', category: 'Blood', priority: 'Routine' });

  // Initial Fetch & Search
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await doctorService.searchPatients(search);
        setPatients(data);
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Full Details on Select
  const handleSelectPatient = async (patient: ClinicalPatient) => {
    setLoadingDetails(true);
    try {
      const details = await doctorService.getPatientDetails(patient.id);
      setSelectedPatient(details);
      setActiveTab('overview');
    } catch (err) {
      addNotification('error', 'Failed to load patient history');
    } finally {
      setLoadingDetails(false);
    }
  };

  // --- Handlers ---

  const handleAddMed = () => {
    setMeds([...meds, { name: '', dosage: '', frequency: '' }]);
  };

  const handlePrescribe = async () => {
    if (!selectedPatient || !user) return;
    try {
      const res = await doctorService.createPrescription({
        patientId: selectedPatient.id,
        medications: meds.map(m => ({ ...m, duration: '30 days' })),
        notes: 'Prescribed via Wysh Clinical Console'
      });
      
      // Optimistically update local state
      setSelectedPatient(prev => prev ? ({
        ...prev,
        prescriptions: [res.data, ...(prev.prescriptions || [])]
      }) : null);
      
      setPrescribing(false);
      setMeds([{ name: '', dosage: '', frequency: '' }]);
      addNotification('success', 'Prescription sent to pharmacy');
    } catch (err) {
      addNotification('error', 'Failed to prescribe');
    }
  };

  const handleOrderLab = async () => {
    if (!selectedPatient || !user) return;
    try {
      const res = await doctorService.orderLab({
        patientId: selectedPatient.id,
        ...labForm
      });

      // Optimistically update local state
      setSelectedPatient(prev => prev ? ({
        ...prev,
        labOrders: [res.data, ...(prev.labOrders || [])]
      }) : null);

      setOrderingLab(false);
      addNotification('success', 'Lab order placed successfully');
    } catch (err) {
      addNotification('error', 'Failed to place order');
    }
  };

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 !bg-black/20"
            />
            <Search className="absolute left-3 top-3.5 text-text-secondary w-5 h-5" />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {patients.map(p => (
              <div 
                key={p.id} 
                className={`
                  p-3 rounded-xl cursor-pointer transition-all border relative
                  ${selectedPatient?.id === p.id 
                    ? 'bg-teal/10 border-teal text-white' 
                    : 'bg-white/5 border-transparent text-text-secondary hover:bg-white/10 hover:text-white'}
                `}
                onClick={() => handleSelectPatient(p)}
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
          {selectedPatient ? (
            loadingDetails ? (
              <div className="h-full flex items-center justify-center"><Loader text="Loading clinical history..." /></div>
            ) : (
              <GlassCard className="h-full flex flex-col !p-0 overflow-hidden bg-[#0D0F12]">
                {/* Patient Header */}
                <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row justify-between items-start gap-4">
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-teal/20 border border-teal text-teal flex items-center justify-center text-xl font-bold">
                       {selectedPatient.name.charAt(0)}
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-white">{selectedPatient.name}</h2>
                       <div className="flex flex-wrap gap-4 text-sm text-text-secondary mt-1">
                          <span className="flex items-center gap-1"><Activity size={14}/> ID: {selectedPatient.id}</span>
                          <span>Age: {selectedPatient.age}</span>
                          <span>Last Visit: {selectedPatient.lastVisit}</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex gap-2">
                      <Button variant={activeTab === 'rx' ? 'primary' : 'outline'} className="h-10 text-xs" icon={<FileText size={16}/>} onClick={() => setPrescribing(true)}>
                        Prescribe
                      </Button>
                      <Button variant={activeTab === 'labs' ? 'primary' : 'outline'} className="h-10 text-xs" icon={<TestTube size={16}/>} onClick={() => setOrderingLab(true)}>
                        Order Lab
                      </Button>
                   </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 px-6 bg-black/20">
                  {['overview', 'rx', 'labs'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`
                        px-6 py-4 text-sm font-medium border-b-2 transition-colors
                        ${activeTab === tab ? 'border-teal text-white' : 'border-transparent text-text-secondary hover:text-white'}
                      `}
                    >
                      {tab === 'overview' && 'Clinical Overview'}
                      {tab === 'rx' && 'Medications'}
                      {tab === 'labs' && 'Lab Results'}
                    </button>
                  ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-black/10">
                   {activeTab === 'overview' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Alerts Column */}
                       <div className="space-y-4">
                         <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                            <h4 className="text-red-300 font-bold text-sm mb-3 flex items-center gap-2"><AlertCircle size={16}/> Allergies</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedPatient.allergies?.map((a: string) => <Badge key={a} color="purple">{a}</Badge>) || <span className="text-xs text-white/50">None Recorded</span>}
                            </div>
                         </div>
                         <div className="bg-teal/10 border border-teal/20 p-4 rounded-xl">
                            <h4 className="text-teal font-bold text-sm mb-3 flex items-center gap-2"><Activity size={16}/> Chronic Conditions</h4>
                             <div className="flex flex-wrap gap-2">
                                {selectedPatient.chronicConditions?.map((c: string) => <Badge key={c} color="teal">{c}</Badge>)}
                            </div>
                         </div>
                       </div>
                       
                       {/* Vitals Column */}
                       <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-full">
                          <h4 className="text-white font-bold text-sm mb-4">Latest Vitals</h4>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                <span className="text-text-secondary">Blood Pressure</span>
                                <span className="text-white font-mono text-lg">120/80</span>
                             </div>
                             <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                <span className="text-text-secondary">Heart Rate</span>
                                <span className="text-white font-mono text-lg">72 <span className="text-xs text-text-secondary">bpm</span></span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-text-secondary">Temp</span>
                                <span className="text-white font-mono text-lg">98.6 <span className="text-xs text-text-secondary">°F</span></span>
                             </div>
                          </div>
                       </div>
                     </div>
                   )}

                   {activeTab === 'rx' && (
                     <div className="space-y-4">
                        {(!selectedPatient.prescriptions || selectedPatient.prescriptions.length === 0) && (
                            <div className="text-center py-12 text-text-secondary border border-dashed border-white/10 rounded-xl">
                                No active prescriptions.
                            </div>
                        )}
                        {selectedPatient.prescriptions?.map((rx: Prescription) => (
                          <div key={rx.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3 group hover:border-teal/30 transition-colors">
                             <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs text-teal font-bold block mb-1">{rx.date}</span>
                                    <span className="text-xs text-text-secondary">Ordered by {rx.doctorName}</span>
                                </div>
                                <Badge color="teal">Active</Badge>
                             </div>
                             
                             <div className="space-y-2 mt-2">
                                {rx.medications.map((m, i) => (
                                  <div key={i} className="flex justify-between items-center text-sm bg-black/20 p-2 rounded">
                                      <span className="text-white font-medium">{m.name}</span>
                                      <span className="text-text-secondary">{m.dosage} • {m.frequency}</span>
                                  </div>
                                ))}
                             </div>
                             
                             {rx.notes && <p className="text-xs text-text-secondary italic mt-1 border-t border-white/5 pt-2">"{rx.notes}"</p>}
                          </div>
                        ))}
                     </div>
                   )}

                   {activeTab === 'labs' && (
                     <div className="space-y-4">
                        {(!selectedPatient.labOrders || selectedPatient.labOrders.length === 0) && (
                            <div className="text-center py-12 text-text-secondary border border-dashed border-white/10 rounded-xl">
                                No labs ordered.
                            </div>
                        )}
                        {selectedPatient.labOrders?.map((lab: LabOrder) => (
                          <div key={lab.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-purple/30 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple/10 rounded-lg text-purple">
                                  <TestTube size={20} />
                                </div>
                                <div>
                                  <h4 className="text-white font-bold text-sm">{lab.testName}</h4>
                                  <p className="text-xs text-text-secondary mt-0.5">{lab.category} • {lab.priority}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <Badge color={lab.status === 'Completed' ? 'teal' : 'purple'}>{lab.status}</Badge>
                                <p className="text-[10px] text-text-secondary mt-2">{lab.dateOrdered}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
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

      {/* Prescription Modal */}
      <Modal isOpen={prescribing} onClose={() => setPrescribing(false)} title="Write Prescription">
        <div className="space-y-4">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
             {meds.map((med, idx) => (
               <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-white/5 rounded-lg border border-white/5">
                 <div className="md:col-span-1">
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
                 <input 
                    placeholder="Dosage (e.g. 50mg)" 
                    className="w-full bg-transparent border-b border-white/10 text-white text-sm focus:border-teal outline-none py-1"
                    value={med.dosage}
                    onChange={(e) => {
                      const newMeds = [...meds];
                      newMeds[idx].dosage = e.target.value;
                      setMeds(newMeds);
                    }}
                 />
                 <input 
                    placeholder="Freq (e.g. 2x Daily)" 
                    className="w-full bg-transparent border-b border-white/10 text-white text-sm focus:border-teal outline-none py-1"
                    value={med.frequency}
                    onChange={(e) => {
                      const newMeds = [...meds];
                      newMeds[idx].frequency = e.target.value;
                      setMeds(newMeds);
                    }}
                 />
               </div>
             ))}
          </div>
          <Button variant="outline" className="w-full text-xs dashed" onClick={handleAddMed} icon={<Plus size={14}/>}>
            Add Medication
          </Button>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
             <Button variant="outline" onClick={() => setPrescribing(false)}>Cancel</Button>
             <Button variant="primary" onClick={handlePrescribe} icon={<Save size={16}/>}>Sign & Send</Button>
          </div>
        </div>
      </Modal>

      {/* Lab Order Modal */}
      <Modal isOpen={orderingLab} onClose={() => setOrderingLab(false)} title="Order Lab Test">
        <div className="space-y-4">
           <div>
              <label className="text-xs text-text-secondary uppercase mb-1 block">Test Name</label>
              <Input 
                value={labForm.testName}
                onChange={e => setLabForm({...labForm, testName: e.target.value})}
                placeholder="e.g. Complete Blood Count"
              />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-secondary uppercase mb-1 block">Category</label>
                <select 
                  className="w-full bg-surgical-light border border-white/10 rounded-lg px-4 py-3 text-white"
                  value={labForm.category}
                  onChange={e => setLabForm({...labForm, category: e.target.value})}
                >
                  <option>Blood</option>
                  <option>Urine</option>
                  <option>Imaging</option>
                  <option>Biopsy</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary uppercase mb-1 block">Priority</label>
                <select 
                  className="w-full bg-surgical-light border border-white/10 rounded-lg px-4 py-3 text-white"
                  value={labForm.priority}
                  onChange={e => setLabForm({...labForm, priority: e.target.value})}
                >
                  <option>Routine</option>
                  <option>Urgent</option>
                  <option>Stat</option>
                </select>
              </div>
           </div>
           <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
             <Button variant="outline" onClick={() => setOrderingLab(false)}>Cancel</Button>
             <Button variant="primary" onClick={handleOrderLab} icon={<TestTube size={16}/>}>Place Order</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};