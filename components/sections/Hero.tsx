import Image from "next/image";

interface HeroProps {
  name: string;
  tagline: string | null;
  description: string | null;
  heroImageUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  donationUrl: string | null;
}

export default function Hero({
  name,
  tagline,
  description,
  heroImageUrl,
  heroTitle,
  heroSubtitle,
  donationUrl,
}: HeroProps) {
  const title       = heroTitle   ?? name;
  const subtitle    = heroSubtitle ?? tagline ?? "";
  const desc        = description ?? "Pusat ibadah, kajian, dan kegiatan sosial bagi jamaah. Mari makmurkan masjid bersama-sama.";

  return (
    <section style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        {/* Text */}
        <div>
          {subtitle && (
            <p
              className="inline-block text-xs font-medium rounded-full px-3 py-1 mb-5"
              style={{ background: "var(--tint)", color: "var(--pri)" }}
            >
              {subtitle}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight" style={{ color: "var(--ink)" }}>
            {title}
          </h1>
          <p className="mt-5 leading-relaxed max-w-lg" style={{ color: "var(--muted)" }}>
            {desc}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {donationUrl && (
              <a
                href={donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-donation-btn"
                className="font-medium px-5 py-3 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: "var(--pri)", color: "var(--onpri)" }}
              >
                Donasi Sekarang
              </a>
            )}
            <a
              href="/#tentang"
              id="hero-about-btn"
              className="font-medium px-5 py-3 rounded-lg border transition-colors hover:bg-soft"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            >
              Tentang Kami
            </a>
          </div>
        </div>

        {/* Hero image or placeholder */}
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border" style={{ borderColor: "var(--line)" }}>
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={`Gambar hero ${name}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div
              className="absolute inset-0 grid place-items-center text-sm"
              style={{ background: "linear-gradient(135deg, var(--tint), var(--soft))", color: "var(--muted)" }}
            >
              Belum ada gambar hero
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
