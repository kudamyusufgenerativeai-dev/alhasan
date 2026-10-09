import { createClient } from "@/lib/supabase/server";

export interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

/** 8 most recently sorted photos for landing page */
export async function getLatestPhotos(): Promise<GalleryPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .limit(8);

  return data ?? [];
}

/** All photos for the full gallery page */
export async function getAllPhotos(): Promise<GalleryPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}
