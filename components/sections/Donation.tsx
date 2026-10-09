interface DonationProps {
  donationUrl: string | null;
}

export default function Donation({ donationUrl }: DonationProps) {
  if (!donationUrl) return null;

  return (
    <section id="donasi" className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div
          className="rounded-3xl px-6 py-12 md:py-16 text-center border"
          style={{ background: "var(--tint)", borderColor: "var(--line)" }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
            Mari berdonasi untuk masjid
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            Setiap kontribusi membantu operasional, pembangunan, dan program sosial masjid.
          </p>
          <a
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="donation-section-btn"
            className="mt-7 inline-block font-medium px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "var(--pri)", color: "var(--onpri)" }}
          >
            Donasi via Google Form
          </a>
        </div>
      </div>
    </section>
  );
}
