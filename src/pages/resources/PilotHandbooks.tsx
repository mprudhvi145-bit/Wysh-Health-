
import React, { useState } from 'react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { 
  Stethoscope, User, CheckCircle, XCircle, AlertTriangle, 
  FileText, Shield, QrCode, Lock, Printer, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PilotHandbooks: React.FC = () => {
  const [role, setRole] = useState<'doctor' | 'patient'>('doctor');
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 print:p-0 print:max-w-none print:bg-white print:text-black">
      {/* Header - Hidden on Print */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div>
           <Button variant="outline" onClick={() => navigate(-1)} className="mb-4 text-xs !py-1 !px-3" icon={<ArrowLeft size={12}/>}>Back</Button>
           <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
             <FileText className="text-teal" size={32} /> Pilot Onboarding Handbooks
           </h1>
           <p className="text-text-secondary text-sm">Official Quick-Start Guides for Wysh Care Pilot Phase.</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex">
                <button 
                    onClick={() => setRole('doctor')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${role === 'doctor' ? 'bg-purple text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                >
                    <Stethoscope size={16} /> Doctor Guide
                </button>
                <button 
                    onClick={() => setRole('patient')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${role === 'patient' ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                >
                    <User size={16} /> Patient Guide
                </button>
            </div>
            <Button variant="outline" onClick={handlePrint} icon={<Printer size={16}/>}>Print Guide</Button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-black">Wysh Care Pilot Handbook</h1>
          <p className="text-sm text-gray-600">Role: {role.toUpperCase()}</p>
      </div>

      {role === 'doctor' && (
        <div className="space-y-8 animate-fadeIn">
            {/* Intro */}
            <GlassCard className="border-purple/30 bg-purple/5 print:border-black print:bg-white print:shadow-none">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple/20 rounded-full text-purple print:hidden">
                        <Stethoscope size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white print:text-black mb-2">1. What Wysh Care Is</h2>
                        <p className="text-text-secondary print:text-gray-700 leading-relaxed">
                            Wysh Care is a <strong>patient-owned EMR</strong>. Unlike traditional systems, you can view records only with patient consent. Every access is logged for legal protection.
                        </p>
                    </div>
                </div>
            </GlassCard>

            {/* Workflow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="print:border print:border-gray-300 print:bg-white print:text-black">
                    <Badge color="purple" className="mb-3">Pre-Visit</Badge>
                    <h3 className="text-white print:text-black font-bold mb-3">Before the Visit</h3>
                    <ul className="space-y-2 text-sm text-text-secondary print:text-gray-700">
                        <li className="flex gap-2">1. Log in with secure OTP</li>
                        <li className="flex gap-2">2. Open "Today's Schedule"</li>
                        <li className="flex gap-2">3. Check online status</li>
                    </ul>
                </GlassCard>
                <GlassCard className="print:border print:border-gray-300 print:bg-white print:text-black border-teal/30">
                    <Badge color="teal" className="mb-3">During Visit</Badge>
                    <h3 className="text-white print:text-black font-bold mb-3">The Encounter</h3>
                    <ul className="space-y-2 text-sm text-text-secondary print:text-gray-700">
                        <li className="flex gap-2">1. Search by WyshID</li>
                        <li className="flex gap-2 font-bold text-white print:text-black">2. Request Access (OTP)</li>
                        <li className="flex gap-2">3. View Timeline</li>
                        <li className="flex gap-2">4. Write SOAP Note</li>
                        <li className="flex gap-2">5. Issue Prescription</li>
                    </ul>
                </GlassCard>
                <GlassCard className="print:border print:border-gray-300 print:bg-white print:text-black">
                    <Badge color="purple" className="mb-3">Post-Visit</Badge>
                    <h3 className="text-white print:text-black font-bold mb-3">After Care</h3>
                    <ul className="space-y-2 text-sm text-text-secondary print:text-gray-700">
                        <li className="flex gap-2">1. Access expires auto</li>
                        <li className="flex gap-2">2. Note saved to patient</li>
                        <li className="flex gap-2">3. Audit log updated</li>
                    </ul>
                </GlassCard>
            </div>

            {/* Do's and Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="bg-green-500/5 border-green-500/20 print:bg-white print:border-gray-300">
                    <h3 className="text-green-400 print:text-green-700 font-bold mb-4 flex items-center gap-2">
                        <CheckCircle size={20} /> You CAN
                    </h3>
                    <ul className="space-y-3 text-sm text-text-secondary print:text-gray-700">
                        <li className="flex gap-2"><CheckCircle size={14} className="mt-1 text-green-500"/> View consented records & labs</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="mt-1 text-green-500"/> Add SOAP notes & Vitals</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="mt-1 text-green-500"/> Issue digital prescriptions</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="mt-1 text-green-500"/> Initiate teleconsultations</li>
                    </ul>
                </GlassCard>
                <GlassCard className="bg-red-500/5 border-red-500/20 print:bg-white print:border-gray-300">
                    <h3 className="text-red-400 print:text-red-700 font-bold mb-4 flex items-center gap-2">
                        <XCircle size={20} /> You CANNOT
                    </h3>
                    <ul className="space-y-3 text-sm text-text-secondary print:text-gray-700">
                        <li className="flex gap-2"><XCircle size={14} className="mt-1 text-red-500"/> View data without active consent</li>
                        <li className="flex gap-2"><XCircle size={14} className="mt-1 text-red-500"/> Download/Export full history</li>
                        <li className="flex gap-2"><XCircle size={14} className="mt-1 text-red-500"/> Edit patient-uploaded documents</li>
                        <li className="flex gap-2"><XCircle size={14} className="mt-1 text-red-500"/> View hidden/private records</li>
                    </ul>
                </GlassCard>
            </div>

            {/* Edge Cases */}
            <div className="space-y-4">
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 print:bg-white print:border-gray-300 print:text-black">
                    <h4 className="text-red-300 print:text-red-700 font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle size={18} /> If Access Is Denied
                    </h4>
                    <p className="text-sm text-text-secondary print:text-gray-700">
                        You will see: <strong>“Access not granted.”</strong><br/>
                        Action: Proceed with history verbally. Do not pressure the patient. Request again only if clinically necessary.
                    </p>
                </div>
                
                <div className="p-4 rounded-xl border border-teal/30 bg-teal/5 print:bg-white print:border-gray-300 print:text-black">
                    <h4 className="text-teal print:text-teal-700 font-bold mb-2 flex items-center gap-2">
                        <QrCode size={18} /> Emergency Protocol
                    </h4>
                    <p className="text-sm text-text-secondary print:text-gray-700">
                        Use the <strong>Emergency QR</strong> on the patient's phone/card.<br/>
                        You will see: Blood Group, Allergies, Current Meds, Contacts.<br/>
                        <strong>No login required.</strong> Access is strictly logged and audited.
                    </p>
                </div>
            </div>
        </div>
      )}

      {role === 'patient' && (
        <div className="space-y-8 animate-fadeIn">
             {/* Intro */}
             <GlassCard className="border-teal/30 bg-teal/5 print:border-black print:bg-white print:shadow-none">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-teal/20 rounded-full text-teal print:hidden">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white print:text-black mb-2">1. What is Wysh Care?</h2>
                        <p className="text-text-secondary print:text-gray-700 leading-relaxed">
                            Wysh Care keeps all your health records in one secure place and lets <strong>you control</strong> exactly who sees them and when.
                        </p>
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="print:border print:border-gray-300 print:bg-white print:text-black">
                    <h3 className="text-white print:text-black font-bold mb-4 flex items-center gap-2">
                        <User size={20} className="text-teal"/> Your Wysh ID
                    </h3>
                    <ul className="space-y-2 text-sm text-text-secondary print:text-gray-700 list-disc pl-4">
                        <li>Unique to you (e.g., WYSH-1234)</li>
                        <li>Share with doctors to identify you</li>
                        <li>Works across all pilot hospitals</li>
                        <li>Can link to your government ABHA ID</li>
                    </ul>
                </GlassCard>

                <GlassCard className="print:border print:border-gray-300 print:bg-white print:text-black">
                    <h3 className="text-white print:text-black font-bold mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-purple"/> Sharing (Consent)
                    </h3>
                    <ul className="space-y-2 text-sm text-text-secondary print:text-gray-700 list-disc pl-4">
                        <li>Doctor requests access → You get an OTP</li>
                        <li>You choose to <strong>Approve</strong> or <strong>Deny</strong></li>
                        <li>Access is temporary (expires automatically)</li>
                        <li>You can revoke access anytime in "Security"</li>
                    </ul>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="print:border print:border-gray-300 print:bg-white print:text-black">
                    <h3 className="text-white print:text-black font-bold mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-blue-400"/> Uploading Records
                    </h3>
                    <p className="text-sm text-text-secondary print:text-gray-700 mb-2">
                        You can upload photos, PDFs, or scans of old reports.
                    </p>
                    <ul className="space-y-2 text-sm text-text-secondary print:text-gray-700 list-disc pl-4">
                        <li>Records are encrypted</li>
                        <li>You can "Hide" sensitive records</li>
                        <li>Records are never deleted by hospitals</li>
                    </ul>
                </GlassCard>

                <GlassCard className="print:border print:border-gray-300 print:bg-white print:text-black">
                    <h3 className="text-white print:text-black font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-red-400"/> Emergency Profile
                    </h3>
                    <p className="text-sm text-text-secondary print:text-gray-700 mb-2">
                        Set this up once in your Dashboard.
                    </p>
                    <ul className="space-y-2 text-sm text-text-secondary print:text-gray-700 list-disc pl-4">
                        <li>Shows Blood Group & Allergies</li>
                        <li>Accessible via QR code (Locked Screen)</li>
                        <li>You get notified if someone scans it</li>
                    </ul>
                </GlassCard>
            </div>

            <GlassCard className="bg-white/5 border-white/10 print:bg-white print:border-gray-300">
                <h3 className="text-white print:text-black font-bold mb-3 flex items-center gap-2">
                    <Shield size={20} className="text-teal"/> Your Rights
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-text-secondary print:text-gray-700">
                    <div>✓ See who accessed your data</div>
                    <div>✓ Hide specific records</div>
                    <div>✓ Revoke consent instantly</div>
                    <div>✓ Download your full history</div>
                </div>
                <p className="mt-4 text-xs text-text-secondary print:text-gray-500 italic">
                    No doctor or hospital can access your records silently without an emergency reason.
                </p>
            </GlassCard>
        </div>
      )}

      {/* Support Footer */}
      <div className="border-t border-white/10 pt-8 mt-8 text-center print:border-gray-300">
          <p className="text-white print:text-black font-bold mb-2">Need Help?</p>
          <p className="text-text-secondary print:text-gray-700 text-sm">
              Contact Pilot Support: <span className="text-teal print:text-black font-mono">pilot@wysh.care</span> or WhatsApp <span className="text-teal print:text-black font-mono">+1 555-012-3456</span>
          </p>
      </div>
    </div>
  );
};
