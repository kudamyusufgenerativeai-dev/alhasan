import { createClient } from "@/lib/supabase/server";

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  bio: string | null;
  sort_order: number;
}

export async function getBoardMembers(): Promise<BoardMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("board_members")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}
