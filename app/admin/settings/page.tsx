import { getAppSettings } from "@/lib/services/appSettings";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "App Settings | SVARA STUDIO Admin",
  description: "Admin — manage company info, contact, and payment settings.",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAppSettings();
  return <SettingsClient initial={settings} />;
}
