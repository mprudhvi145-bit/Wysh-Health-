
import React, { useState } from 'react';
import { Play, X, ArrowRight, User, Stethoscope, Activity, ShieldCheck, Database, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const DemoGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { addNotification } = useNotification();

  const steps = [
    {
      id: 1,
      label: 'Platform Overview',
      desc: 'Hero, Value Prop, Audience Segments',
      action: () => {
        navigate('/products');
      },
      icon: <Layout size={16} />
    },
    {
      id: 2,
      label: 'Patient Onboarding',
      desc: 'Wysh ID, ABHA Link, Profile',
      action: () => {
        switchRole('patient');
        navigate('/abha?tab=profile');
        addNotification('info', 'Switched to Patient View');
      },
      icon: <User size={16} />
    },
    {
      id: 3,
      label: 'Doctor Workflow',
      desc: 'Clinical Console, SOAP, Rx',
      action: () => {
        switchRole('doctor');
        navigate('/doctor/patients'); // Goes to console directly
        addNotification('info', 'Switched to Doctor View');
      },
      icon: <Stethoscope size={16} />
    },
    {
      id: 4,
      label: 'Labs & AI Insights',
      desc: 'Lab Orders, AI Summaries',
      action: () => {
        switchRole('patient');
        navigate('/dashboard/insights');
        addNotification('info', 'Switched to Patient View');
      },
      icon: <Activity size={16} />
    },
    {
      id: 5,
      label: 'Patient Access',
      desc: 'Prescriptions, Documents',
      action: () => {
        switchRole('patient');
        navigate('/dashboard/prescriptions');
        addNotification('info', 'Switched to Patient View');
      },
      icon: <Database size={16} />
    },
    {
      id: 6,
      label: 'ABDM Consent',
      desc: 'Consent Ledger, Revocation',
      action: () => {
        switchRole('patient');
        navigate('/abha?tab=consents');
        addNotification('info', 'Switched to Patient View');
      },
      icon: <ShieldCheck size={16} />
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-sans">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-teal to-purple text-white px-4 py-3 rounded-full shadow-[0_0_20px_rgba(77,139,131,0.5)] hover:scale-105 transition-all animate-float"
        >
          <Play fill="currentColor" size={16} />
          <span className="font-bold tracking-wide text-sm">Run Demo</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-[#0D0F12] border border-white/10 rounded-2xl shadow-2xl w-80 overflow-hidden animate-scaleIn relative">
          <div className="bg-gradient-to-r from-teal/20 to-purple/20 p-4 flex justify-between items-center border-b border-white/10">
            <div>
               <h3 className="text-white font-bold text-sm">Official Product Demo</h3>
               <p className="text-[10px] text-teal-glow uppercase tracking-wider font-bold">Live Script Mode</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={step.action}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-secondary group-hover:bg-teal/20 group-hover:text-teal transition-colors flex-shrink-0 border border-white/5">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-xs truncate">
                    {step.id}. {step.label}
                  </h4>
                  <p className="text-[10px] text-text-secondary truncate">{step.desc}</p>
                </div>
                <ArrowRight size={14} className="text-white/20 group-hover:text-teal transition-colors" />
              </button>
            ))}
          </div>
          
          <div className="p-3 bg-white/5 border-t border-white/5 text-[10px] text-center text-text-secondary">
             Simulated Envt • Data Reset on Refresh
          </div>
        </div>
      )}
    </div>
  );
};
