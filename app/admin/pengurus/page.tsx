import { getBoardMembers } from "@/lib/data/board";
import PengurusClient from "@/components/admin/PengurusClient";

export const metadata = { title: "Pengurus" };

export default async function AdminPengurusPage() {
  const members = await getBoardMembers();
  return <PengurusClient members={members} />;
}
