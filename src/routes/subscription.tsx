import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Check, Upload, Banknote, Building, CreditCard, Wallet } from "lucide-react";

export const Route = createFileRoute("/subscription")({ component: Subscription });

const PRICES = {
  doctor:     { basic: 800,  silver: 1500, gold: 3000 },
  pharmacy:   { basic: 1500, silver: 3500, gold: 6500 },
  wholesaler: { basic: 3000, silver: 6000, gold: 12000 },
  importer:   { basic: 4000, silver: 8000, gold: 16000 },
  producer:   { basic: 5000, silver: 9000, gold: 18000 },
  citizen:    { basic: 0,    silver: 0,    gold: 0 },
  admin:      { basic: 0,    silver: 0,    gold: 0 },
};

function Subscription() {
  const { t, dir } = useI18n();
  const { user } = useAuth();
  const [cycle, setCycle] = useState<"monthly"|"yearly">("monthly");
  const [picked, setPicked] = useState<"basic"|"silver"|"gold"|null>(null);
  const [method, setMethod] = useState<string|null>(null);
  const [done, setDone] = useState(false);
  if (!user) return null;
  const prices = PRICES[user.role];
  const mult = cycle === "yearly" ? 10 : 1;

  const plans: { k: "basic"|"silver"|"gold"; features: string[] }[] = [
    { k: "basic", features: [dir==="rtl"?"بحث الدواء":"Medicine search", dir==="rtl"?"كمية أساسية حسب الولاية":"Basic quantity by wilaya", dir==="rtl"?"معلومات محدودة عن المالك":"Limited owner info"]},
    { k: "silver", features: [dir==="rtl"?"تواريخ الصلاحية وأرقام التشغيلة":"Expiry & batch numbers", dir==="rtl"?"معلومات مفصلة عن المالك":"Detailed owner info", dir==="rtl"?"تقارير محدودة":"Limited reports"]},
    { k: "gold", features: [dir==="rtl"?"تحليلات متقدمة":"Advanced analytics", dir==="rtl"?"أولوية في طلبات التزويد":"Priority supply requests", dir==="rtl"?"دعم مخصص":"Dedicated support"]},
  ];

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold">{t.subscription}</h1>
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            {(["monthly","yearly"] as const).map((c) => (
              <button key={c} onClick={()=>setCycle(c)} className={`rounded-md px-3 py-1 text-xs ${cycle===c?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
                {t[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.k} className={`rounded-2xl border bg-card p-5 shadow-card ${picked===p.k?"border-primary ring-2 ring-primary/30":"border-border"}`}>
              <div className="text-sm font-semibold text-muted-foreground">{t[p.k]}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{prices[p.k]*mult}</span>
                <span className="text-xs text-muted-foreground">DZD / {t[cycle]}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f)=>(
                  <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-success"/><span>{f}</span></li>
                ))}
              </ul>
              <button onClick={()=>setPicked(p.k)} className={`mt-5 w-full rounded-lg py-2 text-sm font-medium ${picked===p.k?"bg-primary text-primary-foreground":"border border-border hover:bg-muted"}`}>
                {t.selectPlan}
              </button>
            </div>
          ))}
        </div>

        {picked && !done && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-sm font-semibold">{t.paymentMethod}</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              {[
                { k:"ccp", l:"CCP", i:<Banknote className="h-4 w-4"/> },
                { k:"bank", l:dir==="rtl"?"تحويل بنكي":"Bank transfer", i:<Building className="h-4 w-4"/> },
                { k:"agency", l:dir==="rtl"?"دفع في الوكالة":"Agency payment", i:<Wallet className="h-4 w-4"/> },
                { k:"edahabia", l:"Edahabia", i:<CreditCard className="h-4 w-4"/> },
              ].map((m) => (
                <button key={m.k} onClick={()=>setMethod(m.k)} className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${method===m.k?"border-primary bg-primary/5 text-primary":"border-border hover:bg-muted"}`}>
                  {m.i}{m.l}
                </button>
              ))}
            </div>

            {method && method !== "edahabia" && (
              <div className="mt-4 rounded-xl border border-dashed border-input p-4">
                <div className="text-xs text-muted-foreground">{dir==="rtl"?"يرجى تحويل المبلغ ورفع وصل الدفع":"Please transfer the amount and upload the receipt"}</div>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4"/>{t.uploadReceipt}
                </div>
              </div>
            )}

            {method === "edahabia" && (
              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                <div className="text-xs text-muted-foreground">{dir==="rtl"?"محاكاة بوابة الدفع الإلكتروني":"Electronic payment gateway (mock)"}</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <input placeholder="**** **** **** 1234" className="rounded-lg border border-input bg-background px-3 py-2 text-sm"/>
                  <input placeholder="MM/YY" className="rounded-lg border border-input bg-background px-3 py-2 text-sm"/>
                </div>
              </div>
            )}

            {method && (
              <button onClick={()=>setDone(true)} className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground">
                {t.submit}
              </button>
            )}
          </div>
        )}

        {done && (
          <div className="rounded-2xl border border-warning/30 bg-warning/10 p-5 text-sm">
            <div className="font-semibold">{t.pendingReview}</div>
            <div className="mt-1 text-xs text-muted-foreground">{dir==="rtl"?"سيتم تفعيل اشتراكك بعد مراجعة الدفع من طرف إدارة MediSave.":"Your subscription will be activated after MediSave admin reviews the payment."}</div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
