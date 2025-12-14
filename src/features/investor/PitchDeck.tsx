
import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { ChevronRight, ChevronLeft, X, Activity, ShieldCheck, TrendingUp, Users, AlertTriangle, Lock, Globe } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "WYSH CARE",
    subtitle: "Neo-Clinical Operating System",
    content: "A Patient-Owned, Consent-Driven National EHR Platform.",
    highlight: "Healthcare data that follows the patient — securely, legally, and instantly.",
    type: "hero"
  },
  {
    id: 2,
    title: "The Problem",
    subtitle: "Healthcare data is trapped inside institutions.",
    points: [
      "Patient data is fragmented across hospitals",
      "No reliable emergency access",
      "Patients don’t own their records",
      "Doctors waste time collecting history",
      "Hospitals carry legal & compliance risk"
    ],
    type: "list",
    icon: <AlertTriangle size={48} className="text-red-400" />
  },
  {
    id: 3,
    title: "Why Now?",
    subtitle: "The ecosystem is finally ready.",
    points: [
      "ABDM / ABHA has created national rails",
      "Smartphone penetration is universal",
      "Telemedicine normalized post-COVID",
      "Regulators now mandate consent & audit",
      "Hospitals are actively replacing legacy EMRs"
    ],
    type: "list",
    icon: <Activity size={48} className="text-teal" />
  },
  {
    id: 4,
    title: "The Solution",
    subtitle: "Patients carry their health record. Hospitals don’t trap it.",
    points: [
      "Creates a universal WyshID",
      "Links (optionally) to ABHA",
      "Enables consent-based access across hospitals",
      "Provides emergency read-only access",
      "Works for OPD, telemedicine, and emergencies"
    ],
    type: "list",
    icon: <ShieldCheck size={48} className="text-purple" />
  },
  {
    id: 5,
    title: "Product Overview",
    subtitle: "This is built, not a concept.",
    points: [
      "Patient App (records, sharing, emergency QR)",
      "Doctor Dashboard (SOAP, Rx, teleconsult)",
      "Hospital Dashboard (doctors, analytics, compliance)",
      "Consent Engine (OTP, time-bound, auditable)",
      "ABDM-ready adapter"
    ],
    type: "grid"
  },
  {
    id: 6,
    title: "How It Works",
    subtitle: "Zero trust by default. Explicit trust when needed.",
    points: [
      "1. Patient gets WyshID",
      "2. Records uploaded / aggregated",
      "3. Doctor requests access",
      "4. Patient approves via OTP",
      "5. Access expires automatically"
    ],
    type: "process"
  },
  {
    id: 7,
    title: "Emergency Differentiation",
    subtitle: "The Key Moat",
    points: [
      "Emergency QR / WyshID",
      "No login required for paramedics",
      "Blood group, allergies, meds, contacts",
      "Access logged & patient notified immediately"
    ],
    highlight: "This saves lives — and no existing EMR does this well.",
    type: "list",
    icon: <Activity size={48} className="text-red-500" />
  },
  {
    id: 8,
    title: "AI Responsibility",
    subtitle: "Assists doctors without creating legal risk.",
    points: [
      "Reads uploaded reports (OCR + NLP)",
      "Converts to structured clinical data",
      "Provides decision support, not diagnosis",
      "Fully traceable & optional"
    ],
    type: "list",
    icon: <Users size={48} className="text-blue-400" />
  },
  {
    id: 9,
    title: "Market Opportunity",
    subtitle: "India Market",
    points: [
      "1.4B Patients",
      "1.3M Doctors",
      "70,000+ Hospitals & Clinics"
    ],
    highlight: "A multi-billion-dollar infrastructure play, not just a consumer app.",
    type: "big_number"
  },
  {
    id: 10,
    title: "Business Model",
    subtitle: "Trust is the moat.",
    points: [
      "Patients: Free (Core)",
      "Doctors: Freemium → ₹999/mo",
      "Hospitals: ₹2k - ₹50k/mo (Primary Revenue)"
    ],
    highlight: "No monetization of emergency access or patient data sales.",
    type: "split"
  },
  {
    id: 11,
    title: "Traction",
    subtitle: "Current Status",
    points: [
      "Fully functional EHR platform",
      "Pilot-ready with hospitals",
      "ABDM-aligned by design",
      "Strong doctor & patient pull potential"
    ],
    type: "list",
    icon: <TrendingUp size={48} className="text-green-400" />
  },
  {
    id: 12,
    title: "Competitive Landscape",
    subtitle: "Wysh Care = Ownership + Compliance + UX",
    points: [
      "Hospital EMRs: Data locked inside",
      "Telemedicine Apps: Episodic, not longitudinal",
      "ABDM-only Apps: Infrastructure, not UX",
      "Global EMRs: Not India-native or compliant"
    ],
    type: "grid"
  },
  {
    id: 13,
    title: "Defensibility",
    subtitle: "Infrastructure, not a feature.",
    points: [
      "Patient network effect (WyshID)",
      "Regulatory alignment (ABDM)",
      "Consent & audit architecture",
      "Hospital switching cost once adopted"
    ],
    type: "list",
    icon: <Lock size={48} className="text-teal" />
  },
  {
    id: 14,
    title: "Go-To-Market",
    subtitle: "Strategy",
    points: [
      "Hospital pilots (B2B)",
      "Doctor-led patient onboarding (B2B2C)",
      "Patient-driven hospital adoption (Network Effect)",
      "Regional expansion"
    ],
    type: "list",
    icon: <Globe size={48} className="text-purple" />
  },
  {
    id: 15,
    title: "Team",
    subtitle: "Execution Focused",
    points: [
      "Deep Healthcare Understanding",
      "Technical Depth (AI, Crypto, Cloud)",
      "Long-term infrastructure mindset"
    ],
    type: "list"
  },
  {
    id: 16,
    title: "The Ask",
    subtitle: "Fueling the Pilot Phase",
    points: [
      "Hospital Pilots Execution",
      "Security & Compliance Audits",
      "Sales & Onboarding Team",
      "AI Model Refinement"
    ],
    type: "split"
  },
  {
    id: 17,
    title: "The Future of Health",
    subtitle: "Wysh Care",
    content: "Building the missing layer of Indian healthcare — patient-owned health records that work in real life.",
    type: "hero"
  }
];

export const PitchDeck: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard Nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) setCurrentSlide(c => c + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0F12] flex flex-col animate-fadeIn">
      {/* Deck Controls */}
      <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
           <Badge color="teal">Investor Deck</Badge>
           <span className="text-text-secondary text-xs font-mono">
             SLIDE {currentSlide + 1} / {SLIDES.length}
           </span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-12 relative overflow-hidden">
        {/* Background Ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-5xl w-full z-10 animate-slideDown key={currentSlide}"> {/* Key forces re-render animation */}
            
            {slide.type === 'hero' && (
                <div className="text-center space-y-8">
                    <h1 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tight">
                        {slide.title}
                    </h1>
                    <p className="text-2xl text-teal-glow font-light">{slide.subtitle}</p>
                    <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed border-t border-white/10 pt-8">
                        {slide.content || slide.highlight}
                    </p>
                </div>
            )}

            {(slide.type === 'list' || slide.type === 'split') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="mb-6">
                            {slide.icon && <div className="mb-6">{slide.icon}</div>}
                            <h2 className="text-5xl font-display font-bold text-white mb-2">{slide.title}</h2>
                            <p className="text-xl text-teal">{slide.subtitle}</p>
                        </div>
                        {slide.highlight && (
                            <div className="p-6 bg-white/5 border-l-4 border-teal rounded-r-xl text-lg text-white font-medium">
                                "{slide.highlight}"
                            </div>
                        )}
                    </div>
                    <div>
                        <ul className="space-y-4">
                            {slide.points?.map((point, i) => (
                                <li key={i} className="flex items-start gap-4 text-xl text-text-secondary">
                                    <div className="w-2 h-2 mt-2.5 rounded-full bg-purple flex-shrink-0" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {slide.type === 'grid' && (
                <div className="text-center">
                    <h2 className="text-5xl font-display font-bold text-white mb-2">{slide.title}</h2>
                    <p className="text-xl text-text-secondary mb-12">{slide.subtitle}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {slide.points?.map((point, i) => (
                            <GlassCard key={i} className="text-lg font-medium text-white flex items-center justify-center p-8">
                                {point}
                            </GlassCard>
                        ))}
                    </div>
                </div>
            )}

            {slide.type === 'process' && (
                <div className="text-center">
                    <h2 className="text-5xl font-display font-bold text-white mb-2">{slide.title}</h2>
                    <p className="text-xl text-text-secondary mb-12">{slide.subtitle}</p>
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {slide.points?.map((point, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-teal font-bold">{i+1}</span>
                                <span className="text-white text-lg">{point.replace(/^\d+\.\s/, '')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {slide.type === 'big_number' && (
                <div className="text-center">
                    <h2 className="text-5xl font-display font-bold text-white mb-12">{slide.title}</h2>
                    <div className="grid grid-cols-3 gap-8 mb-12">
                        {slide.points?.map((p, i) => {
                            const [num, ...rest] = p.split(' ');
                            return (
                                <div key={i}>
                                    <div className="text-6xl font-bold text-teal mb-2">{num}</div>
                                    <div className="text-xl text-white">{rest.join(' ')}</div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-xl text-text-secondary italic">{slide.highlight}</p>
                </div>
            )}

        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 flex justify-between items-center">
          <Button variant="outline" onClick={prevSlide} disabled={currentSlide === 0} icon={<ChevronLeft size={20}/>}>
              Previous
          </Button>
          
          <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-teal' : 'w-2 bg-white/10'}`} 
                  />
              ))}
          </div>

          <Button variant="primary" onClick={nextSlide} disabled={currentSlide === SLIDES.length - 1}>
              Next <ChevronRight size={20} />
          </Button>
      </div>
    </div>
  );
};
