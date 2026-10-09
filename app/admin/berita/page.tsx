import { getAdminNews } from "@/lib/data/news";
import BeritaClient from "@/components/admin/BeritaClient";

export const metadata = { title: "Berita" };

export default async function AdminBeritaPage() {
  const articles = await getAdminNews();
  return <BeritaClient articles={articles} />;
}
