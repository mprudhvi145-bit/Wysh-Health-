import React from 'react';
import { X } from 'lucide-react';

export const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  hoverEffect?: boolean;
  style?: React.CSSProperties;
}> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  style
}) => {
  return (
    <div 
      className={`
      glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group
      ${hoverEffect ? 'hover:-translate-y-1' : ''}
      ${className}
    `}
      style={style}
    >
      {/* Holographic Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-glow/0 via-teal-glow/10 to-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </div>
  );
};

export const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline'; 
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}> = ({ children, variant = 'primary', onClick, className = '', icon, type = 'button', disabled }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-display font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-teal text-white hover:bg-teal-glow hover:shadow-[0_0_20px_rgba(77,139,131,0.5)] border border-transparent",
    secondary: "bg-purple text-white hover:bg-purple-dark hover:shadow-[0_0_20px_rgba(135,99,255,0.5)] border border-transparent",
    outline: "bg-transparent border border-white/20 text-text-primary hover:border-teal hover:text-teal hover:bg-white/5"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{icon}{children}</span>
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
      )}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'teal' | 'purple' }> = ({ children, color = 'teal' }) => {
  const colors = {
    teal: "bg-teal/10 text-teal-glow border-teal/20",
    purple: "bg-purple/10 text-purple-300 border-purple/20"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-mono uppercase tracking-wider border ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props} 
    className="w-full bg-surgical-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all placeholder:text-text-secondary/50"
  />
);

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto bg-surgical border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-display font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        {children}
      </GlassCard>
    </div>
  );
};