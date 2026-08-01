import { getStudios } from "@/lib/services/studios";
import BookingClient from "./BookingClient";
import { Suspense } from "react";

export const metadata = {
  title: "Pesan Studio | SVARA STUDIO",
  description: "Selesaikan pemesanan studio Anda dalam beberapa langkah.",
};

export default async function BookingPage() {
  const studios = await getStudios();
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <BookingClient studios={studios} />
    </Suspense>
  );
}
