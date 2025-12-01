import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid 
} from 'recharts';
import { Search, User, Calendar, FileText, Bell, MessageSquare } from 'lucide-react';
import { GlassCard, Button, Badge } from '../components/UI';
import { MOCK_DOCTORS } from '../constants';
import { generateHealthInsight } from '../services/geminiService';

const DATA_VISITS = [
  { name: 'Mon', visits: 40 }, { name: 'Tue', visits: 55 }, 
  { name: 'Wed', visits: 45 }, { name: 'Thu', visits: 60 }, 
  { name: 'Fri', visits: 70 }, { name: 'Sat', visits: 35 }, { name: 'Sun', visits: 20 },
];

const DATA_REVENUE = [
  { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 }, { name: 'Apr', value: 7000 },
  { name: 'May', value: 6000 }, { name: 'Jun', value: 8000 },
];

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAiQuery = async () => {
    if(!aiPrompt) return;
    setLoadingAi(true);
    const res = await generateHealthInsight(aiPrompt);
    setAiResponse(res);
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-surgical p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Hospital OS <span className="text-teal text-sm align-top">v4.0</span></h1>
            <p className="text-text-secondary text-sm">Welcome back, Dr. Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="text-text-secondary hover:text-white cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <div className="w-10 h-10 rounded-full bg-teal/20 border border-teal flex items-center justify-center text-teal font-bold">
              DA
            </div>
          </div>
        </div>

        {/* Wysh AI Assistant */}
        <GlassCard className="border-teal/30 bg-teal/5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-teal" />
                <h3 className="font-bold text-white">Wysh AI Assistant</h3>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask about patient trends, ICD-10 codes, or schedule..." 
                  className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-teal outline-none"
                />
                <Button onClick={handleAiQuery} className="!py-2 !px-4 text-sm">
                  {loadingAi ? 'Thinking...' : 'Ask AI'}
                </Button>
              </div>
            </div>
            {aiResponse && (
              <div className="flex-1 bg-black/20 p-3 rounded border border-white/5 text-sm text-text-secondary animate-fadeIn">
                <strong className="text-teal block mb-1">Response:</strong>
                {aiResponse}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Patients', value: '12,403', change: '+12%', color: 'teal' },
            { label: 'Appointments', value: '84', change: 'Today', color: 'purple' },
            { label: 'Avg Wait Time', value: '14m', change: '-2m', color: 'blue' },
            { label: 'Revenue', value: '$84.2k', change: '+8%', color: 'green' },
          ].map((stat, i) => (
            <GlassCard key={i} className="py-4">
              <p className="text-text-secondary text-xs uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              <span className={`text-xs ${stat.color === 'teal' ? 'text-teal' : 'text-purple-400'}`}>{stat.change} vs last month</span>
            </GlassCard>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <h3 className="text-white font-bold mb-6">Patient Flow Analytics</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DATA_VISITS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1D2329', border: '1px solid #333', color: '#fff' }}
                      itemStyle={{ color: '#4D8B83' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="visits" fill="#4D8B83" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

             <GlassCard>
              <h3 className="text-white font-bold mb-6">Revenue Projection (AI Forecast)</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DATA_REVENUE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1D2329', border: '1px solid #333' }} />
                    <Line type="monotone" dataKey="value" stroke="#8763FF" strokeWidth={3} dot={{fill: '#8763FF'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Doctors & Tasks */}
          <div className="space-y-6">
            <GlassCard className="h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold">On Duty</h3>
                <span className="text-xs text-teal cursor-pointer hover:underline">View All</span>
              </div>
              <div className="space-y-4">
                {MOCK_DOCTORS.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                      {doc.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{doc.name}</h4>
                      <p className="text-text-secondary text-xs">{doc.specialty}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-500'}`} />
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-white font-bold mb-4">Pending Tasks</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-text-secondary">
                    <div className="mt-1 w-2 h-2 rounded-full bg-teal" />
                    <p>Review Dr. Carter's lab request for Patient #9021</p>
                  </div>
                   <div className="flex items-start gap-3 text-sm text-text-secondary">
                    <div className="mt-1 w-2 h-2 rounded-full bg-purple" />
                    <p>Sign off on monthly insurance claim batch</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};
