
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subSpecialty?: string;
  image: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  location: string;
  about: string;
  education: string[];
  languages: string[];
  availability: {
    nextSlot: string;
    isOnline: boolean;
  };
  tags: string[];
  consultationFee: number;
}

export type Specialty = 'All' | 'Cardiology' | 'Neurology' | 'Pediatrics' | 'Dermatology' | 'Orthopedics' | 'General Medicine';
