
import React from 'react';
import { GlassCard, Button, Badge } from '../../../components/UI';
import { useAuth } from '../../../context/AuthContext';
import { AlertTriangle, Phone, Activity, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmergencyAccess: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-red-500 mb-2 flex items-center justify-center gap-3">
                <AlertTriangle size={32} /> Emergency Profile
            </h1>
            <p className="text-text-secondary">Information accessible to paramedics via your Wysh ID QR code.</p>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
            <p className="text-red-300 text-sm font-bold">
                ⚠️ PUBLIC ACCESS WARNING
            </p>
            <p className="text-red-200/70 text-xs mt-1 max-w-2xl mx-auto">
                By enabling this profile, you consent to allow any person scanning your QR code to view your Blood Group, Allergies, and Emergency Contacts without authentication. This is designed for unconscious/critical states. Do not include sensitive private data here.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard variant="emergency" className="flex flex-col items-center justify-center text-center p-8 bg-red-900/10 border-red-500/50">
                <div className="bg-white p-4 rounded-xl mb-6 shadow-2xl">
                    <QrCode className="w-48 h-48 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
                <div className="flex gap-2 mb-6">
                    <Badge color="red">Emergency QR</Badge>
                    <Badge color="purple">Blood: O+</Badge>
                </div>
                <div className="p-4 bg-black/60 rounded-lg border border-red-500/30 w-full text-left">
                    <p className="text-xs text-red-400 uppercase font-bold mb-2 flex items-center gap-2"><AlertTriangle size={12}/> Public Access Data:</p>
                    <ul className="text-sm text-gray-300 space-y-1 list-disc pl-4">
                        <li>Allergies</li>
                        <li>Chronic Conditions</li>
                        <li>Emergency Contacts</li>
                        <li>Blood Group</li>
                    </ul>
                </div>
            </GlassCard>

            <div className="space-y-6">
                <GlassCard>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Phone size={18} className="text-teal" /> Emergency Contacts
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                            <div>
                                <p className="text-white font-bold">Jane Doe (Spouse)</p>
                                <p className="text-xs text-text-secondary">Primary Contact</p>
                            </div>
                            <Button variant="outline" className="text-xs h-8">Edit</Button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                            <div>
                                <p className="text-white font-bold">Dr. Sarah Chen</p>
                                <p className="text-xs text-text-secondary">Cardiologist</p>
                            </div>
                            <Button variant="outline" className="text-xs h-8">Call</Button>
                        </div>
                    </div>
                    <Button variant="primary" className="w-full mt-4">Add Contact</Button>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-red-400" /> Critical Medical Data
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs text-text-secondary uppercase font-bold">Allergies</span>
                            <div className="flex gap-2 mt-2">
                                <Badge color="red">Peanuts</Badge>
                                <Badge color="red">Penicillin</Badge>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-text-secondary uppercase font-bold">Conditions</span>
                            <div className="flex gap-2 mt-2">
                                <Badge color="teal">Arrhythmia</Badge>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4 text-xs">Update Clinical Profile</Button>
                </GlassCard>
            </div>
        </div>
    </div>
  );
};
