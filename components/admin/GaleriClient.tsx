"use client";

import { useTransition, useState, useRef } from "react";
import type { GalleryPhoto } from "@/lib/data/gallery";
import { uploadPhotos, deletePhoto } from "@/lib/actions/gallery";
import AdminShell from "@/components/admin/AdminShell";
import { RiUploadCloud2Line, RiDeleteBinLine } from "react-icons/ri";

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm shadow-lg max-w-sm"
      style={{ background: type === "success" ? "#f0fdf4" : "#fef2f2", color: type === "success" ? "#15803d" : "#dc2626", border: `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}` }}>
      {msg}
    </div>
  );
}

function ConfirmDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl" style={{ background: "var(--bg)" }}>
        <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>Hapus foto?</h3>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Foto akan dihapus dari storage dan database.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>Batal</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: "#dc2626" }}>Hapus</button>
        </div>
      </div>
    </div>
  );
}

interface Props { photos: GalleryPhoto[] }

export default function GaleriClient({ photos }: Props) {
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState<GalleryPhoto | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append("files", f));
    startTransition(async () => {
      const result = await uploadPhotos(fd);
      if (result.error) { showToast("error", result.error); return; }
      showToast("success", `${files.length} foto berhasil diupload.`);
    });
  }

  function handleDelete(p: GalleryPhoto) {
    startTransition(async () => {
      const result = await deletePhoto(p.id, p.image_url);
      if (result.error) { showToast("error", result.error); return; }
      showToast("success", "Foto berhasil dihapus.");
      setConfirm(null);
    });
  }

  return (
    <AdminShell>
      {toast && <Toast {...toast} />}
      {confirm && <ConfirmDialog onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>Galeri ({photos.length} foto)</h1>
      </div>

      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragover(true); }}
        onDragLeave={() => setDragover(false)}
        onDrop={e => { e.preventDefault(); setDragover(false); handleFiles(e.dataTransfer.files); }}
        className="mb-8 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors"
        style={{ borderColor: dragover ? "var(--pri)" : "var(--line)", background: dragover ? "var(--tint)" : "var(--soft)" }}
        id="gallery-upload-zone"
      >
        <RiUploadCloud2Line size={32} className="mx-auto mb-3" style={{ color: "var(--pri)" }} />
        <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
          {isPending ? "Mengupload…" : "Klik atau seret foto ke sini"}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>JPG, PNG, WebP — maks. 5 MB per file · bisa pilih banyak sekaligus</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
          id="gallery-file-input"
        />
      </div>

      {photos.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>Belum ada foto. Upload foto di atas.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((p) => (
            <div key={p.id} className="group relative rounded-xl overflow-hidden aspect-square border" style={{ borderColor: "var(--line)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt={p.caption ?? "Foto galeri"} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setConfirm(p)}
                  className="w-9 h-9 rounded-full grid place-items-center bg-red-600 text-white hover:bg-red-700 transition-colors"
                  aria-label="Hapus foto"
                >
                  <RiDeleteBinLine size={15} />
                </button>
              </div>
              {p.caption && (
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-xs text-white truncate" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                  {p.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
