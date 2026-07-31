import { NextRequest, NextResponse } from "next/server";
import { approvePayment } from "@/lib/services/payments";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const verifiedBy = String(body.verifiedBy ?? "admin");

    await approvePayment(id, verifiedBy);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/payments/[id]/approve error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
