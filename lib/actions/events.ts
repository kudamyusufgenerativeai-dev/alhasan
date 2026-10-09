"use server";

import { getAuthenticatedSupabase } from "@/lib/actions/common";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const eventSchema = z.object({
  title:        z.string().min(1, "Judul wajib diisi"),
  starts_at:    z.string().min(1, "Tanggal & jam mulai wajib diisi"),
  ends_at:      z.string().optional(),
  location:     z.string().optional(),
  description:  z.string().optional(),
  is_published: z.string().optional(),
});

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/event");
}

export async function createEvent(formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };

  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) return { error: authError ?? "Sesi tidak valid." };

  const { error } = await supabase.from("events").insert({
    ...parsed.data,
    ends_at:      parsed.data.ends_at      || null,
    location:     parsed.data.location     || null,
    description:  parsed.data.description  || null,
    is_published: parsed.data.is_published === "true",
  });

  if (error) return { error: `Gagal menyimpan event: ${error.message}` };
  revalidate();
  return { success: true };
}

export async function updateEvent(id: string, formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };

  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) return { error: authError ?? "Sesi tidak valid." };

  const { error } = await supabase.from("events").update({
    ...parsed.data,
    ends_at:      parsed.data.ends_at      || null,
    location:     parsed.data.location     || null,
    description:  parsed.data.description  || null,
    is_published: parsed.data.is_published === "true",
  }).eq("id", id);

  if (error) return { error: `Gagal memperbarui event: ${error.message}` };
  revalidate();
  return { success: true };
}

export async function deleteEvent(id: string) {
  const { supabase, error: authError } = await getAuthenticatedSupabase();
  if (authError || !supabase) return { error: authError ?? "Sesi tidak valid." };

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: `Gagal menghapus event: ${error.message}` };
  revalidate();
  return { success: true };
}
