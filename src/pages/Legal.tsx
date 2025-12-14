
import React, { useState } from 'react';
import { GlassCard, Button } from '../components/UI';
import { Shield, FileText, Activity, Lock } from 'lucide-react';

export const Legal: React.FC = () => {
  const [section, setSection] = useState<'privacy' | 'consent' | 'ai'>('privacy');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-white mb-2">Legal & Compliance</h1>
            <p className="text-text-secondary">Transparency is our operating system.</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
            <button 
                onClick={() => setSection('privacy')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${section === 'privacy' ? 'bg-teal text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
            >
                Privacy Policy
            </button>
            <button 
                onClick={() => setSection('consent')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${section === 'consent' ? 'bg-teal text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
            >
                Consent Framework
            </button>
            <button 
                onClick={() => setSection('ai')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${section === 'ai' ? 'bg-teal text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
            >
                AI Governance
            </button>
        </div>

        <GlassCard className="p-8">
            {section === 'privacy' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-teal" size={24} />
                        <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>1. Data Ownership:</strong> You (the patient) are the sole owner of your health data. Wysh Care acts as a fiduciary data processor.
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>2. Data Residency:</strong> All personal health information (PHI) is stored encrypted at rest within ISO-27001 certified data centers located in India.
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>3. No Sale of Data:</strong> We do not sell, rent, or monetize your personal health data to advertisers or third parties.
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>4. DPDP Compliance:</strong> This policy is aligned with the Digital Personal Data Protection Act, 2023.
                    </p>
                </div>
            )}

            {section === 'consent' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="text-purple" size={24} />
                        <h2 className="text-2xl font-bold text-white">Consent Policy</h2>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>1. Explicit Consent:</strong> No doctor or hospital can view your records without your explicit OTP-based approval, except in life-threatening emergencies.
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>2. Granular Control:</strong> You can choose to share only specific types of data (e.g., "Only Prescriptions", "No Mental Health Records").
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>3. Revocation:</strong> You can revoke consent at any time instantly via the Security Center.
                    </p>
                </div>
            )}

            {section === 'ai' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="text-blue-400" size={24} />
                        <h2 className="text-2xl font-bold text-white">AI Governance</h2>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>1. Decision Support Only:</strong> Wysh AI is designed to assist doctors, not replace them. It provides summaries and flags potential risks but does not make diagnoses.
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>2. Human in the Loop:</strong> All AI-generated prescriptions or clinical notes must be verified and signed by a licensed medical practitioner.
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                        <strong>3. Explainability:</strong> We strive to provide source references for all AI insights generated from your medical records.
                    </p>
                </div>
            )}
        </GlassCard>
    </div>
  );
};
