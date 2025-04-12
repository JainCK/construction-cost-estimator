import { NextRequest, NextResponse } from "next/server";
import { findMaterialAlternatives } from "@/lib/materials";

interface Params {
  materialId: string;
}

interface RouteContext {
  params: Params;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const materialId = context.params.materialId;
    const searchParams = request.nextUrl.searchParams;
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
