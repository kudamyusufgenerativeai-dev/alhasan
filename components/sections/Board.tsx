import Image from "next/image";
import type { BoardMember } from "@/lib/data/board";
import { RiUserLine } from "react-icons/ri";

interface BoardProps {
  members: BoardMember[];
}

export default function Board({ members }: BoardProps) {
  return (
    <section id="pengurus" className="py-16 md:py-24" style={{ background: "var(--soft)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
          Pengurus &amp; Ustaz
        </h2>

        {members.length === 0 ? (
          <p className="mt-8 text-sm" style={{ color: "var(--muted)" }}>
            Belum ada data pengurus.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {members.map((m) => (
              <div
                key={m.id}
                className="border rounded-2xl p-4 text-center"
                style={{ background: "var(--bg)", borderColor: "var(--line)" }}
              >
                <div className="relative w-20 h-20 rounded-full mx-auto overflow-hidden" style={{ background: "linear-gradient(135deg, var(--tint), var(--soft))" }}>
                  {m.photo_url ? (
                    <Image
                      src={m.photo_url}
                      alt={m.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center" style={{ color: "var(--muted)" }}>
                      <RiUserLine size={28} />
                    </span>
                  )}
                </div>
                <p className="mt-3 font-semibold text-sm leading-snug" style={{ color: "var(--ink)" }}>
                  {m.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {m.role}
                </p>
                {m.bio && (
                  <p className="text-xs mt-2 line-clamp-3 leading-relaxed" style={{ color: "var(--muted)" }}>
                    {m.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
