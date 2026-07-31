"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  CheckCircle,
  XCircle,
  Music,
  Users,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  ImageIcon,
  Upload,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { formatIDR } from "@/lib/data/schedule";
import type { AdminStudio, StudioFormData } from "@/lib/services/studiosAdmin";

interface StudiosAdminClientProps {
  initialStudios: AdminStudio[];
}

const EQUIPMENT_LEVELS = ["Starter", "Standard", "Professional", "Premium", "VIP"] as const;

const EMPTY_FORM: StudioFormData = {
  name: "",
  slug: "",
  description: "",
  price_per_hour: 0,
  capacity: 0,
  room_size: "",
  equipment_level: "Standard",
  thumbnail: "",
  badge: "",
  is_active: true,
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function EquipmentBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Starter: "bg-info-custom/10 border-info-custom/30 text-info-custom",
    Standard: "bg-surface-elevated border-border-custom text-text-secondary",
    Professional: "bg-warning-custom/10 border-warning-custom/30 text-warning-custom",
    Premium: "bg-accent/10 border-accent/30 text-accent",
    VIP: "bg-success-custom/10 border-success-custom/30 text-success-custom",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        colors[level] || colors["Standard"]
      }`}
    >
      {level}
    </span>
  );
}

// ─── Studio Form Modal ────────────────────────────────────────────────────────

interface StudioFormModalProps {
  mode: "create" | "edit";
  initial: StudioFormData;
  onClose: () => void;
  onSubmit: (data: StudioFormData) => Promise<void>;
  isLoading: boolean;
}

function StudioFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
  isLoading,
}: StudioFormModalProps) {
  const [form, setForm] = useState<StudioFormData>(initial);
  const [previewError, setPreviewError] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState("");
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof StudioFormData, value: string | number | boolean) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-generate slug from name when creating
      if (key === "name" && mode === "create") {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const handleThumbnailUpload = async (file: File | null) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setThumbnailUploadError("Thumbnail harus berformat JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setThumbnailUploadError("Ukuran thumbnail maksimal 3MB.");
      return;
    }

    setIsUploadingThumbnail(true);
    setPreviewError(false);
    setThumbnailUploadError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/studios/image", { method: "POST", body: data });
      const result = await res.json();
      if (!res.ok) {
        setThumbnailUploadError(result.error ?? "Gagal mengunggah thumbnail.");
        return;
      }
      set("thumbnail", result.url);
    } catch {
      setThumbnailUploadError("Kesalahan jaringan saat mengunggah thumbnail.");
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border-custom bg-bg-secondary px-4 py-2.5 text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all";
  const labelCls = "text-[11px] font-bold uppercase tracking-wider text-text-secondary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border-custom bg-surface p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-custom pb-4">
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
              {mode === "create" ? "New Studio" : "Edit Studio"}
            </span>
            <h2 className="text-xl font-extrabold text-white">
              {mode === "create" ? "Add Studio Room" : form.name || "Edit Studio"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-secondary hover:text-white hover:bg-bg-secondary transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Studio Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Studio A"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
                placeholder="e.g. studio-a"
                className={inputCls}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Short description of the studio room..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Price, Capacity, Room Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Price / Hour (IDR) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.price_per_hour || ""}
                onChange={(e) => set("price_per_hour", Number(e.target.value))}
                placeholder="e.g. 75000"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Capacity (persons)</label>
              <input
                type="number"
                min={0}
                value={form.capacity || ""}
                onChange={(e) => set("capacity", Number(e.target.value))}
                placeholder="e.g. 6"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Room Size</label>
              <input
                type="text"
                value={form.room_size}
                onChange={(e) => set("room_size", e.target.value)}
                placeholder="e.g. 4×5m"
                className={inputCls}
              />
            </div>
          </div>

          {/* Equipment Level, Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Equipment Level</label>
              <select
                value={form.equipment_level}
                onChange={(e) => set("equipment_level", e.target.value)}
                className={inputCls}
              >
                {EQUIPMENT_LEVELS.map((l) => (
                  <option key={l} value={l} className="bg-surface">
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Badge Label</label>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
                placeholder="e.g. Best Value, Popular"
                className={inputCls}
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-1.5">
            <label className={labelCls}>Thumbnail</label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleThumbnailUpload(e.target.files?.[0] ?? null)}
              disabled={isUploadingThumbnail}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
              disabled={isUploadingThumbnail}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accent/50 bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition-all hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploadingThumbnail ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploadingThumbnail ? "Mengunggah thumbnail..." : "Pilih gambar thumbnail"}
            </button>
            <p className="text-[10px] text-text-secondary/60">JPG, PNG, atau WebP (maks. 3MB)</p>
            {thumbnailUploadError && (
              <p className="text-xs text-error-custom flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> {thumbnailUploadError}
              </p>
            )}
            {form.thumbnail && !previewError && (
              <div className="relative mt-2 h-28 w-full overflow-hidden rounded-xl border border-border-custom bg-bg-secondary">
                <Image
                  src={form.thumbnail}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                  unoptimized
                  onError={() => setPreviewError(true)}
                />
              </div>
            )}
            {previewError && (
              <p className="text-xs text-error-custom flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Gambar thumbnail tidak dapat dimuat. Silakan unggah ulang.
              </p>
            )}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between rounded-2xl bg-bg-secondary border border-border-custom p-4">
            <div>
              <p className="text-sm font-bold text-white">Active / Visible</p>
              <p className="text-xs text-text-secondary">
                Inactive studios are hidden from the public booking page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("is_active", !form.is_active)}
              className={`transition-all ${form.is_active ? "text-success-custom" : "text-text-secondary"}`}
            >
              {form.is_active ? (
                <ToggleRight className="h-9 w-9" />
              ) : (
                <ToggleLeft className="h-9 w-9" />
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent py-3 text-sm font-extrabold text-background hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {mode === "create" ? "Create Studio" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-2xl border border-border-custom bg-bg-secondary px-6 text-sm font-bold text-text-secondary hover:text-white transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  studio,
  onConfirm,
  onClose,
  isLoading,
}: {
  studio: AdminStudio;
  onConfirm: () => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-error-custom/30 bg-surface p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-14 w-14 rounded-full bg-error-custom/10 border border-error-custom/30 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-error-custom" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Delete Studio?</h2>
          <p className="text-sm text-text-secondary">
            You are about to permanently delete{" "}
            <strong className="text-white">{studio.name}</strong>. This action
            cannot be undone and may affect existing booking records.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-error-custom py-3 text-sm font-extrabold text-white hover:bg-error-custom/80 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete Permanently
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl border border-border-custom bg-bg-secondary px-5 text-sm font-bold text-text-secondary hover:text-white transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudiosAdminClient({ initialStudios }: StudiosAdminClientProps) {
  const [studios, setStudios] = useState<AdminStudio[]>(initialStudios);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Modal states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminStudio | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminStudio | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Refresh ──────────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/studios", { cache: "no-store" });
      if (res.ok) setStudios(await res.json());
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── Create ───────────────────────────────────────────────────────────────
  const handleCreate = async (form: StudioFormData) => {
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/studios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json();
        showToast(j.error ?? "Failed to create studio", "error");
        return;
      }
      const created: AdminStudio = await res.json();
      setStudios((prev) => [created, ...prev]);
      setShowCreateForm(false);
      showToast(`Studio "${created.name}" created successfully`, "success");
    } finally {
      setIsActionLoading(false);
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const handleEdit = async (form: StudioFormData) => {
    if (!editTarget) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/admin/studios/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json();
        showToast(j.error ?? "Failed to update studio", "error");
        return;
      }
      const updated: AdminStudio = await res.json();
      setStudios((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setEditTarget(null);
      showToast(`Studio "${updated.name}" updated`, "success");
    } finally {
      setIsActionLoading(false);
    }
  };

  // ── Toggle Active ─────────────────────────────────────────────────────────
  const handleToggleActive = async (studio: AdminStudio) => {
    try {
      const res = await fetch(`/api/admin/studios/${studio.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !studio.isActive }),
      });
      if (!res.ok) {
        const j = await res.json();
        showToast(j.error ?? "Failed to toggle studio", "error");
        return;
      }
      setStudios((prev) =>
        prev.map((s) => (s.id === studio.id ? { ...s, isActive: !s.isActive } : s))
      );
      showToast(
        `${studio.name} is now ${!studio.isActive ? "active" : "inactive"}`,
        "success"
      );
    } catch {
      showToast("Network error", "error");
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/admin/studios/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json();
        showToast(j.error ?? "Failed to delete studio", "error");
        return;
      }
      setStudios((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      showToast(`Studio "${deleteTarget.name}" deleted`, "success");
      setDeleteTarget(null);
    } finally {
      setIsActionLoading(false);
    }
  };

  // ── Derive edit initial data ──────────────────────────────────────────────
  const editFormData: StudioFormData | null = editTarget
    ? {
        name: editTarget.name,
        slug: editTarget.slug,
        description: editTarget.description,
        price_per_hour: editTarget.pricePerHour,
        capacity: editTarget.capacity,
        room_size: editTarget.roomSize,
        equipment_level: editTarget.equipmentLevel,
        thumbnail: editTarget.thumbnail,
        badge: editTarget.badge,
        is_active: editTarget.isActive,
      }
    : null;

  return (
    <div className="min-h-screen bg-transparent text-[#F5F7FA] font-sans selection:bg-[#6C63FF] selection:text-[#050510]">
      <AdminHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Music className="h-5 w-5 text-accent" />
              Studio Management
            </h1>
            <p className="text-xs text-text-secondary">
              Create, edit, activate/deactivate and delete studio rooms.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-border-custom bg-surface px-4 py-2 text-xs font-mono text-text-secondary">
              Total:{" "}
              <strong className="text-white">{studios.length}</strong> studios
            </span>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-extrabold text-background hover:bg-accent-hover active:scale-[0.98] transition-all shadow-md shadow-accent/20"
            >
              <Plus className="h-4 w-4" />
              Add Studio
            </button>
          </div>
        </div>

        {/* Studios Grid */}
        {studios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border-custom bg-surface text-center space-y-4">
            <Music className="h-12 w-12 text-text-secondary" />
            <h3 className="text-base font-bold text-white">No studios yet</h3>
            <p className="text-xs text-text-secondary">
              Click &quot;Add Studio&quot; to create your first studio room.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-background hover:bg-accent-hover transition-all"
            >
              <Plus className="h-4 w-4" />
              Add First Studio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <article
                key={studio.id}
                className={`group relative rounded-2xl border bg-surface overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                  studio.isActive
                    ? "border-border-custom hover:border-accent/30 hover:shadow-accent/5"
                    : "border-border-custom/50 opacity-70 hover:opacity-90"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-bg-secondary">
                  {studio.thumbnail ? (
                    <Image
                      src={studio.thumbnail}
                      alt={studio.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Music className="h-12 w-12 text-text-secondary/30" />
                    </div>
                  )}

                  {/* Overlay badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {studio.badge && (
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-extrabold text-background uppercase tracking-wider shadow-md">
                        {studio.badge}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        studio.isActive
                          ? "bg-success-custom/15 border-success-custom/40 text-success-custom"
                          : "bg-surface/80 border-border-custom text-text-secondary"
                      }`}
                    >
                      {studio.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-extrabold text-white leading-tight">
                        {studio.name}
                      </h3>
                      <p className="text-[11px] font-mono text-text-secondary">{studio.slug}</p>
                    </div>
                    <EquipmentBadge level={studio.equipmentLevel} />
                  </div>

                  {studio.description && (
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {studio.description}
                    </p>
                  )}

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-xs text-text-secondary border-t border-border-custom/60 pt-3">
                    <span className="flex items-center gap-1.5 font-bold text-accent">
                      <DollarSign className="h-3.5 w-3.5" />
                      {formatIDR(studio.pricePerHour)}/hr
                    </span>
                    {studio.capacity > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {studio.capacity} pax
                      </span>
                    )}
                    {studio.roomSize && (
                      <span className="text-[11px]">{studio.roomSize}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(studio)}
                      title={studio.isActive ? "Deactivate" : "Activate"}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                        studio.isActive
                          ? "border-success-custom/40 bg-success-custom/10 text-success-custom hover:bg-success-custom/20"
                          : "border-border-custom bg-surface-elevated text-text-secondary hover:text-white"
                      }`}
                    >
                      {studio.isActive ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                      {studio.isActive ? "Active" : "Inactive"}
                    </button>

                    <div className="flex-1 flex items-center justify-end gap-2">
                      {/* Edit */}
                      <button
                        onClick={() => setEditTarget(studio)}
                        title="Edit studio"
                        className="rounded-xl border border-border-custom bg-surface-elevated p-2 text-text-secondary hover:text-white hover:border-accent/40 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(studio)}
                        title="Delete studio"
                        className="rounded-xl border border-error-custom/30 bg-error-custom/10 p-2 text-error-custom hover:bg-error-custom/20 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateForm && (
        <StudioFormModal
          mode="create"
          initial={EMPTY_FORM}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreate}
          isLoading={isActionLoading}
        />
      )}

      {/* Edit Modal */}
      {editTarget && editFormData && (
        <StudioFormModal
          mode="edit"
          initial={editFormData}
          onClose={() => setEditTarget(null)}
          onSubmit={handleEdit}
          isLoading={isActionLoading}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          studio={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          isLoading={isActionLoading}
        />
      )}

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
