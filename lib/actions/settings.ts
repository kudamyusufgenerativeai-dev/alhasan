"use server";

import { getAuthenticatedSupabase } from "@/lib/actions/common";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
  name:            z.string().min(1, "Nama masjid wajib diisi"),
  tagline:         z.string().optional(),
  description:     z.string().optional(),
  address:         z.string().optional(),
  phone:           z.string().optional(),
  whatsapp:        z.string().optional(),
  email:           z.string().email("Format email tidak valid").optional().or(z.literal("")),
  maps_embed_url:  z.string().url("URL tidak valid").optional().or(z.literal("")),
  hero_title:      z.string().optional(),
  hero_subtitle:   z.string().optional(),
  donation_url:    z.string().url("URL tidak valid").optional().or(z.literal("")),
  instagram_url:   z.string().url("URL tidak valid").optional().or(z.literal("")),
  facebook_url:    z.string().url("URL tidak valid").optional().or(z.literal("")),
  youtube_url:     z.string().url("URL tidak valid").optional().or(z.literal("")),
  tiktok_url:      z.string().url("URL tidak valid").optional().or(z.literal("")),
});

export async function updateSettings(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) {
    return { error: authError ?? "Sesi tidak valid." };
  }

  const { data, error } = await supabase
    .from("mosque_settings")
    .upsert(
      {
        id: 1,
        ...parsed.data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select();

  if (error) {
    return { error: `Gagal menyimpan ke Supabase: ${error.message}` };
  }

  if (!data || data.length === 0) {
    return { error: "Data tidak tersimpan. Pastikan tabel 'mosque_settings' dan policy RLS di Supabase sudah dibuat sesuai setup.sql." };
  }

  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath("/galeri");
  revalidatePath("/admin/pengaturan");
  return { success: true };
}
