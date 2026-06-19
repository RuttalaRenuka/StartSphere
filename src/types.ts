export interface Equipment {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  contact: string;
}

export interface BusinessPlan {
  id: string;
  category: string;
  description?: string;
  budget: {
    basic: number;
    standard: number;
    premium: number;
  };
  equipment: Equipment[];
  suppliers: Supplier[];
  checklist: string[];
  marketingPlan?: string[];
  riskAnalysis?: string[];
  growthOpportunities?: string[];
  revenuePrediction?: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    expectedProfit: number;
    breakEvenMonths: number;
    growthPotential: string;
  };
}
