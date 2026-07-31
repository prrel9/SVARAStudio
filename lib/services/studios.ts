import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Studio } from "@/lib/types";

export async function getStudios(): Promise<Studio[]> {
  const supabase = await getStudioSupabaseClient();
  const { data, error } = await supabase.from("studios").select("*");

  if (error || !data) {
    console.error("Error fetching studios:", {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
    });
    return [];
  }

  return data.map(mapStudioData).sort((a, b) => a.pricePerHour - b.pricePerHour);
}

export async function getStudioBySlug(slug: string): Promise<Studio | null> {
  const supabase = await getStudioSupabaseClient();
  const { data, error } = await supabase
    .from("studios")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching studio by slug:", {
      slug,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
    });
    return null;
  }

  return mapStudioData(data);
}

export async function getStudioSlugs(): Promise<{ slug: string }[]> {
  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createAdminSupabaseClient()
    : createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
  
  const { data, error } = await supabase.from("studios").select("slug");
  
  if (error || !data) {
    console.error("Error fetching studio slugs:", error);
    return [];
  }
  
  return data;
}

const DEFAULT_STUDIO_IMAGES: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
  "2": "https://images.unsplash.com/photo-1621784562807-cb6a34ca7342?w=600&q=80",
  "3": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80",
  "4": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&q=80",
  "5": "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=80",
  "6": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
};

function extractThumbnail(data: Record<string, unknown>): string {
  const candidates = [data.thumbnail, data.thumbnail_url, data.image_url, data.image];
  for (const item of candidates) {
    if (typeof item === "string" && item.trim() !== "" && item !== "[object Object]") {
      return item.trim();
    }
    if (
      item &&
      typeof item === "object" &&
      "src" in item &&
      typeof (item as { src?: string }).src === "string"
    ) {
      const src = (item as { src: string }).src;
      if (src.trim() !== "" && src !== "[object Object]") return src.trim();
    }
  }
  const idStr = String(data.id || "");
  const slugStr = String(data.slug || "");
  return (
    DEFAULT_STUDIO_IMAGES[idStr] ||
    DEFAULT_STUDIO_IMAGES[slugStr] ||
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80"
  );
}

function getStudioSupabaseClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createAdminSupabaseClient();
  }

  return createClient();
}

function pickString(data: Record<string, unknown>, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return fallback;
}

function pickNumber(data: Record<string, unknown>, keys: string[], fallback = 0): number {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }

  return fallback;
}

function pickBoolean(data: Record<string, unknown>, keys: string[], fallback = true): boolean {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes", "available", "active"].includes(normalized)) {
        return true;
      }
      if (["false", "0", "no", "booked", "inactive"].includes(normalized)) {
        return false;
      }
    }
    if (typeof value === "number") {
      return value !== 0;
    }
  }

  return fallback;
}

function mapStudioData(data: Record<string, unknown>): Studio {
  const desc = pickString(data, ["description", "short_description", "details", "content"]);
  const slug = pickString(data, ["slug", "studio_slug"], String(data.id || ""));
  const name = pickString(data, ["name", "title", "studio_name"], `Studio ${slug || String(data.id || "")}`);
  const pricePerHour = pickNumber(data, ["price_per_hour", "pricePerHour", "hourly_rate", "rate"], 0);
  const capacity = pickNumber(data, ["capacity", "max_capacity", "maxPeople"], 0);
  const roomSize = pickString(data, ["room_size", "roomSize", "size"], "");
  const equipmentLevel = pickString(data, ["equipment_level", "equipmentLevel", "level"], "Standard") as Studio["equipmentLevel"];
  const badge = pickString(data, ["badge", "label"], "");
  return {
    id: String(data.id),
    slug,
    name,
    shortDescription: desc.length > 100 ? desc.substring(0, 100) + "..." : desc,
    description: desc,
    pricePerHour,
    capacity,
    roomSize,
    equipmentLevel,
    thumbnail: extractThumbnail(data),
    badge,
    features: ["Air Conditioning", "WiFi"], // Default features if not present in DB
    isAvailable: pickBoolean(data, ["is_active", "isAvailable", "is_available"], true),
  };
}
