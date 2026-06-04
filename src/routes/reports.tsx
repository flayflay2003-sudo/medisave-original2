import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { Flag } from "lucide-react";

export const Route = createFileRoute("/reports")({ component: Reports });

const TYPES = [
  "كمية غير صحيحة","دواء يظهر كمتوفر لكنه غير متوفر",
  "تاريخ صلاحية مشبوه","رقم تشغيلة خاطئ",
  "حساب مهني مشبوه","معلومات دواء خاطئة",
];

function Reports() {
  const { t, dir } = useI18n();
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{t.reports}</h1>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-3 text-sm font-semibold">{dir==="rtl"?"أرسل بلاغاً جديداً":"Submit a new report"}</div>
          <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">{TYPES.map(t=><option key={t}>{t}</option>)}</select>
          <textarea rows={4} placeholder={dir==="rtl"?"وصف البلاغ...":"Description..."} className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"/>
          <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Flag className="h-4 w-4"/>{t.submit}</button>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-3 text-sm font-semibold">{dir==="rtl"?"بلاغاتك السابقة":"Your past reports"}</div>
          <div className="text-xs text-muted-foreground">{dir==="rtl"?"لا توجد بلاغات.":"No reports yet."}</div>
        </div>
      </div>
    </AppShell>
  );
}
