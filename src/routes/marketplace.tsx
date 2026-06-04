import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { MOCK_REQUESTS, WILAYAS } from "@/lib/mockData";
import { StatusBadge } from "./dashboard";
import { useState } from "react";
import { Filter, Plus } from "lucide-react";

export const Route = createFileRoute("/marketplace")({ component: Marketplace });

function Marketplace() {
  const { t, dir } = useI18n();
  const [wilaya, setWilaya] = useState("");
  const rows = MOCK_REQUESTS.filter((r) => !wilaya || r.fromWilaya === wilaya || r.toWilaya === wilaya);

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">{t.marketplace}</h1>
            <p className="text-xs text-muted-foreground">{dir==="rtl"?"طلبات وعروض التزويد بين الولايات":"Inter-wilaya supply requests and offers"}</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs"><Plus className="h-3.5 w-3.5"/>{t.requestSupply}</button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground"><Plus className="h-3.5 w-3.5"/>{dir==="rtl"?"عرض كمية متاحة":"Offer stock"}</button>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
          <Filter className="h-4 w-4 text-muted-foreground"/>
          <select value={wilaya} onChange={(e)=>setWilaya(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
            <option value="">{t.allWilayas}</option>
            {WILAYAS.map((w)=> <option key={w}>{w}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-start">#</th>
                <th className="px-3 py-2 text-start">{dir==="rtl"?"الدواء":"Medicine"}</th>
                <th className="px-3 py-2 text-start">{dir==="rtl"?"الطالب":"Requester"}</th>
                <th className="px-3 py-2 text-start">{dir==="rtl"?"من":"From"}</th>
                <th className="px-3 py-2 text-start">{dir==="rtl"?"إلى":"To"}</th>
                <th className="px-3 py-2 text-start">{t.quantity}</th>
                <th className="px-3 py-2 text-start">{dir==="rtl"?"الحالة":"Status"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 hover:bg-muted/40">
                  <td className="px-3 py-2.5 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2.5 font-medium">{r.medicineName}</td>
                  <td className="px-3 py-2.5">{r.requesterName}</td>
                  <td className="px-3 py-2.5">{r.fromWilaya}</td>
                  <td className="px-3 py-2.5">{r.toWilaya}</td>
                  <td className="px-3 py-2.5 font-semibold">{r.quantity}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={r.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
