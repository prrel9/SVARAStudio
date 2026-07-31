import { getAllStudiosAdmin } from "@/lib/services/studiosAdmin";
import StudiosAdminClient from "./StudiosAdminClient";

export const metadata = {
  title: "Studios Management | SVARA STUDIO Admin",
  description: "Admin — create, edit, activate/deactivate and delete studio rooms.",
};

export const dynamic = "force-dynamic";

export default async function AdminStudiosPage() {
  const studios = await getAllStudiosAdmin();
  return <StudiosAdminClient initialStudios={studios} />;
}
