import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllNews } from "@/lib/data/news";
import { getMosqueSettings } from "@/lib/data/settings";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita dan pengumuman terbaru dari masjid.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta",
  });
}

export default async function BeritaPage() {
  const [{ data: articles }, settings] = await Promise.all([
    getAllNews(),
    getMosqueSettings(),
  ]);

  return (
    <>
      <Navbar name={settings.name} logoUrl={settings.logo_url} donationUrl={settings.donation_url} />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
          Berita
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Informasi dan pengumuman terbaru dari {settings.name}.
        </p>

        {articles.length === 0 ? (
          <p className="mt-12 text-sm" style={{ color: "var(--muted)" }}>Belum ada berita.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} href={`/berita/${a.slug}`} className="group block">
                <div
                  className="relative rounded-2xl overflow-hidden aspect-video"
                  style={{ background: "linear-gradient(135deg, var(--tint), var(--soft))" }}
                >
                  {a.cover_url && (
                    <Image src={a.cover_url} alt={a.title} fill className="object-cover" sizes="400px" />
                  )}
                </div>
                <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>{formatDate(a.published_at)}</p>
                <h2
                  className="mt-1 font-semibold leading-snug group-hover:text-pri transition-colors"
                  style={{ color: "var(--ink)" }}
                >
                  {a.title}
                </h2>
                {a.excerpt && (
                  <p className="mt-1 text-sm line-clamp-2" style={{ color: "var(--muted)" }}>
                    {a.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer settings={settings} />
    </>
  );
}
