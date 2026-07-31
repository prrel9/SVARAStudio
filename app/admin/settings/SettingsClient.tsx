"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  Building2,
  Phone,
  MapPin,
  CreditCard,
  Globe,
  MessageCircle,
  ImageIcon,
  FileText,
  Settings2,
  Upload,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import type { AppSettings } from "@/lib/services/appSettings";

interface SettingsClientProps {
  initial: AppSettings;
}

interface SectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, subtitle, icon, children }: SectionProps) {
  return (
    <div className="rounded-2xl border border-border-custom bg-surface overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border-custom bg-bg-secondary px-6 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 border border-accent/25 text-accent shrink-0">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-extrabold text-white">{title}</h2>
          <p className="text-[11px] text-text-secondary">{subtitle}</p>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-text-secondary/60">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border-custom bg-bg-secondary px-4 py-2.5 text-sm text-white placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all";

export default function SettingsClient({ initial }: SettingsClientProps) {
  const [form, setForm] = useState<AppSettings>(initial);
  const [saved, setSaved] = useState<AppSettings>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreviewError, setLogoPreviewError] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = (key: keyof AppSettings, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json();
        showToast(j.error ?? "Failed to save settings", "error");
        return;
      }
      const updated: AppSettings = await res.json();
      setForm(updated);
      setSaved(updated);
      showToast("Settings saved successfully", "success");
    } catch {
      showToast("Network error — settings not saved", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (res.ok) {
        const fresh: AppSettings = await res.json();
        setForm(fresh);
        setSaved(fresh);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDiscard = () => {
    setForm(saved);
    setLogoPreviewError(false);
  };

  const handleLogoUpload = async (file: File | null) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Logo harus berformat JPG, PNG, atau WebP", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran logo maksimal 2MB", "error");
      return;
    }

    setIsUploadingLogo(true);
    setLogoPreviewError(false);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/settings/logo", { method: "POST", body: data });
      const result = await res.json();
      if (!res.ok) {
        showToast(result.error ?? "Gagal mengunggah logo", "error");
        return;
      }
      set("logo_url", result.url);
      showToast("Logo berhasil diunggah. Simpan perubahan untuk menerapkannya.", "success");
    } catch {
      showToast("Kesalahan jaringan saat mengunggah logo", "error");
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#F5F7FA] font-sans selection:bg-[#6C63FF] selection:text-[#050510]">
      <AdminHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-accent" />
              App Settings
            </h1>
            <p className="text-xs text-text-secondary">
              Manage company info, contact details, and payment configuration.
            </p>
          </div>

          {/* Save / Discard Buttons */}
          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                onClick={handleDiscard}
                className="rounded-xl border border-border-custom bg-surface px-4 py-2 text-xs font-bold text-text-secondary hover:text-white transition-all"
              >
                Discard Changes
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-extrabold text-background hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-accent/20"
            >
              {isSaving ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isSaving ? "Saving…" : isDirty ? "Save Changes" : "Saved"}
            </button>
          </div>
        </div>

        {/* Unsaved indicator */}
        {isDirty && (
          <div className="flex items-center gap-2 rounded-xl border border-warning-custom/40 bg-warning-custom/10 px-4 py-2.5 text-xs font-semibold text-warning-custom">
            <span className="h-1.5 w-1.5 rounded-full bg-warning-custom animate-pulse" />
            You have unsaved changes
          </div>
        )}

        {/* ── Section 1: Brand & Identity ─────────────────────────────── */}
        <Section
          title="Brand & Identity"
          subtitle="Company name, logo and public-facing hero text"
          icon={<Building2 className="h-4 w-4" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Company Name" hint="Shown in the browser tab and emails">
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => set("company_name", e.target.value)}
                placeholder="e.g. Fauls House Studio"
                className={inputCls}
              />
            </Field>

            <Field label="Logo" hint="Unggah file JPG, PNG, atau WebP (maks. 2MB)">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)}
                disabled={isUploadingLogo}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accent/50 bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition-all hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingLogo ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploadingLogo ? "Mengunggah logo..." : "Pilih gambar logo"}
              </button>
            </Field>
          </div>

          {/* Logo Preview */}
          {form.logo_url && !logoPreviewError && (
            <div className="flex items-center gap-4 rounded-xl border border-border-custom bg-bg-secondary p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border-custom bg-surface">
                <Image
                  src={form.logo_url}
                  alt="Logo preview"
                  fill
                  className="object-contain p-1"
                  unoptimized
                  onError={() => setLogoPreviewError(true)}
                />
              </div>
              <p className="text-xs text-text-secondary">Logo preview</p>
            </div>
          )}
          {logoPreviewError && (
            <p className="flex items-center gap-1 text-xs text-error-custom">
              <ImageIcon className="h-3.5 w-3.5" />
              Invalid logo URL — check the link is publicly accessible.
            </p>
          )}

          <div className="grid grid-cols-1 gap-5">
            <Field
              label="Hero Title"
              hint="Main headline shown on the homepage hero section"
            >
              <input
                type="text"
                value={form.hero_title}
                onChange={(e) => set("hero_title", e.target.value)}
                placeholder="e.g. Where Your Sound Comes to Life"
                className={inputCls}
              />
            </Field>
            <Field label="Hero Subtitle" hint="Supporting text below the hero title">
              <textarea
                value={form.hero_subtitle}
                onChange={(e) => set("hero_subtitle", e.target.value)}
                rows={2}
                placeholder="Short description of your studio..."
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
        </Section>

        {/* ── Section 2: Contact Information ───────────────────────────── */}
        <Section
          title="Contact Information"
          subtitle="Phone, WhatsApp, and physical address"
          icon={<Phone className="h-4 w-4" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Phone Number" hint="Display phone for customer calls">
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="e.g. +62 812 3456 7890"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>

            <Field
              label="WhatsApp Number"
              hint="Digits only, no + or spaces (e.g. 6281234567890)"
            >
              <div className="relative">
                <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="e.g. 6281234567890"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>
          </div>

          <Field label="Physical Address" hint="Full studio address for maps & contact page">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-text-secondary pointer-events-none" />
              <textarea
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                rows={2}
                placeholder="e.g. Jl. Studio Raya No. 12, Jakarta Selatan"
                className={`${inputCls} pl-10 resize-none`}
              />
            </div>
          </Field>
        </Section>

        {/* ── Section 3: Payment / Bank Details ───────────────────────── */}
        <Section
          title="Bank & Payment Details"
          subtitle="Displayed to customers on the payment page"
          icon={<CreditCard className="h-4 w-4" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Bank Name">
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                <input
                  type="text"
                  value={form.bank_name}
                  onChange={(e) => set("bank_name", e.target.value)}
                  placeholder="e.g. BCA"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>

            <Field label="Account Number">
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                <input
                  type="text"
                  value={form.account_number}
                  onChange={(e) => set("account_number", e.target.value)}
                  placeholder="e.g. 1234567890"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>

            <Field label="Account Holder Name">
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                <input
                  type="text"
                  value={form.account_holder}
                  onChange={(e) => set("account_holder", e.target.value)}
                  placeholder="e.g. PT Fauls House Studio"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>
          </div>

          {/* Bank Details Preview Card */}
          {(form.bank_name || form.account_number || form.account_holder) && (
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Customer-facing payment card preview
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-10 w-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {form.bank_name || "Bank Name"} —{" "}
                    <span className="font-mono">
                      {form.account_number || "Account Number"}
                    </span>
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    a/n {form.account_holder || "Account Holder"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* Bottom Save Bar (sticky for long forms) */}
        <div className="sticky bottom-4 z-30 flex justify-end">
          <div
            className={`flex items-center gap-3 rounded-2xl border bg-surface/90 backdrop-blur-xl px-5 py-3 shadow-xl transition-all duration-300 ${
              isDirty
                ? "border-accent/30 shadow-accent/10 opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <span className="text-xs text-text-secondary font-semibold">
              Unsaved changes
            </span>
            <button
              onClick={handleDiscard}
              className="rounded-xl border border-border-custom px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-white transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-1.5 text-xs font-extrabold text-background hover:bg-accent-hover transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save
            </button>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl transition-all duration-300 ${
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
