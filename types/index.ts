// This file contains type definitions for a construction cost estimation application.
// It includes types for project inputs, cost breakdowns, materials, and labor hours.

export type Dimensions = {
  length: number;
  width: number;
  height: number;
  unit: "meters" | "feet";
};

export type MaterialInput = {
  materialId: string;
  quantity: number;
};

export type LaborHours = {
  skilled: number;
  unskilled: number;
};

export type ProjectInput = {
  name: string;
  dimensions: Dimensions;
  materials: MaterialInput[];
  laborHours: LaborHours;
};

export type CostBreakdown = {
  materials: number;
  labor: number;
  overhead: number;
};

export type ProjectCost = {
  totalCost: number;
  costBreakdown: CostBreakdown;
  materialCosts: {
    materialId: string;
    materialName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
};

export type Material = {
  id: string;
  name: string;
  category: string;
  rate: number;
  unit: string;
  description?: string;
};

export type MaterialAlternative = {
  original: Material;
  alternative: Material;
  originalQuantity: number;
  originalCost: number;
  alternativeCost: number;
  potentialSavings: number;
};
