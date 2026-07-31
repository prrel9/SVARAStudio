import { NextRequest, NextResponse } from "next/server";
import {
  deleteEquipmentAdmin,
  updateEquipmentAdmin,
} from "@/lib/services/equipmentsAdmin";
import type { EquipmentFormData } from "@/lib/services/equipmentsAdmin";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<EquipmentFormData> = await req.json();
    const equipment = await updateEquipmentAdmin(id, body);
    return NextResponse.json(equipment);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update equipment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteEquipmentAdmin(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete equipment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
