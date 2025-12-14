
import React, { useState } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { Download, TrendingUp, PieChart, Users, Play, ArrowRight, Activity, Map } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PitchDeck } from '../features/investor/PitchDeck';
import { useNavigate } from 'react-router-dom';

const GROWTH_DATA = [
  { year: '2022', val: 10 },
  { year: '2023', val: 45 },
  { year: '2024', val: 120 },
  { year: '2025', val: 350 },
  { year: '2026', val: 800 },
];

export const Investor: React.FC = () => {
  const [viewDeck, setViewDeck] = useState(false);
  const navigate = useNavigate();

  if (viewDeck) {
      return <PitchDeck onClose={() => setViewDeck(false)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <Badge color="teal">Series A Ready</Badge>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
          Invest in the <span className="text-teal text-glow">Future</span>
        </h1>
        <p className="text-text-secondary text-lg">
          Wysh Care is scaling rapidly to unify the fragmented healthcare market.
          Join us as we build the operating system for the next generation of hospitals.
        </p>
        
        <div className="flex justify-center gap-4 pt-4 flex-wrap">
            <Button 
                variant="primary" 
                onClick={() => setViewDeck(true)}
                className="pl-6 pr-8 py-4 text-lg shadow-[0_0_30px_rgba(77,139,131,0.3)] animate-pulse-slow"
                icon={<Play fill="currentColor" size={20} />}
            >
                Launch Pitch Deck
            </Button>
            <Button variant="outline" icon={<Map size={18} />} onClick={() => navigate('/resources/roadmap')}>
                View Scale Roadmap
            </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="text-center group hover:border-teal/30">
          <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 text-teal group-hover:scale-110 transition-transform">
             <TrendingUp size={32} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">$1.2T</h2>
          <p className="text-text-secondary">TAM Opportunity</p>
        </GlassCard>
        <GlassCard className="text-center group hover:border-purple/30">
          <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4 text-purple group-hover:scale-110 transition-transform">
             <Users size={32} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">350%</h2>
          <p className="text-text-secondary">YoY User Growth</p>
        </GlassCard>
        <GlassCard className="text-center group hover:border-blue-400/30">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform">
             <PieChart size={32} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">85%</h2>
          <p className="text-text-secondary">Gross Margins (SaaS)</p>
        </GlassCard>
      </div>

      {/* Projection Chart */}
      <GlassCard className="p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white">Projected Growth</h3>
            <p className="text-text-secondary">Active Monthly Users (in thousands)</p>
          </div>
          <div className="text-right">
            <span className="text-teal font-bold">+200%</span>
            <p className="text-xs text-text-secondary">Forecast</p>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH_DATA}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4D8B83" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4D8B83" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#0D0F12', border: '1px solid #333' }} />
              <Area type="monotone" dataKey="val" stroke="#4D8B83" fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Ecosystem Map Section (Textual) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
           <h3 className="text-3xl font-display font-bold text-white mb-6">Revenue Diversification</h3>
           <p className="text-text-secondary mb-6 leading-relaxed">
               Wysh Care isn't just an app; it's an infrastructure layer. We monetize through multiple high-margin channels while keeping the core patient experience free.
           </p>
           <ul className="space-y-4">
             {['SaaS Subscription for Hospitals', 'Telemedicine Transaction Fees', 'AI Coding & Billing APIs', 'Direct-to-Consumer Diagnostics'].map((item, i) => (
               <li key={i} className="flex items-center gap-3 text-white">
                 <div className="w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold">
                     {i+1}
                 </div>
                 {item}
               </li>
             ))}
           </ul>
        </div>
        <div className="relative h-80 bg-gradient-to-br from-teal/10 to-purple/10 rounded-2xl border border-white/5 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-8 opacity-30">
              <div className="border-r border-b border-white/20"></div>
              <div className="border-b border-white/20"></div>
              <div className="border-r border-white/20"></div>
              <div></div>
          </div>
          <Activity size={64} className="text-white mb-4" />
          <p className="text-white font-bold tracking-widest uppercase">Ecosystem Model</p>
        </div>
      </div>
      
      {/* Call to Action */}
      <GlassCard className="text-center py-16 bg-gradient-to-r from-teal/10 to-purple/10 border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Healthcare?</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              We are currently open for Series A discussions with strategic partners.
          </p>
          <Button variant="primary" onClick={() => window.location.href = "mailto:investors@wysh.care"} icon={<ArrowRight size={18}/>}>
              Contact Investor Relations
          </Button>
      </GlassCard>
    </div>
  );
};
