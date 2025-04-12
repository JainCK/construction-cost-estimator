import { NextResponse } from "next/server";
import { findMaterialAlternatives } from "@/lib/materials";

export async function GET(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    // Destructure materialId from params
    const { materialId } = params;

    // Parse query parameters
    const searchParams = new URL(request.url).searchParams;
    const quantity = parseInt(searchParams.get("quantity") || "1");

    // Validate quantity
    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid quantity parameter" },
        { status: 400 }
      );
    }

    // Fetch material alternatives
    const alternatives = await findMaterialAlternatives(materialId, quantity);

    // Return the alternatives as JSON
    return NextResponse.json(alternatives);
  } catch (error) {
    console.error("Error finding material alternatives:", error);
    return NextResponse.json(
      { error: "Failed to find material alternatives" },
      { status: 500 }
    );
  }
}
