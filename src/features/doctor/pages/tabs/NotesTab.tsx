
import React, { useState } from 'react';
import { useClinical } from '../../hooks/useClinical';
import { clinicalService } from '../../services/clinicalService';
import { GlassCard, Button, Checkbox, Loader, Badge } from '../../../../components/UI';
import { StickyNote, Save, Lock, Share2, Layout, FileText } from 'lucide-react';

const NotesTab: React.FC = () => {
  const { clinicalNotes, patient, refresh } = useClinical();
  
  // Mode State
  const [mode, setMode] = useState<'simple' | 'soap'>('soap');
  
  // Data State
  const [content, setContent] = useState("");
  const [soap, setSoap] = useState({ s: '', o: '', a: '', p: '' });
  const [shared, setShared] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!patient) return;
    
    // Construct final content based on mode
    let finalContent = content;
    if (mode === 'soap') {
        finalContent = `SUBJECTIVE:\n${soap.s}\n\nOBJECTIVE:\n${soap.o}\n\nASSESSMENT:\n${soap.a}\n\nPLAN:\n${soap.p}`;
    }

    if (!finalContent.trim()) return;

    setSaving(true);
    try {
      await clinicalService.addNote({ 
        patientId: patient.id, 
        content: finalContent, 
        subject: mode === 'soap' ? 'SOAP Encounter Note' : 'General Clinical Note',
        type: mode === 'soap' ? 'SOAP' : 'General',
        shared 
      });
      
      // Reset
      setContent("");
      setSoap({ s: '', o: '', a: '', p: '' });
      setShared(false);
      await refresh();
    } catch (error) {
      console.error("Save note failed", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Note Editor */}
      <GlassCard className="border-white/10">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
                <StickyNote size={18} className="text-text-secondary" /> Clinical Entry
            </h3>
            <div className="flex bg-black/30 rounded-lg p-1 border border-white/10">
                <button 
                    onClick={() => setMode('simple')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all flex items-center gap-2 ${mode === 'simple' ? 'bg-teal text-white shadow' : 'text-text-secondary hover:text-white'}`}
                >
                    <FileText size={12} /> Simple
                </button>
                <button 
                    onClick={() => setMode('soap')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all flex items-center gap-2 ${mode === 'soap' ? 'bg-purple text-white shadow' : 'text-text-secondary hover:text-white'}`}
                >
                    <Layout size={12} /> SOAP
                </button>
            </div>
        </div>

        {mode === 'simple' ? (
            <textarea 
              className="w-full bg-black/20 border border-white/10 rounded-lg p-4 text-white text-sm focus:outline-none focus:border-teal min-h-[150px] mb-4 placeholder:text-text-secondary/30"
              placeholder="Enter clinical observations, assessment, and plan..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
        ) : (
            <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] text-teal font-bold uppercase tracking-wider pl-1">Subjective</label>
                        <textarea 
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple min-h-[100px] placeholder:text-text-secondary/30"
                            placeholder="Patient's complaints, history..."
                            value={soap.s}
                            onChange={e => setSoap({...soap, s: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-teal font-bold uppercase tracking-wider pl-1">Objective</label>
                        <textarea 
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple min-h-[100px] placeholder:text-text-secondary/30"
                            placeholder="Vitals, physical exam findings, labs..."
                            value={soap.o}
                            onChange={e => setSoap({...soap, o: e.target.value})}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] text-teal font-bold uppercase tracking-wider pl-1">Assessment</label>
                        <textarea 
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple min-h-[80px] placeholder:text-text-secondary/30"
                            placeholder="Diagnosis, differential..."
                            value={soap.a}
                            onChange={e => setSoap({...soap, a: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-teal font-bold uppercase tracking-wider pl-1">Plan</label>
                        <textarea 
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple min-h-[80px] placeholder:text-text-secondary/30"
                            placeholder="Treatment, medications, follow-up..."
                            value={soap.p}
                            onChange={e => setSoap({...soap, p: e.target.value})}
                        />
                    </div>
                </div>
            </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <Checkbox 
            id="share-note"
            checked={shared}
            onChange={setShared}
            label={
              <span className="flex items-center gap-2 text-sm">
                {shared ? <Share2 size={14} className="text-teal"/> : <Lock size={14} className="text-text-secondary"/>}
                {shared ? 'Shared with Patient' : 'Private Note'}
              </span>
            }
          />
          <Button 
            onClick={save} 
            disabled={saving || (mode === 'simple' ? !content : (!soap.s && !soap.o))} 
            variant="primary" 
            className="text-xs h-9"
            icon={saving ? <Loader text=""/> : <Save size={14}/>}
          >
            {saving ? 'Saving...' : 'Save Record'}
          </Button>
        </div>
      </GlassCard>

      {/* Notes Stream */}
      <div className="space-y-4">
         <h4 className="text-text-secondary text-sm font-bold uppercase tracking-wider">Clinical Timeline</h4>
         {clinicalNotes.length === 0 && (
           <div className="text-center py-8 text-text-secondary border border-dashed border-white/10 rounded-xl">
             No notes recorded.
           </div>
         )}
         {clinicalNotes.map((note: any) => (
           <div key={note.id} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold">
                       DR
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Dr. User</p>
                        <p className="text-[10px] text-text-secondary">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    {note.type === 'SOAP' && <Badge color="purple">SOAP</Badge>}
                    {note.shared ? (
                        <span className="px-2 py-1 rounded bg-teal/10 text-teal text-[10px] border border-teal/20">Shared</span>
                    ) : (
                        <span className="px-2 py-1 rounded bg-black/30 text-text-secondary text-[10px] border border-white/5 flex items-center gap-1">
                            <Lock size={10} /> Private
                        </span>
                    )}
                 </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap pl-10 border-l-2 border-white/5 group-hover:border-teal/30 transition-colors font-mono">
                  {note.content}
              </p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default NotesTab;
