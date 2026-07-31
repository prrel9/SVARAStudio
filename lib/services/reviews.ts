import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";

export async function getReviews(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      studios (
        name
      )
    `)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data.map((item: Record<string, unknown>) => ({
    id: String(item.id),
    name: String(item.customer_name || "Anonymous"),
    role: "Customer", // Fallback role as it's not in DB
    avatar: String(item.avatar_url || `https://i.pravatar.cc/150?u=${item.id}`),
    rating: Number(item.rating || 5),
    comment: String(item.comment || ""),
    studioUsed: String((item.studios as { name?: string })?.name || ""),
  }));
}
