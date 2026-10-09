"use client";

import { useState, useTransition } from "react";
import type { NewsItem } from "@/lib/data/news";
import { createNews, updateNews, deleteNews } from "@/lib/actions/news";
import AdminShell from "@/components/admin/AdminShell";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine, RiEyeLine } from "react-icons/ri";
import ReactMarkdown from "react-markdown";

/* ─── Shared ─────────────────────────────────────────── */
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm shadow-lg max-w-sm"
      style={{ background: type === "success" ? "#f0fdf4" : "#fef2f2", color: type === "success" ? "#15803d" : "#dc2626", border: `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}` }}>
      {msg}
    </div>
  );
}
function ConfirmDialog({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl" style={{ background: "var(--bg)" }}>
        <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>Hapus berita?</h3>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>"{label}" akan dihapus permanen.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>Batal</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: "#dc2626" }}>Hapus</button>
        </div>
      </div>
    </div>
  );
}

/* ─── News Form ──────────────────────────────────────── */
function NewsForm({ initial, onSubmit, onClose, loading }: {
  initial?: NewsItem; onSubmit: (fd: FormData) => void; onClose: () => void; loading: boolean;
}) {
  const [content, setContent]   = useState(initial?.content ?? "");
  const [preview, setPreview]   = useState(false);
  const inputStyle = { borderColor: "var(--line)", background: "var(--bg)", color: "var(--ink)" };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("content", content);
    onSubmit(fd);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-2xl rounded-2xl shadow-xl mb-8" style={{ background: "var(--bg)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--line)" }}>
          <h2 className="font-semibold" style={{ color: "var(--ink)" }}>{initial ? "Edit Berita" : "Tambah Berita"}</h2>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-soft"><RiCloseLine /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Judul <span style={{ color: "var(--pri)" }}>*</span></label>
            <input name="title" required defaultValue={initial?.title} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>

          {initial && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>
                Slug
                <span className="ml-2 text-xs font-normal" style={{ color: "var(--muted)" }}>(kosongkan untuk mempertahankan slug saat ini)</span>
              </label>
              <input name="slug" defaultValue={initial.slug} placeholder={initial.slug} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none font-mono" style={inputStyle} />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Kutipan</label>
            <textarea name="excerpt" rows={2} defaultValue={initial?.excerpt ?? ""} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none resize-none" style={inputStyle} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--ink)" }}>Isi (Markdown) <span style={{ color: "var(--pri)" }}>*</span></label>
              <button
                type="button"
                onClick={() => setPreview(v => !v)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors"
                style={{ borderColor: "var(--line)", color: "var(--muted)" }}
              >
                <RiEyeLine size={12} /> {preview ? "Edit" : "Pratinjau"}
              </button>
            </div>
            {preview ? (
              <div className="prose border rounded-lg p-4 min-h-[200px]" style={{ borderColor: "var(--line)" }}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={10}
                placeholder="# Judul&#10;&#10;Tulis isi berita dalam format Markdown..."
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none resize-y font-mono"
                style={inputStyle}
                required
              />
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input name="is_published" type="checkbox" value="true" defaultChecked={initial?.is_published ?? true} className="w-4 h-4" />
            <span className="text-sm" style={{ color: "var(--ink)" }}>Terbit</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm border" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 hover:opacity-90" style={{ background: "var(--pri)", color: "var(--onpri)" }}>
              {loading ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
interface Props { articles: NewsItem[] }

export default function BeritaClient({ articles }: Props) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm]     = useState<"create" | NewsItem | null>(null);
  const [confirm, setConfirm] = useState<NewsItem | null>(null);
  const [toast, setToast]   = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  function handleFormSubmit(fd: FormData) {
    startTransition(async () => {
      const result = form === "create"
        ? await createNews(fd)
        : await updateNews((form as NewsItem).id, (form as NewsItem).slug, fd);
      if (result.error) { showToast("error", result.error); return; }
      showToast("success", "Berita berhasil disimpan.");
      setForm(null);
    });
  }

  function handleDelete(a: NewsItem) {
    startTransition(async () => {
      const result = await deleteNews(a.id, a.slug);
      if (result.error) { showToast("error", result.error); return; }
      showToast("success", "Berita berhasil dihapus.");
      setConfirm(null);
    });
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" });

  return (
    <AdminShell>
      {toast && <Toast {...toast} />}
      {form && <NewsForm initial={form === "create" ? undefined : (form as NewsItem)} onSubmit={handleFormSubmit} onClose={() => setForm(null)} loading={isPending} />}
      {confirm && <ConfirmDialog label={confirm.title} onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>Berita</h1>
        <button id="news-add-btn" onClick={() => setForm("create")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--pri)", color: "var(--onpri)" }}>
          <RiAddLine /> Tambah
        </button>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>Belum ada berita.</p>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a.id} className="flex items-start gap-4 p-4 rounded-2xl border" style={{ background: "var(--bg)", borderColor: "var(--line)" }}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "var(--ink)" }}>{a.title}</p>
                <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted)" }}>/berita/{a.slug} · {fmt(a.published_at)}</p>
              </div>
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                style={a.is_published ? { background: "var(--tint)", color: "var(--pri)" } : { background: "var(--soft)", color: "var(--muted)" }}>
                {a.is_published ? "Terbit" : "Draft"}
              </span>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setForm(a)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-soft" style={{ color: "var(--muted)" }} aria-label="Edit"><RiEditLine size={15} /></button>
                <button onClick={() => setConfirm(a)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-soft" style={{ color: "#dc2626" }} aria-label="Hapus"><RiDeleteBinLine size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
