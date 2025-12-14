
import React, { useState } from 'react';
import { Play, X, ArrowRight, RotateCcw, MonitorPlay, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const DemoGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFlow, setActiveFlow] = useState<number | null>(null);
  const navigate = useNavigate();
  const { switchRole, logout } = useAuth();
  const { addNotification } = useNotification();

  const handleReset = () => {
      logout();
      window.location.reload();
  };

  const flows = [
    {
      id: 1,
      title: "1. Patient Experience (4m)",
      color: "teal",
      steps: [
        { 
            label: 'Login Patient', 
            action: () => { switchRole('patient'); navigate('/dashboard'); },
            script: "Patients log in with OTP — no passwords, no confusion."
        },
        { 
            label: 'Show Dashboard', 
            action: () => navigate('/dashboard'),
            script: "This WyshID is the patient’s universal health identity across hospitals."
        },
        { 
            label: 'Upload Record', 
            action: () => navigate('/dashboard/records'),
            script: "Patients upload records once — they don’t carry files anymore."
        },
        { 
            label: 'Hide/Share', 
            action: () => navigate('/dashboard/records'),
            script: "Patients can hide records from doctors — but never delete them. Doctors never see data unless the patient approves."
        },
      ]
    },
    {
      id: 2,
      title: "2. Doctor Experience (4m)",
      color: "purple",
      steps: [
        { 
            label: 'Login Doctor', 
            action: () => { switchRole('doctor'); navigate('/dashboard'); },
            script: "Doctors see only their appointments — no global patient list."
        },
        { 
            label: 'Search Patient', 
            action: () => navigate('/doctor/patients'),
            script: "Enter WyshID. No data appears until consent is approved."
        },
        { 
            label: 'Simulate Consent', 
            action: () => { 
                addNotification('success', 'Consent OTP Verified'); 
                navigate('/doctor/patients'); // Force refresh view concept
            },
            script: "(Switching back) Access is time-bound and logged automatically."
        },
        { 
            label: 'Clinical Note', 
            action: () => navigate('/doctor/patients'), // Opens tabs
            script: "SOAP notes are structured and saved instantly."
        },
        { 
            label: 'Prescription', 
            action: () => navigate('/doctor/patients'),
            script: "Prescriptions become part of the patient record."
        },
      ]
    },
    {
      id: 3,
      title: "3. Emergency Flow (2m)",
      color: "red",
      steps: [
        { 
            label: 'Public Access', 
            action: () => { logout(); navigate('/emergency-view/WYSH-IND-9X82K'); },
            script: "No login. No delay. Only what saves a life is visible."
        },
        { 
            label: 'Close Emergency', 
            action: () => navigate('/'),
            script: "The patient is notified later. Everything is logged."
        },
      ]
    },
    {
      id: 4,
      title: "4. Hospital Admin (2m)",
      color: "blue",
      steps: [
        { 
            label: 'Login Admin', 
            action: () => { switchRole('admin'); navigate('/dashboard'); },
            script: "Hospitals see operations, not patient data."
        },
        { 
            label: 'System Health', 
            action: () => navigate('/admin/system'),
            script: "Hospitals manage doctors — not patient records."
        },
      ]
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-sans">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-[#0D0F12] text-white px-5 py-3 rounded-full shadow-[0_0_20px_rgba(77,139,131,0.3)] hover:scale-105 transition-all animate-float border border-white/20 group"
        >
          <MonitorPlay fill="currentColor" size={20} className="text-teal group-hover:text-white transition-colors" />
          <span className="font-bold tracking-wide text-sm">Launch Demo Script</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-[#0D0F12] border border-white/10 rounded-2xl shadow-2xl w-96 overflow-hidden animate-scaleIn relative backdrop-blur-xl flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal/20 to-purple/20 p-4 flex justify-between items-center border-b border-white/10 flex-shrink-0">
            <div>
               <h3 className="text-white font-bold text-sm flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Pilot Script
               </h3>
               <p className="text-[10px] text-text-secondary uppercase tracking-wider font-medium mt-0.5">Total Time: 12-15 Minutes</p>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={handleReset} className="p-2 text-white/50 hover:text-white transition-colors rounded hover:bg-white/10" title="Reset Demo Data">
                    <RotateCcw size={14} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors rounded hover:bg-white/10">
                    <X size={18} />
                </button>
            </div>
          </div>
          
          {/* Flow List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {flows.map((flow) => (
              <div key={flow.id} className={`rounded-xl border transition-all duration-300 overflow-hidden ${activeFlow === flow.id ? 'bg-white/5 border-white/10' : 'bg-transparent border-transparent opacity-70 hover:opacity-100'}`}>
                <button 
                    onClick={() => setActiveFlow(activeFlow === flow.id ? null : flow.id)}
                    className="w-full flex items-center justify-between p-3 text-left"
                >
                    <span className={`text-xs font-bold uppercase tracking-wider text-${flow.color === 'red' ? 'red-400' : flow.color === 'blue' ? 'blue-400' : flow.color === 'purple' ? 'purple-400' : 'teal-400'}`}>
                        {flow.title}
                    </span>
                    {activeFlow === flow.id ? <Play size={12} className="text-white fill-white"/> : <ArrowRight size={12} className="text-text-secondary"/>}
                </button>
                
                {activeFlow === flow.id && (
                    <div className="px-3 pb-3 space-y-3">
                        {flow.steps.map((step, idx) => (
                            <div key={idx} className="relative pl-4 border-l border-white/10 group">
                                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0D0F12] border border-white/20 group-hover:border-teal transition-colors" />
                                <button
                                    onClick={() => {
                                        step.action();
                                        addNotification('info', `Demo Action: ${step.label}`);
                                    }}
                                    className="block w-full text-left mb-1"
                                >
                                    <span className="text-sm font-bold text-white hover:text-teal transition-colors flex items-center gap-2">
                                        {step.label} <Play size={10} />
                                    </span>
                                </button>
                                <div className="p-2 bg-black/40 rounded border border-white/5 text-xs text-text-secondary italic flex gap-2">
                                    <MessageSquare size={12} className="flex-shrink-0 mt-0.5 text-teal/50" />
                                    <span>"{step.script}"</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Closing Statement */}
          <div className="p-4 bg-white/5 border-t border-white/5 flex-shrink-0">
             <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-1">Closing Statement</p>
             <p className="text-xs text-white leading-relaxed italic">
                 "Wysh Care doesn’t replace hospitals. It connects them — while keeping patients in control."
             </p>
          </div>
        </div>
      )}
    </div>
  );
};
