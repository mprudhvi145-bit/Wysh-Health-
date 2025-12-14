
import React, { useState } from 'react';
import { GlassCard, Button, Input, Badge } from '../components/UI';
import { Send, CheckCircle, MessageCircle, Mail, Phone } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
          <Badge color="purple">Pilot Support</Badge>
          <h1 className="text-4xl font-display font-bold text-white mt-4 mb-6">Priority Support Channel</h1>
          <p className="text-text-secondary text-lg">
            Direct access for pilot hospitals and doctors.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="text-center group cursor-pointer hover:border-green-500/50" onClick={() => window.open('https://wa.me/15550123456')}>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                  <MessageCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Pilot WhatsApp</h3>
              <p className="text-text-secondary text-sm mt-2">Instant response for critical issues.</p>
              <p className="text-green-400 font-mono mt-4">+1 555-012-3456</p>
          </GlassCard>

          <GlassCard className="text-center group cursor-pointer hover:border-blue-400/50" onClick={() => window.open('mailto:pilot@wysh.care')}>
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                  <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Escalation Email</h3>
              <p className="text-text-secondary text-sm mt-2">Data corrections & account resets.</p>
              <p className="text-blue-300 font-mono mt-4">pilot@wysh.care</p>
          </GlassCard>

          <GlassCard className="text-center group cursor-pointer hover:border-purple/50">
              <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4 text-purple">
                  <Phone size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Emergency Line</h3>
              <p className="text-text-secondary text-sm mt-2">Server outage or security incident.</p>
              <p className="text-purple-300 font-mono mt-4">1-800-WYSH-SOS</p>
          </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">General Inquiry</h2>
          <p className="text-text-secondary mb-8">
            For partnerships, careers, or non-urgent questions, use the form below.
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold mb-1">Headquarters</h4>
              <p className="text-text-secondary">Silicon Valley, CA & Hyderabad, India</p>
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
    </div>
  );
};
