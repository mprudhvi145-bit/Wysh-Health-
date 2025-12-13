
import React from 'react';
import { Doctor } from '../../../types/doctor';
import { GlassCard, Button, Badge } from '../../../components/UI';
import { Star, MapPin, Clock, Video, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <GlassCard className="h-full flex flex-col group relative overflow-hidden">
      {/* Online Indicator */}
      {doctor.availability.isOnline && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-surgical/80 backdrop-blur px-2 py-1 rounded-full border border-green-500/30">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-400 uppercase">Live</span>
        </div>
      )}

      <div className="flex flex-col items-center text-center p-2">
        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-teal/50 to-purple/50 mb-4 group-hover:scale-105 transition-transform duration-300">
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            className="w-full h-full rounded-full object-cover border-2 border-surgical"
          />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-1">{doctor.name}</h3>
        <p className="text-teal text-sm font-medium mb-2">{doctor.specialty}</p>
        
        <div className="flex items-center gap-1 text-yellow-400 text-sm mb-4">
          <Star size={14} fill="currentColor" />
          <span className="font-bold">{doctor.rating}</span>
          <span className="text-text-secondary text-xs">({doctor.reviewCount} reviews)</span>
        </div>

        <div className="w-full space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
            <MapPin size={12} />
            {doctor.location}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
             <Clock size={12} />
             Next: <span className="text-white">{doctor.availability.nextSlot}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
            {doctor.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-text-secondary">
                    {tag}
                </span>
            ))}
        </div>

        <div className="mt-auto w-full grid grid-cols-2 gap-3">
             <Link to={`/doctors/${doctor.id}`} className="col-span-2">
                <Button variant="outline" className="w-full !py-2 text-sm justify-center group-hover:border-teal/50 transition-colors">
                    View Profile
                </Button>
             </Link>
             {/* 
             <Button variant="primary" className="!py-2 text-sm justify-center">
                 <Video size={14} /> Consult
             </Button>
             */}
        </div>
      </div>
    </GlassCard>
  );
};
