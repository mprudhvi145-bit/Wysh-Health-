import React from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { HolographicModel } from '../components/3DVisuals';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Activity, Heart, Zap, Brain, ChevronRight, Thermometer } from 'lucide-react';

const RISK_DATA = [
  { subject: 'Cardiac', A: 120, fullMark: 150 },
  { subject: 'Respiratory', A: 98, fullMark: 150 },
  { subject: 'Metabolic', A: 86, fullMark: 150 },
  { subject: 'Genetic', A: 99, fullMark: 150 },
  { subject: 'Lifestyle', A: 85, fullMark: 150 },
  { subject: 'Environmental', A: 65, fullMark: 150 },
];

const VITALS_DATA = [
  { time: '08:00', heart: 72, temp: 98.6 },
  { time: '10:00', heart: 75, temp: 98.7 },
  { time: '12:00', heart: 82, temp: 98.8 },
  { time: '14:00', heart: 78, temp: 98.6 },
  { time: '16:00', heart: 74, temp: 98.5 },
  { time: '18:00', heart: 70, temp: 98.4 },
  { time: '20:00', heart: 68, temp: 98.3 },
  { time: '22:00', heart: 66, temp: 98.2 },
];

export const AIHealthDash: React.FC = () => {
  return (
    <div className="min-h-screen p-6 space-y-8">
      
      <div className="flex justify-between items-end max-w-7xl mx-auto w-full">
        <div>
           <Badge color="purple">AI BETA v2.1</Badge>
           <h1 className="text-4xl font-display font-bold text-white mt-2">Personal Health <span className="text-teal-glow">Intelligence</span></h1>
        </div>
        <Button variant="outline" className="text-sm">Export Report</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column - Holographic Status */}
        <div className="lg:col-span-1 space-y-6">
            <GlassCard className="h-[400px] relative overflow-hidden flex flex-col items-center justify-center bg-black/40 border-teal/20">
                <div className="absolute top-4 left-4 z-10">
                    <h3 className="text-white font-bold flex items-center gap-2"><Brain size={16} className="text-purple"/> Body Scan</h3>
                    <p className="text-xs text-text-secondary">Real-time biometrics</p>
                </div>
                <div className="w-full h-full absolute inset-0">
                    <HolographicModel />
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between text-xs text-white bg-black/50 p-3 rounded-lg border border-white/5 backdrop-blur-md">
                   <span>Status: <span className="text-teal">OPTIMAL</span></span>
                   <span>Sync: <span className="text-purple animate-pulse">LIVE</span></span>
                </div>
            </GlassCard>

            <GlassCard>
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="text-yellow-400" size={20} />
                    <h3 className="text-white font-bold">Lifestyle Insights</h3>
                </div>
                <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-lg border-l-2 border-teal">
                        <p className="text-sm text-white">Sleep pattern analysis suggests peak cognitive window at <span className="text-teal font-bold">10:00 AM</span>.</p>
                    </div>
                     <div className="p-3 bg-white/5 rounded-lg border-l-2 border-purple">
                        <p className="text-sm text-white">Hydration levels low. Recommended intake: +500ml.</p>
                    </div>
                </div>
            </GlassCard>
        </div>

        {/* Middle - Risk & Predictions */}
        <div className="lg:col-span-2 space-y-6">
             <GlassCard className="h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-white font-bold text-lg">Predictive Risk Modeling</h3>
                        <p className="text-text-secondary text-xs">AI-driven analysis based on genetic & lifestyle markers</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-teal border border-teal/20 px-3 py-1 rounded-full bg-teal/5">
                        <Activity size={12} /> 98% Confidence
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RISK_DATA}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9BA5AD', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar name="Risk Score" dataKey="A" stroke="#8763FF" strokeWidth={2} fill="#8763FF" fillOpacity={0.3} />
                            <Tooltip contentStyle={{ backgroundColor: '#1D2329', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Heart className="text-red-400" size={18} /> Cardiac Rhythm
                    </h3>
                     <div className="h-[150px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={VITALS_DATA.slice(0, 6)}>
                                <defs>
                                    <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Area type="monotone" dataKey="heart" stroke="#F87171" fillOpacity={1} fill="url(#colorHeart)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal/20 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-white font-bold mb-4">Diet Recommendations</h3>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm text-text-secondary border-b border-white/5 pb-2">
                            <span>Protein Intake</span>
                            <span className="text-white font-bold">120g <span className="text-green-500 text-xs">▲</span></span>
                        </li>
                        <li className="flex justify-between items-center text-sm text-text-secondary border-b border-white/5 pb-2">
                            <span>Carbohydrates</span>
                            <span className="text-white font-bold">250g <span className="text-red-500 text-xs">▼</span></span>
                        </li>
                         <li className="flex justify-between items-center text-sm text-text-secondary pb-2">
                            <span>Micronutrients</span>
                            <span className="text-teal font-bold">Optimal</span>
                        </li>
                    </ul>
                    <Button variant="outline" className="w-full mt-4 text-xs h-8">View Meal Plan</Button>
                </GlassCard>
            </div>

            {/* Vitals History Section */}
            <GlassCard className="h-[320px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                     <Activity size={18} className="text-teal" /> Vitals History
                  </h3>
                  <Badge color="teal">Live Data</Badge>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#0D0F12] shadow-sm z-10">
                            <tr>
                                <th className="py-2 text-xs text-text-secondary uppercase tracking-wider font-medium bg-[#0D0F12]">Time</th>
                                <th className="py-2 text-xs text-text-secondary uppercase tracking-wider font-medium bg-[#0D0F12]">Heart Rate</th>
                                <th className="py-2 text-xs text-text-secondary uppercase tracking-wider font-medium bg-[#0D0F12]">Temperature</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {VITALS_DATA.map((row, i) => (
                                <tr key={i} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-3 text-sm text-teal font-mono">{row.time}</td>
                                    <td className="py-3 text-sm text-white">
                                        <div className="flex items-center gap-2">
                                            <Heart size={14} className="text-red-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                                            {row.heart} bpm
                                        </div>
                                    </td>
                                    <td className="py-3 text-sm text-white">
                                        <div className="flex items-center gap-2">
                                            <Thermometer size={14} className="text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                                            {row.temp}°F
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

        </div>
      </div>
    </div>
  );
};