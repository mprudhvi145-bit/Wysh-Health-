
import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge, Modal, Input, Loader, Checkbox } from '../../../components/UI';
import { patientService, HealthRecord, ExtractedMedicalData, ShareResult } from '../../../services/patientService';
import { Upload, FileText, CheckCircle, Brain, Calendar, Camera, Pill, Activity, Save, Shield, Globe, Lock, Share2, EyeOff, Clock, Copy } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';

export const HealthRecords: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Share State
  const [shareData, setShareData] = useState<ShareResult | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Upload State
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('Prescription');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // AI Results
  const [extractedData, setExtractedData] = useState<ExtractedMedicalData | null>(null);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const fetchRecords = async () => {
    if (user) {
      const data = await patientService.getRecords(user.id);
      setRecords(data);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExtractedData(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const data = await patientService.extractDocumentData(file, docType);
      setExtractedData(data);
      addNotification('success', 'Document analysis complete');
    } catch (error) {
      console.error("Extraction failed", error);
      addNotification('error', 'Failed to analyze document. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveRecord = async () => {
    if (!file || !user) return;
    setSaving(true);

    try {
      await patientService.uploadRecord({
        patientId: user.id,
        title: file.name,
        type: docType as any,
        date: docDate,
        url: URL.createObjectURL(file), // Visual fallback
        summary: extractedData?.summary,
        tags: [docType, ...(extractedData?.diagnosis || [])],
        extractedData: extractedData || undefined,
        fileObj: file // Pass raw file for actual upload
      } as any);
      
      await fetchRecords();
      setIsUploadModalOpen(false);
      addNotification('success', 'Health record saved securely');
      
      // Reset State
      setFile(null);
      setExtractedData(null);
      setConsent(false);
    } catch (err) {
      console.error(err);
      addNotification('error', 'Failed to save record.');
    } finally {
      setSaving(false);
    }
  };

  const handleHide = async (id: string) => {
      if(!confirm("Are you sure you want to hide this record?")) return;
      try {
          await patientService.hideRecord(id);
          await fetchRecords();
          addNotification('info', 'Record hidden from timeline.');
      } catch (e) {
          addNotification('error', 'Failed to hide record');
      }
  };

  const handleShare = async (id: string) => {
      try {
          const result = await patientService.shareRecord(id);
          setShareData(result);
          setShareModalOpen(true);
      } catch (e) {
          addNotification('error', 'Failed to generate share link');
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Syncing Records..." /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Health Records</h1>
          <p className="text-text-secondary text-sm">Centralized repository for all your medical documents.</p>
        </div>
        <Button variant="primary" icon={<Upload size={16}/>} onClick={() => setIsUploadModalOpen(true)}>
          Upload Record
        </Button>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.length === 0 ? (
           <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <FileText className="mx-auto text-text-secondary mb-4 opacity-50" size={48} />
              <p className="text-text-secondary">No records found. Upload a prescription to get started.</p>
           </div>
        ) : (
          records.map(rec => (
            <GlassCard key={rec.id} className={`group relative overflow-hidden flex flex-col h-full hover:border-opacity-50 transition-all ${rec.isExternal ? 'border-orange-500/30 bg-orange-500/5' : 'hover:border-teal/40'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg transition-colors ${rec.isExternal ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-teal group-hover:bg-teal group-hover:text-white'}`}>
                  {rec.isExternal ? <Globe size={24} /> : <FileText size={24} />}
                </div>
                <div className="flex gap-1">
                    <button onClick={() => handleShare(rec.id)} className="p-1.5 hover:bg-white/10 rounded text-text-secondary hover:text-white" title="Share securely">
                        <Share2 size={16} />
                    </button>
                    {!rec.isExternal && (
                        <button onClick={() => handleHide(rec.id)} className="p-1.5 hover:bg-white/10 rounded text-text-secondary hover:text-red-400" title="Hide record">
                            <EyeOff size={16} />
                        </button>
                    )}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 truncate">{rec.title}</h3>
              <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
                <Calendar size={12} /> {rec.date}
                {rec.isExternal && (
                  <span className="flex items-center gap-1 text-orange-400 font-medium">
                     • From {rec.source}
                  </span>
                )}
              </div>

              {rec.summary && (
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 mb-4 flex-grow">
                  <p className="text-xs text-teal font-bold mb-1 flex items-center gap-1">
                    <Brain size={12} /> {rec.isExternal ? 'Import Summary' : 'AI Assisted Summary'}
                  </p>
                  <p className="text-xs text-text-secondary line-clamp-3">{rec.summary}</p>
                </div>
              )}

              <div className="mt-auto flex gap-2">
                <Button variant="outline" className="flex-1 text-xs justify-center">View File</Button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Share Modal */}
      <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Secure Document Sharing">
          <div className="space-y-6">
              <div className="p-4 bg-teal/5 border border-teal/20 rounded-lg text-center">
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-3 text-teal">
                      <Lock size={24} />
                  </div>
                  <h3 className="text-white font-bold mb-1">Time-Limited Access Link</h3>
                  <p className="text-xs text-text-secondary">This link will expire in 60 minutes.</p>
              </div>

              <div className="space-y-4">
                  <div>
                      <label className="text-xs text-text-secondary uppercase mb-2 block">Secure URL</label>
                      <div className="flex gap-2">
                          <Input readOnly value={shareData?.shareUrl} className="font-mono text-xs text-teal" />
                          <Button variant="secondary" icon={<Copy size={16}/>} onClick={() => {
                              navigator.clipboard.writeText(shareData?.shareUrl || '');
                              addNotification('success', 'Link copied');
                          }} />
                      </div>
                  </div>
                  <div>
                      <label className="text-xs text-text-secondary uppercase mb-2 block">Access OTP</label>
                      <div className="text-3xl font-display font-bold text-white text-center tracking-widest bg-black/20 p-4 rounded-lg border border-white/10">
                          {shareData?.otp}
                      </div>
                  </div>
              </div>
              <div className="flex justify-center">
                  <p className="text-[10px] text-text-secondary flex items-center gap-1">
                      <Clock size={10} /> Expires: {new Date(shareData?.expiresAt || '').toLocaleString()}
                  </p>
              </div>
          </div>
      </Modal>

      {/* Upload Modal (Same as before but with real service call) */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Add Medical Document">
        <div className="space-y-6">
          {!extractedData && (
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-secondary uppercase mb-2 block">Document Type</label>
                    <select 
                      className="w-full bg-surgical-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                    >
                      <option value="Prescription">Prescription</option>
                      <option value="Lab Report">Lab Report</option>
                      <option value="Scan">Scan / Imaging</option>
                      <option value="Discharge Summary">Discharge Summary</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary uppercase mb-2 block">Date</label>
                    <Input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
                  </div>
                </div>

                <div>
                   <label className="text-xs text-text-secondary uppercase mb-2 block">Attachment</label>
                   <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-teal/50 transition-colors bg-white/5">
                     <input 
                       type="file" 
                       accept="image/*,application/pdf"
                       onChange={handleFileChange} 
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                     />
                     {file ? (
                       <div className="flex flex-col items-center justify-center gap-2 text-teal">
                         <CheckCircle size={32} />
                         <span className="font-medium text-white">{file.name}</span>
                         <span className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                       </div>
                     ) : (
                       <div className="text-text-secondary">
                         <Camera className="mx-auto mb-3 text-white" size={32} />
                         <p className="text-white font-medium mb-1">Upload File</p>
                       </div>
                     )}
                   </div>
                </div>

                <div className="flex justify-end pt-4">
                   <Button 
                      variant="primary" 
                      className="w-full justify-center" 
                      disabled={!file || analyzing} 
                      onClick={handleAnalyze}
                      icon={analyzing ? <Brain className="animate-spin" /> : <Brain />}
                   >
                      {analyzing ? 'Extracting Data...' : 'Analyze Document'}
                   </Button>
                </div>
             </div>
          )}

          {extractedData && (
            <div className="space-y-6 animate-fadeIn">
               {/* Extraction Review UI from previous steps... kept concise for brevity */}
               <div className="p-4 bg-teal/10 rounded-lg border border-teal/20">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="text-teal font-bold flex items-center gap-2"><Brain size={16} /> Analysis Complete</h4>
                     <Badge color="teal">{(extractedData.confidence * 100).toFixed(0)}% Confidence</Badge>
                  </div>
                  <p className="text-sm text-white mb-2 font-medium">"{extractedData.summary}"</p>
               </div>
               
               <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => { setExtractedData(null); setFile(null); }}>Retry</Button>
                  <Button 
                     variant="primary" 
                     disabled={saving} 
                     onClick={handleSaveRecord}
                     icon={saving ? <Save className="animate-spin" /> : <Save />}
                  >
                     {saving ? 'Saving...' : 'Save Record'}
                  </Button>
               </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
