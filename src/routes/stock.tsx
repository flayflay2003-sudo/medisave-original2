import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { WILAYAS } from "@/lib/mockData";
import { Upload, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/stock")({ component: Stock });

function Stock() {
  const { t, dir } = useI18n();
  const [tab, setTab] = useState<"manual"|"upload">("manual");

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{t.stock}</h1>
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          <button onClick={()=>setTab("manual")} className={`rounded-md px-3 py-1.5 text-xs ${tab==="manual"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>{dir==="rtl"?"إدخال يدوي":"Manual entry"}</button>
          <button onClick={()=>setTab("upload")} className={`rounded-md px-3 py-1.5 text-xs ${tab==="upload"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>Excel / CSV</button>
        </div>

        {tab==="manual" ? (
          <form className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-card md:grid-cols-2">
            {[
              {l:t.commercialName}, {l:t.scientificName}, {l:t.dosage}, {l:t.form},
              {l:t.quantity, type:"number"}, {l:t.expiryDate, type:"date"}, {l:t.batchNumber}, {l:t.commune}
            ].map((f)=>(
              <label key={f.l} className="block">
                <div className="mb-1 text-xs text-muted-foreground">{f.l}</div>
                <input type={f.type ?? "text"} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"/>
              </label>
            ))}
            <label className="block">
              <div className="mb-1 text-xs text-muted-foreground">{t.wilaya}</div>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">{WILAYAS.map(w=><option key={w}>{w}</option>)}</select>
            </label>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked/> {dir==="rtl"?"متاح للتزويد بين الولايات":"Available for inter-wilaya supply"}</label>
            <div className="md:col-span-2">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4"/>{t.save}</button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-input p-10 text-center">
              <Upload className="h-8 w-8 text-muted-foreground"/>
              <div className="text-sm font-medium">{dir==="rtl"?"اسحب ملف Excel أو CSV هنا":"Drag your Excel/CSV file here"}</div>
              <div className="text-[11px] text-muted-foreground">{dir==="rtl"?"الأعمدة المطلوبة: الدواء، المادة الفعالة، الجرعة، الشكل، الكمية، الصلاحية، التشغيلة، الولاية، البلدية، نوع المالك، متاح للتزويد":"Required columns: medicine, active ingredient, dosage, form, quantity, expiry, batch, wilaya, commune, owner type, available"}</div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
