import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface AdminEquipment {
  id: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  imageUrl: string;
  studioIds: string[];
  availableIn: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentFormData {
  category: string;
  brand: string;
  model: string;
  description: string;
  image_url: string;
  studio_ids: string[];
}

export interface EquipmentStudioOption {
  id: string;
  name: string;
}

type UnknownRecord = Record<string, unknown>;

export async function getAllEquipmentsAdmin(): Promise<AdminEquipment[]> {
  const supabase = createAdminSupabaseClient();

  const [{ data: equipmentRows, error: equipmentError }, { data: relationRows, error: relationError }] =
    await Promise.all([
      supabase.from("equipments").select("*").order("category", { ascending: true }).order("brand", { ascending: true }),
      supabase.from("studio_equipments").select("equipment_id, studio_id, studios ( id, name )"),
    ]);

  if (equipmentError || !equipmentRows) {
    console.error("getAllEquipmentsAdmin equipment error:", equipmentError);
    return [];
  }

  if (relationError && relationError.code !== "42P01") {
    console.error("getAllEquipmentsAdmin relation error:", relationError);
  }

  const relations = (relationRows || []) as Array<{
    equipment_id?: string;
    studio_id?: string;
    studios?: { id?: string; name?: string } | null;
  }>;

  return equipmentRows.map((row: UnknownRecord) => {
    const equipmentId = String(row.id);
    const linkedRows = relations.filter((item) => String(item.equipment_id || "") === equipmentId);
    const studioIds = linkedRows.map((item) => String(item.studio_id || "")).filter(Boolean);
    const availableIn = Array.from(
      new Set(linkedRows.map((item) => item.studios?.name).filter((name): name is string => Boolean(name)))
    );

    return {
      id: equipmentId,
      category: pickString(row, ["category", "type"], ""),
      brand: pickString(row, ["brand", "manufacturer"], ""),
      model: pickString(row, ["model", "name"], ""),
      description: pickString(row, ["description", "details", "short_description"], ""),
      imageUrl: pickString(row, ["image_url", "image", "thumbnail"], ""),
      studioIds,
      availableIn,
      createdAt: pickString(row, ["created_at"], ""),
      updatedAt: pickString(row, ["updated_at"], ""),
    };
  });
}

export async function getEquipmentStudiosAdmin(): Promise<EquipmentStudioOption[]> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("studios").select("id, name").order("name", { ascending: true });

  if (error || !data) {
    console.error("getEquipmentStudiosAdmin error:", error);
    return [];
  }

  return data.map((row: UnknownRecord) => ({
    id: String(row.id),
    name: String(row.name || ""),
  }));
}

export async function createEquipmentAdmin(form: EquipmentFormData): Promise<AdminEquipment> {
  const supabase = createAdminSupabaseClient();
  const payload: Record<string, unknown> = {
    category: form.category,
    brand: form.brand,
    model: form.model,
    description: form.description,
    image_url: form.image_url,
  };

  for (let attempt = 0; attempt < 6; attempt++) {
    const { data, error } = await supabase.from("equipments").insert(payload).select().single();

    if (!error && data) {
      const created = await syncEquipmentStudios(String(data.id), form.studio_ids);
      return {
        ...mapEquipmentRow(data),
        studioIds: created.studioIds,
        availableIn: created.availableIn,
      };
    }

    if (error) {
      const stripped = stripMissingColumn(payload, error.message);
      if (stripped) continue;
      console.error("createEquipmentAdmin error:", error);
      throw new Error(error.message || "Failed to create equipment");
    }
  }

  throw new Error("Failed to create equipment after payload sanitization");
}

export async function updateEquipmentAdmin(
  id: string,
  form: Partial<EquipmentFormData>
): Promise<AdminEquipment> {
  const supabase = createAdminSupabaseClient();
  const payload: Record<string, unknown> = {};

  if (form.category !== undefined) payload.category = form.category;
  if (form.brand !== undefined) payload.brand = form.brand;
  if (form.model !== undefined) payload.model = form.model;
  if (form.description !== undefined) payload.description = form.description;
  if (form.image_url !== undefined) payload.image_url = form.image_url;

  for (let attempt = 0; attempt < 6; attempt++) {
    const shouldUpdateEquipment = Object.keys(payload).length > 0;

    if (shouldUpdateEquipment) {
      const { data, error } = await supabase
        .from("equipments")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const sync = form.studio_ids ? await syncEquipmentStudios(id, form.studio_ids) : await getEquipmentStudiosSnapshot(id);
        return {
          ...mapEquipmentRow(data),
          studioIds: sync.studioIds,
          availableIn: sync.availableIn,
        };
      }

      if (error) {
        const stripped = stripMissingColumn(payload, error.message);
        if (stripped) continue;
        console.error("updateEquipmentAdmin error:", error);
        throw new Error(error.message || "Failed to update equipment");
      }
    }

    if (form.studio_ids) {
      const sync = await syncEquipmentStudios(id, form.studio_ids);
      const current = await getEquipmentById(id);
      if (current) {
        return { ...current, studioIds: sync.studioIds, availableIn: sync.availableIn };
      }
    }

    const current = await getEquipmentById(id);
    if (current) return current;
  }

  throw new Error("Failed to update equipment");
}

export async function deleteEquipmentAdmin(id: string): Promise<void> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("studio_equipments").delete().eq("equipment_id", id);
  if (error && error.code !== "42P01") {
    console.error("deleteEquipmentAdmin relation error:", error);
  }

  const { error: equipmentError } = await supabase.from("equipments").delete().eq("id", id);
  if (equipmentError) {
    console.error("deleteEquipmentAdmin error:", equipmentError);
    throw new Error(equipmentError.message);
  }
}

export async function getEquipmentById(id: string): Promise<AdminEquipment | null> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("equipments").select("*").eq("id", id).maybeSingle();
  if (error || !data) {
    if (error) console.error("getEquipmentById error:", error);
    return null;
  }

  const snapshot = await getEquipmentStudiosSnapshot(id);
  return {
    ...mapEquipmentRow(data),
    studioIds: snapshot.studioIds,
    availableIn: snapshot.availableIn,
  };
}

async function syncEquipmentStudios(equipmentId: string, studioIds: string[]) {
  const supabase = createAdminSupabaseClient();

  const { error: deleteError } = await supabase.from("studio_equipments").delete().eq("equipment_id", equipmentId);
  if (deleteError && deleteError.code !== "42P01") {
    console.error("syncEquipmentStudios delete error:", deleteError);
  }

  const uniqueIds = Array.from(new Set(studioIds.map((id) => String(id)).filter(Boolean)));
  if (uniqueIds.length === 0) {
    return { studioIds: [], availableIn: [] };
  }

  const rows = uniqueIds.map((studioId) => ({
    equipment_id: equipmentId,
    studio_id: studioId,
  }));

  const { error: insertError } = await supabase.from("studio_equipments").insert(rows);
  if (insertError) {
    console.error("syncEquipmentStudios insert error:", insertError);
    throw new Error(insertError.message || "Failed to save studio assignments");
  }

  return getEquipmentStudiosSnapshot(equipmentId);
}

async function getEquipmentStudiosSnapshot(equipmentId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("studio_equipments")
    .select("studio_id, studios ( id, name )")
    .eq("equipment_id", equipmentId);

  if (error && error.code !== "42P01") {
    console.error("getEquipmentStudiosSnapshot error:", error);
  }

  const rows = (data || []) as Array<{ studio_id?: string; studios?: { name?: string } | null }>;
  return {
    studioIds: rows.map((row) => String(row.studio_id || "")).filter(Boolean),
    availableIn: Array.from(
      new Set(rows.map((row) => row.studios?.name).filter((name): name is string => Boolean(name)))
    ),
  };
}

function mapEquipmentRow(row: UnknownRecord): AdminEquipment {
  return {
    id: String(row.id),
    category: pickString(row, ["category", "type"], ""),
    brand: pickString(row, ["brand", "manufacturer"], ""),
    model: pickString(row, ["model", "name"], ""),
    description: pickString(row, ["description", "details", "short_description"], ""),
    imageUrl: pickString(row, ["image_url", "image", "thumbnail"], ""),
    studioIds: [],
    availableIn: [],
    createdAt: pickString(row, ["created_at"], ""),
    updatedAt: pickString(row, ["updated_at"], ""),
  };
}

function pickString(row: UnknownRecord, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return fallback;
}

function stripMissingColumn(payload: Record<string, unknown>, message?: string): boolean {
  const match = message?.match(/Could not find the '([^']+)' column/i);
  if (match && match[1] && match[1] in payload) {
    delete payload[match[1]];
    return true;
  }
  return false;
}
