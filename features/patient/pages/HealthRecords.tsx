import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge, Modal, Input, Loader, Checkbox } from '../../../components/UI';
import { patientService, HealthRecord, ExtractedMedicalData } from '../../../services/patientService';
import { Upload, FileText, CheckCircle, Brain, Calendar, Camera, Pill, Activity, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';

export const HealthRecords: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
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
    const fetchRecords = async () => {
      if (user) {
        const data = await patientService.getRecords(user.id);
        setRecords(data);
      }
      setLoading(false);
    };
    fetchRecords();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExtractedData(null); // Reset extraction on new file
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
    if (!file || !user || !extractedData) return;
    setSaving(true);

    try {
      await patientService.uploadRecord({
        patientId: user.id,
        title: file.name,
        type: docType as any,
        date: docDate,
        url: URL.createObjectURL(file), // Using object URL for session mock
        summary: extractedData.summary,
        tags: [docType, ...extractedData.diagnosis],
        extractedData: extractedData
      });
      
      const updated = await patientService.getRecords(user.id);
      setRecords(updated);
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
            <GlassCard key={rec.id} className="group relative overflow-hidden flex flex-col h-full hover:border-teal/40 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-lg text-teal group-hover:bg-teal group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <Badge color="purple">{rec.type}</Badge>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 truncate">{rec.title}</h3>
              <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
                <Calendar size={12} /> {rec.date}
              </div>

              {rec.summary && (
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 mb-4 flex-grow">
                  <p className="text-xs text-teal font-bold mb-1 flex items-center gap-1">
                    <Brain size={12} /> AI Summary
                  </p>
                  <p className="text-xs text-text-secondary line-clamp-3">{rec.summary}</p>
                </div>
              )}

              {/* Tag Preview */}
              <div className="flex flex-wrap gap-2 mb-4">
                 {rec.tags.slice(0, 3).map(tag => (
                   <span key={tag} className="px-2 py-0.5 rounded-full bg-black/30 border border-white/5 text-[10px] text-text-secondary">
                     {tag}
                   </span>
                 ))}
              </div>

              <div className="mt-auto flex gap-2">
                <Button variant="outline" className="flex-1 text-xs justify-center">View</Button>
                {/* <Button variant="outline" className="flex-1 text-xs justify-center">Share</Button> */}
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Smart Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Add Medical Document">
        <div className="space-y-6">
          
          {/* File Selection */}
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
                       capture="environment"
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
                         <p className="text-white font-medium mb-1">Take Photo or Upload</p>
                         <p className="text-xs">Supports PDF, JPG, PNG (Max 5MB)</p>
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
                      {analyzing ? 'Extracting Data with AI...' : 'Analyze Document'}
                   </Button>
                </div>
             </div>
          )}

          {/* AI Extraction Review */}
          {extractedData && (
            <div className="space-y-6 animate-fadeIn">
               <div className="p-4 bg-teal/10 rounded-lg border border-teal/20">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="text-teal font-bold flex items-center gap-2">
                        <Brain size={16} /> Analysis Complete
                     </h4>
                     <Badge color="teal">{(extractedData.confidence * 100).toFixed(0)}% Confidence</Badge>
                  </div>
                  <p className="text-sm text-white mb-2 font-medium">"{extractedData.summary}"</p>
                  
                  {/* Extracted Diagnosis */}
                  {extractedData.diagnosis.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-3">
                        {extractedData.diagnosis.map((d, i) => (
                           <span key={i} className="text-xs bg-black/40 px-2 py-1 rounded text-text-secondary border border-white/10">{d}</span>
                        ))}
                     </div>
                  )}
               </div>

               {/* Medications Table */}
               {extractedData.medications.length > 0 && (
                  <div>
                     <h5 className="text-xs text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Pill size={14} /> Identified Medications
                     </h5>
                     <div className="bg-black/20 rounded-lg border border-white/5 overflow-hidden">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-white/5 text-text-secondary text-xs">
                              <tr>
                                 <th className="p-2">Name</th>
                                 <th className="p-2">Dosage</th>
                                 <th className="p-2">Freq</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {extractedData.medications.map((med, i) => (
                                 <tr key={i}>
                                    <td className="p-2 text-white font-medium">{med.name}</td>
                                    <td className="p-2 text-text-secondary">{med.dosage}</td>
                                    <td className="p-2 text-text-secondary">{med.frequency}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {/* Labs Table */}
               {extractedData.labs.length > 0 && (
                  <div>
                     <h5 className="text-xs text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Activity size={14} /> Lab Results
                     </h5>
                     <div className="bg-black/20 rounded-lg border border-white/5 overflow-hidden">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-white/5 text-text-secondary text-xs">
                              <tr>
                                 <th className="p-2">Test</th>
                                 <th className="p-2">Value</th>
                                 <th className="p-2">Flag</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {extractedData.labs.map((lab, i) => (
                                 <tr key={i}>
                                    <td className="p-2 text-white font-medium">{lab.test}</td>
                                    <td className="p-2 text-text-secondary">{lab.value} {lab.unit}</td>
                                    <td className="p-2">
                                       <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                          lab.flag === 'Normal' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                       }`}>
                                          {lab.flag}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {/* Notes */}
               {extractedData.notes && (
                  <div className="p-3 bg-white/5 rounded border border-white/5">
                     <p className="text-xs text-text-secondary uppercase mb-1">Doctor Notes</p>
                     <p className="text-sm text-white">{extractedData.notes}</p>
                  </div>
               )}

               <div className="pt-4 border-t border-white/10">
                   <Checkbox 
                     id="data-consent"
                     checked={consent}
                     onChange={setConsent}
                     label="I verify this data is accurate and consent to saving it to my health record."
                   />
               </div>

               <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => { setExtractedData(null); setFile(null); }}>Retry</Button>
                  <Button 
                     variant="primary" 
                     disabled={!consent || saving} 
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