
import React from 'react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { ShieldCheck, Lock, RefreshCw, FileText, ArrowRight, ExternalLink, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ABDMProduct: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
            <Button variant="outline" onClick={() => navigate('/products')} className="mb-4 text-xs !py-1 !px-3">Back to Platform</Button>
            <div className="flex justify-center mb-4">
                <img src="https://abdm.gov.in/assets/images/logo/ndhm-logo.svg" alt="ABDM" className="h-12" style={{filter: 'invert(1)'}}/>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
                ABDM & ABHA Ready
            </h1>
            <p className="text-xl text-orange-500 font-medium">Designed for India’s National Digital Health Mission</p>
            <p className="text-text-secondary text-lg">
                Health data must move only with patient consent. Wysh Care enforces this core principle.
            </p>
            <div className="flex justify-center gap-4">
                <Button variant="primary" onClick={() => navigate('/abha')} icon={<ShieldCheck size={18} />}>
                    Manage ABHA ID
                </Button>
            </div>
        </div>

        {/* Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-teal/20 via-purple/20 to-teal/20 -translate-y-1/2 hidden md:block -z-10" />
            
            {[
                { icon: <ShieldCheck size={24}/>, title: "1. ABHA", desc: "Identity Verification" },
                { icon: <Lock size={24}/>, title: "2. Consent", desc: "Granular Permissions" },
                { icon: <RefreshCw size={24}/>, title: "3. Exchange", desc: "Encrypted Data Flow" },
                { icon: <FileText size={24}/>, title: "4. Audit", desc: "Immutable Logs" },
            ].map((step, i) => (
                <GlassCard key={i} className="text-center relative z-10 bg-[#0D0F12]">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white border border-white/10">
                        {step.icon}
                    </div>
                    <h3 className="text-white font-bold mb-1">{step.title}</h3>
                    <p className="text-xs text-text-secondary">{step.desc}</p>
                </GlassCard>
            ))}
        </div>

        {/* Technical Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold text-white">Wysh Care Capabilities</h2>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="mt-1"><Activity className="text-teal" size={20} /></div>
                        <div>
                            <h4 className="text-white font-bold">HIP & HIU Compatible</h4>
                            <p className="text-sm text-text-secondary">Acts as both Health Information Provider and User.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="mt-1"><Lock className="text-purple" size={20} /></div>
                        <div>
                            <h4 className="text-white font-bold">Consent Management</h4>
                            <p className="text-sm text-text-secondary">Creation, viewing, and revocation of consents.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="mt-1"><FileText className="text-blue-400" size={20} /></div>
                        <div>
                            <h4 className="text-white font-bold">Read-Only External Records</h4>
                            <p className="text-sm text-text-secondary">Fetch records from other hospitals securely.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-orange-500"/> Compliance Note
                </h3>
                <p className="text-text-secondary leading-relaxed">
                    Wysh Care does not bypass ABDM workflows. It enforces them. All data exchanges utilize standard FHIR artifacts and are cryptographically signed.
                </p>
            </div>
        </div>
    </div>
  );
};
