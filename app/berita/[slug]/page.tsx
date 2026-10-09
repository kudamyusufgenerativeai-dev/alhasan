import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { getNewsBySlug } from "@/lib/data/news";
import { getMosqueSettings } from "@/lib/data/settings";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { RiWhatsappLine, RiArrowLeftLine } from "react-icons/ri";
import Link from "next/link";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? "",
      images: article.cover_url ? [article.cover_url] : [],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta",
  });
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([
    getNewsBySlug(slug),
    getMosqueSettings(),
  ]);

  if (!article) notFound();

  const shareUrl  = `${process.env.NEXT_PUBLIC_SITE_URL}/berita/${article.slug}`;
  const shareText = encodeURIComponent(`${article.title}\n${shareUrl}`);
  const waUrl     = `https://wa.me/?text=${shareText}`;

  return (
    <>
      <Navbar name={settings.name} logoUrl={settings.logo_url} donationUrl={settings.donation_url} />
      <main className="mx-auto max-w-3xl px-4 py-14">
        {/* Back */}
        <Link href="/berita" className="inline-flex items-center gap-1.5 text-sm mb-8 hover:underline" style={{ color: "var(--pri)" }}>
          <RiArrowLeftLine /> Semua berita
        </Link>

        {/* Meta */}
        <p className="text-xs" style={{ color: "var(--muted)" }}>{formatDate(article.published_at)}</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight leading-tight" style={{ color: "var(--ink)" }}>
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-3 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            {article.excerpt}
          </p>
        )}

        {/* Cover */}
        {article.cover_url && (
          <div className="relative mt-8 rounded-2xl overflow-hidden aspect-video">
            <Image src={article.cover_url} alt={article.title} fill className="object-cover" sizes="720px" priority />
          </div>
        )}

        {/* Content */}
        <div className="prose mt-10">
          <ReactMarkdown>{article.content ?? ""}</ReactMarkdown>
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t flex items-center gap-4" style={{ borderColor: "var(--line)" }}>
          <span className="text-sm" style={{ color: "var(--muted)" }}>Bagikan:</span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#25D366", color: "#fff" }}
            id="share-whatsapp-btn"
          >
            <RiWhatsappLine size={16} /> WhatsApp
          </a>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
