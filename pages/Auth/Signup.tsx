import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, Button, Input } from '../../components/UI';
import { Activity, Mail, User, Stethoscope, ArrowRight, AlertCircle } from 'lucide-react';
import { Role } from '../../types/auth';
import { config } from '../../config';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('patient');
  const [error, setError] = useState('');
  
  const { register, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();

  // Initialize Google Button
  useEffect(() => {
    /* global google */
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: config.googleClientId,
            callback: handleGoogleCallback
        });
        google.accounts.id.renderButton(
            document.getElementById("google-signup-btn"),
            { theme: "outline", size: "large", width: "100%", text: "signup_with" }
        );
    }
  }, [role]); // Re-init if role logic needs it (though role is passed dynamically below)

  const handleGoogleCallback = async (response: any) => {
    try {
        // Pass the selected role to the backend for new users
        await loginWithGoogle(response.credential, role);
        navigate('/dashboard');
    } catch (err: any) {
        setError(err.message || 'Google registration failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, password, role });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <GlassCard className="w-full max-w-md p-8 relative z-10 border-purple/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Initialize ID</h1>
          <p className="text-text-secondary mt-2">Join the future of healthcare</p>
        </div>

        {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                <AlertCircle size={16} />
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${
                role === 'patient' 
                  ? 'bg-teal/10 border-teal text-teal' 
                  : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
              }`}
            >
              <User size={24} />
              <span className="text-sm font-medium">Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${
                role === 'doctor' 
                  ? 'bg-purple/10 border-purple text-purple' 
                  : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
              }`}
            >
              <Stethoscope size={24} />
              <span className="text-sm font-medium">Doctor</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-1 block">Full Name</label>
              <Input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-1 block">Email</label>
              <Input 
                type="email" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-1 block">Create Passcode</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full justify-center mt-2" 
            disabled={isLoading}
            variant={role === 'doctor' ? 'secondary' : 'primary'}
            icon={isLoading ? <Activity className="animate-spin" /> : <ArrowRight />}
          >
            {isLoading ? 'Creating Identity...' : 'Create Account'}
          </Button>

           <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0D0F12] px-2 text-text-secondary">Or register with</span>
            </div>
          </div>

          {/* Google Button Container */}
          <div id="google-signup-btn" className="w-full flex justify-center h-10"></div>

          <div className="text-center pt-4 border-t border-white/5 mt-6">
            <p className="text-text-secondary text-sm">
              Already have an ID?{' '}
              <Link to="/login" className="text-teal hover:text-white transition-colors font-medium">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};