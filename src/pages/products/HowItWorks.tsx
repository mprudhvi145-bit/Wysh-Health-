
import React, { useState } from 'react';
import { GlassCard, Button } from '../../components/UI';
import { User, Stethoscope, TestTube, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Patient Onboarding",
      icon: <User size={24}/>,
      desc: "Patients create a Wysh ID and optionally link ABHA.",
      action: "View Identity",
      link: "/products/wysh-id"
    },
    {
      id: 2,
      title: "Doctor Consultation",
      icon: <Stethoscope size={24}/>,
      desc: "Doctors conduct consultations using structured notes, prescriptions, and lab orders.",
      action: "Doctor Console",
      link: "/products/emr"
    },
    {
      id: 3,
      title: "Labs & Reports",
      icon: <TestTube size={24}/>,
      desc: "Lab results are uploaded, stored securely, and summarized using AI assistance.",
      action: "View AI Insights",
      link: "/products/ai-clinical"
    },
    {
      id: 4,
      title: "Patient Access",
      icon: <FileText size={24}/>,
      desc: "Patients view prescriptions, reports, and plain-language summaries in one place.",
      action: "Patient Dashboard",
      link: "/dashboard"
    },
    {
      id: 5,
      title: "ABDM Exchange",
      icon: <ShieldCheck size={24}/>,
      desc: "With explicit consent, records can be fetched from or shared with external systems.",
      action: "View Compliance",
      link: "/products/abdm"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-white mb-4">How Wysh Care Works</h1>
            <p className="text-text-secondary">A patient’s healthcare journey, end to end.</p>
        </div>

        {/* Stepper Navigation */}
        <div className="flex justify-between items-center relative mb-12 max-w-4xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 -z-10" />
            <div className="absolute top-1/2 left-0 h-1 bg-teal transition-all duration-500 -translate-y-1/2 -z-10" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} />
            
            {steps.map((s) => (
                <button 
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${step === s.id ? 'bg-teal border-[#0D0F12] text-white scale-125 shadow-lg' : step > s.id ? 'bg-teal border-teal text-white' : 'bg-[#0D0F12] border-white/20 text-text-secondary'}`}
                >
                    {step > s.id ? <ShieldCheck size={16} /> : s.id}
                </button>
            ))}
        </div>

        {/* Content Card */}
        <GlassCard className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 transition-all duration-500 animate-fadeIn">
            <div className="w-20 h-20 bg-gradient-to-br from-teal/20 to-purple/20 rounded-2xl flex items-center justify-center mb-6 text-white border border-white/10 shadow-[0_0_30px_rgba(77,139,131,0.2)]">
                {steps[step-1].icon}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{steps[step-1].title}</h2>
            <p className="text-xl text-text-secondary max-w-2xl mb-8 leading-relaxed">
                {steps[step-1].desc}
            </p>
            <Button 
                variant="primary" 
                onClick={() => navigate(steps[step-1].link)} 
                className="px-8"
                icon={<ArrowRight size={18} />}
            >
                {steps[step-1].action}
            </Button>
        </GlassCard>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 max-w-xl mx-auto">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep(s => s - 1)}>
                Previous
            </Button>
            <Button variant="outline" disabled={step === 5} onClick={() => setStep(s => s + 1)}>
                Next Step
            </Button>
        </div>

        {/* Outcome Mapping Table */}
        <div className="mt-24">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Feature Impact Analysis</h3>
            <GlassCard className="!p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-text-secondary text-xs uppercase">
                        <tr>
                            <th className="p-4">Feature</th>
                            <th className="p-4">Outcome</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">Structured SOAP Notes</td>
                            <td className="p-4 text-teal">Faster, safer consultations</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">AI Summaries</td>
                            <td className="p-4 text-teal">Reduced clinician burnout</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">Wysh ID</td>
                            <td className="p-4 text-teal">Lifetime health continuity</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">ABDM Consent</td>
                            <td className="p-4 text-teal">Government compliance</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">Audit Logs</td>
                            <td className="p-4 text-teal">Legal & operational safety</td>
                        </tr>
                    </tbody>
                </table>
            </GlassCard>
        </div>
    </div>
  );
};
