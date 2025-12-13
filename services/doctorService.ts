
import { Doctor, Specialty } from '../types/doctor';

const MOCK_DOCTORS_DATA: Doctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    subSpecialty: 'Interventional Cardiology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 124,
    experienceYears: 12,
    location: 'Wysh General, Silicon Valley',
    about: 'Dr. Chen is a leading cardiologist specializing in minimally invasive procedures. She pioneered the use of AI in predicting atrial fibrillation patterns.',
    education: ['MD, Stanford University', 'Residency, Johns Hopkins Hospital', 'Fellowship, Cleveland Clinic'],
    languages: ['English', 'Mandarin', 'Spanish'],
    availability: {
      nextSlot: 'Today, 2:00 PM',
      isOnline: true
    },
    tags: ['Heart Failure', 'Angioplasty', 'Preventive'],
    consultationFee: 250
  },
  {
    id: 'doc_2',
    name: 'Dr. James Wilson',
    specialty: 'Neurology',
    subSpecialty: 'Neuro-Oncology',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 98,
    experienceYears: 15,
    location: 'Wysh Neuro Institute',
    about: 'Expert in treating complex brain tumors and neurological disorders. Dr. Wilson leads our Neuro-Holography research division.',
    education: ['MD, Harvard Medical School', 'PhD, Neuroscience, MIT'],
    languages: ['English', 'German'],
    availability: {
      nextSlot: 'Tomorrow, 10:00 AM',
      isOnline: false
    },
    tags: ['Brain Tumors', 'Epilepsy', 'Migraine'],
    consultationFee: 300
  },
  {
    id: 'doc_3',
    name: 'Dr. Emily Carter',
    specialty: 'Pediatrics',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&auto=format&fit=crop',
    rating: 5.0,
    reviewCount: 210,
    experienceYears: 8,
    location: 'Wysh Childrens Center',
    about: 'Compassionate pediatric care with a focus on developmental health and preventative medicine for children of all ages.',
    education: ['MD, UCSF School of Medicine'],
    languages: ['English', 'French'],
    availability: {
      nextSlot: 'Today, 4:30 PM',
      isOnline: true
    },
    tags: ['Newborn Care', 'Vaccinations', 'Adolescent Health'],
    consultationFee: 150
  },
  {
    id: 'doc_4',
    name: 'Dr. Raj Patel',
    specialty: 'Orthopedics',
    subSpecialty: 'Sports Medicine',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 85,
    experienceYears: 10,
    location: 'Wysh Sports Clinic',
    about: 'Specializing in arthroscopic surgery and sports-related injuries. Official team physician for the Valley Titans.',
    education: ['MD, Baylor College of Medicine', 'Fellowship, Andrews Sports Medicine'],
    languages: ['English', 'Hindi', 'Gujarati'],
    availability: {
      nextSlot: 'Fri, 9:00 AM',
      isOnline: true
    },
    tags: ['ACL Repair', 'Joint Replacement', 'Fractures'],
    consultationFee: 220
  },
  {
    id: 'doc_5',
    name: 'Dr. Elena Rodriguez',
    specialty: 'Dermatology',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 340,
    experienceYears: 14,
    location: 'Wysh Aesthetics',
    about: 'Merging clinical dermatology with aesthetic precision. Dr. Rodriguez is an expert in early skin cancer detection.',
    education: ['MD, Yale School of Medicine'],
    languages: ['English', 'Spanish', 'Portuguese'],
    availability: {
      nextSlot: 'Next Mon, 11:00 AM',
      isOnline: false
    },
    tags: ['Acne', 'Skin Cancer', 'Cosmetic'],
    consultationFee: 200
  },
  {
    id: 'doc_6',
    name: 'Dr. Michael Chang',
    specialty: 'General Medicine',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 156,
    experienceYears: 20,
    location: 'Wysh Central Clinic',
    about: 'A dedicated family physician focusing on holistic health and chronic disease management through lifestyle changes.',
    education: ['MD, University of Washington'],
    languages: ['English', 'Cantonese'],
    availability: {
      nextSlot: 'Today, 1:15 PM',
      isOnline: true
    },
    tags: ['Diabetes', 'Hypertension', 'Wellness'],
    consultationFee: 120
  }
];

// Mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const doctorService = {
  getAllDoctors: async (specialty?: Specialty, search?: string): Promise<Doctor[]> => {
    await delay(600);
    let doctors = [...MOCK_DOCTORS_DATA];

    if (specialty && specialty !== 'All') {
      doctors = doctors.filter(d => d.specialty === specialty);
    }

    if (search) {
      const q = search.toLowerCase();
      doctors = doctors.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.specialty.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return doctors;
  },

  getDoctorById: async (id: string): Promise<Doctor | undefined> => {
    await delay(400);
    return MOCK_DOCTORS_DATA.find(d => d.id === id);
  },

  updateStatus: async (id: string, isOnline: boolean): Promise<void> => {
    await delay(300);
    // In a real app, this would call the API.
    // For mock, we can just log it as the static data resets on reload anyway unless we persisted it.
    console.log(`Doctor ${id} is now ${isOnline ? 'online' : 'offline'}`);
  }
};
