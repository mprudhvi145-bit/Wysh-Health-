
import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Input, Badge, Modal, Loader, Checkbox } from '../../../components/UI';
import { Shield, Smartphone, QrCode, Lock, CheckCircle, RefreshCw, FileText, ExternalLink, Plus, AlertCircle, Calendar } from 'lucide-react';
import { abdmService, AbhaProfile, ConsentArtifact } from '../../../services/abdmService';
import { useNotification } from '../../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { clinicalService } from '../../doctor/services/clinicalService';

export const AbhaManager: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'consents'>('profile');
  const [profile, setProfile] = useState<AbhaProfile | null>(null);
  const [consents, setConsents] = useState<ConsentArtifact[]>([]);
  const [loading, setLoading] = useState(true);

  // Link State
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [abhaAddr, setAbhaAddr] = useState('');
  const [otp, setOtp] = useState('');
  const [linking, setLinking] = useState(false);

  // New Consent State
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [newConsent, setNewConsent] = useState({
      hipName: 'Apollo Hospital',
      purpose: 'Care Management',
      scope: {
          prescription: true,
          diagnostic: true,
          discharge: false,
          opConsult: false
      },
      dateFrom: '',
      dateTo: ''
  });
  const [requestingConsent, setRequestingConsent] = useState(false);

  // Fetch Logic
  useEffect(() => {
      const init = async () => {
          if (!user) return;
          try {
              // Try to get profile from patient chart (since user object in auth doesn't have it yet in this mock)
              const chart = await clinicalService.getPatientChart(user.id);
              if (chart.patient?.abha) {
                  setProfile(chart.patient.abha);
                  setStep('success');
              }
              const consentData = await abdmService.getConsents();
              setConsents(consentData);
          } catch (e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      };
      init();
  }, [user]);

  const handleRequestOtp = async () => {
      setLinking(true);
      try {
          await abdmService.requestOtp(abhaAddr);
          setStep('otp');
          addNotification('info', 'OTP sent to linked mobile number');
      } catch (e: any) {
          addNotification('error', e.message || 'Failed to send OTP');
      } finally {
          setLinking(false);
      }
  };

  const handleVerify = async () => {
      setLinking(true);
      try {
          const res = await abdmService.linkAbha(abhaAddr, otp);
          setProfile(res.data);
          setStep('success');
          addNotification('success', 'ABHA Linked Successfully');
      } catch (e: any) {
          addNotification('error', e.message || 'Verification Failed');
      } finally {
          setLinking(false);
      }
  };

  const handleSubmitConsent = async () => {
      setRequestingConsent(true);
      try {
          const scopeArray = [];
          if (newConsent.scope.prescription) scopeArray.push('Prescription');
          if (newConsent.scope.diagnostic) scopeArray.push('DiagnosticReport');
          if (newConsent.scope.discharge) scopeArray.push('DischargeSummary');
          if (newConsent.scope.opConsult) scopeArray.push('OPConsultation');

          await abdmService.createConsent({
              hipName: newConsent.hipName,
              purpose: newConsent.purpose,
              scope: scopeArray,
              dateFrom: newConsent.dateFrom,
              dateTo: newConsent.dateTo
          });
          
          addNotification('success', 'Consent request sent to ABDM network');
          setIsConsentModalOpen(false);
          
          // Refresh list
          const consentData = await abdmService.getConsents();
          setConsents(consentData);
      } catch (e) {
          addNotification('error', 'Failed to create consent request');
      } finally {
          setRequestingConsent(false);
      }
  };

  const handleFetchData = async (consentId: string) => {
      try {
          await abdmService.fetchExternalData(consentId);
          addNotification('success', 'Health records fetched successfully. Check Health Records.');
      } catch (e) {
          addNotification('error', 'Fetch failed');
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                    <img src="https://abdm.gov.in/assets/images/logo/ndhm-logo.svg" alt="ABDM" className="h-8" style={{filter: 'invert(1)'}}/> 
                    ABHA Integration
                </h1>
                <p className="text-text-secondary text-sm">Manage your National Digital Health Identity</p>
            </div>
            <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-teal text-white' : 'text-text-secondary hover:text-white'}`}
                >
                    Identity
                </button>
                <button 
                    onClick={() => setActiveTab('consents')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'consents' ? 'bg-purple text-white' : 'text-text-secondary hover:text-white'}`}
                >
                    Consent Ledger
                </button>
            </div>
        </div>

        {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status Card */}
                <GlassCard className="flex flex-col items-center justify-center text-center py-10 relative overflow-hidden">
                    {profile ? (
                        <>
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-white to-green-500 opacity-80" />
                            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center mb-6 shadow-xl relative group">
                                <QrCode size={64} className="text-black" />
                                <div className="absolute inset-0 bg-teal/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer">
                                    <span className="text-white text-xs font-bold">View QR</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                            <p className="text-teal font-mono mb-4">{profile.address}</p>
                            <Badge color="teal">VERIFIED: {profile.id}</Badge>
                            <p className="text-xs text-text-secondary mt-6">Linked on {new Date(profile.linkedAt).toLocaleDateString()}</p>
                            <Button variant="outline" className="mt-6 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">Unlink ABHA</Button>
                        </>
                    ) : (
                        <>
                            <Shield size={48} className="text-text-secondary mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-white mb-2">ABHA Not Linked</h3>
                            <p className="text-text-secondary text-sm max-w-xs mb-6">Link your Ayushman Bharat Health Account to access the national digital health ecosystem.</p>
                            <div className="text-xs text-text-secondary flex items-center gap-1">
                                <AlertCircle size={12} /> Wysh does not store Aadhaar.
                            </div>
                        </>
                    )}
                </GlassCard>

                {/* Linking Form */}
                <div className="space-y-6">
                    {!profile && (
                        <GlassCard>
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Smartphone size={18} className="text-teal" /> Link via Mobile OTP
                            </h3>
                            
                            {step === 'input' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase mb-2 block">ABHA Address / Number</label>
                                        <Input 
                                            placeholder="e.g. name@abdm or 91-xxxx" 
                                            value={abhaAddr}
                                            onChange={e => setAbhaAddr(e.target.value)}
                                        />
                                    </div>
                                    <Button 
                                        className="w-full justify-center" 
                                        onClick={handleRequestOtp} 
                                        disabled={linking || !abhaAddr}
                                        icon={linking ? <Loader text="" /> : undefined}
                                    >
                                        {linking ? 'Sending OTP...' : 'Send OTP'}
                                    </Button>
                                </div>
                            )}

                            {step === 'otp' && (
                                <div className="space-y-4 animate-fadeIn">
                                    <div className="p-3 bg-teal/10 border border-teal/20 rounded text-xs text-teal mb-2">
                                        OTP sent to linked mobile number. (Demo: Use 123456)
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase mb-2 block">Enter OTP</label>
                                        <Input 
                                            placeholder="123456" 
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            maxLength={6}
                                            className="tracking-widest text-center text-lg"
                                        />
                                    </div>
                                    <Button 
                                        className="w-full justify-center" 
                                        onClick={handleVerify} 
                                        disabled={linking || otp.length !== 6}
                                        icon={linking ? <Loader text="" /> : <CheckCircle size={18}/>}
                                    >
                                        {linking ? 'Verifying...' : 'Link Account'}
                                    </Button>
                                </div>
                            )}
                        </GlassCard>
                    )}

                    {/* Info Card */}
                    <GlassCard className="bg-purple/5 border-purple/20">
                        <div className="flex gap-4">
                            <Lock className="text-purple flex-shrink-0" size={24} />
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">Consent-Driven Privacy</h4>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Your data is never shared without explicit approval. You can grant, manage, and revoke access to your health records at any time via the Consent Ledger.
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        )}

        {activeTab === 'consents' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white">Active Consents</h3>
                        <p className="text-text-secondary text-xs">Manage access to your health data</p>
                    </div>
                    <Button variant="primary" className="text-xs" icon={<Plus size={14}/>} onClick={() => setIsConsentModalOpen(true)}>New Consent</Button>
                </div>

                {!profile && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm flex items-center gap-2">
                        <AlertCircle size={16} /> Link your ABHA ID to enable consent management.
                    </div>
                )}

                {consents.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-text-secondary">
                        No active data sharing consents found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {consents.map(consent => (
                            <GlassCard key={consent.id} className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-lg text-teal">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{consent.hipName}</h4>
                                        <p className="text-xs text-text-secondary mb-1">Purpose: {consent.purpose}</p>
                                        <div className="flex gap-2 text-[10px] text-text-secondary">
                                            <span>Granted: {new Date(consent.dateGranted).toLocaleDateString()}</span>
                                            <span>Expires: {new Date(consent.expiresAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Badge color={consent.status === 'GRANTED' ? 'teal' : 'purple'}>{consent.status}</Badge>
                                    {consent.status === 'GRANTED' && (
                                        <>
                                            <Button 
                                                variant="outline" 
                                                className="text-xs h-8 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                            >
                                                Revoke
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="text-xs h-8"
                                                onClick={() => handleFetchData(consent.id)}
                                                icon={<ExternalLink size={12} />}
                                            >
                                                Fetch Records
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* Create Consent Modal */}
        <Modal isOpen={isConsentModalOpen} onClose={() => setIsConsentModalOpen(false)} title="New Data Consent">
            <div className="space-y-6">
                <div className="p-4 bg-teal/5 border border-teal/20 rounded-lg text-sm text-text-secondary">
                    You are authorizing Wysh Care to access and share your health records strictly within the scope and duration you approve.
                </div>

                <div>
                    <label className="text-xs text-text-secondary uppercase mb-2 block">Hospital / Provider (HIP)</label>
                    <Input 
                        value={newConsent.hipName} 
                        onChange={e => setNewConsent({...newConsent, hipName: e.target.value})} 
                        placeholder="Search Provider..."
                    />
                </div>

                <div>
                    <label className="text-xs text-text-secondary uppercase mb-2 block">Purpose of Request</label>
                    <select 
                        className="w-full bg-surgical-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal"
                        value={newConsent.purpose}
                        onChange={e => setNewConsent({...newConsent, purpose: e.target.value})}
                    >
                        <option>Care Management</option>
                        <option>Public Health</option>
                        <option>Self Access</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs text-text-secondary uppercase mb-2 block">Data Scope</label>
                    <div className="grid grid-cols-2 gap-3">
                        <Checkbox 
                            id="scope-rx"
                            checked={newConsent.scope.prescription} 
                            onChange={c => setNewConsent({...newConsent, scope: {...newConsent.scope, prescription: c}})}
                            label="Prescriptions"
                        />
                        <Checkbox 
                            id="scope-lab"
                            checked={newConsent.scope.diagnostic} 
                            onChange={c => setNewConsent({...newConsent, scope: {...newConsent.scope, diagnostic: c}})}
                            label="Lab Reports"
                        />
                        <Checkbox 
                            id="scope-op"
                            checked={newConsent.scope.opConsult} 
                            onChange={c => setNewConsent({...newConsent, scope: {...newConsent.scope, opConsult: c}})}
                            label="OP Consults"
                        />
                        <Checkbox 
                            id="scope-ds"
                            checked={newConsent.scope.discharge} 
                            onChange={c => setNewConsent({...newConsent, scope: {...newConsent.scope, discharge: c}})}
                            label="Discharge Summary"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-text-secondary uppercase mb-2 block">Valid From</label>
                        <Input 
                            type="date" 
                            value={newConsent.dateFrom} 
                            onChange={e => setNewConsent({...newConsent, dateFrom: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-text-secondary uppercase mb-2 block">Valid To</label>
                        <Input 
                            type="date" 
                            value={newConsent.dateTo} 
                            onChange={e => setNewConsent({...newConsent, dateTo: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button variant="outline" onClick={() => setIsConsentModalOpen(false)}>Cancel</Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmitConsent} 
                        disabled={requestingConsent}
                        icon={requestingConsent ? <Loader text=""/> : <CheckCircle size={16}/>}
                    >
                        {requestingConsent ? 'Requesting...' : 'Request Consent'}
                    </Button>
                </div>
            </div>
        </Modal>
    </div>
  );
};
