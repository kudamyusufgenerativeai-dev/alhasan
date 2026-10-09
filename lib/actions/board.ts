"use server";

import { getAuthenticatedSupabase } from "@/lib/actions/common";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "mosque-media";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/pengurus");
}

const memberSchema = z.object({
  name:       z.string().min(1, "Nama wajib diisi"),
  role:       z.string().min(1, "Jabatan wajib diisi"),
  bio:        z.string().optional(),
  sort_order: z.coerce.number().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function uploadPhoto(file: File, supabase: SupabaseClient<any, any, any>) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type))
    return { error: "Foto harus JPG, PNG, atau WebP." };
  if (file.size > 5 * 1024 * 1024)
    return { error: "Foto tidak boleh lebih dari 5 MB." };

  const ext  = file.name.split(".").pop();
  const path = `board/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) return { error: `Gagal upload foto: ${error.message}` };

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: publicUrl };
}

export async function createBoardMember(formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = memberSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };

  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) return { error: authError ?? "Sesi tidak valid." };

  let photo_url: string | null = null;

  const file = formData.get("photo") as File | null;
  if (file && file.size > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await uploadPhoto(file, supabase as any);
    if (result.error) return { error: result.error };
    photo_url = result.url!;
  }

  const { error } = await supabase.from("board_members").insert({
    name:       parsed.data.name,
    role:       parsed.data.role,
    bio:        parsed.data.bio        || null,
    sort_order: parsed.data.sort_order ?? 0,
    photo_url,
  });

  if (error) return { error: `Gagal menyimpan pengurus: ${error.message}` };
  revalidate();
  return { success: true };
}

export async function updateBoardMember(id: string, oldPhotoUrl: string | null, formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = memberSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };

  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) return { error: authError ?? "Sesi tidak valid." };

  let photo_url = oldPhotoUrl;

  const file = formData.get("photo") as File | null;
  if (file && file.size > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await uploadPhoto(file, supabase as any);
    if (result.error) return { error: result.error };
    // Delete old photo from storage
    if (oldPhotoUrl) {
      try {
        const old = new URL(oldPhotoUrl);
        const p   = old.pathname.split(`/object/public/${BUCKET}/`)[1];
        if (p) await supabase.storage.from(BUCKET).remove([p]);
      } catch {
        // Ignore URL parse error
      }
    }
    photo_url = result.url!;
  }

  const { error } = await supabase.from("board_members").update({
    name:       parsed.data.name,
    role:       parsed.data.role,
    bio:        parsed.data.bio || null,
    sort_order: parsed.data.sort_order ?? 0,
    photo_url,
  }).eq("id", id);

  if (error) return { error: `Gagal memperbarui pengurus: ${error.message}` };
  revalidate();
  return { success: true };
}

export async function deleteBoardMember(id: string, photoUrl: string | null) {
  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) return { error: authError ?? "Sesi tidak valid." };

  if (photoUrl) {
    try {
      const url  = new URL(photoUrl);
      const path = url.pathname.split(`/object/public/${BUCKET}/`)[1];
      if (path) await supabase.storage.from(BUCKET).remove([path]);
    } catch {
      // Ignore URL parse error
    }
  }

  const { error } = await supabase.from("board_members").delete().eq("id", id);
  if (error) return { error: `Gagal menghapus pengurus: ${error.message}` };
  revalidate();
  return { success: true };
}
