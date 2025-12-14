
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
      desc: "Patient creates a Wysh ID and links their ABHA. Past records are fetched via ABDM consent.",
      action: "View Identity",
      link: "/profile"
    },
    {
      id: 2,
      title: "The Consultation",
      icon: <Stethoscope size={24}/>,
      desc: "Doctor opens the clinical console. AI surfaces key history. A live video visit or in-person encounter begins.",
      action: "Doctor Console",
      link: "/doctor/patients"
    },
    {
      id: 3,
      title: "Clinical Workflow",
      icon: <FileText size={24}/>,
      desc: "Doctor types SOAP notes. AI suggests diagnosis codes. Prescriptions and Lab Orders are one click away.",
      action: "View EMR Flow",
      link: "/products/emr"
    },
    {
      id: 4,
      title: "Diagnostic Loop",
      icon: <TestTube size={24}/>,
      desc: "Lab results are uploaded. AI analyzes values for anomalies and updates the patient's longitudinal record.",
      action: "View Results",
      link: "/dashboard/labs"
    },
    {
      id: 5,
      title: "Continuity of Care",
      icon: <ShieldCheck size={24}/>,
      desc: "Patient receives a plain-language summary. Follow-ups are automated. Data is securely stored.",
      action: "Patient Dashboard",
      link: "/dashboard"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-white mb-4">How Wysh Care Works</h1>
            <p className="text-text-secondary">The end-to-end journey from symptoms to care.</p>
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
                            <th className="p-4">Product Module</th>
                            <th className="p-4">Core Feature</th>
                            <th className="p-4">Operational Outcome</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">Wysh EMR</td>
                            <td className="p-4 text-text-secondary">Smart SOAP Templates</td>
                            <td className="p-4 text-teal">40% faster documentation time</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">ABDM Gateway</td>
                            <td className="p-4 text-text-secondary">Consent-driven History</td>
                            <td className="p-4 text-teal">Reduced duplicate testing by 25%</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">AI Insights</td>
                            <td className="p-4 text-text-secondary">Automated Summaries</td>
                            <td className="p-4 text-teal">Improved patient adherence</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium">Telemedicine</td>
                            <td className="p-4 text-text-secondary">Integrated Vitals</td>
                            <td className="p-4 text-teal">Remote monitoring capability</td>
                        </tr>
                    </tbody>
                </table>
            </GlassCard>
        </div>
    </div>
  );
};
