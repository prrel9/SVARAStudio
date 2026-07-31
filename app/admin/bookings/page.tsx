import { getAllBookingsAdmin } from "@/lib/services/bookings";
import BookingsAdminClient from "./BookingsAdminClient";

export const metadata = {
  title: "Bookings Management | SVARA STUDIO Admin",
  description: "Admin — search, filter, view details and manage booking statuses.",
};

// Disable caching so admin always sees fresh data
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await getAllBookingsAdmin();
  return <BookingsAdminClient initialBookings={bookings} />;
}
