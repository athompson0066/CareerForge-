export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Listing {
  id: string;
  address: string;
  price: string;
  specs: string; // e.g., "4 Bed | 3 Bath | 2500 sqft"
  description: string;
  image?: string;
  status: 'For Sale' | 'Sold' | 'Pending';
}

export interface Testimonial {
  id: string;
  client: string;
  text: string;
  rating: number;
}

export interface PortfolioItem {
  id: string;
  name: string;
  sector: string; // e.g. "Tech", "Energy"
  value: string; // e.g. "$50M AUM" or "3x Return"
  description: string;
}

export interface WeddingService {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string; // Bullet points
}

export interface WeddingGalleryItem {
  id: string;
  image: string;
  tag: string; // e.g., "Ceremony", "Reception"
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    jobTitle: string;
    website: string;
    summary: string;
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  socials: SocialLink[];
  // Template specific data
  listings?: Listing[];
  testimonials?: Testimonial[];
  portfolio?: PortfolioItem[];
  weddingServices?: WeddingService[];
  weddingGallery?: WeddingGalleryItem[];
}

export type ThemeType = 'modern' | 'minimalist' | 'creative' | 'realtor' | 'finance' | 'wedding';

export interface AIResponse {
  text?: string;
  items?: string[];
  error?: string;
}