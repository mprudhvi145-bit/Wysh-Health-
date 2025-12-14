
import React, { useState } from 'react';
import { AlertTriangle, X, LifeBuoy, BookOpen, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PilotBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-2 flex flex-col md:flex-row items-center justify-between backdrop-blur-md relative z-[60] gap-2 md:gap-0">
      <div className="flex items-center gap-4 text-xs md:text-sm text-orange-200">
        <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-orange-400">Pilot Environment</span>
        </div>
        <span className="hidden md:inline text-orange-200/50">|</span>
        <span className="hidden md:inline">Controlled Access Only. Features may change.</span>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => navigate('/resources/roadmap')} className="flex items-center gap-2 text-xs font-bold text-teal hover:text-white transition-colors">
              <Map size={14} /> Roadmap
          </button>
          <button onClick={() => navigate('/resources/pilot-handbooks')} className="flex items-center gap-2 text-xs font-bold text-white hover:text-teal transition-colors">
              <BookOpen size={14} /> Handbooks
          </button>
          <button onClick={() => navigate('/contact')} className="flex items-center gap-2 text-xs font-bold text-teal hover:text-white transition-colors">
              <LifeBuoy size={14} /> Support
          </button>
          <button onClick={() => setVisible(false)} className="text-orange-200/50 hover:text-white transition-colors hidden md:block">
            <X size={16} />
          </button>
      </div>
    </div>
  );
};
