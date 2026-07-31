import { getAllStudiosAdmin } from "@/lib/services/studiosAdmin";
import { getAllEquipmentsAdmin } from "@/lib/services/equipmentsAdmin";
import EquipmentsAdminClient from "./EquipmentsAdminClient";

export const metadata = {
  title: "Equipment Management | SVARA STUDIO Admin",
  description: "Admin — manage gear inventory and studio assignments.",
};

export const dynamic = "force-dynamic";

export default async function AdminEquipmentsPage() {
  const [equipments, studios] = await Promise.all([
    getAllEquipmentsAdmin(),
    getAllStudiosAdmin(),
  ]);

  return <EquipmentsAdminClient initialEquipments={equipments} studios={studios} />;
}
