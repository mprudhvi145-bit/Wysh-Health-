
import React, { useState } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { CheckCircle, ShieldCheck, Zap, Building2, User, Stethoscope, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <Badge color="teal">Transparent Pricing</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
          Fair Value for <span className="text-teal-glow">Future Care</span>
        </h1>
        <p className="text-text-secondary text-lg">
          We monetize efficiency for hospitals and tools for doctors. <br/>
          <span className="text-white font-medium">Patients never pay to access their own data.</span>
        </p>
        
        {/* Toggle */}
        <div className="inline-flex bg-white/5 p-1 rounded-xl border border-white/10 relative">
            <button 
                onClick={() => setBilling('monthly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
            >
                Monthly
            </button>
            <button 
                onClick={() => setBilling('yearly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billing === 'yearly' ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
            >
                Yearly <span className="text-[10px] bg-white/20 px-1 rounded ml-1">-20%</span>
            </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Patient Plan */}
          <GlassCard className="border-t-4 border-t-teal hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center text-teal mb-4">
                      <User size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Patient Basic</h3>
                  <p className="text-text-secondary text-sm mt-2">Data ownership & access</p>
              </div>
              <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-white">Free</span>
                  <span className="text-text-secondary text-sm"> / forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-teal mt-0.5" /> Universal Wysh ID
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-teal mt-0.5" /> Secure Health Locker
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-teal mt-0.5" /> Emergency QR Profile
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-teal mt-0.5" /> ABDM Interoperability
                  </li>
              </ul>
              <Button variant="primary" className="w-full justify-center" onClick={() => navigate('/signup')}>
                  Create Wysh ID
              </Button>
              <p className="text-xs text-text-secondary text-center mt-4">No credit card required.</p>
          </GlassCard>

          {/* Doctor Plan */}
          <GlassCard className="border-t-4 border-t-purple relative bg-gradient-to-b from-purple/5 to-transparent">
              <div className="absolute top-0 right-0 bg-purple text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
              </div>
              <div className="mb-6">
                  <div className="w-12 h-12 bg-purple/10 rounded-full flex items-center justify-center text-purple mb-4">
                      <Stethoscope size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Clinical Pro</h3>
                  <p className="text-text-secondary text-sm mt-2">For independent practitioners</p>
              </div>
              <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-white">
                      {billing === 'monthly' ? '₹1,999' : '₹1,599'}
                  </span>
                  <span className="text-text-secondary text-sm"> / month</span>
              </div>
              <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm text-white font-medium">
                      <CheckCircle size={16} className="text-purple mt-0.5" /> All Free Features
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-purple mt-0.5" /> Unlimited Telemedicine
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-purple mt-0.5" /> AI Clinical Scribe
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-purple mt-0.5" /> Smart Prescriptions
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-purple mt-0.5" /> Revenue Analytics
                  </li>
              </ul>
              <Button variant="primary" className="w-full justify-center bg-purple hover:bg-purple-dark border-purple">
                  Start Free Trial
              </Button>
              <p className="text-xs text-text-secondary text-center mt-4">14-day free trial. Cancel anytime.</p>
          </GlassCard>

          {/* Hospital Plan */}
          <GlassCard className="border-t-4 border-t-blue-400">
              <div className="mb-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-4">
                      <Building2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Enterprise OS</h3>
                  <p className="text-text-secondary text-sm mt-2">For clinics & hospitals</p>
              </div>
              <div className="mb-6">
                  <span className="text-3xl font-display font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-blue-400 mt-0.5" /> Multi-Doctor Management
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-blue-400 mt-0.5" /> Departmental Analytics
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-blue-400 mt-0.5" /> ABDM Compliance Suite
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-blue-400 mt-0.5" /> Dedicated Support Manager
                  </li>
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                      <CheckCircle size={16} className="text-blue-400 mt-0.5" /> On-Premise Options
                  </li>
              </ul>
              <Button variant="outline" className="w-full justify-center" onClick={() => navigate('/contact')}>
                  Contact Sales
              </Button>
              <p className="text-xs text-text-secondary text-center mt-4">Volume discounts available.</p>
          </GlassCard>
      </div>

      {/* Trust Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 rounded-3xl p-8 border border-white/10">
          <div>
              <h3 className="text-2xl font-bold text-white mb-4">Why we don't charge patients</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                  We believe access to your own health history is a fundamental right, not a premium feature. 
                  Charging patients creates friction and discourages data portability.
              </p>
              <div className="flex items-center gap-2 text-teal font-bold text-sm">
                  <ShieldCheck size={18} /> Patient-First Business Model
              </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-xl">
                  <Zap size={24} className="text-yellow-400 mb-2" />
                  <h4 className="text-white font-bold text-sm">No Ads</h4>
                  <p className="text-xs text-text-secondary">Your health data is never sold.</p>
              </div>
              <div className="p-4 bg-black/20 rounded-xl">
                  <HelpCircle size={24} className="text-blue-400 mb-2" />
                  <h4 className="text-white font-bold text-sm">Support</h4>
                  <p className="text-xs text-text-secondary">24/7 help for emergencies.</p>
              </div>
          </div>
      </div>

    </div>
  );
};
