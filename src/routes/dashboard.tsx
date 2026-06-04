import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { MEDICINES, MOCK_REQUESTS, WILAYAS } from "@/lib/mockData";
import { Pill, Search, TrendingUp, Activity, AlertCircle, Package, CheckCircle2, Clock, Boxes, ArrowRight, MapPin } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user } = useAuth();
  const { t, dir } = useI18n();
  if (!user) return null;

  const role = user.role;
  const isCitizen = role === "citizen";
  const isDoctor = role === "doctor";

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Welcome + Status */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">{t.welcome}</div>
              <div className="text-xl font-bold">{user.name}</div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{t[role as keyof typeof t] as string}</span>
                {user.status === "approved" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-success"><CheckCircle2 className="h-3 w-3"/>{t.approved}</span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-warning"><Clock className="h-3 w-3"/>{t.pending}</span>
                )}
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{t[user.plan as keyof typeof t] as string}</span>
              </div>
            </div>
            <Link to="/search" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Search className="h-4 w-4"/> {t.search}
            </Link>
          </div>
        </div>

        {/* KPI row */}
        {!isCitizen && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={<Boxes/>} label={dir==="rtl"?"طلبات تزويد نشطة":"Active supply requests"} value="4" tone="primary"/>
            <Kpi icon={<Package/>} label={dir==="rtl"?"تحديثات مخزون هذا الأسبوع":"Stock updates this week"} value="18" tone="secondary"/>
            <Kpi icon={<TrendingUp/>} label={dir==="rtl"?"طلب متزايد على":"Rising demand"} value="Paracetamol" tone="warning"/>
            <Kpi icon={<Activity/>} label={t.trustScore} value={`${user.trustScore}/100`} tone="success"/>
          </div>
        )}

        {/* Citizen quick: nearby availability */}
        {isCitizen && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-primary"/>{dir==="rtl"?"توفّر قرب ولايتك":"Availability near your wilaya"}</div>
            <p className="mt-1 text-xs text-muted-foreground">{dir==="rtl"?"يمكنك البحث عن دواء ومعرفة إن كان متوفراً وأقرب الصيدليات.":"Search a medicine to see if it's available and the nearest pharmacies."}</p>
            <Link to="/search" className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{t.search}</Link>
          </div>
        )}

        {/* Top medicines */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{dir==="rtl"?"أدوية تحت المتابعة":"Watched medicines"}</div>
            <Link to="/search" className="text-xs text-primary hover:underline">{dir==="rtl"?"عرض الكل":"See all"} →</Link>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {MEDICINES.slice(0, 4).map((m) => (
              <Link key={m.id} to="/medicine/$id" params={{id: m.id}} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Pill className="h-4 w-4"/></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{m.commercial} · {m.dosage}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.scientific}</div>
                </div>
                <ArrowRight className={`h-4 w-4 text-muted-foreground ${dir==="rtl"?"rotate-180":""}`}/>
              </Link>
            ))}
          </div>
        </div>

        {/* Active requests */}
        {!isCitizen && !isDoctor && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{dir==="rtl"?"آخر طلبات التزويد":"Latest supply requests"}</div>
              <Link to="/marketplace" className="text-xs text-primary hover:underline">{t.marketplace} →</Link>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-start">#</th>
                    <th className="px-3 py-2 text-start">{dir==="rtl"?"الدواء":"Medicine"}</th>
                    <th className="px-3 py-2 text-start">{dir==="rtl"?"من":"From"}</th>
                    <th className="px-3 py-2 text-start">{dir==="rtl"?"إلى":"To"}</th>
                    <th className="px-3 py-2 text-start">{t.quantity}</th>
                    <th className="px-3 py-2 text-start">{dir==="rtl"?"الحالة":"Status"}</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_REQUESTS.map((r) => (
                    <tr key={r.id} className="border-b border-border/60">
                      <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                      <td className="px-3 py-2">{r.medicineName}</td>
                      <td className="px-3 py-2">{r.fromWilaya}</td>
                      <td className="px-3 py-2">{r.toWilaya}</td>
                      <td className="px-3 py-2 font-semibold">{r.quantity}</td>
                      <td className="px-3 py-2"><StatusBadge status={r.status}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wilaya demand mini-chart */}
        {(role === "producer" || role === "importer" || role === "wholesaler" || role === "admin") && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-sm font-semibold">{dir==="rtl"?"الطلب حسب الولاية (محاكاة)":"Demand by wilaya (simulated)"}</div>
            <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-8">
              {WILAYAS.slice(0, 16).map((w, i) => {
                const h = 20 + ((i * 37) % 80);
                return (
                  <div key={w} className="flex flex-col items-center gap-1">
                    <div className="flex h-24 w-full items-end rounded-lg bg-muted">
                      <div className="w-full rounded-lg bg-gradient-to-t from-primary to-secondary" style={{ height: `${h}%` }} />
                    </div>
                    <div className="truncate text-[10px] text-muted-foreground">{w}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {user.status === "pending" && (
          <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 text-warning"/>
            <div>
              <div className="font-semibold">{t.pending}</div>
              <div className="text-xs text-muted-foreground">{dir==="rtl"?"تتم مراجعة وثائقك من طرف إدارة MediSave. ستتلقى إشعاراً عند التفعيل.":"Your documents are under review. You'll be notified when activated."}</div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Kpi({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "primary"|"secondary"|"warning"|"success" }) {
  const toneCls = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/10 text-success",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneCls}`}>{icon}</div>
      <div className="mt-3 text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: keyof typeof statusColor }) {
  const { t } = useI18n();
  const label = t.requestStatus[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor[status]}`}>
      {label}
    </span>
  );
}
const statusColor = {
  sent: "bg-muted text-muted-foreground",
  review: "bg-primary/10 text-primary",
  contacted: "bg-accent text-accent-foreground",
  waiting: "bg-warning/15 text-warning",
  accepted: "bg-success/10 text-success",
  arranging: "bg-secondary/10 text-secondary",
  done: "bg-success/15 text-success",
  rejected: "bg-destructive/10 text-destructive",
} as const;
