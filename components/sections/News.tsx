import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/data/news";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

interface NewsProps {
  articles: NewsItem[];
}

export default function News({ articles }: NewsProps) {
  return (
    <section id="berita" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
            Berita Terbaru
          </h2>
          <Link
            href="/berita"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--pri)" }}
          >
            Lihat semua →
          </Link>
        </div>

        {articles.length === 0 ? (
          <p className="mt-8 text-sm" style={{ color: "var(--muted)" }}>
            Belum ada berita.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/berita/${a.slug}`}
                className="group block"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-video" style={{ background: "linear-gradient(135deg, var(--tint), var(--soft))" }}>
                  {a.cover_url && (
                    <Image src={a.cover_url} alt={a.title} fill className="object-cover" sizes="400px" />
                  )}
                </div>
                <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                  {formatDate(a.published_at)}
                </p>
                <h3
                  className="mt-1 font-semibold leading-snug group-hover:transition-colors"
                  style={{ color: "var(--ink)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pri)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
                >
                  {a.title}
                </h3>
                {a.excerpt && (
                  <p className="mt-1 text-sm line-clamp-2" style={{ color: "var(--muted)" }}>
                    {a.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
