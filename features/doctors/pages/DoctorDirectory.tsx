
import React, { useState, useEffect } from 'react';
import { doctorService } from '../../../services/doctorService';
import { Doctor, Specialty } from '../../../types/doctor';
import { DoctorCard } from '../components/DoctorCard';
import { Button, Input } from '../../../components/UI';
import { Search, Filter, Stethoscope } from 'lucide-react';

const SPECIALTIES: Specialty[] = ['All', 'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedics'];

export const DoctorDirectory: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSpecialty, setActiveSpecialty] = useState<Specialty>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await doctorService.getAllDoctors(activeSpecialty, searchQuery);
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
        fetchDoctors();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeSpecialty, searchQuery]);

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                Find Your <span className="text-teal-glow text-glow">Specialist</span>
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
                Connect with world-class medical professionals through our AI-matched directory. 
                Instant consultations available.
            </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surgical-light/50 border border-white/10 p-4 rounded-2xl backdrop-blur-md sticky top-24 z-30">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3.5 text-text-secondary w-5 h-5" />
                <Input 
                    placeholder="Search name, specialty, or condition..." 
                    className="pl-10 !bg-black/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Filter size={18} className="text-text-secondary min-w-[18px]" />
                <div className="flex gap-2">
                    {SPECIALTIES.map(spec => (
                        <button
                            key={spec}
                            onClick={() => setActiveSpecialty(spec)}
                            className={`
                                whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border
                                ${activeSpecialty === spec 
                                    ? 'bg-teal text-white border-teal shadow-[0_0_15px_rgba(77,139,131,0.4)]' 
                                    : 'bg-transparent text-text-secondary border-white/10 hover:border-white/30 hover:text-white'
                                }
                            `}
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Results Grid */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Stethoscope className="w-12 h-12 text-teal animate-bounce" />
                <p className="text-text-secondary animate-pulse">Scanning medical database...</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {doctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
                
                {doctors.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-2">No doctors found</h3>
                        <p className="text-text-secondary">Try adjusting your filters or search terms.</p>
                        <Button 
                            variant="outline" 
                            className="mt-6 mx-auto"
                            onClick={() => {setActiveSpecialty('All'); setSearchQuery('');}}
                        >
                            Reset Filters
                        </Button>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};
