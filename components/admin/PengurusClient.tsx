"use client";

import { useState, useTransition } from "react";
import type { BoardMember } from "@/lib/data/board";
import { createBoardMember, updateBoardMember, deleteBoardMember } from "@/lib/actions/board";
import AdminShell from "@/components/admin/AdminShell";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine, RiUserLine } from "react-icons/ri";

/* ─── Shared ─────────────────────────────────────────── */
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm shadow-lg max-w-sm"
      style={{ background: type === "success" ? "#f0fdf4" : "#fef2f2", color: type === "success" ? "#15803d" : "#dc2626", border: `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}` }}>
      {msg}
    </div>
  );
}
function ConfirmDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl" style={{ background: "var(--bg)" }}>
        <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>Hapus pengurus?</h3>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>"{name}" akan dihapus permanen beserta fotonya.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>Batal</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: "#dc2626" }}>Hapus</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Member Form ────────────────────────────────────── */
function MemberForm({ initial, onSubmit, onClose, loading }: {
  initial?: BoardMember; onSubmit: (fd: FormData) => void; onClose: () => void; loading: boolean;
}) {
  const inputStyle = { borderColor: "var(--line)", background: "var(--bg)", color: "var(--ink)" };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-lg rounded-2xl shadow-xl mb-8" style={{ background: "var(--bg)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--line)" }}>
          <h2 className="font-semibold" style={{ color: "var(--ink)" }}>{initial ? "Edit Pengurus" : "Tambah Pengurus"}</h2>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-soft"><RiCloseLine /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Nama <span style={{ color: "var(--pri)" }}>*</span></label>
            <input name="name" required defaultValue={initial?.name} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Jabatan <span style={{ color: "var(--pri)" }}>*</span></label>
            <input name="role" required defaultValue={initial?.role} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Bio Singkat</label>
            <textarea name="bio" rows={2} defaultValue={initial?.bio ?? ""} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none resize-none" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Urutan</label>
            <input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>
              Foto {initial?.photo_url && <span className="text-xs font-normal ml-1" style={{ color: "var(--muted)" }}>(biarkan kosong untuk mempertahankan foto lama)</span>}
            </label>
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="w-full rounded-lg border px-3 py-2 text-sm" style={inputStyle} id="member-photo-input" />
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>JPG, PNG, WebP — maks. 5 MB</p>
          </div>
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
interface Props { members: BoardMember[] }

export default function PengurusClient({ members }: Props) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm]     = useState<"create" | BoardMember | null>(null);
  const [confirm, setConfirm] = useState<BoardMember | null>(null);
  const [toast, setToast]   = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  function handleFormSubmit(fd: FormData) {
    startTransition(async () => {
      const result = form === "create"
        ? await createBoardMember(fd)
        : await updateBoardMember((form as BoardMember).id, (form as BoardMember).photo_url, fd);
      if (result.error) { showToast("error", result.error); return; }
      showToast("success", "Pengurus berhasil disimpan.");
      setForm(null);
    });
  }

  function handleDelete(m: BoardMember) {
    startTransition(async () => {
      const result = await deleteBoardMember(m.id, m.photo_url);
      if (result.error) { showToast("error", result.error); return; }
      showToast("success", "Pengurus berhasil dihapus.");
      setConfirm(null);
    });
  }

  return (
    <AdminShell>
      {toast && <Toast {...toast} />}
      {form && <MemberForm initial={form === "create" ? undefined : (form as BoardMember)} onSubmit={handleFormSubmit} onClose={() => setForm(null)} loading={isPending} />}
      {confirm && <ConfirmDialog name={confirm.name} onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>Pengurus &amp; Ustaz</h1>
        <button id="member-add-btn" onClick={() => setForm("create")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--pri)", color: "var(--onpri)" }}>
          <RiAddLine /> Tambah
        </button>
      </div>

      {members.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>Belum ada pengurus.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ background: "var(--bg)", borderColor: "var(--line)" }}>
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0" style={{ background: "linear-gradient(135deg, var(--tint), var(--soft))" }}>
                {m.photo_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                  : <span className="w-full h-full grid place-items-center" style={{ color: "var(--muted)" }}><RiUserLine /></span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: "var(--ink)" }}>{m.name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{m.role} · Urutan {m.sort_order}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setForm(m)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-soft" style={{ color: "var(--muted)" }} aria-label="Edit"><RiEditLine size={15} /></button>
                <button onClick={() => setConfirm(m)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-soft" style={{ color: "#dc2626" }} aria-label="Hapus"><RiDeleteBinLine size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
