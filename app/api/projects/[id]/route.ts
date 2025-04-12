import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { calculateProjectCost } from "@/lib/costCalculator";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // We need to recalculate the materialCosts since it's not stored directly
    // Reusing our calculation function ensures consistency
    const projectInput = {
      name: project.name,
      dimensions: project.dimensions as any,
      materials: project.materials as any,
      laborHours: project.laborHours as any,
    };

    const costResult = await calculateProjectCost(projectInput);

    return NextResponse.json({
      id: project.id,
      name: project.name,
      totalCost: project.totalCost,
      costBreakdown: project.costBreakdown,
      materialCosts: costResult.materialCosts,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
