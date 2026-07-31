import { NextRequest, NextResponse } from "next/server";
import {
  createEquipmentAdmin,
  getAllEquipmentsAdmin,
} from "@/lib/services/equipmentsAdmin";
import type { EquipmentFormData } from "@/lib/services/equipmentsAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const equipments = await getAllEquipmentsAdmin();
    return NextResponse.json(equipments);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch equipments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: EquipmentFormData = await req.json();
    const equipment = await createEquipmentAdmin({
      ...body,
      studio_ids: Array.isArray(body.studio_ids) ? body.studio_ids : [],
    });
    return NextResponse.json(equipment, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create equipment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
