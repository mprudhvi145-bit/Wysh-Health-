
import React, { useState } from 'react';
import { useClinical } from '../../hooks/useClinical';
import { GlassCard, Button, Modal, Badge } from '../../../../components/UI';
import { FileText, Download, Eye, Brain, ShieldAlert } from 'lucide-react';
import { api } from '../../../../services/api';

const DocumentsTab: React.FC = () => {
  const { documents } = useClinical();
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter out hidden documents for clinical view
  const visibleDocuments = documents.filter((d: any) => !d.isHidden);

  const viewAnalysis = async (doc: any) => {
    setSelectedDoc(doc);
    setLoading(true);
    setModalOpen(true);
    try {
        const data = await api.get<any>(`/clinical/documents/${doc.id}/ai`);
        setAiData(data);
    } catch (e) {
        setAiData(null);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h4 className="text-text-secondary text-sm font-bold uppercase tracking-wider">Medical Records</h4>
          <Button variant="outline" className="text-xs h-8">Upload Document</Button>
       </div>

       {visibleDocuments.length === 0 && (
           <div className="text-center py-12 text-text-secondary border border-dashed border-white/10 rounded-xl">
             No documents found.
           </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleDocuments.map((doc: any, i: number) => (
             <GlassCard key={i} className="flex items-center justify-between group hover:border-teal/30 cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/5 rounded-lg text-teal group-hover:bg-teal group-hover:text-white transition-colors">
                      <FileText size={20} />
                   </div>
                   <div>
                      <h5 className="text-white font-bold text-sm">{doc.title || `Document #${i+1}`}</h5>
                      <p className="text-xs text-text-secondary">{doc.date || 'Unknown Date'}</p>
                   </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     className="p-2 hover:bg-white/10 rounded-full text-purple"
                     title="AI Analysis"
                     onClick={() => viewAnalysis(doc)}
                   >
                      <Brain size={16} />
                   </button>
                   <button className="p-2 hover:bg-white/10 rounded-full text-white">
                      <Eye size={16} />
                   </button>
                </div>
             </GlassCard>
          ))}
       </div>

       {/* Doctor View Modal for AI */}
       <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Clinical AI Analysis">
            {loading ? <div className="p-10 text-center text-teal">Loading analysis...</div> : aiData ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Badge color="purple">Confidence: {(aiData.rawConfidence * 100).toFixed(1)}%</Badge>
                        <span className="text-xs text-text-secondary">{aiData.source}</span>
                    </div>

                    <div className="p-4 bg-white/5 rounded border border-white/10">
                        <h5 className="text-xs text-text-secondary uppercase mb-2">Clinical Summary</h5>
                        <p className="text-sm text-white leading-relaxed">{aiData.summary}</p>
                    </div>

                    {/* Red Flags - Doctor Only View */}
                    {aiData.redFlags && aiData.redFlags.length > 0 && (
                        <div className="p-4 bg-red-500/10 rounded border border-red-500/20">
                            <h5 className="text-xs text-red-300 uppercase mb-2 flex items-center gap-2">
                                <ShieldAlert size={14} /> Critical Findings
                            </h5>
                            <ul className="list-disc pl-5 text-sm text-white">
                                {aiData.redFlags.map((flag: any, i: number) => (
                                    <li key={i}>{flag.test}: {flag.value} {flag.unit} ({flag.flag})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* Raw Structured Data Preview */}
                    <div>
                        <h5 className="text-xs text-text-secondary uppercase mb-2">Structured Data Extraction</h5>
                        <pre className="text-[10px] bg-black/50 p-3 rounded text-green-400 overflow-auto max-h-40">
                            {JSON.stringify(aiData, null, 2)}
                        </pre>
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center text-text-secondary">No AI analysis data found for this document.</div>
            )}
       </Modal>
    </div>
  );
};

export default DocumentsTab;
