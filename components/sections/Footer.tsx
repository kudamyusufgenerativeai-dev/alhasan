import Link from "next/link";
import {
  RiInstagramLine,
  RiFacebookCircleLine,
  RiYoutubeLine,
  RiTiktokLine,
  RiLeafLine,
} from "react-icons/ri";
import type { MosqueSettings } from "@/lib/data/settings";

interface FooterProps {
  settings: MosqueSettings;
}

export default function Footer({ settings }: FooterProps) {
  const socials = [
    { url: settings.instagram_url, icon: RiInstagramLine, label: "Instagram" },
    { url: settings.facebook_url,  icon: RiFacebookCircleLine, label: "Facebook" },
    { url: settings.youtube_url,   icon: RiYoutubeLine, label: "YouTube" },
    { url: settings.tiktok_url,    icon: RiTiktokLine, label: "TikTok" },
  ].filter((s) => s.url);

  const year = new Date().getFullYear();

  return (
    <footer id="kontak" className="border-t" style={{ borderColor: "var(--line)", background: "var(--soft)" }}>
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-3">
        {/* Info */}
        <div>
          <div className="flex items-center gap-2 font-semibold mb-3">
            <span
              className="w-7 h-7 rounded-lg grid place-items-center text-xs"
              style={{ background: "var(--pri)", color: "var(--onpri)" }}
            >
              <RiLeafLine />
            </span>
            <span style={{ color: "var(--ink)" }}>{settings.name}</span>
          </div>
          {settings.address && (
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {settings.address}
            </p>
          )}
          <div className="mt-2 text-sm space-y-1" style={{ color: "var(--muted)" }}>
            {settings.phone && <p>📞 {settings.phone}</p>}
            {settings.whatsapp && <p>💬 {settings.whatsapp}</p>}
            {settings.email && (
              <p>
                ✉️{" "}
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:underline"
                  style={{ color: "var(--pri)" }}
                >
                  {settings.email}
                </a>
              </p>
            )}
          </div>

          {/* Social links */}
          {socials.length > 0 && (
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg grid place-items-center border hover:bg-tint transition-colors"
                  style={{ borderColor: "var(--line)", color: "var(--pri)" }}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Google Maps embed */}
        <div className="md:col-span-2">
          {settings.maps_embed_url ? (
            <iframe
              src={settings.maps_embed_url}
              className="w-full rounded-2xl border"
              style={{ minHeight: "260px", borderColor: "var(--line)" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi masjid"
            />
          ) : (
            <div
              className="w-full rounded-2xl border grid place-items-center text-sm"
              style={{
                minHeight: "260px",
                borderColor: "var(--line)",
                background: "linear-gradient(135deg, var(--tint), var(--soft))",
                color: "var(--muted)",
              }}
            >
              Peta Google Maps
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs pb-6" style={{ color: "var(--muted)" }}>
        © {year} {settings.name}. Seluruh hak cipta dilindungi.
      </p>
    </footer>
  );
}
