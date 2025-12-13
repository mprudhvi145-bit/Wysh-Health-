
import React, { useState } from 'react';
import { GlassCard } from '../components/UI';
import { TEAM } from '../utils/constants';
import { Linkedin } from 'lucide-react';

export const Team: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Architects of Wysh</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          A fusion of medical experts and technological visionaries building the next era of healthcare.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {TEAM.map((member, i) => (
          <GlassCard key={i} className="text-center group !p-4">
            <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-teal/20 group-hover:border-teal transition-colors">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
            <p className="text-teal text-sm mb-4">{member.role}</p>
            <div className="flex justify-center">
              <a href="#" className="text-text-secondary hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
