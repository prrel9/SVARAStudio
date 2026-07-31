import { NextRequest, NextResponse } from "next/server";
import { rejectPayment } from "@/lib/services/payments";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const verifiedBy = String(body.verifiedBy ?? "admin");
    const reason = String(body.reason ?? "");

    if (!reason.trim()) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
    }

    await rejectPayment(id, verifiedBy, reason.trim());

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/payments/[id]/reject error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
