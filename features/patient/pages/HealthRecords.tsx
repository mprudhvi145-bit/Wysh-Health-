
import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge, Modal, Input, Loader } from '../../../components/UI';
import { patientService, HealthRecord } from '../../../services/patientService';
import { analyzeMedicalDocument } from '../../../services/geminiService';
import { Upload, FileText, X, CheckCircle, Brain, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const HealthRecords: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Upload State
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('Lab Report');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

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
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    
    // Simulate OCR text extraction based on file type
    const mockText = `
      Patient: ${user?.name}
      Date: ${docDate}
      Test: ${docType}
      Findings: Hemoglobin 11.2 g/dL (Low), WBC 5.5 k/cumm (Normal), Platelets 250 k/cumm (Normal).
      Cholesterol: 240 mg/dL (High). 
      Notes: Patient advised to reduce saturated fats.
    `;

    const summary = await analyzeMedicalDocument(docType, mockText);
    setAiSummary(summary);
    setAnalyzing(false);
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);

    try {
      await patientService.uploadRecord({
        patientId: user.id,
        title: file.name,
        type: docType as any,
        date: docDate,
        url: URL.createObjectURL(file), // Mock URL
        summary: aiSummary,
        tags: [docType, 'Uploaded']
      });
      
      const updated = await patientService.getRecords(user.id);
      setRecords(updated);
      setIsUploadModalOpen(false);
      setFile(null);
      setAiSummary('');
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map(rec => (
          <GlassCard key={rec.id} className="group relative overflow-hidden flex flex-col h-full">
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

            <div className="mt-auto flex gap-2">
              <Button variant="outline" className="flex-1 text-xs justify-center">View</Button>
              <Button variant="outline" className="flex-1 text-xs justify-center">Share</Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Document">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary uppercase mb-2 block">Document Type</label>
              <select 
                className="w-full bg-surgical-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                <option>Lab Report</option>
                <option>Prescription</option>
                <option>Scan</option>
                <option>Discharge Summary</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary uppercase mb-2 block">Date</label>
              <Input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
            </div>
          </div>

          <div>
             <label className="text-xs text-text-secondary uppercase mb-2 block">File Attachment</label>
             <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-teal/50 transition-colors">
               <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
               <label htmlFor="file-upload" className="cursor-pointer">
                 {file ? (
                   <div className="flex items-center justify-center gap-2 text-teal">
                     <CheckCircle size={20} />
                     <span className="font-medium">{file.name}</span>
                   </div>
                 ) : (
                   <div className="text-text-secondary">
                     <Upload className="mx-auto mb-2" />
                     <p>Click to select PDF or Image</p>
                   </div>
                 )}
               </label>
             </div>
          </div>

          {/* AI Analysis Section */}
          {file && !aiSummary && (
            <div className="bg-purple/10 border border-purple/20 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-bold text-sm">Wysh AI Analysis</h4>
                  <p className="text-xs text-text-secondary">Extract insights before saving.</p>
                </div>
                <Button 
                  variant="primary" 
                  className="!py-1 !px-3 text-xs" 
                  onClick={handleAnalyze}
                  icon={analyzing ? <Brain className="animate-spin" /> : <Brain />}
                >
                  {analyzing ? 'Reading...' : 'Analyze'}
                </Button>
              </div>
            </div>
          )}

          {aiSummary && (
            <div className="bg-teal/10 border border-teal/20 p-4 rounded-lg animate-fadeIn">
              <h4 className="text-teal font-bold text-sm mb-2">AI Findings:</h4>
              <p className="text-xs text-white leading-relaxed">{aiSummary}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              disabled={!file || uploading} 
              onClick={handleUpload}
            >
              {uploading ? 'Uploading...' : 'Save Record'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
