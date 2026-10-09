"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BUCKET = "mosque-media";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

const photoSchema = z.object({
  caption:    z.string().optional(),
  sort_order: z.coerce.number().optional(),
});

export async function uploadPhotos(formData: FormData) {
  const supabase = await createClient();
  const files    = formData.getAll("files") as File[];

  if (!files.length) return { error: "Tidak ada file yang dipilih." };

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024;

  for (const file of files) {
    if (!allowed.includes(file.type))
      return { error: `File "${file.name}" bukan JPG, PNG, atau WebP.` };
    if (file.size > maxSize)
      return { error: `File "${file.name}" melebihi 5 MB.` };
  }

  const inserts: { image_url: string; sort_order: number }[] = [];

  for (const file of files) {
    const ext  = file.name.split(".").pop();
    const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file);
    if (upErr) return { error: `Gagal upload "${file.name}".` };

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    inserts.push({ image_url: publicUrl, sort_order: 0 });
  }

  const { error } = await supabase.from("gallery_photos").insert(inserts);
  if (error) return { error: "Gagal menyimpan ke database." };

  revalidate();
  return { success: true };
}

export async function updatePhoto(id: string, formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = photoSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };

  const supabase = await createClient();
  const { error } = await supabase.from("gallery_photos").update({
    caption:    parsed.data.caption    ?? null,
    sort_order: parsed.data.sort_order ?? 0,
  }).eq("id", id);

  if (error) return { error: "Gagal memperbarui foto." };
  revalidate();
  return { success: true };
}

export async function deletePhoto(id: string, imageUrl: string) {
  const supabase = await createClient();

  // Extract storage path from the public URL
  const url   = new URL(imageUrl);
  const parts = url.pathname.split(`/object/public/${BUCKET}/`);
  if (parts[1]) {
    await supabase.storage.from(BUCKET).remove([parts[1]]);
  }

  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus foto." };
  revalidate();
  return { success: true };
}
