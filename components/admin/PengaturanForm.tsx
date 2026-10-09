"use client";

import { useState, useTransition } from "react";
import type { MosqueSettings } from "@/lib/data/settings";
import { updateSettings } from "@/lib/actions/settings";
import AdminShell from "@/components/admin/AdminShell";

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  multiline?: boolean;
}

function Field({ label, name, type = "text", defaultValue, placeholder, required, hint, multiline }: FieldProps) {
  const inputStyle = {
    borderColor: "var(--line)",
    background: "var(--bg)",
    color: "var(--ink)",
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>
        {label} {required && <span style={{ color: "var(--pri)" }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-offset-1 resize-none"
          style={inputStyle}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-offset-1"
          style={inputStyle}
        />
      )}
      {hint && <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{hint}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold pt-6 pb-3 border-b mb-4" style={{ color: "var(--pri)", borderColor: "var(--line)" }}>
      {children}
    </h2>
  );
}

interface PengaturanFormProps {
  settings: MosqueSettings;
}

export default function PengaturanForm({ settings }: PengaturanFormProps) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateSettings(formData);
      setToast(
        result.success
          ? { type: "success", msg: "Pengaturan berhasil disimpan." }
          : { type: "error", msg: result.error ?? "Terjadi kesalahan." }
      );
      setTimeout(() => setToast(null), 4000);
    });
  }

  return (
    <AdminShell>
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold mb-6" style={{ color: "var(--ink)" }}>Pengaturan Masjid</h1>

        {toast && (
          <div
            className="mb-6 px-4 py-3 rounded-lg text-sm"
            style={{
              background: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: toast.type === "success" ? "#15803d" : "#dc2626",
              border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            {toast.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <SectionTitle>Identitas Masjid</SectionTitle>
          <Field label="Nama Masjid" name="name" defaultValue={settings.name} required />
          <Field label="Tagline" name="tagline" defaultValue={settings.tagline} placeholder="Slogan singkat masjid" />
          <Field label="Deskripsi" name="description" defaultValue={settings.description} multiline hint="Ditampilkan di section Tentang dan meta description." />

          <SectionTitle>Kontak &amp; Lokasi</SectionTitle>
          <Field label="Alamat Lengkap" name="address" defaultValue={settings.address} multiline />
          <Field label="Telepon" name="phone" type="tel" defaultValue={settings.phone} placeholder="+62..." />
          <Field label="WhatsApp" name="whatsapp" type="tel" defaultValue={settings.whatsapp} placeholder="+62..." />
          <Field label="Email" name="email" type="email" defaultValue={settings.email} />
          <Field
            label="URL Embed Google Maps"
            name="maps_embed_url"
            type="url"
            defaultValue={settings.maps_embed_url}
            placeholder="https://www.google.com/maps/embed?pb=..."
            hint="Salin URL src dari kode iframe Google Maps (bukan kode iframe lengkap)."
          />

          <SectionTitle>Hero</SectionTitle>
          <Field label="Judul Hero" name="hero_title" defaultValue={settings.hero_title} placeholder="Nama atau slogan utama masjid" />
          <Field label="Subjudul Hero" name="hero_subtitle" defaultValue={settings.hero_subtitle} placeholder="Alamat singkat atau tagline" />

          <SectionTitle>Donasi</SectionTitle>
          <Field
            label="Link Donasi (Google Form)"
            name="donation_url"
            type="url"
            defaultValue={settings.donation_url}
            placeholder="https://forms.gle/..."
            hint="Kosongkan untuk menyembunyikan tombol Donasi."
          />

          <SectionTitle>Media Sosial</SectionTitle>
          <Field label="Instagram" name="instagram_url" type="url" defaultValue={settings.instagram_url} placeholder="https://instagram.com/..." />
          <Field label="Facebook"  name="facebook_url"  type="url" defaultValue={settings.facebook_url}  placeholder="https://facebook.com/..." />
          <Field label="YouTube"   name="youtube_url"   type="url" defaultValue={settings.youtube_url}   placeholder="https://youtube.com/..." />
          <Field label="TikTok"    name="tiktok_url"    type="url" defaultValue={settings.tiktok_url}    placeholder="https://tiktok.com/..." />

          <div className="pt-4">
            <button
              type="submit"
              id="settings-save-btn"
              disabled={isPending}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--pri)", color: "var(--onpri)" }}
            >
              {isPending ? "Menyimpan…" : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
