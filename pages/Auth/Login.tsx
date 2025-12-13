
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, Button, Input } from '../../components/UI';
import { Activity, Lock, Mail, ArrowRight, AlertCircle, Globe } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError('Authentication failed. Please verify credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError('Google authentication failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/5 rounded-full blur-[100px] pointer-events-none" />

      <GlassCard className="w-full max-w-md p-8 relative z-10 border-teal/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal/20 to-purple/20 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Activity className="text-teal w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Welcome Back</h1>
          <p className="text-text-secondary mt-2">Access the Wysh Care OS</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-text-secondary uppercase tracking-wider font-medium">Email ID</label>
            <div className="relative">
              <Input 
                type="email" 
                placeholder="doctor@wysh.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
              <Mail className="absolute left-3 top-3.5 text-text-secondary w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text-secondary uppercase tracking-wider font-medium">Passcode</label>
            <div className="relative">
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
              <Lock className="absolute left-3 top-3.5 text-text-secondary w-5 h-5" />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full justify-center" 
            disabled={isLoading}
            icon={isLoading ? <Activity className="animate-spin" /> : <ArrowRight />}
          >
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0D0F12] px-2 text-text-secondary">Or continue with</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline"
            className="w-full justify-center bg-white/5 hover:bg-white/10" 
            disabled={isLoading}
            onClick={handleGoogleLogin}
            icon={<Globe size={16} />}
          >
            Sign in with Google
          </Button>

          <div className="text-center pt-4 border-t border-white/5 mt-6">
            <p className="text-text-secondary text-sm">
              New to Wysh?{' '}
              <Link to="/signup" className="text-teal hover:text-white transition-colors font-medium">
                Initialize Account
              </Link>
            </p>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
