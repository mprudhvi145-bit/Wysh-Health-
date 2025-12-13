import React from 'react';
import { useClinical } from '../../hooks/useClinical';
import { GlassCard, Button } from '../../../../components/UI';
import { FileText, Download, Eye } from 'lucide-react';

const DocumentsTab: React.FC = () => {
  const { documents } = useClinical();

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h4 className="text-text-secondary text-sm font-bold uppercase tracking-wider">Medical Records</h4>
          <Button variant="outline" className="text-xs h-8">Upload Document</Button>
       </div>

       {documents.length === 0 && (
           <div className="text-center py-12 text-text-secondary border border-dashed border-white/10 rounded-xl">
             No documents found.
           </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc: any, i: number) => (
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
                   <button className="p-2 hover:bg-white/10 rounded-full text-white">
                      <Eye size={16} />
                   </button>
                   <button className="p-2 hover:bg-white/10 rounded-full text-teal">
                      <Download size={16} />
                   </button>
                </div>
             </GlassCard>
          ))}
       </div>
    </div>
  );
};

export default DocumentsTab;