import { ABOUT_STATS } from "@/lib/data/about";

interface AboutProps {
  description: string | null;
  address: string | null;
}

export default function About({ description, address }: AboutProps) {
  return (
    <section id="tentang" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-start">
        {/* Text */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
            Tentang Masjid
          </h2>
          {description && (
            <p className="mt-4 leading-relaxed" style={{ color: "var(--muted)" }}>
              {description}
            </p>
          )}
          {address && (
            <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
              📍 {address}
            </p>
          )}
        </div>

        {/* Static stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {ABOUT_STATS.map((s) => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: "var(--soft)" }}>
              <p className="text-2xl font-semibold" style={{ color: "var(--pri)" }}>
                {s.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
