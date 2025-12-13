import React, { useState } from 'react';
import { useClinical } from '../../hooks/useClinical';
import { clinicalService } from '../../services/clinicalService';
import { GlassCard, Button, Checkbox, Loader } from '../../../../components/UI';
import { StickyNote, Save, Lock, Share2 } from 'lucide-react';

const NotesTab: React.FC = () => {
  const { clinicalNotes, patient, refresh } = useClinical();
  const [content, setContent] = useState("");
  const [shared, setShared] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!patient || !content) return;
    setSaving(true);
    try {
      await clinicalService.addNote({ 
        patientId: patient.id, 
        content, 
        shared 
      });
      setContent("");
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
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <StickyNote size={18} className="text-text-secondary" /> Clinical Entry
        </h3>
        <textarea 
          className="w-full bg-black/20 border border-white/10 rounded-lg p-4 text-white text-sm focus:outline-none focus:border-teal min-h-[120px] mb-4"
          placeholder="Enter clinical observations, assessment, and plan..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="flex justify-between items-center">
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
            disabled={saving || !content} 
            variant="primary" 
            className="text-xs h-9"
            icon={saving ? <Loader text=""/> : <Save size={14}/>}
          >
            {saving ? 'Saving...' : 'Save Note'}
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
                 {note.shared ? (
                    <span className="px-2 py-1 rounded bg-teal/10 text-teal text-[10px] border border-teal/20">Shared</span>
                 ) : (
                    <span className="px-2 py-1 rounded bg-black/30 text-text-secondary text-[10px] border border-white/5 flex items-center gap-1">
                        <Lock size={10} /> Private
                    </span>
                 )}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap pl-10 border-l-2 border-white/5 group-hover:border-teal/30 transition-colors">
                  {note.content}
              </p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default NotesTab;