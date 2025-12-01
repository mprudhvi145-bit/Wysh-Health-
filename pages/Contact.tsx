import React, { useState } from 'react';
import { GlassCard, Button, Input } from '../components/UI';
import { Send, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <GlassCard className="max-w-md w-full text-center py-12">
          <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-teal w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Message Sent</h2>
          <p className="text-text-secondary mb-8">
            Our team will review your inquiry and get back to you within 24 hours.
          </p>
          <Button onClick={() => setStatus('idle')} variant="outline">Send Another</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-4xl font-display font-bold text-white mb-6">Get in Touch</h1>
        <p className="text-text-secondary text-lg mb-8">
          Whether you're a hospital administrator, investor, or medical professional, we're ready to deploy Wysh Care for you.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-bold mb-1">Headquarters</h4>
            <p className="text-text-secondary">Silicon Valley, CA & Hyderabad, India</p>
          </div>
          <div>
             <h4 className="text-white font-bold mb-1">Email</h4>
             <p className="text-teal cursor-pointer">partnerships@wyshcare.com</p>
          </div>
        </div>
      </div>

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">First Name</label>
              <Input type="text" placeholder="Jane" required />
            </div>
            <div>
              <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Last Name</label>
              <Input type="text" placeholder="Doe" required />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Email Address</label>
            <Input type="email" placeholder="jane@hospital.com" required />
          </div>

          <div>
             <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Inquiry Type</label>
             <select className="w-full bg-surgical-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal">
               <option>Partnership</option>
               <option>Investor Relations</option>
               <option>Careers</option>
               <option>Demo Request</option>
             </select>
          </div>

          <div>
            <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Message</label>
            <textarea 
              rows={4} 
              className="w-full bg-surgical-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all placeholder:text-text-secondary/50"
              placeholder="Tell us about your needs..."
            />
          </div>

          <Button type="submit" className="w-full" icon={status === 'submitting' ? undefined : <Send size={18} />}>
            {status === 'submitting' ? 'Transmitting...' : 'Send Message'}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
};
