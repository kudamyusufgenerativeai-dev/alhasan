import { getFinancialSummary } from "@/lib/data/finance";

export default function Finance() {
  const summary = getFinancialSummary();

  const cards = [
    { label: "Pemasukan",   value: summary.income  },
    { label: "Pengeluaran", value: summary.expense },
    { label: "Saldo",       value: summary.balance, highlight: true },
  ];

  return (
    <section id="laporan" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
          Laporan Keuangan
        </h2>
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          Laporan keuangan akan segera tersedia.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl p-5 border"
              style={{
                background: c.highlight ? "var(--soft)" : "var(--bg)",
                borderColor: "var(--line)",
              }}
            >
              <p className="text-sm" style={{ color: "var(--muted)" }}>{c.label}</p>
              <p
                className="mt-2 text-2xl font-semibold"
                style={{ color: c.highlight ? "var(--pri)" : "var(--ink)" }}
              >
                {c.value ?? "–"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
