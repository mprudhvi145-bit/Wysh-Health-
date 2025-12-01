import React from 'react';
import { GlassCard, Button } from '../components/UI';
import { Download, TrendingUp, PieChart, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GROWTH_DATA = [
  { year: '2022', val: 10 },
  { year: '2023', val: 45 },
  { year: '2024', val: 120 },
  { year: '2025', val: 350 },
  { year: '2026', val: 800 },
];

export const Investor: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
          Invest in the <span className="text-teal text-glow">Future</span>
        </h1>
        <p className="text-text-secondary text-lg">
          Wysh Care is scaling rapidly to unify the fragmented healthcare market.
          Join us as we build the operating system for the next generation of hospitals.
        </p>
        <Button variant="primary" icon={<Download size={18} />} className="mx-auto">
          Request Pitch Deck (Series A)
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="text-center">
          <TrendingUp className="mx-auto text-teal mb-4" size={32} />
          <h2 className="text-4xl font-bold text-white mb-2">$1.2T</h2>
          <p className="text-text-secondary">TAM Opportunity</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Users className="mx-auto text-purple mb-4" size={32} />
          <h2 className="text-4xl font-bold text-white mb-2">350%</h2>
          <p className="text-text-secondary">YoY User Growth</p>
        </GlassCard>
        <GlassCard className="text-center">
          <PieChart className="mx-auto text-blue-400 mb-4" size={32} />
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
           <ul className="space-y-4">
             {['SaaS Subscription for Hospitals', 'Telemedicine Transaction Fees', 'AI Coding & Billing APIs', 'Direct-to-Consumer Diagnostics'].map((item, i) => (
               <li key={i} className="flex items-center gap-3 text-text-secondary">
                 <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                 {item}
               </li>
             ))}
           </ul>
        </div>
        <div className="relative h-64 bg-gradient-to-br from-teal/10 to-purple/10 rounded-2xl border border-white/5 flex items-center justify-center">
          <p className="text-white/50 font-mono">ECOSYSTEM REVENUE MODEL VISUALIZATION</p>
        </div>
      </div>
    </div>
  );
};
