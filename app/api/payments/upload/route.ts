import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createPayment } from "@/lib/services/payments";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bookingId = formData.get("bookingId") as string | null;

    if (!file || !bookingId) {
      return NextResponse.json({ error: "Missing file or bookingId" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const supabase = createAdminSupabaseClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${bookingId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(path);

    const proofUrl = urlData.publicUrl;

    // Create payment record
    const payment = await createPayment(bookingId, proofUrl);

    return NextResponse.json({ paymentId: payment.id, proofUrl });
  } catch (err) {
    console.error("POST /api/payments/upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
