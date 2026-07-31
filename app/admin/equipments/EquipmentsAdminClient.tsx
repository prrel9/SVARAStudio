"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  ImageIcon,
  Search,
  Check,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getValidImageSrc } from "@/lib/utils/image";
import type {
  AdminEquipment,
  EquipmentFormData,
  EquipmentStudioOption,
} from "@/lib/services/equipmentsAdmin";

interface EquipmentsAdminClientProps {
  initialEquipments: AdminEquipment[];
  studios: EquipmentStudioOption[];
}

const EMPTY_FORM: EquipmentFormData = {
  category: "",
  brand: "",
  model: "",
  description: "",
  image_url: "",
  studio_ids: [],
};

function EquipmentModal({
  mode,
  form,
  studios,
  onClose,
  onSubmit,
  isLoading,
}: {
  mode: "create" | "edit";
  form: EquipmentFormData;
  studios: EquipmentStudioOption[];
  onClose: () => void;
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  isLoading: boolean;
}) {
  const [state, setState] = useState(form);
  const [imageUploadError, setImageUploadError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof EquipmentFormData, value: string | string[]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleStudio = (studioId: string) => {
    setState((prev) => {
      const exists = prev.studio_ids.includes(studioId);
      return {
        ...prev,
        studio_ids: exists
          ? prev.studio_ids.filter((id) => id !== studioId)
          : [...prev.studio_ids, studioId],
      };
    });
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setImageUploadError("Image harus berformat JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setImageUploadError("Ukuran image maksimal 3MB.");
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/equipments/image", { method: "POST", body: data });
      const result = await res.json();
      if (!res.ok) {
        setImageUploadError(result.error ?? "Gagal mengunggah image.");
        return;
      }
      set("image_url", result.url);
    } catch {
      setImageUploadError("Kesalahan jaringan saat mengunggah image.");
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(state);
  };

  const inputCls =
    "w-full rounded-xl border border-border-custom bg-bg-secondary px-4 py-2.5 text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all";
  const labelCls = "text-[11px] font-bold uppercase tracking-wider text-text-secondary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border-custom bg-surface p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-border-custom pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
              {mode === "create" ? "New Gear" : "Edit Gear"}
            </span>
            <h2 className="text-xl font-extrabold text-white">
              {mode === "create" ? "Add Equipment" : state.model || "Edit Equipment"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-secondary transition-all hover:bg-bg-secondary hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className={labelCls}>Category *</label>
              <input
                type="text"
                required
                value={state.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Drums"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Brand *</label>
              <input
                type="text"
                required
                value={state.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="Pearl"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Model *</label>
              <input
                type="text"
                required
                value={state.model}
                onChange={(e) => set("model", e.target.value)}
                placeholder="Export Series"
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short description of the gear..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-1.5">
              <label className={labelCls}>Image</label>
              <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-white/15 bg-bg-secondary/60 p-4">
                {state.image_url ? (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src={getValidImageSrc(
                        state.image_url,
                        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&q=80"
                      )}
                      alt={state.model || "Equipment image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex min-h-36 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-text-secondary">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <ImageIcon className="h-4 w-4" />
                      No image selected
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white transition-all hover:border-accent/30 hover:bg-white/10"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploadingImage ? "Uploading..." : "Upload image"}
                  </button>
                  <input
                    type="url"
                    value={state.image_url}
                    onChange={(e) => set("image_url", e.target.value)}
                    placeholder="Or paste image URL"
                    className={inputCls}
                  />
                </div>
                {imageUploadError && <p className="text-xs text-error-custom">{imageUploadError}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelCls}>Available in studios</label>
              <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-bg-secondary/60 p-4">
                {studios.length === 0 ? (
                  <p className="text-xs text-text-secondary">No studios available yet.</p>
                ) : (
                  studios.map((studio) => {
                    const checked = state.studio_ids.includes(studio.id);
                    return (
                      <label
                        key={studio.id}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all ${
                          checked
                            ? "border-accent/30 bg-accent/10 text-white"
                            : "border-white/10 bg-white/5 text-text-secondary hover:bg-white/10"
                        }`}
                      >
                        <span>{studio.name}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleStudio(studio.id)}
                          className="h-4 w-4 accent-[#6C63FF]"
                        />
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-text-secondary transition-all hover:text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploadingImage}
              className="rounded-2xl bg-accent px-5 py-2.5 text-sm font-extrabold text-background transition-all hover:bg-accent-hover disabled:opacity-60"
            >
              {isLoading ? "Saving..." : mode === "create" ? "Create Equipment" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EquipmentsAdminClient({
  initialEquipments,
  studios,
}: EquipmentsAdminClientProps) {
  const [equipments, setEquipments] = useState<AdminEquipment[]>(initialEquipments);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeEquipment, setActiveEquipment] = useState<AdminEquipment | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return equipments;
    return equipments.filter((item) =>
      [item.category, item.brand, item.model, item.description, item.availableIn.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [equipments, search]);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/equipments", { cache: "no-store" });
      if (res.ok) {
        const fresh: AdminEquipment[] = await res.json();
        setEquipments(fresh);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const openCreate = () => {
    setActiveEquipment({
      id: "",
      category: "",
      brand: "",
      model: "",
      description: "",
      imageUrl: "",
      studioIds: [],
      availableIn: [],
      createdAt: "",
      updatedAt: "",
    });
    setModalMode("create");
  };

  const openEdit = (item: AdminEquipment) => {
    setActiveEquipment(item);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveEquipment(null);
  };

  const submitEquipment = async (form: EquipmentFormData) => {
    setIsSaving(true);
    try {
      const isCreate = modalMode === "create";
      const res = await fetch(
        isCreate ? "/api/admin/equipments" : `/api/admin/equipments/${activeEquipment?.id}`,
        {
          method: isCreate ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save equipment");
      }

      if (isCreate) {
        setEquipments((prev) => [result, ...prev]);
      } else {
        setEquipments((prev) => prev.map((item) => (item.id === result.id ? result : item)));
      }
      showToast(isCreate ? "Equipment created." : "Equipment updated.", "success");
      closeModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save equipment";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEquipment = async (item: AdminEquipment) => {
    if (!confirm(`Delete ${item.brand} ${item.model}?`)) return;
    setIsDeletingId(item.id);
    try {
      const res = await fetch(`/api/admin/equipments/${item.id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to delete equipment");
      }
      setEquipments((prev) => prev.filter((entry) => entry.id !== item.id));
      showToast("Equipment deleted.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete equipment";
      showToast(message, "error");
    } finally {
      setIsDeletingId(null);
    }
  };

  const modalForm = activeEquipment
    ? {
        category: activeEquipment.category,
        brand: activeEquipment.brand,
        model: activeEquipment.model,
        description: activeEquipment.description,
        image_url: activeEquipment.imageUrl,
        studio_ids: activeEquipment.studioIds,
      }
    : EMPTY_FORM;

  return (
    <div className="min-h-screen bg-transparent text-foreground selection:bg-accent selection:text-background">
      <AdminHeader onRefresh={refresh} isRefreshing={isRefreshing} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border-custom bg-gradient-to-r from-surface via-bg-secondary to-surface p-6 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Equipment Management</h1>
              <p className="mt-1 text-sm text-text-secondary">
                Create, edit, assign, and remove gear used across the studio pages.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search gear..."
                  className="w-full rounded-2xl border border-border-custom bg-bg-secondary py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent sm:w-72"
                />
              </div>
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-2.5 text-sm font-bold text-background transition-all hover:bg-accent-hover"
              >
                <Plus className="h-4 w-4" />
                Add Equipment
              </button>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-border-custom bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            >
              <div className="relative h-52 bg-black/30">
                {item.imageUrl ? (
                  <Image
                    src={getValidImageSrc(item.imageUrl)}
                    alt={`${item.brand} ${item.model}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-text-secondary">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {item.category}
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    {item.brand}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold text-white">{item.model}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    Available in
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.availableIn.length > 0 ? (
                      item.availableIn.map((studio) => (
                        <span
                          key={studio}
                          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white"
                        >
                          <Check className="h-3 w-3 text-success-custom" />
                          {studio}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-text-secondary">Not assigned to any studio</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-white/10"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEquipment(item)}
                    disabled={isDeletingId === item.id}
                    className="inline-flex items-center gap-2 rounded-2xl border border-error-custom/20 bg-error-custom/10 px-3 py-2 text-xs font-bold text-error-custom transition-all hover:bg-error-custom/20 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {isDeletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-surface p-10 text-center text-sm text-text-secondary">
            No equipment found.
          </div>
        )}
      </main>

      {modalMode && activeEquipment && (
        <EquipmentModal
          mode={modalMode}
          form={modalForm}
          studios={studios}
          onClose={closeModal}
          onSubmit={submitEquipment}
          isLoading={isSaving}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[60] rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl ${
            toast.type === "success"
              ? "border-success-custom/30 bg-success-custom/10 text-success-custom"
              : "border-error-custom/30 bg-error-custom/10 text-error-custom"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
