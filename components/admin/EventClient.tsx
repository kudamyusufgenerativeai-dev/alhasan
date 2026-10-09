"use client";

import { useState, useTransition } from "react";
import type { Event } from "@/lib/data/events";
import { createEvent, updateEvent, deleteEvent } from "@/lib/actions/events";
import AdminShell from "@/components/admin/AdminShell";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine, RiCheckLine } from "react-icons/ri";

/* ─── Toast ─────────────────────────────────────────── */
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm shadow-lg max-w-sm"
      style={{
        background: type === "success" ? "#f0fdf4" : "#fef2f2",
        color:      type === "success" ? "#15803d" : "#dc2626",
        border:     `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}`,
      }}
    >
      {type === "success" ? <RiCheckLine className="inline mr-2" /> : null}
      {msg}
    </div>
  );
}

/* ─── Confirm Dialog ─────────────────────────────────── */
function ConfirmDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl" style={{ background: "var(--bg)" }}>
        <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>Hapus event?</h3>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>Batal</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm text-white" style={{ background: "#dc2626" }}>Hapus</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Event Form ─────────────────────────────────────── */
function EventForm({
  initial,
  onSubmit,
  onClose,
  loading,
}: {
  initial?: Event;
  onSubmit: (fd: FormData) => void;
  onClose: () => void;
  loading: boolean;
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
          <h2 className="font-semibold" style={{ color: "var(--ink)" }}>{initial ? "Edit Event" : "Tambah Event"}</h2>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-soft transition-colors"><RiCloseLine /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Judul <span style={{ color: "var(--pri)" }}>*</span></label>
            <input name="title" required defaultValue={initial?.title} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Tanggal & Jam Mulai <span style={{ color: "var(--pri)" }}>*</span></label>
              <input name="starts_at" type="datetime-local" required defaultValue={initial?.starts_at?.slice(0, 16)} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Jam Selesai (opsional)</label>
              <input name="ends_at" type="datetime-local" defaultValue={initial?.ends_at?.slice(0, 16) ?? ""} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Lokasi</label>
            <input name="location" defaultValue={initial?.location ?? ""} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Deskripsi</label>
            <textarea name="description" rows={3} defaultValue={initial?.description ?? ""} className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none resize-none" style={inputStyle} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="is_published" type="checkbox" value="true" defaultChecked={initial?.is_published ?? true} className="w-4 h-4 accent-pri" />
            <span className="text-sm" style={{ color: "var(--ink)" }}>Terbit (tampil di website)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm border" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 transition-opacity hover:opacity-90" style={{ background: "var(--pri)", color: "var(--onpri)" }}>
              {loading ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
interface Props { events: Event[] }

export default function EventClient({ events }: Props) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm]   = useState<"create" | Event | null>(null);
  const [confirm, setConfirm] = useState<Event | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  function handleFormSubmit(fd: FormData) {
    startTransition(async () => {
      const result = form === "create"
        ? await createEvent(fd)
        : await updateEvent((form as Event).id, fd);

      if (result.error) { showToast("error", result.error); return; }
      showToast("success", "Event berhasil disimpan.");
      setForm(null);
    });
  }

  function handleDelete(ev: Event) {
    startTransition(async () => {
      const result = await deleteEvent(ev.id);
      if (result.error) { showToast("error", result.error); return; }
      showToast("success", "Event berhasil dihapus.");
      setConfirm(null);
    });
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

  return (
    <AdminShell>
      {toast && <Toast {...toast} />}
      {form && (
        <EventForm
          initial={form === "create" ? undefined : (form as Event)}
          onSubmit={handleFormSubmit}
          onClose={() => setForm(null)}
          loading={isPending}
        />
      )}
      {confirm && (
        <ConfirmDialog
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "var(--ink)" }}>Event</h1>
        <button
          id="event-add-btn"
          onClick={() => setForm("create")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "var(--pri)", color: "var(--onpri)" }}
        >
          <RiAddLine /> Tambah
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>Belum ada event.</p>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="flex items-start gap-4 p-4 rounded-2xl border" style={{ background: "var(--bg)", borderColor: "var(--line)" }}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "var(--ink)" }}>{ev.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{fmt(ev.starts_at)}{ev.location ? ` · ${ev.location}` : ""}</p>
              </div>
              <span
                className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                style={ev.is_published
                  ? { background: "var(--tint)", color: "var(--pri)" }
                  : { background: "var(--soft)", color: "var(--muted)" }}
              >
                {ev.is_published ? "Terbit" : "Draft"}
              </span>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setForm(ev)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-soft transition-colors" style={{ color: "var(--muted)" }} aria-label="Edit"><RiEditLine size={15} /></button>
                <button onClick={() => setConfirm(ev)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-soft transition-colors" style={{ color: "#dc2626" }} aria-label="Hapus"><RiDeleteBinLine size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
