import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppSettings {
  company_name: string;
  logo_url: string;
  hero_title: string;
  hero_subtitle: string;
  phone: string;
  whatsapp: string;
  address: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  company_name: "SVARA STUDIO",
  logo_url: "",
  hero_title: "Where Your Sound Comes to Life",
  hero_subtitle:
    "Professional rehearsal studios, premium equipment, and an inspiring atmosphere.",
  phone: "",
  whatsapp: "",
  address: "",
  bank_name: "",
  account_number: "",
  account_holder: "",
};

const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof AppSettings)[];

type SettingsRow = Record<string, unknown>;

function toSettings(row: SettingsRow | null): AppSettings {
  const settings = { ...DEFAULT_SETTINGS };

  if (!row) return settings;

  for (const key of SETTING_KEYS) {
    if (key in row && row[key] != null) {
      settings[key] = String(row[key]);
    }
  }

  return settings;
}

// ─── Load Settings ────────────────────────────────────────────────────────────

export async function getAppSettings(): Promise<AppSettings> {
  const supabase = createAdminSupabaseClient();

  // The production table is a single settings record. Select all its fields so
  // this also works with databases created before the key/value migration.
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getAppSettings error:", JSON.stringify(error), error?.message);
    return { ...DEFAULT_SETTINGS };
  }

  return toSettings(data as SettingsRow | null);
}

// ─── Save Settings ────────────────────────────────────────────────────────────

export async function saveAppSettings(settings: Partial<AppSettings>): Promise<void> {
  const supabase = createAdminSupabaseClient();

  const updates = Object.fromEntries(
    Object.entries(settings)
      .filter(([key]) => SETTING_KEYS.includes(key as keyof AppSettings))
      .map(([key, value]) => [key, value ?? ""])
  );

  if (Object.keys(updates).length === 0) return;

  const { data: existing, error: fetchError } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error("saveAppSettings read error:", fetchError);
    throw new Error(fetchError.message);
  }

  const payload = Object.fromEntries(
    Object.entries(updates).filter(([key]) => !existing || key in existing)
  );

  if (Object.keys(payload).length === 0) {
    throw new Error("The settings table does not contain supported settings columns");
  }

  const query = existing
    ? supabase.from("settings").update(payload).eq("id", existing.id)
    : supabase.from("settings").insert(payload);

  const { error } = await query;

  if (error) {
    console.error("saveAppSettings error:", error);
    throw new Error(error.message);
  }
}
