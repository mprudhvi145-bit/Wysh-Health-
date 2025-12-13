
export interface NavItem {
  label: string;
  path: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  available: boolean;
  image?: string;
}

export interface MockDataPoint {
  name: string;
  value: number;
  value2?: number;
}