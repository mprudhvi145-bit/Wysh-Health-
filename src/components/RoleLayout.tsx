
import React from 'react';
import { getDensity, UIRole } from '../utils/uiDensity';

interface RoleLayoutProps {
  role: string;
  children: React.ReactNode;
  className?: string;
}

export const RoleLayout: React.FC<RoleLayoutProps> = ({ role, children, className = '' }) => {
  const d = getDensity(role);

  return (
    <div className={`min-h-screen ${d.padding} ${className}`}>
      <div className={`${d.container} ${d.gap} flex flex-col`}>
        {children}
      </div>
    </div>
  );
};
