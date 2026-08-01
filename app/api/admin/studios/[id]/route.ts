import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  updateStudioAdmin,
  deleteStudioAdmin,
  toggleStudioActiveAdmin,
} from "@/lib/services/studiosAdmin";
import type { StudioFormData } from "@/lib/services/studiosAdmin";

export const dynamic = "force-dynamic";

function revalidateStudioPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/studios");
  revalidatePath("/schedule");
  revalidatePath("/booking");

  if (slug) revalidatePath(`/studios/${slug}`);
}

// PUT — update full studio
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<StudioFormData> = await req.json();
    const studio = await updateStudioAdmin(id, body);
    revalidateStudioPages(studio.slug);
    return NextResponse.json(studio);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update studio";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH — toggle is_active
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { is_active } = await req.json();
    await toggleStudioActiveAdmin(id, Boolean(is_active));
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle studio status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — remove studio
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteStudioAdmin(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete studio";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
