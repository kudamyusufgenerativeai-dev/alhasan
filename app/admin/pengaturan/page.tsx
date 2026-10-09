import { getMosqueSettings } from "@/lib/data/settings";
import PengaturanForm from "@/components/admin/PengaturanForm";

export const metadata = { title: "Pengaturan" };

export default async function PengaturanPage() {
  const settings = await getMosqueSettings();
  return <PengaturanForm settings={settings} />;
}
