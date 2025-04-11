import { NextResponse } from "next/server";
import { getAllMaterials } from "@/lib/materials";

export async function GET() {
  try {
    const materials = await getAllMaterials();
    return NextResponse.json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch materials" },
      { status: 500 }
    );
  }
}
