"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Receipt,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatIDR } from "@/lib/data/schedule";
import type { Booking, BookingStatus } from "@/lib/types";

interface BookingsAdminClientProps {
  initialBookings: Booking[];
}

function formatWhatsApp(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  return cleaned;
}

function buildWhatsAppUrl(phone: string, bookingCode: string, name: string, date: string, time: string): string {
  const wa = formatWhatsApp(phone);
  const msg = encodeURIComponent(
    `Halo ${name}! 🎵\n\nMengenai booking studio Anda:\n\n📌 Booking Code: *${bookingCode}*\n📅 Tanggal: ${date}\n⏰ Jam: ${time}\n\nAda yang bisa kami bantu seputar sesi studio Anda?\n\nTerima kasih 🙏\nSvara Studio`
  );
  return `https://wa.me/${wa}?text=${msg}`;
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; border: string; text: string; dot: string }
> = {
  confirmed: {
    label: "Confirmed",
    bg: "bg-success-custom/10",
    border: "border-success-custom/30",
    text: "text-success-custom",
    dot: "bg-success-custom",
  },
  waiting_verification: {
    label: "Waiting Verification",
    bg: "bg-warning-custom/10",
    border: "border-warning-custom/30",
    text: "text-warning-custom",
    dot: "bg-warning-custom animate-pulse",
  },
  pending_payment: {
    label: "Pending Payment",
    bg: "bg-info-custom/10",
    border: "border-info-custom/30",
    text: "text-info-custom",
    dot: "bg-info-custom",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-error-custom/10",
    border: "border-error-custom/30",
    text: "text-error-custom",
    dot: "bg-error-custom",
  },
  expired: {
    label: "Expired",
    bg: "bg-surface-elevated",
    border: "border-border-custom",
    text: "text-text-secondary",
    dot: "bg-text-secondary",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-surface-elevated",
    border: "border-border-custom",
    text: "text-text-secondary",
    dot: "bg-text-secondary",
  },
};

export default function BookingsAdminClient({ initialBookings }: BookingsAdminClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      if (res.ok) {
        const fresh: Booking[] = await res.json();
        setBookings(fresh);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    setIsUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const j = await res.json();
        showToast(j.error ?? "Failed to update status", "error");
        return;
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: newStatus } : b))
      );

      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, bookingStatus: newStatus } : null));
      }

      showToast(`Booking status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`, "success");
    } catch {
      showToast("Network error updating status", "error");
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Filtered Bookings list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search term check
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        b.fullName.toLowerCase().includes(query) ||
        b.whatsapp.includes(query) ||
        b.bookingCode.toLowerCase().includes(query);

      // Status check
      const matchesStatus = statusFilter === "all" || b.bookingStatus === statusFilter;

      // Date check
      const matchesDate = !dateFilter || b.bookingDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchQuery, statusFilter, dateFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-background">
      <AdminHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title & Stats Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Booking Management
            </h1>
            <p className="text-xs text-text-secondary">
              Search, filter, manage statuses, and view complete customer booking details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-border-custom bg-surface px-4 py-2 text-xs font-mono text-text-secondary">
              Total: <strong className="text-white">{filteredBookings.length}</strong> / {bookings.length}
            </span>
          </div>
        </div>

        {/* Controls Bar: Search & Filters */}
        <div className="rounded-2xl border border-border-custom bg-surface p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, or booking code..."
              className="w-full rounded-xl border border-border-custom bg-bg-secondary pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-xl border border-border-custom bg-bg-secondary pl-3.5 pr-8 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="waiting_verification">Waiting Verification</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="rounded-xl border border-border-custom bg-bg-secondary px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter("")}
                  className="ml-1.5 text-xs text-accent hover:underline font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BOOKINGS CONTENT */}
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border-custom bg-surface p-6 text-center space-y-3">
            <Filter className="h-10 w-10 text-text-secondary" />
            <h3 className="text-base font-bold text-white">No bookings match your filters</h3>
            <p className="text-xs text-text-secondary max-w-sm">
              Try adjusting your search terms, status selector, or clear date filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setDateFilter("");
              }}
              className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-background hover:bg-accent-hover transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW (hidden on mobile) */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-border-custom bg-surface shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-bg-secondary border-b border-border-custom text-text-secondary uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Booking Code</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Studio / Date</th>
                    <th className="px-6 py-4">Time Slot</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/50">
                  {filteredBookings.map((b) => {
                    const cfg = STATUS_CONFIG[b.bookingStatus] || STATUS_CONFIG.pending_payment;
                    const waUrl = buildWhatsAppUrl(
                      b.whatsapp,
                      b.bookingCode,
                      b.fullName,
                      b.bookingDate,
                      `${b.startTime} - ${b.endTime}`
                    );

                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-bg-secondary/40 transition-colors"
                      >
                        {/* Booking Code */}
                        <td className="px-6 py-4 font-mono font-extrabold text-white tracking-wider">
                          {b.bookingCode}
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{b.fullName}</p>
                          <p className="text-text-secondary text-[11px] font-mono">{b.whatsapp}</p>
                        </td>

                        {/* Studio / Date */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-accent">Studio {b.studioId}</p>
                          <p className="text-text-secondary text-[11px]">{b.bookingDate}</p>
                        </td>

                        {/* Time Slot */}
                        <td className="px-6 py-4 font-mono text-white">
                          {b.startTime} – {b.endTime}
                          <span className="block text-[10px] text-text-secondary">
                            ({b.durationHours} hrs)
                          </span>
                        </td>

                        {/* Total Price */}
                        <td className="px-6 py-4 font-mono font-bold text-white">
                          {formatIDR(b.totalPrice)}
                        </td>

                        {/* Status Change Selector */}
                        <td className="px-6 py-4">
                          <div className="relative inline-block">
                            <select
                              value={b.bookingStatus}
                              disabled={isUpdatingId === b.id}
                              onChange={(e) =>
                                handleStatusChange(b.id, e.target.value as BookingStatus)
                              }
                              className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer appearance-none pr-6 focus:outline-none transition-all ${cfg.bg} ${cfg.border} ${cfg.text}`}
                            >
                              <option value="confirmed" className="bg-surface text-white">
                                Confirmed
                              </option>
                              <option value="waiting_verification" className="bg-surface text-white">
                                Waiting Verification
                              </option>
                              <option value="pending_payment" className="bg-surface text-white">
                                Pending Payment
                              </option>
                              <option value="rejected" className="bg-surface text-white">
                                Rejected
                              </option>
                              <option value="expired" className="bg-surface text-white">
                                Expired
                              </option>
                              <option value="cancelled" className="bg-surface text-white">
                                Cancelled
                              </option>
                            </select>
                            <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none ${cfg.text}`} />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Button */}
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-success-custom/30 bg-success-custom/10 p-2 text-success-custom hover:bg-success-custom/20 transition-all"
                              title="Open WhatsApp chat"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>

                            {/* View Detail Button */}
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="rounded-lg border border-border-custom bg-surface-elevated p-2 text-text-secondary hover:text-white hover:border-accent/40 transition-all"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE STACKED CARDS VIEW (visible on small screens) */}
            <div className="block md:hidden space-y-4">
              {filteredBookings.map((b) => {
                const cfg = STATUS_CONFIG[b.bookingStatus] || STATUS_CONFIG.pending_payment;
                const waUrl = buildWhatsAppUrl(
                  b.whatsapp,
                  b.bookingCode,
                  b.fullName,
                  b.bookingDate,
                  `${b.startTime} - ${b.endTime}`
                );

                return (
                  <article
                    key={b.id}
                    className="rounded-2xl border border-border-custom bg-surface p-5 space-y-4 shadow-lg"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border-custom pb-3">
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                          Booking Code
                        </span>
                        <p className="text-lg font-mono font-extrabold text-white">{b.bookingCode}</p>
                      </div>

                      {/* Status Selector */}
                      <select
                        value={b.bookingStatus}
                        disabled={isUpdatingId === b.id}
                        onChange={(e) =>
                          handleStatusChange(b.id, e.target.value as BookingStatus)
                        }
                        className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider focus:outline-none ${cfg.bg} ${cfg.border} ${cfg.text}`}
                      >
                        <option value="confirmed" className="bg-surface text-white">Confirmed</option>
                        <option value="waiting_verification" className="bg-surface text-white">Waiting Verification</option>
                        <option value="pending_payment" className="bg-surface text-white">Pending Payment</option>
                        <option value="rejected" className="bg-surface text-white">Rejected</option>
                        <option value="expired" className="bg-surface text-white">Expired</option>
                        <option value="cancelled" className="bg-surface text-white">Cancelled</option>
                      </select>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[10px] text-text-secondary uppercase">Customer</p>
                        <p className="font-bold text-white">{b.fullName}</p>
                        <p className="text-[11px] font-mono text-text-secondary">{b.whatsapp}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-text-secondary uppercase">Session</p>
                        <p className="font-bold text-accent">Studio {b.studioId}</p>
                        <p className="text-[11px] text-white">{b.bookingDate}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-text-secondary uppercase">Time</p>
                        <p className="font-mono text-white">
                          {b.startTime} – {b.endTime}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-text-secondary uppercase">Total Price</p>
                        <p className="font-mono font-bold text-white">{formatIDR(b.totalPrice)}</p>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex gap-2 pt-2 border-t border-border-custom/50">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-success-custom/40 bg-success-custom/10 text-success-custom text-xs font-bold py-2 hover:bg-success-custom/20 transition-all"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </a>

                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border-custom bg-bg-secondary text-white text-xs font-bold py-2 hover:bg-surface-elevated transition-all"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Details</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* BOOKING DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border-custom bg-surface p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border-custom pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  Booking Detail
                </span>
                <h2 className="text-2xl font-mono font-extrabold text-white tracking-wider">
                  {selectedBooking.bookingCode}
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-2 text-text-secondary hover:text-white hover:bg-bg-secondary transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between rounded-2xl bg-bg-secondary p-4 border border-border-custom">
              <div className="space-y-0.5">
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                  Current Status
                </p>
                <p
                  className={`text-sm font-bold uppercase tracking-wider ${
                    STATUS_CONFIG[selectedBooking.bookingStatus]?.text || "text-white"
                  }`}
                >
                  {STATUS_CONFIG[selectedBooking.bookingStatus]?.label || selectedBooking.bookingStatus}
                </p>
              </div>

              {/* Status Change Dropdown inside Modal */}
              <div className="relative">
                <select
                  value={selectedBooking.bookingStatus}
                  disabled={isUpdatingId === selectedBooking.id}
                  onChange={(e) =>
                    handleStatusChange(selectedBooking.id, e.target.value as BookingStatus)
                  }
                  className="rounded-xl border border-border-custom bg-surface px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                >
                  <option value="confirmed">Set Confirmed</option>
                  <option value="waiting_verification">Set Waiting Verification</option>
                  <option value="pending_payment">Set Pending Payment</option>
                  <option value="rejected">Set Rejected</option>
                  <option value="expired">Set Expired</option>
                  <option value="cancelled">Set Cancelled</option>
                </select>
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3 rounded-2xl bg-bg-secondary/50 p-4 border border-border-custom/50">
                <h4 className="text-[10px] font-bold text-accent uppercase tracking-wider">
                  Customer Info
                </h4>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-white font-semibold">
                    <User className="h-4 w-4 text-text-secondary shrink-0" />
                    <span>{selectedBooking.fullName}</span>
                  </p>
                  <p className="flex items-center gap-2 font-mono text-white">
                    <Phone className="h-4 w-4 text-text-secondary shrink-0" />
                    <span>{selectedBooking.whatsapp}</span>
                  </p>
                  {selectedBooking.email && (
                    <p className="text-text-secondary truncate pl-6">
                      {selectedBooking.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-bg-secondary/50 p-4 border border-border-custom/50">
                <h4 className="text-[10px] font-bold text-accent uppercase tracking-wider">
                  Session Info
                </h4>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-white font-semibold">
                    <Calendar className="h-4 w-4 text-text-secondary shrink-0" />
                    <span>Studio {selectedBooking.studioId} — {selectedBooking.bookingDate}</span>
                  </p>
                  <p className="flex items-center gap-2 font-mono text-white">
                    <Clock className="h-4 w-4 text-text-secondary shrink-0" />
                    <span>{selectedBooking.startTime} – {selectedBooking.endTime} ({selectedBooking.durationHours}h)</span>
                  </p>
                  <p className="flex items-center gap-2 font-mono text-white font-bold">
                    <Receipt className="h-4 w-4 text-accent shrink-0" />
                    <span>{formatIDR(selectedBooking.totalPrice)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Notes Section if available */}
            {selectedBooking.notes && (
              <div className="rounded-2xl bg-bg-secondary/50 p-4 border border-border-custom/50 space-y-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Notes
                </span>
                <p className="text-xs text-white italic">{selectedBooking.notes}</p>
              </div>
            )}

            {/* Payment Proof Section if available */}
            {selectedBooking.payment && (
              <div className="rounded-2xl border border-border-custom bg-bg-secondary p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    Submitted Payment Proof
                  </span>
                  <a
                    href={selectedBooking.payment.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-accent hover:underline font-semibold"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Full
                  </a>
                </div>
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-background border border-border-custom">
                  <Image
                    src={selectedBooking.payment.proofUrl}
                    alt="Payment proof thumbnail"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={buildWhatsAppUrl(
                  selectedBooking.whatsapp,
                  selectedBooking.bookingCode,
                  selectedBooking.fullName,
                  selectedBooking.bookingDate,
                  `${selectedBooking.startTime} - ${selectedBooking.endTime}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-success-custom text-background font-extrabold text-xs py-3 hover:bg-success-custom/90 transition-all shadow-lg"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Contact via WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-2xl border border-border-custom bg-bg-secondary px-6 text-xs font-bold text-text-secondary hover:text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl transition-all duration-300 ${
            toast.type === "success"
              ? "border-success-custom/40 bg-success-custom/15 text-success-custom"
              : "border-error-custom/40 bg-error-custom/15 text-error-custom"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <p className="text-xs font-bold">{toast.msg}</p>
        </div>
      )}
    </div>
  );
}
