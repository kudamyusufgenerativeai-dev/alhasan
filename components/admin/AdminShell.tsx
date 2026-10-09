"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  RiLeafLine,
  RiSettings3Line,
  RiCalendarEventLine,
  RiNewspaperLine,
  RiImageLine,
  RiGroupLine,
  RiLogoutBoxLine,
  RiDashboardLine,
} from "react-icons/ri";

const NAV = [
  { href: "/admin",            icon: RiDashboardLine,      label: "Ringkasan" },
  { href: "/admin/pengaturan", icon: RiSettings3Line,      label: "Pengaturan" },
  { href: "/admin/event",      icon: RiCalendarEventLine,  label: "Event" },
  { href: "/admin/berita",     icon: RiNewspaperLine,      label: "Berita" },
  { href: "/admin/galeri",     icon: RiImageLine,          label: "Galeri" },
  { href: "/admin/pengurus",   icon: RiGroupLine,          label: "Pengurus" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh flex" style={{ background: "var(--soft)" }}>
      {/* Sidebar (desktop) */}
      <aside
        className="hidden lg:flex flex-col w-56 shrink-0 border-r"
        style={{ background: "var(--bg)", borderColor: "var(--line)" }}
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2 border-b" style={{ borderColor: "var(--line)" }}>
          <span className="w-7 h-7 rounded-lg grid place-items-center text-xs" style={{ background: "var(--pri)", color: "var(--onpri)" }}>
            <RiLeafLine />
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Dashboard</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  background: active ? "var(--tint)" : "transparent",
                  color: active ? "var(--pri)" : "var(--muted)",
                  fontWeight: active ? 500 : 400,
                }}
              >
                <n.icon size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-soft"
            style={{ color: "var(--muted)" }}
          >
            <RiLogoutBoxLine size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header
          className="lg:hidden h-14 flex items-center justify-between px-4 border-b"
          style={{ background: "var(--bg)", borderColor: "var(--line)" }}
        >
          <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Dashboard</span>
          <button
            onClick={handleLogout}
            className="text-sm flex items-center gap-1.5"
            style={{ color: "var(--muted)" }}
          >
            <RiLogoutBoxLine size={15} /> Keluar
          </button>
        </header>

        {/* Mobile bottom nav */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t"
          style={{ background: "var(--bg)", borderColor: "var(--line)" }}
        >
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors"
                style={{ color: active ? "var(--pri)" : "var(--muted)" }}
              >
                <n.icon size={18} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 px-4 py-6 lg:px-8 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
