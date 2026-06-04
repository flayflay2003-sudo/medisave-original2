import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { MOCK_REQUESTS, WILAYAS } from "@/lib/mockData";
import { StatusBadge } from "./dashboard";
import { Users, Clock, Boxes, CheckCircle2, CreditCard, TrendingUp, ShieldCheck, X, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin")({ component: AdminDash });

const PENDING_REGS = [
  { id: "R-001", name: "Pharmacie El Wifak", role: "pharmacy", wilaya: "Béjaïa", date: "2026-06-03" },
  { id: "R-002", name: "Imex Pharma Sud", role: "importer", wilaya: "Ouargla", date: "2026-06-02" },
  { id: "R-003", name: "Dr. Salim Adjout", role: "doctor", wilaya: "Constantine", date: "2026-06-02" },
];
const PAYMENTS = [
  { id: "P-091", who: "Pharmacie Centrale", plan: "silver", cycle: "monthly", method: "CCP", amount: 3500 },
  { id: "P-092", who: "Saidal Group", plan: "gold", cycle: "yearly", method: "bank", amount: 180000 },
];

function AdminDash() {
  const { t, dir } = useI18n();
  const [regs, setRegs] = useState(PENDING_REGS);
  const [payments, setPayments] = useState(PAYMENTS);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">{dir==="rtl"?"لوحة تحكم إدارة MediSave":"MediSave admin dashboard"}</h1>
          <p className="text-xs text-muted-foreground">{dir==="rtl"?"إدارة المستخدمين، الاشتراكات، والعمليات بين الولايات":"Manage users, subscriptions and inter-wilaya operations"}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <K icon={<Users/>} l={t.totalUsers} v="1,284"/>
          <K icon={<Clock/>} l={t.pendingRegs} v={String(regs.length)}/>
          <K icon={<Boxes/>} l={t.activeRequests} v="14"/>
          <K icon={<CheckCircle2/>} l={dir==="rtl"?"عمليات مكتملة":"Completed ops"} v="86"/>
          <K icon={<CreditCard/>} l={t.revenue} v="612,000 DZD"/>
          <K icon={<TrendingUp/>} l={t.transactionFees} v="74,200 DZD"/>
          <K icon={<ShieldCheck/>} l={dir==="rtl"?"حسابات موثّقة":"Verified accounts"} v="312"/>
          <K icon={<Boxes/>} l={dir==="rtl"?"تحديثات قيد المراجعة":"Stock updates pending"} v="22"/>
        </div>

        {/* Pending registrations */}
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-4 text-sm font-semibold">{dir==="rtl"?"طلبات تسجيل بانتظار المراجعة":"Pending registration requests"}</div>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground"><tr className="border-b border-border">
              <th className="px-3 py-2 text-start">#</th><th className="px-3 py-2 text-start">{dir==="rtl"?"الاسم":"Name"}</th>
              <th className="px-3 py-2 text-start">{t.accountType}</th><th className="px-3 py-2 text-start">{t.wilaya}</th>
              <th className="px-3 py-2 text-start">{dir==="rtl"?"التاريخ":"Date"}</th><th className="px-3 py-2 text-end">{dir==="rtl"?"إجراء":"Action"}</th>
            </tr></thead>
            <tbody>
              {regs.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="px-3 py-2.5 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2.5 font-medium">{r.name}</td>
                  <td className="px-3 py-2.5"><span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{t[r.role as keyof typeof t] as string}</span></td>
                  <td className="px-3 py-2.5">{r.wilaya}</td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.date}</td>
                  <td className="px-3 py-2.5 text-end">
                    <div className="inline-flex gap-1">
                      <button onClick={()=>setRegs(regs.filter(x=>x.id!==r.id))} className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-[11px] text-success"><Check className="h-3 w-3"/>{dir==="rtl"?"قبول":"Approve"}</button>
                      <button onClick={()=>setRegs(regs.filter(x=>x.id!==r.id))} className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-[11px] text-destructive"><X className="h-3 w-3"/>{dir==="rtl"?"رفض":"Reject"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payments */}
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-4 text-sm font-semibold">{dir==="rtl"?"دفعات اشتراك بانتظار التأكيد":"Subscription payments pending"}</div>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground"><tr className="border-b border-border">
              <th className="px-3 py-2 text-start">#</th><th className="px-3 py-2 text-start">{dir==="rtl"?"الحساب":"Account"}</th>
              <th className="px-3 py-2 text-start">{dir==="rtl"?"الخطة":"Plan"}</th><th className="px-3 py-2 text-start">{dir==="rtl"?"الدورة":"Cycle"}</th>
              <th className="px-3 py-2 text-start">{t.paymentMethod}</th><th className="px-3 py-2 text-start">{dir==="rtl"?"المبلغ":"Amount"}</th>
              <th className="px-3 py-2 text-end">{dir==="rtl"?"إجراء":"Action"}</th>
            </tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border/60">
                  <td className="px-3 py-2.5 font-mono text-xs">{p.id}</td>
                  <td className="px-3 py-2.5 font-medium">{p.who}</td>
                  <td className="px-3 py-2.5">{t[p.plan as keyof typeof t] as string}</td>
                  <td className="px-3 py-2.5">{t[p.cycle as keyof typeof t] as string}</td>
                  <td className="px-3 py-2.5">{p.method}</td>
                  <td className="px-3 py-2.5 font-semibold">{p.amount.toLocaleString()} DZD</td>
                  <td className="px-3 py-2.5 text-end">
                    <button onClick={()=>setPayments(payments.filter(x=>x.id!==p.id))} className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] text-primary-foreground"><Check className="h-3 w-3"/>{dir==="rtl"?"تأكيد":"Confirm"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Supply ops */}
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-4 text-sm font-semibold">{dir==="rtl"?"عمليات تزويد بين الولايات":"Inter-wilaya supply operations"}</div>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground"><tr className="border-b border-border">
              <th className="px-3 py-2 text-start">#</th>
              <th className="px-3 py-2 text-start">{dir==="rtl"?"الدواء":"Medicine"}</th>
              <th className="px-3 py-2 text-start">{dir==="rtl"?"من":"From"}</th>
              <th className="px-3 py-2 text-start">{dir==="rtl"?"إلى":"To"}</th>
              <th className="px-3 py-2 text-start">{t.quantity}</th>
              <th className="px-3 py-2 text-start">{dir==="rtl"?"الحالة":"Status"}</th>
            </tr></thead>
            <tbody>
              {MOCK_REQUESTS.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="px-3 py-2.5 font-mono text-xs">{r.id}</td>
                  <td className="px-3 py-2.5">{r.medicineName}</td>
                  <td className="px-3 py-2.5">{r.fromWilaya}</td>
                  <td className="px-3 py-2.5">{r.toWilaya}</td>
                  <td className="px-3 py-2.5 font-semibold">{r.quantity}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={r.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* demand chart */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="text-sm font-semibold">{dir==="rtl"?"الطلب حسب الولاية":"Demand by wilaya"}</div>
          <div className="mt-4 grid grid-cols-6 gap-3 md:grid-cols-12">
            {WILAYAS.slice(0,24).map((w,i)=>(
              <div key={w} className="flex flex-col items-center gap-1">
                <div className="flex h-24 w-full items-end rounded-lg bg-muted">
                  <div className="w-full rounded-lg bg-gradient-to-t from-primary to-secondary" style={{height: `${20+((i*23)%75)}%`}}/>
                </div>
                <div className="truncate text-[9px] text-muted-foreground">{w}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function K({ icon, l, v }: { icon: React.ReactNode; l: string; v: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div className="mt-3 text-xl font-bold">{v}</div>
      <div className="text-xs text-muted-foreground">{l}</div>
    </div>
  );
}
