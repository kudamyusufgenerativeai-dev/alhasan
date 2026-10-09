"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiCloseLine, RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import type { GalleryPhoto } from "@/lib/data/gallery";

interface LightboxProps {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
}

function Lightbox({ photos, index, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () => setCurrent((i) => Math.min(photos.length - 1, i + 1));
  const photo = photos[current];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full grid place-items-center text-white hover:bg-white/20 transition-colors"
        aria-label="Tutup"
      >
        <RiCloseLine size={22} />
      </button>

      <div
        className="relative w-full max-w-3xl max-h-[80vh] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.image_url}
          alt={photo.caption ?? `Foto ${current + 1}`}
          width={1200}
          height={800}
          className="w-full h-full object-contain"
          style={{ maxHeight: "80vh" }}
        />
      </div>

      {photo.caption && (
        <p className="mt-3 text-sm text-white/80 text-center max-w-lg">{photo.caption}</p>
      )}

      <div className="flex items-center gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={prev}
          disabled={current === 0}
          className="w-10 h-10 rounded-full grid place-items-center text-white hover:bg-white/20 transition-colors disabled:opacity-30"
          aria-label="Foto sebelumnya"
        >
          <RiArrowLeftLine size={20} />
        </button>
        <span className="text-white/60 text-sm">{current + 1} / {photos.length}</span>
        <button
          onClick={next}
          disabled={current === photos.length - 1}
          className="w-10 h-10 rounded-full grid place-items-center text-white hover:bg-white/20 transition-colors disabled:opacity-30"
          aria-label="Foto berikutnya"
        >
          <RiArrowRightLine size={20} />
        </button>
      </div>
    </div>
  );
}

interface GalleryProps {
  photos: GalleryPhoto[];
}

export default function Gallery({ photos }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="galeri" className="py-16 md:py-24" style={{ background: "var(--soft)" }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
            Galeri
          </h2>
          <Link
            href="/galeri"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--pri)" }}
          >
            Lihat semua →
          </Link>
        </div>

        {photos.length === 0 ? (
          <p className="mt-8 text-sm" style={{ color: "var(--muted)" }}>
            Belum ada foto.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setLightboxIndex(i)}
                className="relative rounded-xl overflow-hidden aspect-square border hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ borderColor: "var(--line)", ["--tw-ring-color" as string]: "var(--pri)" }}
                aria-label={p.caption ?? `Foto ${i + 1}`}
              >
                <Image
                  src={p.image_url}
                  alt={p.caption ?? `Foto galeri ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </button>
            ))}
            {/* Placeholder slots if fewer than 8 */}
            {Array.from({ length: Math.max(0, 8 - photos.length) }).map((_, i) => (
              <div
                key={`ph-${i}`}
                className="rounded-xl aspect-square border"
                style={{ background: "linear-gradient(135deg, var(--tint), var(--soft))", borderColor: "var(--line)" }}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
