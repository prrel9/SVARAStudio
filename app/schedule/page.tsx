import { getStudios } from "@/lib/services/studios";
import ScheduleClient from "./ScheduleClient";

export const metadata = {
  title: "Jadwal | SVARA STUDIO",
  description: "Lihat slot latihan yang tersedia dan pesan Studio Anda.",
};

export default async function SchedulePage() {
  const studios = await getStudios();
  return <ScheduleClient studios={studios} />;
}
