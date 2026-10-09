import type { Metadata } from "next";
import { getAllPhotos } from "@/lib/data/gallery";
import { getMosqueSettings } from "@/lib/data/settings";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import GalleryGrid from "@/components/sections/Gallery";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Galeri",
  description: "Foto-foto kegiatan dan suasana masjid.",
};

export default async function GaleriPage() {
  const [photos, settings] = await Promise.all([
    getAllPhotos(),
    getMosqueSettings(),
  ]);

  return (
    <>
      <Navbar name={settings.name} logoUrl={settings.logo_url} donationUrl={settings.donation_url} />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
          Galeri
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Foto-foto kegiatan dan suasana {settings.name}.
        </p>
        <div className="mt-10">
          {/* Reuse Gallery component but override photo count (no limit on full page) */}
          {photos.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Belum ada foto.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.map((p, i) => (
                <div
                  key={p.id}
                  className="relative rounded-xl overflow-hidden aspect-square border"
                  style={{ borderColor: "var(--line)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image_url}
                    alt={p.caption ?? `Foto ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
