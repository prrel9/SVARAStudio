import { getStudios } from "@/lib/services/studios";
import ScheduleClient from "./ScheduleClient";

export const metadata = {
  title: "Schedule | SVARA STUDIO",
  description: "View available rehearsal slots and book your session.",
};

export default async function SchedulePage() {
  const studios = await getStudios();
  return <ScheduleClient studios={studios} />;
}
