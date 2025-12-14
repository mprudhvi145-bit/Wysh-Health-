
import React, { useState } from 'react';
import { Play, X, ArrowRight, User, Stethoscope, Activity, ShieldCheck, Database, Layout, RotateCcw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const DemoGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { switchRole, user, logout } = useAuth();
  const { addNotification } = useNotification();

  const handleReset = () => {
      window.location.reload();
  };

  const flows = [
    {
      title: "1. Patient Workflow",
      color: "teal",
      steps: [
        { label: 'Login as Patient', action: () => { switchRole('patient'); navigate('/dashboard'); } },
        { label: 'View Health Dashboard', action: () => navigate('/dashboard') },
        { label: 'Upload Lab Report', action: () => navigate('/dashboard/records') },
        { label: 'Share via OTP', action: () => navigate('/dashboard/records') },
      ]
    },
    {
      title: "2. Doctor Workflow",
      color: "purple",
      steps: [
        { label: 'Login as Doctor', action: () => { switchRole('doctor'); navigate('/dashboard'); } },
        { label: 'Patient Lookup', action: () => navigate('/doctor/patients') },
        { label: 'Request Consent', action: () => navigate('/doctor/patients') },
        { label: 'Write SOAP Note', action: () => navigate('/doctor/patients') },
      ]
    },
    {
      title: "3. Emergency (Public)",
      color: "red",
      steps: [
        { label: 'Logout Session', action: () => { logout(); navigate('/'); } },
        { label: 'Scan Emergency QR', action: () => navigate('/emergency-view/WYSH-IND-9X82K') }, // Demo ID
      ]
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-sans">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-teal to-purple text-white px-4 py-3 rounded-full shadow-[0_0_20px_rgba(77,139,131,0.5)] hover:scale-105 transition-all animate-float border border-white/10"
        >
          <Play fill="currentColor" size={16} />
          <span className="font-bold tracking-wide text-sm">Demo Script</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-[#0D0F12] border border-white/10 rounded-2xl shadow-2xl w-80 overflow-hidden animate-scaleIn relative backdrop-blur-xl">
          <div className="bg-gradient-to-r from-teal/20 to-purple/20 p-4 flex justify-between items-center border-b border-white/10">
            <div>
               <h3 className="text-white font-bold text-sm">Live Pilot Script</h3>
               <p className="text-[10px] text-teal-glow uppercase tracking-wider font-bold">Role: {user?.role || 'Guest'}</p>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={handleReset} className="p-1.5 text-white/50 hover:text-white transition-colors rounded hover:bg-white/10" title="Reset Demo Data">
                    <RotateCcw size={14} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/50 hover:text-white transition-colors rounded hover:bg-white/10">
                    <X size={18} />
                </button>
            </div>
          </div>
          
          <div className="p-3 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {flows.map((flow, idx) => (
              <div key={idx}>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 text-${flow.color === 'red' ? 'red-400' : flow.color === 'purple' ? 'purple' : 'teal'}`}>
                  {flow.title}
                </h4>
                <div className="space-y-1">
                  {flow.steps.map((step, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => {
                        step.action();
                        addNotification('info', `Demo: ${step.label}`);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group text-left border border-transparent hover:border-white/5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors" />
                      <span className="text-xs text-text-secondary group-hover:text-white transition-colors">{step.label}</span>
                      <ArrowRight size={12} className="ml-auto text-white/20 group-hover:text-teal opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-white/5 border-t border-white/5 text-[10px] text-center text-text-secondary flex justify-center items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> System Secure • 15m Session
          </div>
        </div>
      )}
    </div>
  );
};
