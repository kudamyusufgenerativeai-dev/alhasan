import { createClient } from "@/lib/supabase/server";

export interface MosqueSettings {
  id: number;
  name: string;
  tagline: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  maps_embed_url: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  donation_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
}

export async function getMosqueSettings(): Promise<MosqueSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mosque_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    data ?? {
      id: 1,
      name: "Masjid",
      tagline: null,
      description: null,
      address: null,
      phone: null,
      whatsapp: null,
      email: null,
      maps_embed_url: null,
      logo_url: null,
      hero_image_url: null,
      hero_title: null,
      hero_subtitle: null,
      donation_url: null,
      instagram_url: null,
      facebook_url: null,
      youtube_url: null,
      tiktok_url: null,
    }
  );
}
