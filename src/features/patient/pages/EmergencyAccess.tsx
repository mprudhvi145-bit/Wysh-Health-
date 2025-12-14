
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="flex flex-col items-center justify-center text-center p-8 border-red-500/20 bg-red-500/5">
                <div className="w-48 h-48 bg-white p-2 rounded-xl mb-6">
                    <QrCode className="w-full h-full text-black" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
                <Badge color="purple">Blood: O+</Badge>
                <div className="mt-6 p-4 bg-black/40 rounded-lg border border-red-500/30 w-full">
                    <p className="text-xs text-red-400 uppercase font-bold mb-2">Scan for:</p>
                    <ul className="text-sm text-white space-y-1">
                        <li>Allergies</li>
                        <li>Chronic Conditions</li>
                        <li>Emergency Contacts</li>
                    </ul>
                </div>
            </GlassCard>

            <div className="space-y-6">
                <GlassCard>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Phone size={18} className="text-teal" /> Emergency Contacts
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Jane Doe (Spouse)</p>
                                <p className="text-xs text-text-secondary">Primary Contact</p>
                            </div>
                            <Button variant="outline" className="text-xs h-8">Edit</Button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <div>
                                <p className="text-white font-medium">Dr. Sarah Chen</p>
                                <p className="text-xs text-text-secondary">Cardiologist</p>
                            </div>
                            <Button variant="outline" className="text-xs h-8">Call</Button>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-red-400" /> Critical Medical Data
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <span className="text-xs text-text-secondary uppercase">Allergies</span>
                            <div className="flex gap-2 mt-1">
                                <Badge color="purple">Peanuts</Badge>
                                <Badge color="purple">Penicillin</Badge>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-text-secondary uppercase">Conditions</span>
                            <div className="flex gap-2 mt-1">
                                <Badge color="teal">Arrhythmia</Badge>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    </div>
  );
};
