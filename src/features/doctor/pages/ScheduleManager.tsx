
import React, { useState } from 'react';
import { GlassCard, Button, Badge } from '../../../components/UI';
import { Calendar, Clock, Save, Plus, Trash2 } from 'lucide-react';
import { useNotification } from '../../../context/NotificationContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ScheduleManager: React.FC = () => {
  const { addNotification } = useNotification();
  // In a real app, load this from backend via useEffect
  const [schedule, setSchedule] = useState<{ [key: string]: string[] }>({
    'Monday': ['09:00 - 12:00', '13:00 - 17:00'],
    'Wednesday': ['09:00 - 13:00'],
    'Friday': ['10:00 - 16:00']
  });

  const handleRemoveSlot = (day: string, slotIndex: number) => {
    const updated = { ...schedule };
    updated[day] = updated[day].filter((_, i) => i !== slotIndex);
    setSchedule(updated);
  };

  const handleAddSlot = (day: string) => {
    const updated = { ...schedule };
    if (!updated[day]) updated[day] = [];
    updated[day].push('09:00 - 17:00'); // Default
    setSchedule(updated);
  };

  const handleSave = async () => {
    // Here we would call api.post('/doctor/availability', schedule)
    addNotification('success', 'Availability published to hospital registry');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-display font-bold text-white">Schedule Management</h1>
           <p className="text-text-secondary text-sm">Set your weekly availability for patient bookings.</p>
        </div>
        <Button variant="primary" icon={<Save size={16}/>} onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {DAYS.map(day => (
           <GlassCard key={day} className="flex flex-col gap-4 group">
             <div className="flex justify-between items-center">
               <h3 className="text-white font-bold flex items-center gap-2">
                 <Calendar size={16} className="text-teal" /> {day}
               </h3>
               <button 
                  onClick={() => handleAddSlot(day)} 
                  className="text-xs text-teal hover:text-white transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
               >
                 <Plus size={12} /> Add Slot
               </button>
             </div>

             <div className="space-y-2">
               {(schedule[day] && schedule[day].length > 0) ? (
                 schedule[day].map((slot, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-teal/30 transition-colors">
                      <div className="flex items-center gap-2 text-sm text-white">
                        <Clock size={14} className="text-purple" />
                        {slot}
                      </div>
                      <button 
                        onClick={() => handleRemoveSlot(day, idx)}
                        className="text-text-secondary hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-4 border border-dashed border-white/10 rounded-lg text-xs text-text-secondary">
                   Unavailable
                 </div>
               )}
             </div>
           </GlassCard>
         ))}
      </div>
    </div>
  );
};
