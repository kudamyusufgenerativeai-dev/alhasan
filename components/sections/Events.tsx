"use client";

import { useState } from "react";
import Image from "next/image";
import { RiCalendarLine, RiMapPinLine, RiTimeLine, RiCloseLine } from "react-icons/ri";
import type { Event } from "@/lib/data/events";

function formatEventDate(startsAt: string, endsAt?: string | null): string {
  const d = new Date(startsAt);
  const days  = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];
  const day  = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });

  let label = `${day}, ${date} ${month} · ${time} WIB`;
  if (endsAt) {
    const end = new Date(endsAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
    label += ` – ${end}`;
  }
  return label;
}

function EventDialog({ event, onClose }: { event: Event; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {event.image_url && (
          <div className="relative aspect-video w-full">
            <Image src={event.image_url} alt={event.title} fill className="object-cover" sizes="512px" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>{event.title}</h3>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 rounded-lg grid place-items-center hover:bg-soft transition-colors"
              aria-label="Tutup"
            >
              <RiCloseLine size={18} />
            </button>
          </div>
          <div className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <p className="flex items-center gap-2">
              <RiCalendarLine />
              {formatEventDate(event.starts_at, event.ends_at)}
            </p>
            {event.location && (
              <p className="flex items-center gap-2">
                <RiMapPinLine />
                {event.location}
              </p>
            )}
          </div>
          {event.description && (
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface EventsProps {
  events: Event[];
}

export default function Events({ events }: EventsProps) {
  const [selected, setSelected] = useState<Event | null>(null);

  return (
    <section id="kegiatan" className="py-16 md:py-24" style={{ background: "var(--soft)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
          Kegiatan Mendatang
        </h2>

        {events.length === 0 ? (
          <p className="mt-8 text-sm" style={{ color: "var(--muted)" }}>
            Belum ada kegiatan mendatang.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {events.map((ev) => (
              <article
                key={ev.id}
                onClick={() => setSelected(ev)}
                className="rounded-2xl p-5 cursor-pointer border hover:shadow-md transition-shadow"
                style={{ background: "var(--bg)", borderColor: "var(--line)" }}
              >
                <div className="rounded-xl overflow-hidden aspect-video mb-4 relative" style={{ background: "linear-gradient(135deg, var(--tint), var(--soft))" }}>
                  {ev.image_url && (
                    <Image src={ev.image_url} alt={ev.title} fill className="object-cover" sizes="400px" />
                  )}
                </div>
                <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: "var(--pri)" }}>
                  <RiTimeLine size={12} />
                  {formatEventDate(ev.starts_at, ev.ends_at)}
                </p>
                <h3 className="mt-1 font-semibold text-sm leading-snug" style={{ color: "var(--ink)" }}>
                  {ev.title}
                </h3>
                {ev.location && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                    <RiMapPinLine size={11} /> {ev.location}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {selected && <EventDialog event={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
