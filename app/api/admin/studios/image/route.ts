import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const BUCKET = "studio-images";
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File thumbnail wajib dipilih" }, { status: 400 });
    }
    if (!(file.type in EXTENSIONS)) {
      return NextResponse.json({ error: "Thumbnail harus berformat JPG, PNG, atau WebP" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Ukuran thumbnail maksimal 3MB" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const { error: bucketError } = await supabase.storage.getBucket(BUCKET);
    if (bucketError) {
      const { error: createBucketError } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: String(MAX_FILE_SIZE),
        allowedMimeTypes: Object.keys(EXTENSIONS),
      });
      if (createBucketError && !/already exists/i.test(createBucketError.message)) {
        throw createBucketError;
      }
    }

    const path = `thumbnails/studio-${Date.now()}.${EXTENSIONS[file.type]}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("POST /api/admin/studios/image error:", error);
    return NextResponse.json({ error: "Gagal mengunggah thumbnail" }, { status: 500 });
  }
}
