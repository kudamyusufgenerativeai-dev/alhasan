import { createClient } from "@/lib/supabase/server";

export interface Event {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  is_published: boolean;
}

/** Returns up to 3 upcoming published events (starts_at >= now) */
export async function getUpcomingEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(3);

  return data ?? [];
}

/** Returns all published events (for a future /kegiatan page) */
export async function getAllEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("starts_at", { ascending: true });

  return data ?? [];
}

/** All events including drafts — for admin */
export async function getAdminEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });

  return data ?? [];
}
