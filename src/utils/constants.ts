
import { NavItem, Product, TeamMember, Doctor } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Ecosystem', path: '/ecosystem' },
  { label: 'Products', path: '/products' },
  { label: 'Pricing', path: '/pricing' }, // New GTM Page
  { label: 'Doctors', path: '/doctors' },
  { label: 'Hospital OS', path: '/dashboard' },
  { label: 'Investors', path: '/investors' },
  { label: 'Contact', path: '/contact' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'telemed',
    title: 'Telemedicine 2.0',
    description: 'Holographic consultation interfaces with real-time vital tracking.',
    icon: 'Video',
    features: ['4K Video', 'Remote Vitals', 'AI Transcription']
  },
  {
    id: 'ehr',
    title: 'Wysh EHR',
    description: 'Unified patient timeline secured by blockchain technology.',
    icon: 'Database',
    features: ['HL7/FHIR Ready', 'Timeline View', 'Lab Integrations']
  },
  {
    id: 'ai',
    title: 'Medical Coding AI',
    description: 'Autonomous ICD-10/CPT coding pipeline.',
    icon: 'Cpu',
    features: ['Auto-Coding', 'Audit Trail', '99% Accuracy']
  }
];

export const TEAM: TeamMember[] = [
  { name: 'Dr. Shruti', role: 'Chief Medical Officer', image: 'https://picsum.photos/200/200?random=1' },
  { name: 'Prudhvi Vimarshak', role: 'CTO / Visionary', image: 'https://picsum.photos/200/200?random=2' },
  { name: 'Nikhil Chitneni', role: 'Head of AI', image: 'https://picsum.photos/200/200?random=3' },
  { name: 'Jyothsna', role: 'Operations Lead', image: 'https://picsum.photos/200/200?random=4' },
  { name: 'Harshith', role: 'Product Architect', image: 'https://picsum.photos/200/200?random=5' },
];

export const MOCK_DOCTORS: Doctor[] = [
  { 
    id: '1', 
    name: 'Dr. Sarah Chen', 
    specialty: 'Cardiology', 
    rating: 4.9, 
    available: true,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop'
  },
  { 
    id: '2', 
    name: 'Dr. James Wilson', 
    specialty: 'Neurology', 
    rating: 4.8, 
    available: false,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop'
  },
  { 
    id: '3', 
    name: 'Dr. Emily Carter', 
    specialty: 'Pediatrics', 
    rating: 5.0, 
    available: true,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&auto=format&fit=crop'
  },
];

export const MOCK_PATIENTS = [
  { id: 'p1', name: 'Alex Doe', age: 34, lastVisit: '2024-10-12', condition: 'Arrhythmia', status: 'Stable' },
  { id: 'p2', name: 'Maria Garcia', age: 29, lastVisit: '2024-10-15', condition: 'Pregnancy', status: 'Active' },
  { id: 'p3', name: 'John Smith', age: 45, lastVisit: '2024-10-10', condition: 'Hypertension', status: 'Critical' },
  { id: 'p4', name: 'Linda Kim', age: 52, lastVisit: '2024-09-28', condition: 'Diabetes T2', status: 'Stable' },
];
