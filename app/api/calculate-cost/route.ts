import { NextResponse } from "next/server";
import { calculateProjectCost } from "@/lib/costCalculator";
import { ProjectInput } from "@/types";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const projectInput: ProjectInput = await request.json();

    // Validate input (basic validation)
    if (
      !projectInput.name ||
      !projectInput.dimensions ||
      !projectInput.materials ||
      !projectInput.laborHours
    ) {
      return NextResponse.json(
        { error: "Missing required project information" },
        { status: 400 }
      );
    }

    // Calculate the project cost
    const costResult = await calculateProjectCost(projectInput);

    // Save project to database
    const savedProject = await prisma.project.create({
      data: {
        name: projectInput.name,
        dimensions: projectInput.dimensions,
        materials: projectInput.materials,
        laborHours: projectInput.laborHours,
        totalCost: costResult.totalCost,
        costBreakdown: costResult.costBreakdown,
      },
    });

    return NextResponse.json({
      projectId: savedProject.id,
      ...costResult,
    });
  } catch (error) {
    console.error("Error calculating project cost:", error);
    return NextResponse.json(
      { error: "Failed to calculate project cost" },
      { status: 500 }
    );
  }
}
