import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../../services/doctorService';
import { appointmentService } from '../../../services/appointmentService';
import { Doctor } from '../../../types/doctor';
import { TimeSlot } from '../../../types/appointment';
import { GlassCard, Button, Badge, Modal, Checkbox, Loader } from '../../../components/UI';
import { ArrowLeft, Calendar, Clock, Video, CheckCircle, AlertCircle, MapPin, ShieldCheck, FileText } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const BookingPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Selection State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [type, setType] = useState<'video' | 'in-person'>('video');

  // Consent State
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  useEffect(() => {
    const init = async () => {
      if (!doctorId) return;
      const doc = await doctorService.getDoctorById(doctorId);
      setDoctor(doc || null);
      setSelectedDate(dates[0].iso);
      setLoading(false);
    };
    init();
  }, [doctorId]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctor || !selectedDate) return;
      setLoadingSlots(true);
      const data = await appointmentService.getAvailableSlots(doctor.id, selectedDate);
      setSlots(data);
      setLoadingSlots(false);
    };
    fetchSlots();
  }, [selectedDate, doctor]);

  const initiateBooking = () => {
      setIsConsentOpen(true);
  };

  const confirmBooking = async () => {
    if (!doctor || !user || !selectedSlot) return;
    setIsConsentOpen(false); // Close modal
    setSubmitting(true);
    
    try {
      await appointmentService.bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.image,
        patientId: user.id,
        date: selectedDate,
        time: selectedSlot,
        type: type,
        notes: 'Initial consultation'
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Initializing Secure Channel..." /></div>;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full text-center py-12 border-teal/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-teal/10 to-transparent pointer-events-none" />
          <div className="w-20 h-20 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-teal animate-pulse-slow">
            <CheckCircle className="text-teal w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Booking Confirmed</h2>
          <p className="text-text-secondary mb-8">
            Your appointment with <span className="text-white font-bold">{doctor?.name}</span> has been secured on the blockchain.
          </p>
          <div className="space-y-3">
             <Button variant="primary" className="w-full justify-center" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
             </Button>
             <Button variant="outline" className="w-full justify-center" onClick={() => navigate('/doctors')}>
                Book Another
             </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Doctor Info */}
        <div className="space-y-6">
            <Button variant="outline" onClick={() => navigate(-1)} icon={<ArrowLeft size={16}/>} className="text-xs !py-2 !px-3 mb-4">Back</Button>
            
            <GlassCard className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-teal/30 mb-4 shadow-[0_0_20px_rgba(77,139,131,0.2)]">
                    <img src={doctor?.image} alt={doctor?.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold text-white">{doctor?.name}</h2>
                <p className="text-teal mb-4">{doctor?.specialty}</p>
                <div className="flex justify-center gap-2 mb-6">
                    <Badge color="purple">{doctor?.experienceYears}+ Years Exp</Badge>
                    <Badge color="teal">${doctor?.consultationFee} / Visit</Badge>
                </div>
                <div className="border-t border-white/10 pt-6 text-left space-y-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="text-text-secondary mt-1" size={16} />
                        <div>
                            <p className="text-white text-sm font-bold">Wysh General Hospital</p>
                            <p className="text-text-secondary text-xs">{doctor?.location}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Video className="text-text-secondary mt-1" size={16} />
                        <div>
                            <p className="text-white text-sm font-bold">Telemedicine Ready</p>
                            <p className="text-text-secondary text-xs">High-definition secured line</p>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>

        {/* Right: Booking Interface */}
        <div className="lg:col-span-2 space-y-6">
            <div className="mb-2">
                <h1 className="text-3xl font-display font-bold text-white">Select Availability</h1>
                <p className="text-text-secondary">Choose a date and time for your consultation.</p>
            </div>

            {/* Type Selector */}
            <GlassCard className="flex p-1 !gap-0 bg-black/20">
                <button 
                    onClick={() => setType('video')}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${type === 'video' ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                >
                    <Video size={16} /> Video Consult
                </button>
                <button 
                    onClick={() => setType('in-person')}
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${type === 'in-person' ? 'bg-purple text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                >
                    <MapPin size={16} /> In-Person Visit
                </button>
            </GlassCard>

            {/* Date Selector */}
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                {dates.map(d => (
                    <button
                        key={d.iso}
                        onClick={() => { setSelectedDate(d.iso); setSelectedSlot(''); }}
                        className={`
                            min-w-[80px] p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-300
                            ${selectedDate === d.iso 
                                ? 'bg-white/10 border-teal text-white shadow-[0_0_15px_rgba(77,139,131,0.2)]' 
                                : 'bg-white/5 border-white/5 text-text-secondary hover:border-white/20 hover:bg-white/10'
                            }
                        `}
                    >
                        <span className="text-xs uppercase font-bold tracking-wider">{d.day}</span>
                        <span className="text-xl font-bold font-display">{d.date}</span>
                        <span className="text-xs opacity-60">{d.month}</span>
                    </button>
                ))}
            </div>

            {/* Time Slots */}
            <GlassCard>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-teal" /> Available Slots
                </h3>
                
                {loadingSlots ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 animate-pulse">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-10 bg-white/5 rounded-lg"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {slots.map((slot, i) => (
                            <button
                                key={i}
                                disabled={!slot.available}
                                onClick={() => setSelectedSlot(slot.time)}
                                className={`
                                    py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-200 relative
                                    ${!slot.available 
                                        ? 'bg-white/5 border-transparent text-text-secondary/30 cursor-not-allowed line-through decoration-white/10' 
                                        : selectedSlot === slot.time
                                            ? 'bg-teal border-teal text-white shadow-lg scale-105'
                                            : 'bg-transparent border-white/10 text-white hover:border-teal/50 hover:bg-teal/10'
                                    }
                                `}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                )}
                {slots.every(s => !s.available) && !loadingSlots && (
                    <div className="text-center py-8 text-text-secondary">
                        No slots available for this date.
                    </div>
                )}
            </GlassCard>

            {/* Summary & Confirm */}
            <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <p className="text-text-secondary text-sm">Total to pay</p>
                    <p className="text-3xl font-display font-bold text-white">${doctor?.consultationFee}</p>
                </div>
                <Button 
                    variant="primary" 
                    className="w-full md:w-auto px-12" 
                    disabled={!selectedSlot || submitting}
                    onClick={initiateBooking}
                    icon={submitting ? <Clock className="animate-spin" /> : <CheckCircle />}
                >
                    {submitting ? 'Confirming...' : 'Confirm Appointment'}
                </Button>
            </div>
        </div>
      </div>

      {/* Consent Modal */}
      <Modal 
          isOpen={isConsentOpen} 
          onClose={() => setIsConsentOpen(false)}
          title="Consent & Authorization"
      >
          <div className="space-y-6">
             <div className="p-4 bg-teal/5 border border-teal/20 rounded-lg">
                 <div className="flex items-center gap-3 mb-2">
                     <ShieldCheck className="text-teal" size={24} />
                     <h3 className="text-white font-bold">Telemedicine Consent</h3>
                 </div>
                 <p className="text-sm text-text-secondary leading-relaxed">
                     I hereby consent to engage in a telemedicine consultation with the selected provider through Wysh Care. 
                     I understand that:
                 </p>
                 <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-text-secondary">
                     <li>Video conferencing technology will be used.</li>
                     <li>There are potential risks to privacy, though Wysh Care uses blockchain-grade encryption.</li>
                     <li>The consultation is not for medical emergencies.</li>
                     <li>I have the right to withhold or withdraw consent at any time without affecting my right to future care.</li>
                 </ul>
             </div>
             
             <div className="p-4 bg-purple/5 border border-purple/20 rounded-lg">
                 <div className="flex items-center gap-3 mb-2">
                     <FileText className="text-purple" size={24} />
                     <h3 className="text-white font-bold">Privacy & Data Handling</h3>
                 </div>
                 <p className="text-sm text-text-secondary leading-relaxed">
                     By proceeding, you agree to Wysh Care's Terms of Service and Privacy Policy. Your health data will be processed to provide this service and may be anonymized for AI improvement.
                 </p>
             </div>

             <div className="pt-4 border-t border-white/10">
                 <Checkbox 
                    id="consent-check"
                    checked={hasConsented} 
                    onChange={setHasConsented}
                    label={
                        <span className="text-sm">
                            I have read, understood, and agree to the above terms and consent to the treatment.
                        </span>
                    }
                 />
             </div>

             <div className="flex justify-end gap-3">
                 <Button variant="outline" onClick={() => setIsConsentOpen(false)}>Cancel</Button>
                 <Button 
                    variant="primary" 
                    disabled={!hasConsented} 
                    onClick={confirmBooking}
                    icon={<CheckCircle size={18} />}
                 >
                     Confirm & Book
                 </Button>
             </div>
          </div>
      </Modal>
    </div>
  );
};