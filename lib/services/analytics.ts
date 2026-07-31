import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface DashboardStats {
  bookingsToday: number;
  pendingPayments: number;
  confirmedBookings: number;
  totalRevenue: number;
}

export interface BookingTrendData {
  date: string;
  displayDate: string;
  total: number;
  confirmed: number;
}

export interface RevenueTrendData {
  month: string;
  yearMonth: string;
  revenue: number;
}

export interface StudioOccupancyData {
  name: string;
  studioId: string;
  count: number;
  percentage: number;
  color: string;
}

export interface StatusDistributionData {
  status: string;
  count: number;
  fill: string;
}

export interface RecentActivityItem {
  id: string;
  type: "booking_created" | "payment_submitted" | "payment_verified" | "payment_rejected";
  bookingCode: string;
  customerName: string;
  studioId: string;
  amount: number;
  status: string;
  timestamp: string;
  details: string;
}

export interface AnalyticsDashboardData {
  stats: DashboardStats;
  bookingTrend: BookingTrendData[];
  revenueTrend: RevenueTrendData[];
  studioOccupancy: StudioOccupancyData[];
  statusDistribution: StatusDistributionData[];
  recentActivity: RecentActivityItem[];
}

const STUDIO_COLORS = ["#6c63ff", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"];

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getMonthName(year: number, monthIndex: number): string {
  const d = new Date(year, monthIndex, 1);
  return d.toLocaleDateString("en-US", { month: "short" });
}

export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  const supabase = createAdminSupabaseClient();

  // 1. Fetch Bookings, Payments, Studios concurrently
  const [bookingsRes, paymentsRes, studiosRes] = await Promise.all([
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("*, bookings(*)").order("created_at", { ascending: false }),
    supabase.from("studios").select("id, name, slug"),
  ]);

  const bookings = bookingsRes.data || [];
  const payments = paymentsRes.data || [];
  const studios = studiosRes.data || [];

  // Create studio map
  const studioNameMap = new Map<string, string>();
  studios.forEach((s) => {
    studioNameMap.set(String(s.id), s.name);
    if (s.slug) studioNameMap.set(s.slug, s.name);
  });

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // 2. Overview Stats
  const bookingsToday = bookings.filter(
    (b) => b.booking_date === todayStr || (b.created_at && b.created_at.startsWith(todayStr))
  ).length;

  const pendingPayments = payments.filter((p) => p.payment_status === "waiting_verification").length +
    bookings.filter((b) => b.booking_status === "pending_payment").length;

  const confirmedBookings = bookings.filter((b) => b.booking_status === "confirmed").length;

  const totalRevenue = bookings
    .filter((b) => b.booking_status === "confirmed")
    .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

  // 3. Booking Trend (Last 7 Days)
  const last7Days: BookingTrendData[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    const dayBookings = bookings.filter(
      (b) => b.booking_date === dateStr || (b.created_at && b.created_at.startsWith(dateStr))
    );
    const totalCount = dayBookings.length;
    const confirmedCount = dayBookings.filter((b) => b.booking_status === "confirmed").length;

    last7Days.push({
      date: dateStr,
      displayDate: formatShortDate(dateStr),
      total: totalCount,
      confirmed: confirmedCount,
    });
  }

  // 4. Revenue Trend (Last 6 Months)
  const last6Months: RevenueTrendData[] = [];
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - i, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

    const monthRevenue = bookings
      .filter(
        (b) =>
          b.booking_status === "confirmed" &&
          (b.booking_date?.startsWith(monthPrefix) || b.created_at?.startsWith(monthPrefix))
      )
      .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

    last6Months.push({
      month: `${getMonthName(year, month)} ${String(year).slice(2)}`,
      yearMonth: monthPrefix,
      revenue: monthRevenue,
    });
  }

  // 5. Studio Occupancy (Donut Chart)
  const studioCounts = new Map<string, number>();
  bookings.forEach((b) => {
    const sKey = String(b.studio_id || "unknown");
    studioCounts.set(sKey, (studioCounts.get(sKey) || 0) + 1);
  });

  const totalBookingsCount = bookings.length || 1;
  const studioOccupancyList: StudioOccupancyData[] = [];

  if (studioCounts.size > 0) {
    let index = 0;
    studioCounts.forEach((count, studioId) => {
      const name = studioNameMap.get(studioId) || `Studio ${studioId}`;
      const percentage = Math.round((count / totalBookingsCount) * 100);
      studioOccupancyList.push({
        name,
        studioId,
        count,
        percentage,
        color: STUDIO_COLORS[index % STUDIO_COLORS.length],
      });
      index++;
    });
  } else {
    // Graceful default list if DB has no bookings
    const defaultStudios = studios.length > 0 ? studios : [{ id: "1", name: "Studio A" }, { id: "2", name: "Studio B" }];
    defaultStudios.forEach((s, idx) => {
      studioOccupancyList.push({
        name: s.name || `Studio ${s.id}`,
        studioId: String(s.id),
        count: 0,
        percentage: 0,
        color: STUDIO_COLORS[idx % STUDIO_COLORS.length],
      });
    });
  }

  // 6. Booking Status Distribution (Bar Chart)
  const statusCounts = {
    confirmed: bookings.filter((b) => b.booking_status === "confirmed").length,
    waiting_verification: bookings.filter(
      (b) => b.booking_status === "waiting_verification"
    ).length,
    pending_payment: bookings.filter((b) => b.booking_status === "pending_payment").length,
    rejected_expired: bookings.filter((b) =>
      ["rejected", "expired", "cancelled"].includes(b.booking_status)
    ).length,
  };

  const statusDistributionList: StatusDistributionData[] = [
    { status: "Confirmed", count: statusCounts.confirmed, fill: "#22c55e" },
    { status: "Waiting Verification", count: statusCounts.waiting_verification, fill: "#f59e0b" },
    { status: "Pending Payment", count: statusCounts.pending_payment, fill: "#3b82f6" },
    { status: "Rejected/Expired", count: statusCounts.rejected_expired, fill: "#ef4444" },
  ];

  // 7. Recent Activity
  const activityList: RecentActivityItem[] = [];

  // Add payments to activity
  payments.forEach((p) => {
    const b = p.bookings;
    const customer = b ? b.full_name || b.customer_name || "Customer" : "Customer";
    const code = b ? b.booking_code : "N/A";
    const amount = b ? Number(b.total_price || 0) : 0;
    const studioId = b ? String(b.studio_id) : "";

    if (p.payment_status === "waiting_verification") {
      activityList.push({
        id: `p-sub-${p.id}`,
        type: "payment_submitted",
        bookingCode: code,
        customerName: customer,
        studioId,
        amount,
        status: "Waiting Verification",
        timestamp: p.created_at,
        details: "Submitted payment proof",
      });
    } else if (p.payment_status === "verified") {
      activityList.push({
        id: `p-ver-${p.id}`,
        type: "payment_verified",
        bookingCode: code,
        customerName: customer,
        studioId,
        amount,
        status: "Verified",
        timestamp: p.verified_at || p.updated_at || p.created_at,
        details: `Payment approved by ${p.verified_by || "Admin"}`,
      });
    } else if (p.payment_status === "rejected") {
      activityList.push({
        id: `p-rej-${p.id}`,
        type: "payment_rejected",
        bookingCode: code,
        customerName: customer,
        studioId,
        amount,
        status: "Rejected",
        timestamp: p.verified_at || p.updated_at || p.created_at,
        details: p.rejection_reason ? `Rejected: ${p.rejection_reason}` : "Payment rejected",
      });
    }
  });

  // Add bookings to activity
  bookings.forEach((b) => {
    activityList.push({
      id: `b-crt-${b.id}`,
      type: "booking_created",
      bookingCode: b.booking_code,
      customerName: b.full_name || b.customer_name || "Customer",
      studioId: String(b.studio_id),
      amount: Number(b.total_price || 0),
      status: b.booking_status,
      timestamp: b.created_at,
      details: `Created booking for ${b.booking_date} (${b.start_time} - ${b.end_time})`,
    });
  });

  // Sort activity by timestamp descending and take top 10
  activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    stats: {
      bookingsToday,
      pendingPayments,
      confirmedBookings,
      totalRevenue,
    },
    bookingTrend: last7Days,
    revenueTrend: last6Months,
    studioOccupancy: studioOccupancyList,
    statusDistribution: statusDistributionList,
    recentActivity: activityList.slice(0, 10),
  };
}
