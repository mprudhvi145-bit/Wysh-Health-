
import React from 'react';
import { X, Check, Loader2 } from 'lucide-react';

export const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  hoverEffect?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  style,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
      glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group
      ${hoverEffect ? 'hover:-translate-y-1 cursor-pointer' : ''}
      ${className}
    `}
      style={style}
    >
      {/* Dynamic Border Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Corner Accent */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-glow/20 blur-2xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const Button: React.FC<{ 
  children?: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'; 
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}> = ({ children, variant = 'primary', onClick, className = '', icon, type = 'button', disabled }) => {
  
  const baseStyle = "px-6 py-3 rounded-lg font-display font-medium transition-all duration-300 flex items-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-teal text-surgical hover:bg-teal-glow hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] border border-transparent font-bold",
    secondary: "bg-purple text-white hover:bg-purple-light hover:shadow-[0_0_20px_rgba(197,108,255,0.4)] border border-transparent",
    outline: "bg-transparent border border-white/20 text-text-primary hover:border-teal hover:text-teal-glow hover:bg-teal/5",
    danger: "bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 hover:text-red-200"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2 mx-auto">{icon}{children}</span>
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
      )}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'teal' | 'purple' | 'red' | 'green' }> = ({ children, color = 'teal' }) => {
  const colors = {
    teal: "bg-teal/10 text-teal-glow border-teal/20 shadow-[0_0_10px_rgba(69,162,158,0.2)]",
    purple: "bg-purple/10 text-purple-light border-purple/20 shadow-[0_0_10px_rgba(136,96,208,0.2)]",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20"
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider border ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props} 
    className={`
      w-full bg-surgical-light/50 border border-white/10 rounded-lg px-4 py-3 text-white 
      focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/50 
      transition-all placeholder:text-text-secondary/30 backdrop-blur-sm
      disabled:opacity-50 disabled:cursor-not-allowed
      ${props.className}
    `}
  />
);

export const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  id?: string;
}> = ({ checked, onChange, label, id }) => {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group select-none">
      <div className={`
        w-5 h-5 rounded border flex items-center justify-center transition-all mt-0.5 flex-shrink-0
        ${checked 
          ? 'bg-teal border-teal text-surgical' 
          : 'bg-white/5 border-white/20 group-hover:border-teal/50'
        }
      `}>
        {checked && <Check size={14} strokeWidth={3} />}
        <input 
          id={id}
          type="checkbox" 
          className="hidden" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
        />
      </div>
      <div className="text-sm text-text-secondary group-hover:text-white transition-colors">
        {label}
      </div>
    </label>
  );
};

export const Loader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center p-8 text-teal">
    <Loader2 className="w-8 h-8 animate-spin mb-3 text-teal-glow" />
    <span className="text-xs font-mono uppercase tracking-widest animate-pulse text-teal-glow/80">{text}</span>
  </div>
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="w-full max-w-2xl relative z-10 animate-scaleIn">
        <GlassCard className="max-h-[90vh] overflow-y-auto bg-surgical border-white/10 shadow-2xl !p-0">
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 sticky top-0 backdrop-blur-xl z-20">
            <h2 className="text-xl font-display font-bold text-white">{title}</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
