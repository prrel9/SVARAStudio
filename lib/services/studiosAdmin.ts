import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminStudio {
  id: string;
  slug: string;
  name: string;
  description: string;
  pricePerHour: number;
  capacity: number;
  roomSize: string;
  equipmentLevel: string;
  thumbnail: string;
  badge: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudioFormData {
  name: string;
  slug: string;
  description: string;
  price_per_hour: number;
  capacity: number;
  room_size: string;
  equipment_level: string;
  thumbnail: string;
  badge: string;
  is_active: boolean;
}

const THUMBNAIL_COLUMNS = ["thumbnail", "thumbnail_url", "image_url", "image"] as const;

function moveThumbnailToFallbackColumn(payload: Record<string, unknown>, missingColumn: string): boolean {
  const currentIndex = THUMBNAIL_COLUMNS.indexOf(
    missingColumn as (typeof THUMBNAIL_COLUMNS)[number]
  );
  const thumbnail = payload[missingColumn];
  const nextColumn = THUMBNAIL_COLUMNS[currentIndex + 1];

  if (currentIndex === -1 || typeof thumbnail !== "string" || !nextColumn) {
    return false;
  }

  delete payload[missingColumn];
  payload[nextColumn] = thumbnail;
  return true;
}

// ─── Fetch All Studios (Admin) ────────────────────────────────────────────────

export async function getAllStudiosAdmin(): Promise<AdminStudio[]> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("studios")
    .select("*")
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("getAllStudiosAdmin error:", error);
    return [];
  }

  return data.map(mapAdminStudio);
}

// ─── Create Studio ────────────────────────────────────────────────────────────

export async function createStudioAdmin(form: StudioFormData): Promise<AdminStudio> {
  const supabase = createAdminSupabaseClient();
  const payload: Record<string, unknown> = { ...form };

  for (let attempt = 0; attempt < 6; attempt++) {
    const { data, error } = await supabase
      .from("studios")
      .insert(payload)
      .select()
      .single();

    if (!error && data) {
      return mapAdminStudio(data);
    }

    if (error) {
      // Auto-strip missing column from payload if schema cache is missing it in DB
      const match = error.message?.match(/Could not find the '([^']+)' column/i);
      if (match && match[1] && match[1] in payload) {
        if (moveThumbnailToFallbackColumn(payload, match[1])) {
          continue;
        }
        console.warn(`Stripping missing DB column '${match[1]}' from insert payload`);
        delete payload[match[1]];
        continue;
      }
      console.error("createStudioAdmin error:", error);
      throw new Error(error.message || "Failed to create studio");
    }
  }

  throw new Error("Failed to insert studio after payload sanitization");
}

// ─── Update Studio ────────────────────────────────────────────────────────────

export async function updateStudioAdmin(
  id: string,
  form: Partial<StudioFormData>
): Promise<AdminStudio> {
  const supabase = createAdminSupabaseClient();
  const payload: Record<string, unknown> = { ...form };

  for (let attempt = 0; attempt < 6; attempt++) {
    if (Object.keys(payload).length === 0) {
      break;
    }

    const { data, error } = await supabase
      .from("studios")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      return mapAdminStudio(data);
    }

    if (error) {
      // Auto-strip missing column from payload if schema cache is missing it in DB
      const match = error.message?.match(/Could not find the '([^']+)' column/i);
      if (match && match[1] && match[1] in payload) {
        if (moveThumbnailToFallbackColumn(payload, match[1])) {
          continue;
        }
        console.warn(`Stripping missing DB column '${match[1]}' from update payload`);
        delete payload[match[1]];
        continue;
      }
      console.error("updateStudioAdmin error:", error);
      throw new Error(error.message || "Failed to update studio");
    }
  }

  // Fetch updated studio as fallback if payload became empty or single return missed
  const { data: fresh } = await supabase.from("studios").select("*").eq("id", id).single();
  return mapAdminStudio(fresh || { id, ...form });
}

// ─── Delete Studio ────────────────────────────────────────────────────────────

export async function deleteStudioAdmin(id: string): Promise<void> {
  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.from("studios").delete().eq("id", id);

  if (error) {
    console.error("deleteStudioAdmin error:", error);
    throw new Error(error.message);
  }
}

// ─── Toggle Active ────────────────────────────────────────────────────────────

export async function toggleStudioActiveAdmin(
  id: string,
  isActive: boolean
): Promise<void> {
  const supabase = createAdminSupabaseClient();

  // 1. Try updating is_active first
  let { error } = await supabase
    .from("studios")
    .update({ is_active: isActive })
    .eq("id", id);

  // 2. Fallback: Try updating is_available if is_active column doesn't exist
  if (error && error.message?.includes("is_active")) {
    const res = await supabase
      .from("studios")
      .update({ is_available: isActive })
      .eq("id", id);
    error = res.error;
  }

  if (error) {
    console.error("toggleStudioActiveAdmin error:", error);
    throw new Error(error.message);
  }
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAdminStudio(row: any): AdminStudio {
  if (!row) {
    return {
      id: "",
      slug: "",
      name: "",
      description: "",
      pricePerHour: 0,
      capacity: 0,
      roomSize: "",
      equipmentLevel: "Standard",
      thumbnail: "",
      badge: "",
      isActive: true,
      createdAt: "",
      updatedAt: "",
    };
  }

  return {
    id: String(row.id),
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    description: String(row.description || ""),
    pricePerHour: Number(row.price_per_hour || 0),
    capacity: Number(row.capacity || 0),
    roomSize: String(row.room_size || ""),
    equipmentLevel: String(row.equipment_level || "Standard"),
    thumbnail: String(row.thumbnail || row.thumbnail_url || row.image_url || row.image || ""),
    badge: String(row.badge || ""),
    isActive: row.is_active !== undefined ? Boolean(row.is_active) : row.is_available !== undefined ? Boolean(row.is_available) : true,
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}
