
// src/lib/api/material-api.ts
// Note: In a real application, these functions would make actual HTTP requests to a backend API.
// For this prototype, they return mocked data or simulate API behavior.

export interface MaterialConfig {
  id: string;
  name: string;
  unit: string;
  averagePrice: number;
  requiresDescription: boolean;
  category: string;
}

export interface CalculatedItem {
  id: string; // Client-generated UUID for list key
  materialId: string; // ID from MaterialConfig
  materialName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  description?: string;
  totalCost: number;
}

export interface EstimationToSave {
  name: string;
  items: CalculatedItem[];
  total: number;
}

export interface SavedEstimation extends EstimationToSave {
  id: string; // Server-generated ID
  createdAt: string; // ISO date string
}

// Mock data store (simulating a backend database for the session)
let mockSavedEstimations: SavedEstimation[] = [
  {
    id: 'est-mock-1',
    name: 'تقدير أولي لفيلا الأحلام',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    items: [
      { id: crypto.randomUUID(), materialId: 'mat-concrete', materialName: 'باطون', quantity: 20, unit: 'م³', pricePerUnit: 360, totalCost: 7200 },
      { id: crypto.randomUUID(), materialId: 'mat-steel', materialName: 'حديد', quantity: 1500, unit: 'كغم', pricePerUnit: 3.6, totalCost: 5400 },
    ],
    total: 12600,
  }
];

const mockMaterials: MaterialConfig[] = [
  { id: 'mat-concrete', name: 'باطون', unit: 'م³', averagePrice: 350, requiresDescription: false, category: 'أساسي' },
  { id: 'mat-steel', name: 'حديد تسليح', unit: 'كغم', averagePrice: 3.5, requiresDescription: false, category: 'أساسي' },
  { id: 'mat-cement', name: 'اسمنت', unit: 'كيس (50كغم)', averagePrice: 25, requiresDescription: false, category: 'أساسي' },
  { id: 'mat-sand', name: 'رمل بناء', unit: 'م³', averagePrice: 80, requiresDescription: true, category: 'أساسي' },
  { id: 'mat-gravel', name: 'حصمة (زلط)', unit: 'م³', averagePrice: 70, requiresDescription: true, category: 'أساسي' },
  { id: 'mat-blocks', name: 'طوب بناء', unit: 'طوبة', averagePrice: 2.5, requiresDescription: true, category: 'أساسي' },
  { id: 'mat-wire', name: 'سلك تربيط خرسانة', unit: 'لفة (كغم)', averagePrice: 100, requiresDescription: true, category: 'تشطيبات' },
  { id: 'mat-nails', name: 'مسامير متنوعة', unit: 'كغم', averagePrice: 12, requiresDescription: true, category: 'تشطيبات' },
  { id: 'mat-discs', name: 'صواني قص حديد/حجر', unit: 'قرص', averagePrice: 18, requiresDescription: true, category: 'أدوات' },
  { id: 'mat-wood', name: 'خشب طوبار', unit: 'م³', averagePrice: 1200, requiresDescription: true, category: 'مؤقت' },
  { id: 'mat-pipes-pvc', name: 'مواسير PVC (صرف)', unit: 'متر طولي', averagePrice: 15, requiresDescription: true, category: 'تمديدات' },
  { id: 'mat-pipes-ppr', name: 'مواسير PPR (مياه)', unit: 'متر طولي', averagePrice: 20, requiresDescription: true, category: 'تمديدات' },
  { id: 'mat-paint', name: 'دهان', unit: 'جالون', averagePrice: 90, requiresDescription: true, category: 'تشطيبات' },
  { id: 'mat-tiles', name: 'بلاط أرضيات/جدران', unit: 'م²', averagePrice: 50, requiresDescription: true, category: 'تشطيبات' },
];


export const getMaterials = async (): Promise<MaterialConfig[]> => {
  console.log("[material-api.ts] getMaterials: Fetching materials (mocked).");
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return Promise.resolve([...mockMaterials]);
};

export const saveEstimation = async (estimation: EstimationToSave): Promise<SavedEstimation> => {
  console.log("[material-api.ts] saveEstimation: Saving estimation (mocked):", estimation.name);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newSavedEstimation: SavedEstimation = {
    id: `est-mock-${crypto.randomUUID().substring(0,8)}`,
    createdAt: new Date().toISOString(),
    ...estimation,
  };
  
  mockSavedEstimations.unshift(newSavedEstimation); // Add to the beginning of the array
  console.log("[material-api.ts] Current MOCK saved estimations:", mockSavedEstimations);
  return Promise.resolve(newSavedEstimation);
};

export const getSavedEstimations = async (): Promise<SavedEstimation[]> => {
  console.log("[material-api.ts] getSavedEstimations: Fetching saved estimations (mocked).");
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  return Promise.resolve([...mockSavedEstimations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
};

// It's good practice to export types if they are used by components consuming these API functions.
// Already done by referencing them in PriceForm.tsx.

    