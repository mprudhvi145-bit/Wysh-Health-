
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader text="Accessing Emergency Data..." /></div>;

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
        <div className="bg-red-600 text-white p-4 -m-4 mb-6 text-center font-bold animate-pulse flex items-center justify-center gap-2 shadow-lg z-50 relative">
            <AlertTriangle size={24} /> MEDICAL EMERGENCY VIEW - PARAMEDIC USE ONLY
        </div>

        <div className="max-w-lg mx-auto space-y-6">
            
            {/* Identity Card */}
            <GlassCard variant="emergency" className="border-red-600">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-900 overflow-hidden border-2 border-white">
                        {profile?.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-4"/>}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">{profile?.name}</h1>
                        <div className="flex gap-2 mt-2">
                            <span className="bg-white text-red-600 px-3 py-1 rounded font-bold text-sm border border-red-600">Blood: {profile?.bloodGroup || 'Unknown'}</span>
                            <span className="text-sm text-gray-300 px-2 py-1 border border-white/20 rounded font-mono">ID: {profile?.wyshId}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Critical Medical Info */}
            <div className="space-y-4">
                <div className="bg-red-900 border-2 border-red-500 p-6 rounded-xl">
                    <h3 className="text-white font-black uppercase tracking-wider text-lg mb-4 flex items-center gap-2">
                        <ShieldAlert size={24} className="text-red-200" /> Critical Allergies
                    </h3>
                    {profile?.medicalAlerts.allergies.length ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.medicalAlerts.allergies.map(a => (
                                <span key={a} className="bg-white text-red-700 px-4 py-2 rounded-lg font-black text-lg shadow-sm border border-red-200">{a}</span>
                            ))}
                        </div>
                    ) : <span className="text-lg text-white/70 font-medium">None Recorded</span>}
                </div>

                <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl">
                    <h3 className="text-blue-300 font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
                        <Heart size={16} /> Chronic Conditions
                    </h3>
                    {profile?.medicalAlerts.conditions.length ? (
                        <ul className="list-disc pl-5 text-base text-white font-medium space-y-1">
                            {profile.medicalAlerts.conditions.map(c => <li key={c}>{c}</li>)}
                        </ul>
                    ) : <span className="text-sm text-gray-400">None Recorded</span>}
                </div>

                <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl">
                    <h3 className="text-gray-300 font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
                        <Activity size={16} /> Current Medications
                    </h3>
                    {profile?.medicalAlerts.currentMeds.length ? (
                        <ul className="text-base text-white space-y-1">
                            {profile.medicalAlerts.currentMeds.map(m => <li key={m}>• {m}</li>)}
                        </ul>
                    ) : <span className="text-sm text-gray-400">None Recorded</span>}
                </div>
            </div>

            {/* Contacts */}
            <div className="space-y-4 pt-4">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider pl-1">Emergency Contacts</h3>
                {profile?.emergencyContacts.primary && (
                    <a href={`tel:${profile.emergencyContacts.primary}`} className="block">
                        <Button variant="emergency" className="w-full justify-center h-16 text-xl" icon={<Phone className="mr-2" size={24} />}>
                            Call {profile.emergencyContacts.relationship}
                        </Button>
                    </a>
                )}
                {profile?.emergencyContacts.secondary && (
                    <a href={`tel:${profile.emergencyContacts.secondary}`} className="block">
                        <Button variant="outline" className="w-full justify-center h-12 text-base border-white/30 text-white">
                            Secondary: {profile.emergencyContacts.secondary}
                        </Button>
                    </a>
                )}
                <div className="text-center text-xs text-gray-500 mt-8">
                    Access logged at {new Date().toLocaleTimeString()} • IP Recorded and Sent to Patient
                </div>
            </div>
        </div>
    </div>
  );
};
