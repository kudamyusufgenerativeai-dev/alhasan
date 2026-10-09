import { getAllPhotos } from "@/lib/data/gallery";
import GaleriClient from "@/components/admin/GaleriClient";

export const metadata = { title: "Galeri" };

export default async function AdminGaleriPage() {
  const photos = await getAllPhotos();
  return <GaleriClient photos={photos} />;
}
