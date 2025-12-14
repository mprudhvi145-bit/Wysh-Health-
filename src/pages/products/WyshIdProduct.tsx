
import React from 'react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { Fingerprint, ShieldCheck, Link2, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WyshIdProduct: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <Button variant="outline" onClick={() => navigate('/products')} className="mb-6 text-xs !py-1 !px-3">Back to Platform</Button>
                <Badge color="teal">Identity</Badge>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 mb-6">
                    Wysh ID<br/>
                    <span className="text-teal-glow">One Health Identity. Lifetime Continuity.</span>
                </h1>
                
                <div className="space-y-6">
                    <div>
                        <h4 className="text-white font-bold mb-2">The Problem</h4>
                        <p className="text-text-secondary">Patients today carry multiple hospital IDs, fragmented records, and zero continuity across providers.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-2">The Solution</h4>
                        <p className="text-text-secondary">Wysh ID creates a single, persistent health identity that works across clinics, hospitals, labs, and ABDM systems.</p>
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <Button variant="primary" onClick={() => navigate('/signup')} icon={<UserCheck size={18} />}>
                        Create Wysh ID
                    </Button>
                </div>
            </div>
            
            <GlassCard className="relative overflow-hidden border-teal/30 bg-gradient-to-br from-teal/10 to-transparent">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal/20 rounded-full blur-[60px]" />
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(77,139,131,0.4)]">
                        <Fingerprint size={64} className="text-black" />
                    </div>
                    <div className="space-y-2">
                        <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/20 text-white font-mono">
                            WYSH-9281-XXXX
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-teal">
                            <Link2 size={14} /> Linked with ABHA
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
                <h3 className="text-white font-bold mb-2">1. Create Wysh ID</h3>
                <p className="text-sm text-text-secondary">Sign up once. Get a universal ID that stores your basic demographic and insurance info.</p>
            </GlassCard>
            <GlassCard>
                <h3 className="text-white font-bold mb-2">2. Link ABHA</h3>
                <p className="text-sm text-text-secondary">Optionally connect your Ayushman Bharat Health Account for national interoperability.</p>
            </GlassCard>
            <GlassCard>
                <h3 className="text-white font-bold mb-2">3. Access Anywhere</h3>
                <p className="text-sm text-text-secondary">Pull your records at any Wysh-enabled clinic or hospital instantly.</p>
            </GlassCard>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <ShieldCheck size={32} className="mx-auto text-teal mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Trust Statement</h3>
            <p className="text-text-secondary max-w-2xl mx-auto">
                Wysh ID does not replace ABHA. It complements ABHA while giving patients usable, day-to-day control over their clinical experience.
            </p>
        </div>
    </div>
  );
};
