"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  MessageCircle,
  Calendar,
  Clock,
  User,
  Phone,
  Receipt,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatIDR } from "@/lib/data/schedule";
import type { PaymentWithBooking } from "@/lib/services/payments";

interface PaymentsAdminClientProps {
  initialPayments: PaymentWithBooking[];
}

// ─── Format Indonesian phone number ──────────────────────────────────────────

function formatWhatsApp(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  return cleaned;
}

function buildWhatsAppUrl(phone: string, bookingCode: string, name: string): string {
  const wa = formatWhatsApp(phone);
  const msg = encodeURIComponent(
    `Halo ${name}! 🎵\n\nPembayaran booking kamu telah kami verifikasi.\n\n✅ Booking Code: *${bookingCode}*\n\nSesi kamu sudah dikonfirmasi. Sampai jumpa di Fauls House Studio!\n\nTerima kasih 🙏`
  );
  return `https://wa.me/${wa}?text=${msg}`;
}

// ─── Proof Image Viewer ────────────────────────────────────────────────────────

function ProofViewer({ url }: { url: string }) {
  const isPdf = url.toLowerCase().endsWith(".pdf");
  return (
    <div className="rounded-xl overflow-hidden border border-border-custom bg-bg-secondary">
      {isPdf ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-3 p-8 text-accent hover:text-accent-hover transition-colors"
        >
          <ExternalLink className="h-8 w-8" />
          <span className="text-sm font-semibold">View PDF Proof</span>
        </a>
      ) : (
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={url}
            alt="Transfer proof"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 600px"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}

// ─── Payment Card ─────────────────────────────────────────────────────────────

interface PaymentCardProps {
  payment: PaymentWithBooking;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  isProcessing: boolean;
}

function PaymentCard({ payment, onApprove, onReject, isProcessing }: PaymentCardProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const b = payment.booking;

  const waUrl = buildWhatsAppUrl(b.whatsapp, b.bookingCode, b.fullName);

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setRejectError("Please provide a rejection reason");
      return;
    }
    onReject(payment.id, rejectReason.trim());
    setShowRejectForm(false);
    setRejectReason("");
    setRejectError("");
  };

  return (
    <article className="rounded-2xl border border-border-custom bg-surface overflow-hidden transition-all duration-300 hover:border-accent/20 hover:shadow-[0_4px_32px_rgba(255,140,66,0.05)]">
      {/* Card Header */}
      <div className="bg-bg-secondary px-6 py-4 border-b border-border-custom flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Booking Code</span>
          <p className="text-xl font-extrabold text-white tracking-widest font-mono">{b.bookingCode}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-custom/40 bg-warning-custom/10 px-3 py-1 text-xs font-bold text-warning-custom uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-warning-custom animate-pulse" />
          Pending Verification
        </span>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Left: Booking + Customer Info */}
        <div className="space-y-5">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Booking Info</h3>
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date" value={b.bookingDate} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Time" value={`${b.startTime} – ${b.endTime}`} />
            <InfoRow icon={<Receipt className="h-4 w-4" />} label="Total" value={formatIDR(b.totalPrice)} accent />
          </div>

          <div className="border-t border-border-custom pt-4 space-y-3">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Customer</h3>
            <InfoRow icon={<User className="h-4 w-4" />} label="Name" value={b.fullName} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="WhatsApp" value={b.whatsapp} />
          </div>

          {/* Submitted at */}
          <p className="text-[10px] text-text-secondary">
            Submitted: {new Date(payment.createdAt).toLocaleString("id-ID")}
          </p>
        </div>

        {/* Right: Proof Image */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Transfer Proof</h3>
          <ProofViewer url={payment.proofUrl} />
          <a
            href={payment.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-accent hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Open full image
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 space-y-3">
        {showRejectForm ? (
          <div className="rounded-xl border border-error-custom/30 bg-error-custom/5 p-4 space-y-3">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Rejection Reason <span className="text-error-custom">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                setRejectError("");
              }}
              placeholder="e.g. Transfer amount does not match, screenshot unclear…"
              rows={3}
              className="w-full rounded-xl border border-border-custom bg-surface px-4 py-3 text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-error-custom focus:border-error-custom resize-none transition-all"
            />
            {rejectError && (
              <p className="text-xs text-error-custom flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {rejectError}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setShowRejectForm(false); setRejectReason(""); setRejectError(""); }}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-error-custom border-error-custom/50 hover:border-error-custom hover:text-error-custom"
                onClick={handleReject}
                isLoading={isProcessing}
              >
                <XCircle className="h-4 w-4" />
                Confirm Rejection
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {/* Approve & Open WhatsApp */}
            <button
              disabled={isProcessing}
              onClick={() => {
                onApprove(payment.id);
                // Open WhatsApp after short delay to let state update
                setTimeout(() => window.open(waUrl, "_blank"), 500);
              }}
              className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl bg-success-custom text-background font-bold text-sm px-5 py-2.5 hover:bg-success-custom/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </button>

            <button
              disabled={isProcessing}
              onClick={() => window.open(waUrl, "_blank")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-success-custom/40 bg-success-custom/10 text-success-custom font-semibold text-sm px-4 py-2.5 hover:bg-success-custom/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              title="Open WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>

            <button
              disabled={isProcessing}
              onClick={() => setShowRejectForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-error-custom/40 bg-error-custom/10 text-error-custom font-semibold text-sm px-4 py-2.5 hover:bg-error-custom/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function InfoRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-text-secondary mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-bold ${accent ? "text-accent" : "text-white"}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── Main Admin Client ────────────────────────────────────────────────────────

export default function PaymentsAdminClient({
  initialPayments,
}: PaymentsAdminClientProps) {
  const [payments, setPayments] = useState<PaymentWithBooking[]>(initialPayments);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verifiedBy: "admin" }),
      });
      if (!res.ok) {
        const j = await res.json();
        showToast(j.error ?? "Failed to approve", "error");
        return;
      }
      setPayments((prev) => prev.filter((p) => p.id !== id));
      showToast("Payment approved! Booking confirmed ✓", "success");
    } catch {
      showToast("Network error", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verifiedBy: "admin", reason }),
      });
      if (!res.ok) {
        const j = await res.json();
        showToast(j.error ?? "Failed to reject", "error");
        return;
      }
      setPayments((prev) => prev.filter((p) => p.id !== id));
      showToast("Payment rejected", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/admin/payments?refresh=1", { method: "GET" });
      if (res.ok) window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <AdminHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <main className="mx-auto max-w-6xl px-6 md:px-8 py-10 space-y-6">
        {/* Stats bar */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-border-custom bg-surface px-5 py-3">
            <p className="text-xs text-text-secondary">Pending</p>
            <p className="text-2xl font-extrabold text-white">{payments.length}</p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-success-custom/10 border border-success-custom/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success-custom" />
            </div>
            <h2 className="text-lg font-bold text-white">All caught up!</h2>
            <p className="text-sm text-text-secondary">No payments pending verification.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={processingId === payment.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl transition-all duration-300 ${
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
          <p className="text-sm font-semibold">{toast.msg}</p>
        </div>
      )}
    </div>
  );
}
