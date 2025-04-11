// lib/costCalculator.ts

import { PrismaClient } from "./generated/prisma";
import { ProjectInput, ProjectCost, CostBreakdown } from "@/types";

const prisma = new PrismaClient();

// Constants for cost calculation
const LABOR_RATES = {
  skilled: 45.0, // per hour
  unskilled: 25.0, // per hour
};

const OVERHEAD_RATE = 0.15; // 15% of (materials + labor)

export async function calculateProjectCost(
  projectInput: ProjectInput
): Promise<ProjectCost> {
  // 1. Calculate material costs
  const materialCosts = await Promise.all(
    projectInput.materials.map(async (materialInput) => {
      console.log("Searching for material ID:", materialInput.materialId);
      const material = await prisma.material.findUnique({
        where: { id: materialInput.materialId },
      });

      if (!material) {
        throw new Error(
          `Material with ID ${materialInput.materialId} not found`
        );
      }

      const totalCost = material.rate * materialInput.quantity;

      return {
        materialId: material.id,
        materialName: material.name,
        quantity: materialInput.quantity,
        unitCost: material.rate,
        totalCost,
      };
    })
  );

  // 2. Calculate total material cost
  const totalMaterialCost = materialCosts.reduce(
    (total, material) => total + material.totalCost,
    0
  );

  // 3. Calculate labor cost
  const laborCost =
    projectInput.laborHours.skilled * LABOR_RATES.skilled +
    projectInput.laborHours.unskilled * LABOR_RATES.unskilled;

  // 4. Calculate overhead cost
  const overheadCost = (totalMaterialCost + laborCost) * OVERHEAD_RATE;

  // 5. Calculate total cost
  const totalCost = totalMaterialCost + laborCost + overheadCost;

  // 6. Prepare cost breakdown
  const costBreakdown: CostBreakdown = {
    materials: totalMaterialCost,
    labor: laborCost,
    overhead: overheadCost,
  };

  return {
    totalCost,
    costBreakdown,
    materialCosts,
  };
}
