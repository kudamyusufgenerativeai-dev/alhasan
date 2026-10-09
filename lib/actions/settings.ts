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

  // 1. Coba update row id = 1 (hanya memerlukan policy UPDATE di RLS)
  const { data: updateData, error: updateError } = await supabase
    .from("mosque_settings")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select();

  // Jika update berhasil dan row 1 ditemukan
  if (!updateError && updateData && updateData.length > 0) {
    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/galeri");
    revalidatePath("/admin/pengaturan");
    return { success: true };
  }

  // 2. Jika row id = 1 belum ada sama sekali di tabel, lakukan insert
  if (!updateError && (!updateData || updateData.length === 0)) {
    const { error: insertError } = await supabase
      .from("mosque_settings")
      .insert({
        id: 1,
        ...parsed.data,
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      return {
        error: `Gagal membuat data awal di Supabase (${insertError.message}). Jalankan SQL di setup.sql pada Supabase SQL Editor.`,
      };
    }

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/galeri");
    revalidatePath("/admin/pengaturan");
    return { success: true };
  }

  if (updateError) {
    return { error: `Gagal menyimpan ke Supabase: ${updateError.message}` };
  }

  return { success: true };
}
