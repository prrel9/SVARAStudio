"use client";

import { useState } from "react";
import { Calendar, Clock, CheckCircle2, Receipt, RefreshCw } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import BookingTrendChart from "@/components/admin/BookingTrendChart";
import RevenueTrendChart from "@/components/admin/RevenueTrendChart";
import StudioOccupancyChart from "@/components/admin/StudioOccupancyChart";
import StatusDistributionChart from "@/components/admin/StatusDistributionChart";
import RecentActivity from "@/components/admin/RecentActivity";
import { formatIDR } from "@/lib/data/schedule";
import type { AnalyticsDashboardData } from "@/lib/services/analytics";

interface AdminDashboardClientProps {
  initialData: AnalyticsDashboardData;
}

export default function AdminDashboardClient({ initialData }: AdminDashboardClientProps) {
  const [data, setData] = useState<AnalyticsDashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      if (res.ok) {
        const freshData: AnalyticsDashboardData = await res.json();
        setData(freshData);
      } else {
        // Fallback reload if API call fails
        window.location.reload();
      }
    } catch {
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

  const { stats, bookingTrend, revenueTrend, studioOccupancy, statusDistribution, recentActivity } = data;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-accent selection:text-background">
      {/* Header / Navigation */}
      <AdminHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <div className="rounded-2xl border border-border-custom bg-gradient-to-r from-surface via-bg-secondary to-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Studio Analytics & Performance Overview
            </h2>
            <p className="text-xs text-text-secondary">
              Real-time monitoring of studio bookings, payment verifications, revenue streams, and room usage.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-background transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 shadow-md shadow-accent/20"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* OVERVIEW STAT CARDS (4 cards grid) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
              Overview Metrics
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Bookings Today"
              value={stats.bookingsToday}
              subtitle="Scheduled for today"
              icon={<Calendar className="h-5 w-5" />}
              accentColor="purple"
            />

            <StatCard
              title="Pending Payments"
              value={stats.pendingPayments}
              subtitle="Awaiting admin review"
              icon={<Clock className="h-5 w-5" />}
              accentColor="amber"
            />

            <StatCard
              title="Confirmed Bookings"
              value={stats.confirmedBookings}
              subtitle="Verified & active"
              icon={<CheckCircle2 className="h-5 w-5" />}
              accentColor="green"
            />

            <StatCard
              title="Total Revenue"
              value={formatIDR(stats.totalRevenue)}
              subtitle="From verified bookings"
              icon={<Receipt className="h-5 w-5" />}
              accentColor="blue"
            />
          </div>
        </section>

        {/* CHARTS GRID */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
              Visual Analytics (Recharts)
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Booking Trend (Line Chart) */}
            <BookingTrendChart data={bookingTrend} />

            {/* 2. Revenue Trend (Area Chart) */}
            <RevenueTrendChart data={revenueTrend} />

            {/* 3. Studio Occupancy (Donut Chart) */}
            <StudioOccupancyChart data={studioOccupancy} />

            {/* 4. Booking Status Distribution (Bar Chart) */}
            <StatusDistributionChart data={statusDistribution} />
          </div>
        </section>

        {/* RECENT ACTIVITY SECTION */}
        <section>
          <RecentActivity items={recentActivity} />
        </section>
      </main>
    </div>
  );
}
