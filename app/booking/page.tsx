import { getStudios } from "@/lib/services/studios";
import BookingClient from "./BookingClient";

export const metadata = {
  title: "Book a Studio | SVARA STUDIO",
  description: "Complete your studio booking in just a few steps.",
};

export default async function BookingPage() {
  const studios = await getStudios();
  return <BookingClient studios={studios} />;
}
