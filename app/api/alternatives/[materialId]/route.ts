import { NextResponse } from "next/server";
import { findMaterialAlternatives } from "@/lib/materials";

export async function GET(
  request: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const { materialId } = params;
    const searchParams = new URL(request.url).searchParams;
    const quantity = parseInt(searchParams.get("quantity") || "1");

    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid quantity parameter" },
        { status: 400 }
      );
    }

    const alternatives = await findMaterialAlternatives(materialId, quantity);
    return NextResponse.json(alternatives);
  } catch (error) {
    console.error("Error finding material alternatives:", error);
    return NextResponse.json(
      { error: "Failed to find material alternatives" },
      { status: 500 }
    );
  }
}
