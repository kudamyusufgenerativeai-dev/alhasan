"use server";

import { getAuthenticatedSupabase } from "@/lib/actions/common";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateSlug } from "@/lib/data/news";

const newsSchema = z.object({
  title:        z.string().min(1, "Judul wajib diisi"),
  slug:         z.string().optional(),
  excerpt:      z.string().optional(),
  content:      z.string().min(1, "Isi berita wajib diisi"),
  is_published: z.string().optional(),
});

function revalidate(slug?: string) {
  revalidatePath("/");
  revalidatePath("/berita");
  if (slug) revalidatePath(`/berita/${slug}`);
  revalidatePath("/admin/berita");
}

export async function createNews(formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = newsSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };

  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) return { error: authError ?? "Sesi tidak valid." };

  const slug = generateSlug(parsed.data.title);

  const { error } = await supabase.from("news").insert({
    title:        parsed.data.title,
    slug,
    excerpt:      parsed.data.excerpt      || null,
    content:      parsed.data.content,
    is_published: parsed.data.is_published === "true",
    published_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === "23505") return { error: "Slug sudah digunakan. Ubah judul atau edit slug secara manual." };
    return { error: `Gagal menyimpan berita: ${error.message}` };
  }

  revalidate(slug);
  return { success: true };
}

export async function updateNews(id: string, currentSlug: string, formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = newsSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };

  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) return { error: authError ?? "Sesi tidak valid." };

  // Use manually-edited slug if provided, otherwise keep existing slug
  const slug = (parsed.data.slug && parsed.data.slug.trim()) ? parsed.data.slug.trim() : currentSlug;

  const { error } = await supabase.from("news").update({
    title:        parsed.data.title,
    slug,
    excerpt:      parsed.data.excerpt || null,
    content:      parsed.data.content,
    is_published: parsed.data.is_published === "true",
  }).eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "Slug sudah digunakan oleh berita lain." };
    return { error: `Gagal memperbarui berita: ${error.message}` };
  }

  revalidate(slug);
  if (currentSlug !== slug) revalidatePath(`/berita/${currentSlug}`);
  return { success: true };
}

export async function deleteNews(id: string, slug: string) {
  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) return { error: authError ?? "Sesi tidak valid." };

  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return { error: `Gagal menghapus berita: ${error.message}` };
  revalidate(slug);
  return { success: true };
}
