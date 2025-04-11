import { PrismaClient } from "./generated/prisma";
import { Material as PrismaMaterial, MaterialAlternative } from "@/types";

const prisma = new PrismaClient();

type Material = Omit<PrismaMaterial, "description"> & {
  description?: string | null;
};

export async function getAllMaterials(): Promise<Material[]> {
  return prisma.material.findMany();
}

export async function getMaterialById(id: string): Promise<Material | null> {
  return prisma.material.findUnique({
    where: { id },
  });
}

export async function getMaterialsByCategory(
  category: string
): Promise<Material[]> {
  return prisma.material.findMany({
    where: { category },
  });
}

export async function findMaterialAlternatives(
  materialId: string,
  quantity: number
): Promise<MaterialAlternative[]> {
  const originalMaterial = await prisma.material.findUnique({
    where: { id: materialId },
  });

  if (!originalMaterial) {
    return [];
  }

  // Find alternatives in the same category with a lower rate
  const alternatives = await prisma.material.findMany({
    where: {
      category: originalMaterial.category,
      id: { not: materialId },
      rate: { lt: originalMaterial.rate },
    },
    orderBy: {
      rate: "asc",
    },
    take: 2,
  });

  const originalCost = originalMaterial.rate * quantity;

  return alternatives.map((alternative) => ({
    original: {
      ...originalMaterial,
      description: originalMaterial.description ?? undefined,
    },
    alternative: {
      ...alternative,
      description: alternative.description ?? undefined,
    },
    originalQuantity: quantity,
    originalCost,
    alternativeCost: alternative.rate * quantity,
    potentialSavings: originalCost - alternative.rate * quantity,
  }));
}
