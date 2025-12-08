import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge, Modal } from '../components/UI';
import { HolographicModel } from '../components/3DVisuals';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ComposedChart, Bar, Line, Legend, Scatter
} from 'recharts';
import { Activity, Heart, Zap, Brain, Thermometer, Download, Eye, RefreshCw, FileText } from 'lucide-react';

const RISK_DATA = [
  { subject: 'Cardiac', A: 120, fullMark: 150 },
  { subject: 'Respiratory', A: 98, fullMark: 150 },
  { subject: 'Metabolic', A: 86, fullMark: 150 },
  { subject: 'Genetic', A: 99, fullMark: 150 },
  { subject: 'Lifestyle', A: 85, fullMark: 150 },
  { subject: 'Environmental', A: 65, fullMark: 150 },
];

const INITIAL_VITALS = [
  { time: '08:00', heart: 72, temp: 98.6 },
  { time: '10:00', heart: 75, temp: 98.7 },
  { time: '12:00', heart: 82, temp: 98.8 },
  { time: '14:00', heart: 78, temp: 98.6 },
  { time: '16:00', heart: 74, temp: 98.5 },
  { time: '18:00', heart: 70, temp: 98.4 },
  { time: '20:00', heart: 68, temp: 98.3 },
  { time: '22:00', heart: 66, temp: 98.2 },
];

const PREDICTION_DATA = Array.from({ length: 12 }, (_, i) => ({
  hour: `+${i + 1}h`,
  predictedScore: 85 + Math.sin(i * 0.5) * 5,
  confidenceLow: 80 + Math.sin(i * 0.5) * 5,
  confidenceHigh: 90 + Math.sin(i * 0.5) * 5,
}));

export const AIHealthDash: React.FC = () => {
  // State
  const [vitalsData, setVitalsData] = useState(INITIAL_VITALS);
  const [isLive, setIsLive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleSeries, setVisibleSeries] = useState({ heart: true, temp: true });
  
  // Transform VITALS_DATA to simulate a 7-day week
  const weeklyData = vitalsData.slice(0, 7).map((d, i) => ({
    ...d,
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] || `Day ${i+1}`
  }));

  // Real-time Simulation Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLive) {
      interval = setInterval(() => {
        setVitalsData(prev => {
          const last = prev[prev.length - 1];
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          
          // Random walk for values
          const newHeart = Math.max(60, Math.min(120, last.heart + (Math.random() - 0.5) * 5));
          const newTemp = Math.max(97, Math.min(100, last.temp + (Math.random() - 0.5) * 0.2));
          
          const newPoint = { 
            time: timeStr, 
            heart: Math.round(newHeart), 
            temp: parseFloat(newTemp.toFixed(1)) 
          };
          
          // Keep array size constant-ish
          return [...prev.slice(1), newPoint];
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Export Function
  const handleExport = () => {
    const headers = ['Time', 'Heart Rate', 'Temperature'];
    const rows = vitalsData.map(d => [d.time, d.heart, d.temp]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wysh_vitals_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSeries = (key: 'heart' | 'temp') => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end max-w-7xl mx-auto w-full gap-4">
        <div>
           <Badge color="purple">AI BETA v2.1</Badge>
           <h1 className="text-4xl font-display font-bold text-white mt-2">Personal Health <span className="text-teal-glow">Intelligence</span></h1>
        </div>
        <div className="flex gap-3">
            <Button 
                variant={isLive ? "primary" : "outline"} 
                onClick={() => setIsLive(!isLive)}
                className={isLive ? "animate-pulse" : ""}
                icon={<RefreshCw size={16} className={isLive ? "animate-spin" : ""} />}
            >
                {isLive ? 'Live Simulation On' : 'Start Simulation'}
            </Button>
            <Button variant="outline" onClick={handleExport} icon={<Download size={16}/>}>
                Export Data
            </Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)} icon={<Eye size={16}/>}>
                Patient Details
            </Button>
        </div>
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

            {/* AI Prediction Chart */}
            <GlassCard className="h-[350px]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-white font-bold text-lg">Future Health Projection (12h)</h3>
                        <p className="text-text-secondary text-xs">AI forecasted stability score</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge color="purple">Predictive</Badge>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={PREDICTION_DATA}>
                            <defs>
                                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8763FF" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#8763FF" stopOpacity={0.05}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="hour" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis domain={[60, 100]} stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1D2329', border: '1px solid #333' }} />
                            {/* Confidence Interval using Area */}
                            <Area type="monotone" dataKey="confidenceHigh" stroke="none" fill="url(#colorConfidence)" />
                            <Line type="monotone" dataKey="predictedScore" stroke="#teal" strokeWidth={3} dot={false} strokeDasharray="5 5" />
                        </ComposedChart>
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
                            <AreaChart data={vitalsData.slice(-6)}>
                                <defs>
                                    <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Area type="monotone" dataKey="heart" stroke="#F87171" fillOpacity={1} fill="url(#colorHeart)" isAnimationActive={false} />
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

            {/* Vitals Trends Chart (Area) with Interactive Legend */}
            <GlassCard className="h-[350px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-lg">Vitals Trends (Intraday)</h3>
                    <div className="flex gap-4">
                        <button 
                          onClick={() => toggleSeries('heart')}
                          className={`flex items-center gap-2 text-xs transition-opacity ${visibleSeries.heart ? 'opacity-100' : 'opacity-40'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-red-400"></span> Heart Rate
                        </button>
                        <button 
                          onClick={() => toggleSeries('temp')}
                          className={`flex items-center gap-2 text-xs transition-opacity ${visibleSeries.temp ? 'opacity-100' : 'opacity-40'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Temperature
                        </button>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={vitalsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorHeart2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="time" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="#F87171" fontSize={11} tickLine={false} axisLine={false} domain={[60, 120]} />
                            <YAxis yAxisId="right" orientation="right" stroke="#60A5FA" fontSize={11} tickLine={false} axisLine={false} domain={[97, 101]} />
                            <Tooltip contentStyle={{ backgroundColor: '#1D2329', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ fontSize: '12px' }} />
                            
                            {visibleSeries.heart && (
                              <Area yAxisId="left" type="monotone" dataKey="heart" stroke="#F87171" fill="url(#colorHeart2)" strokeWidth={2} name="Heart Rate" isAnimationActive={false} />
                            )}
                            {visibleSeries.temp && (
                              <Area yAxisId="right" type="monotone" dataKey="temp" stroke="#60A5FA" fill="url(#colorTemp)" strokeWidth={2} name="Temperature" isAnimationActive={false} />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            {/* NEW 7-Day History Chart */}
            <GlassCard className="h-[350px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-lg">7-Day Vitals Overview</h3>
                    <div className="flex items-center gap-2">
                         <span className="px-2 py-1 bg-white/5 rounded text-xs text-text-secondary border border-white/10">Weekly View</span>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="day" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="#4D8B83" fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} />
                            <YAxis yAxisId="right" orientation="right" stroke="#8763FF" fontSize={11} tickLine={false} axisLine={false} domain={[96, 100]} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1D2329', border: '1px solid #333', borderRadius: '8px' }} 
                              itemStyle={{ fontSize: '12px' }}
                              cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Bar yAxisId="left" dataKey="heart" name="Avg Heart Rate" fill="#4D8B83" barSize={20} radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="temp" name="Avg Temperature" stroke="#8763FF" strokeWidth={3} dot={{r: 4, fill:'#8763FF'}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            {/* Vitals History Section */}
            <GlassCard className="h-[320px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                     <Activity size={18} className="text-teal" /> Vitals History List
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
                            {vitalsData.slice().reverse().map((row, i) => (
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

      {/* Patient Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Patient Record #WYSH-9021">
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center border border-teal text-teal font-bold text-xl">
                    AD
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">Alex Doe</h3>
                    <p className="text-text-secondary text-sm">34 Male • O+ Blood Type</p>
                </div>
                <div className="ml-auto">
                    <Badge color="teal">Active</Badge>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">Primary Care</p>
                    <p className="text-white font-medium">Dr. Sarah Chen</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">Insurance</p>
                    <p className="text-white font-medium">Wysh Health Plus</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">Last Visit</p>
                    <p className="text-white font-medium">Oct 12, 2024</p>
                </div>
                 <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">Next Appointment</p>
                    <p className="text-teal font-medium">Tomorrow, 10:00 AM</p>
                </div>
            </div>

            <div>
                <h4 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Medical Notes</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                    Patient presenting with mild arrhythmia. Prescribed beta-blockers. advised to monitor heart rate daily. 
                    Lifestyle changes recommended include increased hydration and reduced sodium intake.
                </p>
            </div>

             <div>
                <h4 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Documents</h4>
                 <div className="flex gap-3">
                     <div className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/5 text-xs text-text-secondary cursor-pointer hover:bg-white/10">
                         <FileText size={14} /> Lab_Results_Oct.pdf
                     </div>
                     <div className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/5 text-xs text-text-secondary cursor-pointer hover:bg-white/10">
                         <FileText size={14} /> ECG_Scan_Full.pdf
                     </div>
                 </div>
            </div>
        </div>
      </Modal>

    </div>
  );
};