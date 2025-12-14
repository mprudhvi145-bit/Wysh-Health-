
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, Button, Input } from '../../components/UI';
import { Activity, Lock, Mail, ArrowRight, AlertCircle, Smartphone, KeyRound } from 'lucide-react';
import { config } from '../../config';

export const Login: React.FC = () => {
  const [method, setMethod] = useState<'otp' | 'password'>('otp');
  
  // OTP State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Password State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const { login, loginWithGoogle, requestOtp, loginWithOtp, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Initialize Google Button
  useEffect(() => {
    /* global google */
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({
        client_id: config.googleClientId,
        callback: handleGoogleCallback
      });
      google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with" }
      );
    }
  }, []);

  const handleGoogleCallback = async (response: any) => {
      try {
          await loginWithGoogle(response.credential);
          navigate(from, { replace: true });
      } catch (err: any) {
          setError(err.message || 'Google authentication failed.');
      }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
          await requestOtp(phone);
          setOtpSent(true);
      } catch (err: any) {
          setError(err.message || 'Failed to send OTP.');
      }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
          await loginWithOtp(phone, otp);
          navigate(from, { replace: true });
      } catch (err: any) {
          setError(err.message || 'Invalid OTP.');
      }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/5 rounded-full blur-[100px] pointer-events-none" />

      <GlassCard className="w-full max-w-md p-8 relative z-10 border-teal/20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-teal/20 to-purple/20 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Activity className="text-teal w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Access Portal</h1>
          <p className="text-text-secondary mt-2">Secure access for Patients & Doctors</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-black/30 rounded-lg p-1 mb-6 border border-white/10">
            <button 
                onClick={() => setMethod('otp')}
                className={`flex-1 py-2 text-sm font-medium rounded transition-all ${method === 'otp' ? 'bg-teal text-white shadow' : 'text-text-secondary hover:text-white'}`}
            >
                Mobile OTP
            </button>
            <button 
                onClick={() => setMethod('password')}
                className={`flex-1 py-2 text-sm font-medium rounded transition-all ${method === 'password' ? 'bg-purple text-white shadow' : 'text-text-secondary hover:text-white'}`}
            >
                Password
            </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {method === 'otp' ? (
            <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp} className="space-y-6">
                {!otpSent ? (
                    <div className="space-y-2">
                        <label className="text-xs text-text-secondary uppercase tracking-wider font-medium">Mobile Number / Email</label>
                        <div className="relative">
                            <Input 
                                type="text" 
                                placeholder="+1 555-000-0000" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="pl-10"
                            />
                            <Smartphone className="absolute left-3 top-3.5 text-text-secondary w-5 h-5" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 animate-fadeIn">
                        <label className="text-xs text-text-secondary uppercase tracking-wider font-medium">Enter 6-Digit OTP</label>
                        <div className="relative">
                            <Input 
                                type="text" 
                                placeholder="123456" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="pl-10 tracking-widest text-lg"
                                maxLength={6}
                            />
                            <KeyRound className="absolute left-3 top-3.5 text-text-secondary w-5 h-5" />
                        </div>
                        <p className="text-xs text-teal cursor-pointer hover:underline text-right" onClick={() => setOtpSent(false)}>Wrong number?</p>
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="w-full justify-center" 
                    disabled={isLoading}
                    icon={isLoading ? <Activity className="animate-spin" /> : (otpSent ? <ArrowRight /> : <Mail />)}
                >
                    {isLoading ? 'Processing...' : (otpSent ? 'Verify & Login' : 'Send Code')}
                </Button>
            </form>
        ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-6">
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
            </form>
        )}

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0D0F12] px-2 text-text-secondary">Or continue with</span>
            </div>
        </div>

        <div id="google-signin-btn" className="w-full flex justify-center h-10"></div>
        <style>{`
            #google-signin-btn iframe { margin: 0 auto !important; } 
        `}</style>

        <div className="text-center pt-4 border-t border-white/5 mt-6">
            <p className="text-text-secondary text-sm">
              New to Wysh?{' '}
              <Link to="/signup" className="text-teal hover:text-white transition-colors font-medium">
                Initialize Account
              </Link>
            </p>
        </div>
      </GlassCard>
    </div>
  );
};
