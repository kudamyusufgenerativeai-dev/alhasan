"use client";

import { useState } from "react";
import Link from "next/link";
import { RiMenuLine, RiCloseLine, RiLeafLine } from "react-icons/ri";

const NAV_LINKS = [
  { href: "/#tentang",  label: "Tentang"  },
  { href: "/#kegiatan", label: "Kegiatan" },
  { href: "/#berita",   label: "Berita"   },
  { href: "/#galeri",   label: "Galeri"   },
  { href: "/#laporan",  label: "Laporan"  },
  { href: "/#pengurus", label: "Pengurus" },
  { href: "/#kontak",   label: "Kontak"   },
];

interface NavbarProps {
  name: string;
  logoUrl: string | null;
  donationUrl: string | null;
}

export default function Navbar({ name, logoUrl, donationUrl }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 bg-bg/90 backdrop-blur-md border-b border-line"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo + name */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-ink hover:opacity-80 transition-opacity">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={name} className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <span
              className="w-8 h-8 rounded-lg grid place-items-center text-sm"
              style={{ background: "var(--pri)", color: "var(--onpri)" }}
            >
              <RiLeafLine />
            </span>
          )}
          <span>{name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm" style={{ color: "var(--muted)" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-2">
          {donationUrl && (
            <a
              href={donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ background: "var(--pri)", color: "var(--onpri)" }}
              id="navbar-donation-btn"
            >
              Donasi
            </a>
          )}
          <button
            id="navbar-menu-btn"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 grid place-items-center rounded-lg border transition-colors hover:bg-soft"
            style={{ borderColor: "var(--line)" }}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
          >
            {open ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="lg:hidden border-t px-4 py-2 text-sm"
          style={{ borderColor: "var(--line)", background: "var(--bg)" }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 border-b last:border-0 hover:text-pri transition-colors"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
