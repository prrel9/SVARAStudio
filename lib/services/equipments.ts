import { createClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Equipment } from "@/lib/types";

export async function getEquipments(): Promise<Equipment[]> {
  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createAdminSupabaseClient()
    : await createClient();

  const [{ data, error }, { data: relationData, error: relationError }] = await Promise.all([
    supabase.from("equipments").select("*"),
    supabase.from("studio_equipments").select("equipment_id, studios ( name )"),
  ]);

  if (error || !data) {
    console.error("Error fetching equipments:", {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
    });
    return [];
  }

  if (relationError && relationError.code !== "42P01") {
    console.error("Error fetching equipment relations:", {
      message: relationError.message,
      details: relationError.details,
      hint: relationError.hint,
      code: relationError.code,
    });
  }

  const relationRows = (relationData || []) as Array<{
    equipment_id?: string;
    studios?: { name?: string } | null;
  }>;

  return data.map((item: Record<string, unknown>) => {
    const studioEquipments = relationRows.filter((row) => String(row.equipment_id || "") === String(item.id || ""));
    const availableIn = Array.from(
      new Set(
        studioEquipments
          .map((se) => se.studios?.name)
          .filter(Boolean)
      )
    ) as string[];

    return {
      id: String(item.id),
      category: String(item.category || item.type || ""),
      brand: String(item.brand || item.manufacturer || ""),
      model: String(item.model || item.name || ""),
      shortDescription: String(item.description || item.details || ""),
      availableIn,
      image: String(item.image_url || item.image || item.thumbnail || ""),
    };
  });
}
