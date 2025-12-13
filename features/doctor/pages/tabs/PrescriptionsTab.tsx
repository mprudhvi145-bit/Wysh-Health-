import React, { useState } from 'react';
import { useClinical } from '../../hooks/useClinical';
import { clinicalService } from '../../services/clinicalService';
import { GlassCard, Button, Input, Badge, Loader } from '../../../../components/UI';
import { Plus, Save, Trash2, FileText } from 'lucide-react';

const PrescriptionsTab: React.FC = () => {
  const { prescriptions, patient, refresh } = useClinical();
  const [items, setItems] = useState([{ medicine: "", dosage: "", frequency: "", duration: "" }]);
  const [saving, setSaving] = useState(false);

  const addItem = () =>
    setItems(prev => [...prev, { medicine: "", dosage: "", frequency: "", duration: "" }]);

  const removeItem = (idx: number) => 
    setItems(prev => prev.filter((_, i) => i !== idx));

  const updateItem = (idx: number, field: string, value: string) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const submit = async () => {
    if (!patient) return;
    setSaving(true);
    try {
      await clinicalService.createPrescription({ 
        patientId: patient.id, 
        items: items.filter(i => i.medicine) // Filter out empty rows
      });
      await refresh();
      setItems([{ medicine: "", dosage: "", frequency: "", duration: "" }]);
    } catch (error) {
      console.error("Failed to prescribe", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Prescription Form */}
      <GlassCard className="border-teal/20 bg-teal/5">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <FileText size={18} className="text-teal" /> New Prescription
        </h3>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center animate-fadeIn">
              <div className="md:col-span-4">
                <Input 
                  placeholder="Medicine Name" 
                  value={item.medicine} 
                  onChange={e => updateItem(idx, 'medicine', e.target.value)}
                  className="!py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <Input 
                  placeholder="Dosage" 
                  value={item.dosage} 
                  onChange={e => updateItem(idx, 'dosage', e.target.value)}
                  className="!py-2 text-sm"
                />
              </div>
              <div className="md:col-span-3">
                <Input 
                  placeholder="Frequency" 
                  value={item.frequency} 
                  onChange={e => updateItem(idx, 'frequency', e.target.value)}
                  className="!py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <Input 
                  placeholder="Duration" 
                  value={item.duration} 
                  onChange={e => updateItem(idx, 'duration', e.target.value)}
                  className="!py-2 text-sm"
                />
              </div>
              <div className="md:col-span-1 text-center">
                {items.length > 1 && (
                  <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
          <Button variant="outline" onClick={addItem} className="text-xs h-9" icon={<Plus size={14}/>}>
            Add Item
          </Button>
          <Button 
            variant="primary" 
            onClick={submit} 
            disabled={saving || !items[0].medicine} 
            className="text-xs h-9" 
            icon={saving ? <Loader text="" /> : <Save size={14}/>}
          >
            {saving ? 'Sending...' : 'Sign & Send'}
          </Button>
        </div>
      </GlassCard>

      {/* History List */}
      <div className="space-y-4">
        <h4 className="text-text-secondary text-sm font-bold uppercase tracking-wider">Active Prescriptions</h4>
        {prescriptions.length === 0 && (
           <div className="text-center py-8 text-text-secondary border border-dashed border-white/10 rounded-xl">
             No active prescriptions found.
           </div>
        )}
        {prescriptions.map((rx: any) => (
          <div key={rx.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3 group hover:border-teal/30 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-teal font-bold block mb-1">
                  {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : rx.date}
                </span>
                <span className="text-xs text-text-secondary">Ordered by {rx.doctorId || 'Dr. Ref'}</span>
              </div>
              <Badge color="teal">Active</Badge>
            </div>
            
            <div className="space-y-2 mt-2">
              {rx.items?.map((m: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm bg-black/20 p-2 rounded">
                  <span className="text-white font-medium">{m.medicine}</span>
                  <span className="text-text-secondary">{m.dosage} • {m.frequency} • {m.duration}</span>
                </div>
              ))}
            </div>
            {rx.notes && <p className="text-xs text-text-secondary italic mt-1">"{rx.notes}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsTab;