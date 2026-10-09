import AdminShell from "@/components/admin/AdminShell";
import { getMosqueSettings } from "@/lib/data/settings";
import { getAdminEvents } from "@/lib/data/events";
import { getAdminNews } from "@/lib/data/news";
import { getAllPhotos } from "@/lib/data/gallery";
import { getBoardMembers } from "@/lib/data/board";
import { RiCalendarEventLine, RiNewspaperLine, RiImageLine, RiGroupLine } from "react-icons/ri";
import Link from "next/link";

export default async function AdminPage() {
  const [settings, events, news, photos, members] = await Promise.all([
    getMosqueSettings(),
    getAdminEvents(),
    getAdminNews(),
    getAllPhotos(),
    getBoardMembers(),
  ]);

  const stats = [
    { label: "Event",    value: events.length,  icon: RiCalendarEventLine, href: "/admin/event"    },
    { label: "Berita",   value: news.length,    icon: RiNewspaperLine,     href: "/admin/berita"   },
    { label: "Foto",     value: photos.length,  icon: RiImageLine,         href: "/admin/galeri"   },
    { label: "Pengurus", value: members.length, icon: RiGroupLine,         href: "/admin/pengurus" },
  ];

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--ink)" }}>Selamat datang 👋</h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Kelola konten {settings.name} dari sini.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl p-5 border hover:shadow-sm transition-shadow"
            style={{ background: "var(--bg)", borderColor: "var(--line)" }}
          >
            <s.icon size={20} style={{ color: "var(--pri)" }} />
            <p className="mt-3 text-2xl font-semibold" style={{ color: "var(--ink)" }}>{s.value}</p>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{s.label}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
