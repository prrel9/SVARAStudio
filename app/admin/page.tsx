import { getAnalyticsDashboardData } from "@/lib/services/analytics";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata = {
  title: "Analytics Dashboard | SVARA STUDIO Admin",
  description: "Admin — production analytics dashboard for studio bookings and revenues.",
};

// Disable caching so admin always sees real-time data
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getAnalyticsDashboardData();
  return <AdminDashboardClient initialData={data} />;
}
