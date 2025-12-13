
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, Button, Input, Badge } from '../../components/UI';
import { User, Mail, Shield, Bell, LogOut, Save } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notifications: true
  });

  const handleSave = () => {
    addNotification('success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    addNotification('info', 'Logged out successfully');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-display font-bold text-white">Account Settings</h1>
         <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={handleLogout} icon={<LogOut size={16}/>}>
            Logout
         </Button>
      </div>

      <GlassCard className="flex flex-col md:flex-row items-center gap-8 p-8">
         <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal/20">
               <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-[#0D0F12]"></div>
         </div>
         <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold text-white mb-1">{user?.name}</h2>
            <p className="text-text-secondary mb-4">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
               <Badge color="purple">{user?.role.toUpperCase()}</Badge>
               <Badge color="teal">WYSH ID: {user?.id}</Badge>
            </div>
         </div>
      </GlassCard>

      <GlassCard>
         <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <User size={20} className="text-teal" /> Personal Information
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="text-xs text-text-secondary uppercase tracking-wider block mb-2">Full Name</label>
               <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
               <label className="text-xs text-text-secondary uppercase tracking-wider block mb-2">Email Address</label>
               <Input value={formData.email} disabled className="opacity-60 cursor-not-allowed" />
            </div>
            <div>
               <label className="text-xs text-text-secondary uppercase tracking-wider block mb-2">Phone Number</label>
               <Input value={formData.phone} placeholder="+1 (555) 000-0000" onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
         </div>
      </GlassCard>

      <GlassCard>
         <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <Bell size={20} className="text-purple" /> Preferences
         </h3>
         <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
               <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-xs text-text-secondary">Receive updates about appointments and results.</p>
               </div>
               <div 
                 onClick={() => setFormData({...formData, notifications: !formData.notifications})}
                 className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.notifications ? 'bg-teal' : 'bg-white/10'}`}
               >
                 <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
               </div>
            </div>
         </div>
      </GlassCard>

      <div className="flex justify-end">
         <Button variant="primary" onClick={handleSave} icon={<Save size={18}/>}>Save Changes</Button>
      </div>
    </div>
  );
};
