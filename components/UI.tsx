import React from 'react';

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
}> = ({ children, variant = 'primary', onClick, className = '', icon, type = 'button' }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-display font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-teal text-white hover:bg-teal-glow hover:shadow-[0_0_20px_rgba(77,139,131,0.5)] border border-transparent",
    secondary: "bg-purple text-white hover:bg-purple-dark hover:shadow-[0_0_20px_rgba(135,99,255,0.5)] border border-transparent",
    outline: "bg-transparent border border-white/20 text-text-primary hover:border-teal hover:text-teal hover:bg-white/5"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{icon}{children}</span>
      {variant === 'primary' && (
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