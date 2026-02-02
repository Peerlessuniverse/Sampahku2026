export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface WasteAnalysis {
  isRecyclable: boolean;
  materialType: string;
  disposalInstructions: string;
  energyPotential: string;
  transformationRoute: 'organic' | 'inorganic' | 'b3' | 'residu';
  confidence: number;
}
