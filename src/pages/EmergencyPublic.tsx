
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { emergencyService, EmergencyProfile } from '../services/emergencyService';
import { GlassCard, Button, Badge, Loader } from '../components/UI';
import { AlertTriangle, Phone, Activity, Heart, ShieldAlert, User } from 'lucide-react';

export const EmergencyPublic: React.FC = () => {
  const { wyshId } = useParams<{ wyshId: string }>();
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
        if (!wyshId) return;
        try {
            const data = await emergencyService.getPublicProfile(wyshId);
            setProfile(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    load();
  }, [wyshId]);

  if (loading) return <div className="min-h-screen bg-red-950 flex items-center justify-center"><Loader text="Accessing Emergency Data..." /></div>;

  if (error) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
              <ShieldAlert size={64} className="text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
              <p className="text-text-secondary">{error}</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
        {/* Urgent Header */}
        <div className="bg-red-600 text-white p-4 -m-4 mb-6 text-center font-bold animate-pulse flex items-center justify-center gap-2">
            <AlertTriangle size={24} /> MEDICAL EMERGENCY VIEW
        </div>

        <div className="max-w-lg mx-auto space-y-6">
            
            {/* Identity Card */}
            <GlassCard className="border-red-500/50 bg-red-900/10">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-800 overflow-hidden border-2 border-white/20">
                        {profile?.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-4"/>}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{profile?.name}</h1>
                        <div className="flex gap-2 mt-2">
                            <Badge color="purple">Blood: {profile?.bloodGroup || 'Unknown'}</Badge>
                            <span className="text-xs text-text-secondary px-2 py-1 border border-white/10 rounded">ID: {profile?.wyshId}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Critical Medical Info */}
            <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                    <h3 className="text-red-400 font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
                        <ShieldAlert size={16} /> Critical Allergies
                    </h3>
                    {profile?.medicalAlerts.allergies.length ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.medicalAlerts.allergies.map(a => (
                                <span key={a} className="bg-red-500 text-white px-3 py-1 rounded font-bold text-sm">{a}</span>
                            ))}
                        </div>
                    ) : <span className="text-sm text-gray-400">None Recorded</span>}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                    <h3 className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
                        <Heart size={16} /> Chronic Conditions
                    </h3>
                    {profile?.medicalAlerts.conditions.length ? (
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {profile.medicalAlerts.conditions.map(c => <li key={c}>{c}</li>)}
                        </ul>
                    ) : <span className="text-sm text-gray-400">None Recorded</span>}
                </div>

                <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl">
                    <h3 className="text-gray-300 font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
                        <Activity size={16} /> Current Medications
                    </h3>
                    {profile?.medicalAlerts.currentMeds.length ? (
                        <ul className="text-sm space-y-1 text-gray-300">
                            {profile.medicalAlerts.currentMeds.map(m => <li key={m}>• {m}</li>)}
                        </ul>
                    ) : <span className="text-sm text-gray-400">None Recorded</span>}
                </div>
            </div>

            {/* Contacts */}
            <div className="space-y-3">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider pl-1">Emergency Contacts</h3>
                {profile?.emergencyContacts.primary && (
                    <a href={`tel:${profile.emergencyContacts.primary}`} className="block">
                        <Button className="w-full bg-green-600 hover:bg-green-700 border-transparent text-white justify-center h-12 text-lg">
                            <Phone className="mr-2" /> Call {profile.emergencyContacts.relationship}
                        </Button>
                    </a>
                )}
                <div className="text-center text-xs text-gray-500 mt-4">
                    Access logged at {new Date().toLocaleTimeString()} • IP Recorded
                </div>
            </div>
        </div>
    </div>
  );
};
