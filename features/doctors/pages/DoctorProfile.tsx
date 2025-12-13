
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../../services/doctorService';
import { Doctor } from '../../../types/doctor';
import { GlassCard, Button, Badge } from '../../../components/UI';
import { 
    ArrowLeft, Star, MapPin, Globe, GraduationCap, Video, Calendar, 
    Shield, Clock, MessageSquare, Activity 
} from 'lucide-react';

export const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
        if (!id) return;
        setLoading(true);
        const doc = await doctorService.getDoctorById(id);
        setDoctor(doc || null);
        setLoading(false);
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Activity className="w-10 h-10 text-teal animate-spin" />
          </div>
      );
  }

  if (!doctor) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4">
              <h1 className="text-2xl text-white font-bold">Doctor Not Found</h1>
              <Button onClick={() => navigate('/doctors')}>Back to Directory</Button>
          </div>
      );
  }

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <Button 
            variant="outline" 
            onClick={() => navigate('/doctors')} 
            className="mb-6 !py-2 !px-4 text-xs border-white/5 hover:border-white/20"
            icon={<ArrowLeft size={14} />}
        >
            Back to Directory
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Main Info */}
            <div className="lg:col-span-2 space-y-8">
                {/* Header Card */}
                <GlassCard className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-50">
                        <Activity className="w-32 h-32 text-teal/10 absolute -top-10 -right-10" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl flex-shrink-0">
                            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-1">{doctor.name}</h1>
                                    <p className="text-teal text-lg flex items-center gap-2">
                                        {doctor.specialty}
                                        {doctor.subSpecialty && <span className="text-text-secondary text-sm">• {doctor.subSpecialty}</span>}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                                        <Star size={16} fill="currentColor" />
                                        <span className="font-bold">{doctor.rating}</span>
                                    </div>
                                    <span className="text-xs text-text-secondary mt-1">{doctor.reviewCount} Reviews</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-6 text-sm text-text-secondary">
                                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-teal"/> {doctor.location}</span>
                                <span className="flex items-center gap-1.5"><Clock size={16} className="text-teal"/> {doctor.experienceYears} Years Exp.</span>
                                <span className="flex items-center gap-1.5"><Globe size={16} className="text-teal"/> {doctor.languages.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* About & Education */}
                <GlassCard>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-purple"/> About
                    </h3>
                    <p className="text-text-secondary leading-relaxed mb-8">
                        {doctor.about}
                    </p>

                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <GraduationCap size={20} className="text-purple"/> Education & Credentials
                    </h3>
                    <ul className="space-y-2">
                        {doctor.education.map((edu, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                                {edu}
                            </li>
                        ))}
                    </ul>
                </GlassCard>
            </div>

            {/* Right Col: Booking & Status */}
            <div className="space-y-6">
                <GlassCard className="sticky top-24 border-teal/30 bg-teal/5">
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <span className="text-text-secondary">Consultation Fee</span>
                        <span className="text-2xl font-bold text-white">${doctor.consultationFee}</span>
                    </div>

                    <div className="space-y-4 mb-6">
                         <div className={`p-3 rounded-lg border flex items-center gap-3 ${doctor.availability.isOnline ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'}`}>
                            <div className={`w-3 h-3 rounded-full ${doctor.availability.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                            <div>
                                <p className="text-white font-bold text-sm">{doctor.availability.isOnline ? 'Available Now' : 'Offline'}</p>
                                <p className="text-xs text-text-secondary">Instant Video Consult</p>
                            </div>
                         </div>

                         <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                            <Calendar size={18} className="text-teal" />
                            <div>
                                <p className="text-white font-bold text-sm">Next Opening</p>
                                <p className="text-xs text-text-secondary">{doctor.availability.nextSlot}</p>
                            </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <Button 
                            variant="primary" 
                            className="w-full justify-center" 
                            icon={<Video size={18} />}
                            onClick={() => navigate(`/book/${doctor.id}`)}
                        >
                            Book Video Call
                        </Button>
                        <Button variant="outline" className="w-full justify-center" icon={<MessageSquare size={18} />}>
                            Send Message
                        </Button>
                    </div>
                </GlassCard>

                <div className="flex flex-wrap gap-2">
                    {doctor.tags.map(tag => (
                        <Badge key={tag} color="purple">{tag}</Badge>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
