import { createClient } from "@/lib/supabase/server";

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  content: string;
  is_published: boolean;
  published_at: string;
}

/** 3 latest published articles for the landing page */
export async function getLatestNews(): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, cover_url, published_at, is_published")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  return data ?? [];
}

/** All published articles with pagination */
export async function getAllNews(page = 1, perPage = 9): Promise<{ data: NewsItem[]; count: number }> {
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to   = from + perPage - 1;

  const { data, count } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, cover_url, published_at, is_published", { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(from, to);

  return { data: data ?? [], count: count ?? 0 };
}

/** Single article by slug (public) */
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return data ?? null;
}

/** All articles including drafts — for admin */
export async function getAdminNews(): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  return data ?? [];
}

/** Generate a slug from a title (used in Server Actions) */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
