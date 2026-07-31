import { NextRequest, NextResponse } from "next/server";
import { getAllStudiosAdmin, createStudioAdmin } from "@/lib/services/studiosAdmin";
import type { StudioFormData } from "@/lib/services/studiosAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const studios = await getAllStudiosAdmin();
    return NextResponse.json(studios);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch studios";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: StudioFormData = await req.json();
    const studio = await createStudioAdmin(body);
    return NextResponse.json(studio, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create studio";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
