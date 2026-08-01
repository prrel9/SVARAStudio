"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import {
  formatHour,
  formatIDR,
  calculatePrice,
} from "@/lib/data/schedule";
import type { Studio } from "@/lib/types";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  Receipt,
  Upload,
  Copy,
  AlertCircle,
  Timer,
  Building2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "form" | "review" | "payment" | "success";

interface FormData {
  fullName: string;
  whatsapp: string;
  email: string;
  notes: string;
}

interface BookingResult {
  bookingCode: string;
  id: string;
  expiresAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BANK_INFO = {
  bank: "BCA",
  accountNumber: "1234567890",
  accountHolder: "Svara Studio",
};

const STEPS: { key: Step; label: string }[] = [
  { key: "form", label: "Data Anda" },
  { key: "review", label: "Tinjau" },
  { key: "payment", label: "Pembayaran" },
  { key: "success", label: "Selesai" },
];

// ─── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  done
                    ? "bg-accent border-accent text-background"
                    : active
                    ? "bg-accent/15 border-accent text-accent"
                    : "bg-surface border-border-custom text-text-secondary",
                ].join(" ")}
              >
                {done ? <CheckCircle className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  active ? "text-accent" : done ? "text-white" : "text-text-secondary"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 mx-3 mb-5 w-12 transition-all duration-500 ${
                  done ? "bg-accent" : "bg-border-custom"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Booking Summary Card ─────────────────────────────────────────────────────

interface SlotInfo {
  studioName: string;
  date: string;
  hour: number;
  duration: number;
  pricePerHour: number;
}

function SummaryCard({ slot, formData }: { slot: SlotInfo; formData?: FormData }) {
  const total = calculatePrice(slot.pricePerHour, slot.duration);
  const displayDate = new Date(slot.date + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl border border-border-custom bg-surface p-6 space-y-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Receipt className="h-4 w-4 text-accent" />
        Detail Pemesanan
      </h3>
      <div className="space-y-3">
        <SummaryRow icon={<MapPin className="h-4 w-4" />} label="Studio" value={slot.studioName} />
        <SummaryRow icon={<Calendar className="h-4 w-4" />} label="Tanggal" value={displayDate} />
        <SummaryRow
          icon={<Clock className="h-4 w-4" />}
          label="Waktu"
          value={`${formatHour(slot.hour)} – ${formatHour(slot.hour + slot.duration)} (${slot.duration}h)`}
        />
        {formData && (
          <>
            <div className="border-t border-border-custom pt-3" />
            <SummaryRow icon={<User className="h-4 w-4" />} label="Nama" value={formData.fullName} />
            <SummaryRow icon={<Phone className="h-4 w-4" />} label="WhatsApp" value={formData.whatsapp} />
            {formData.email && (
            <SummaryRow icon={<Mail className="h-4 w-4" />} label="Email" value={formData.email} />
            )}
            {formData.notes && (
              <SummaryRow icon={<MessageSquare className="h-4 w-4" />} label="Notes" value={formData.notes} />
            )}
          </>
        )}
        <div className="border-t border-border-custom pt-3 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {formatIDR(slot.pricePerHour)} × {slot.duration}h
          </span>
          <span className="text-lg font-extrabold text-white">{formatIDR(total)}</span>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-text-secondary mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
      setRemaining(Math.floor(diff / 1000));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isUrgent = remaining < 120;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${
        isUrgent
          ? "border-error-custom/40 bg-error-custom/10 text-error-custom"
          : "border-warning-custom/40 bg-warning-custom/10 text-warning-custom"
      }`}
    >
      <Timer className="h-4 w-4 shrink-0" />
      <span className="text-sm font-semibold">
      Selesaikan pembayaran dalam{" "}
        <span className="font-extrabold tabular-nums">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </span>
    </div>
  );
}

// ─── Input Component ──────────────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  as?: "input" | "textarea";
}

function InputField({
  id,
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  as = "input",
}: InputFieldProps) {
  const base =
    "w-full rounded-xl border bg-surface px-4 py-3 text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200";
  const borderClass = error ? "border-error-custom" : "border-border-custom";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
        {icon && <span className="text-accent">{icon}</span>}
        {label}
        {required && <span className="text-error-custom">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${base} ${borderClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} ${borderClass}`}
        />
      )}
      {error && (
        <p className="text-xs text-error-custom flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main BookingClient ────────────────────────────────────────────────────────

export default function BookingClient({ studios }: { studios: Studio[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse slot info from URL
  const studioId = searchParams.get("studioId") ?? "";
  const studioName = searchParams.get("studioName") ?? "";
  const date = searchParams.get("date") ?? "";
  const hour = parseInt(searchParams.get("hour") ?? "8");
  const duration = parseInt(searchParams.get("duration") ?? "1");
  const pricePerHour = parseInt(searchParams.get("price") ?? "0");

  const studio = studios.find((s) => s.id === studioId) ?? null;

  const slot: SlotInfo = {
    studioName: studioName || studio?.name || "Studio",
    date,
    hour,
    duration,
    pricePerHour,
  };

  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    whatsapp: "",
    email: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if missing params
  useEffect(() => {
    if (!studioId || !date || !hour || !pricePerHour) {
      router.replace("/schedule");
    }
  }, [studioId, date, hour, pricePerHour, router]);

  // ── Validate Form ────────────────────────────────────────────────────────────

  function validateForm(): boolean {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.fullName.trim()) errors.fullName = "Nama lengkap wajib diisi";
    if (!formData.whatsapp.trim()) errors.whatsapp = "Nomor WhatsApp wajib diisi";
    else if (!/^[0-9+\s-]{8,20}$/.test(formData.whatsapp.trim())) {
      errors.whatsapp = "Masukkan nomor telepon yang valid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ── Submit Booking ────────────────────────────────────────────────────────────

  async function handleSubmitBooking() {
    setIsSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId,
          bookingDate: date,
          startHour: hour,
          durationHours: duration,
          totalPrice: calculatePrice(pricePerHour, duration),
          fullName: formData.fullName.trim(),
          whatsapp: formData.whatsapp.trim(),
          email: formData.email.trim() || undefined,
          notes: formData.notes.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Failed to create booking. Please try again.");
        return;
      }
      setBookingResult({
        bookingCode: json.bookingCode,
        id: json.id,
        expiresAt: json.expiresAt,
      });
      setStep("payment");
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Upload Proof ──────────────────────────────────────────────────────────────

  async function handleUploadProof() {
    if (!proofFile || !bookingResult) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", proofFile);
      fd.append("bookingId", bookingResult.id);

      const res = await fetch("/api/payments/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        setUploadError(json.error ?? "Upload failed. Please try again.");
        return;
      }
      setStep("success");
    } catch {
      setUploadError("Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  const totalPrice = calculatePrice(pricePerHour, duration);

  // ── Render Steps ──────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-background min-h-screen">
        <div className="mx-auto max-w-3xl px-6 md:px-8 py-16">

          {/* Page Title */}
          <div className="mb-10">
            <button
              onClick={() => step === "form" ? router.push("/schedule") : setStep(step === "review" ? "form" : "review")}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === "form" ? "Back to Schedule" : "Back"}
            </button>
            <h1 className="text-3xl font-bold text-white">Pesan Studio</h1>
            <p className="text-text-secondary mt-1">
              SVARA STUDIO &mdash; {slot.studioName}
            </p>
          </div>

          {/* Step Indicator */}
          {step !== "success" && <StepIndicator current={step} />}

          {/* ── Step: Form ──────────────────────────────────────────────── */}
          {step === "form" && (
            <div className="space-y-8">
              <SummaryCard slot={slot} />

              <div className="rounded-2xl border border-border-custom bg-surface p-6 space-y-5">
                <h2 className="text-base font-bold text-white">Data Anda</h2>
                <InputField
                  id="fullName"
                  label="Nama Lengkap"
                  required
                  value={formData.fullName}
                  onChange={(v) => setFormData((p) => ({ ...p, fullName: v }))}
                  placeholder="Nama Anda"
                  icon={<User className="h-3.5 w-3.5" />}
                  error={formErrors.fullName}
                />
                <InputField
                  id="whatsapp"
                  label="Nomor WhatsApp"
                  required
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(v) => setFormData((p) => ({ ...p, whatsapp: v }))}
                  placeholder="08xx xxxx xxxx"
                  icon={<Phone className="h-3.5 w-3.5" />}
                  error={formErrors.whatsapp}
                />
                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => setFormData((p) => ({ ...p, email: v }))}
                  placeholder="Opsional"
                  icon={<Mail className="h-3.5 w-3.5" />}
                />
                <InputField
                  id="notes"
                  label="Catatan Tambahan"
                  as="textarea"
                  value={formData.notes}
                  onChange={(v) => setFormData((p) => ({ ...p, notes: v }))}
                  placeholder="Any special requests or additional information…"
                  icon={<MessageSquare className="h-3.5 w-3.5" />}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  if (validateForm()) setStep("review");
                }}
              >
                Tinjau Pemesanan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* ── Step: Review ────────────────────────────────────────────── */}
          {step === "review" && (
            <div className="space-y-6">
              <SummaryCard slot={slot} formData={formData} />

              {serverError && (
                <div className="flex items-center gap-3 rounded-xl border border-error-custom/40 bg-error-custom/10 px-4 py-3">
                  <AlertCircle className="h-5 w-5 text-error-custom shrink-0" />
                  <p className="text-sm text-error-custom">{serverError}</p>
                </div>
              )}

              <div className="rounded-xl border border-warning-custom/30 bg-warning-custom/5 px-4 py-3">
                <p className="text-xs text-warning-custom">
                  <strong>Catatan:</strong> Setelah konfirmasi, Anda memiliki <strong>15 menit</strong> untuk menyelesaikan pembayaran. Slot akan ditahan selama waktu ini.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                isLoading={isSubmitting}
                onClick={handleSubmitBooking}
              >
                Konfirmasi &amp; Lanjut ke Pembayaran
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* ── Step: Payment ────────────────────────────────────────────── */}
          {step === "payment" && bookingResult && (
            <div className="space-y-6">
              {/* Countdown */}
              <Countdown expiresAt={bookingResult.expiresAt} />

              {/* Booking Code */}
              <div className="rounded-2xl border border-border-custom bg-surface p-6 space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Kode Pemesanan</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-white tracking-widest font-mono">
                    {bookingResult.bookingCode}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(bookingResult.bookingCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="rounded-lg border border-border-custom p-2 text-text-secondary hover:text-white hover:border-accent/40 transition-all"
                    title="Copy booking code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {copied && <span className="text-xs text-success-custom">Copied!</span>}
                </div>
              </div>

              {/* Bank Info */}
              <div className="rounded-2xl border border-border-custom bg-surface p-6 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-accent" />
                  Pembayaran Transfer
                </h2>
                <div className="rounded-xl bg-bg-secondary border border-border-custom p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary uppercase tracking-wider">Bank</span>
                    <span className="text-sm font-bold text-white">{BANK_INFO.bank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary uppercase tracking-wider">Rekening</span>
                    <span className="text-sm font-bold text-white font-mono tracking-widest">{BANK_INFO.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary uppercase tracking-wider">Pemilik</span>
                    <span className="text-sm font-bold text-white">{BANK_INFO.accountHolder}</span>
                  </div>
                  <div className="border-t border-border-custom pt-3 flex justify-between items-center">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total</span>
                    <span className="text-xl font-extrabold text-accent">{formatIDR(totalPrice)}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">
                  Transfer the exact amount and include your booking code <strong className="text-white">{bookingResult.bookingCode}</strong> in the transfer notes.
                </p>
              </div>

              {/* Upload Proof */}
              <div className="rounded-2xl border border-border-custom bg-surface p-6 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Upload className="h-5 w-5 text-accent" />
                  Unggah Bukti Transfer
                </h2>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={[
                    "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200",
                    proofFile
                      ? "border-success-custom/50 bg-success-custom/5"
                      : "border-border-custom hover:border-accent/50 hover:bg-accent/5",
                  ].join(" ")}
                >
                  <Upload className={`h-8 w-8 ${proofFile ? "text-success-custom" : "text-text-secondary"}`} />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">
                      {proofFile ? proofFile.name : "Klik untuk mengunggah bukti transfer"}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      JPG, PNG or PDF (max 5MB)
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      if (f.size > 5 * 1024 * 1024) {
                        setUploadError("File must be under 5MB");
                        return;
                      }
                      setProofFile(f);
                      setUploadError("");
                    }
                  }}
                />

                {uploadError && (
                  <p className="text-xs text-error-custom flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {uploadError}
                  </p>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!proofFile}
                  isLoading={isUploading}
                  onClick={handleUploadProof}
                >
                  Kirim Bukti Pembayaran
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step: Success ────────────────────────────────────────────── */}
          {step === "success" && bookingResult && (
            <div className="flex flex-col items-center text-center space-y-8 py-8">
              <div className="h-20 w-20 rounded-full bg-success-custom/15 border-2 border-success-custom/50 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-success-custom" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Pembayaran Terkirim!</h2>
                <p className="text-text-secondary max-w-sm">
                  Your booking is under review. We&apos;ll confirm via WhatsApp once payment is verified.
                </p>
              </div>

              <div className="w-full rounded-2xl border border-border-custom bg-surface p-6 space-y-3 text-left">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Kode Pemesanan Anda</p>
                <p className="text-3xl font-extrabold text-white tracking-widest font-mono">
                  {bookingResult.bookingCode}
                </p>
                <p className="text-xs text-text-secondary">Save this code to track your booking status.</p>
              </div>

              <SummaryCard slot={slot} formData={formData} />

              <div className="w-full rounded-xl border border-border-custom bg-bg-secondary px-5 py-4 text-left space-y-2">
                <p className="text-xs font-semibold text-white">What&apos;s next?</p>
                <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                  <li>Our team will verify your transfer (usually within 1 hour)</li>
                  <li>You&apos;ll receive a WhatsApp confirmation once approved</li>
                  <li>Bring this booking code on the day of your session</li>
                </ul>
              </div>

              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => {
                  router.refresh();
                  router.push("/schedule");
                }}
              >
                Kembali ke Jadwal
              </Button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
