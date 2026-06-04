import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { MEDICINES, aggregateByWilaya, WILAYAS } from "@/lib/mockData";
import { Pill, MapPin, ShieldCheck, AlertTriangle, Lock, Building2, FlaskConical, Truck, Network, X, Check } from "lucide-react";

export const Route = createFileRoute("/medicine/$id")({ component: MedicinePage });

const TABS = ["overview","map","owners","alternatives","advanced","request"] as const;
type Tab = typeof TABS[number];

function MedicinePage() {
  const { id } = Route.useParams();
  const { t, dir } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const med = MEDICINES.find((m) => m.id === id);
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
  const [showRequest, setShowRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  if (!med) return <AppShell><div className="p-6">Not found</div></AppShell>;
  const agg = aggregateByWilaya(med);
  const sorted = [...agg.entries()].sort((a, b) => b[1].total - a[1].total);
  const max = sorted[0]?.[1].total || 1;

  const isAdvancedLocked = !user || user.plan === "basic";

  const labels: Record<Tab, string> = {
    overview: t.overview, map: t.availabilityByWilaya, owners: t.stockOwners,
    alternatives: t.alternatives, advanced: t.advancedDetails, request: t.requestSupply,
  };

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="gradient-hero p-6 text-primary-foreground">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur"><Pill className="h-6 w-6"/></div>
                <div>
                  <h1 className="text-2xl font-bold">{med.commercial} <span className="text-white/85">· {med.dosage}</span></h1>
                  <p className="text-sm text-white/85">{med.scientific}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-full bg-white/15 px-2 py-0.5">{med.form}</span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5">{med.category}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowRequest(true)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary shadow-card hover:bg-white/90">
                {t.requestSupply}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2">
            {TABS.map((k) => (
              <button key={k} onClick={() => setTab(k)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}>
                {labels[k]}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === "overview" && (
              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow label={t.commercialName} value={med.commercial} />
                <InfoRow label={t.scientificName} value={med.scientific} />
                <InfoRow label={t.dosage} value={med.dosage} />
                <InfoRow label={t.form} value={med.form} />
                <InfoRow label={dir==="rtl"?"الفئة العلاجية":"Therapeutic category"} value={med.category} />
                <div className="md:col-span-2">
                  <div className="text-xs text-muted-foreground">{dir==="rtl"?"وصف مختصر":"Description"}</div>
                  <div className="mt-1 text-sm">{med.description}</div>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground md:col-span-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                  <span>{med.safety}</span>
                </div>
              </div>
            )}

            {tab === "map" && (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">{dir==="rtl"?"الكميات الفعلية حسب الولاية":"Actual quantities by wilaya"}</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {sorted.slice(0, 14).map(([w, v]) => {
                    const pct = (v.total / max) * 100;
                    return (
                      <button key={w} onClick={() => setSelectedWilaya(w)}
                        className={`rounded-xl border p-3 text-left transition ${selectedWilaya===w?"border-primary bg-primary/5":"border-border bg-card hover:bg-muted/50"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-medium"><MapPin className="h-3.5 w-3.5 text-primary"/>{w}</div>
                          <div className="text-sm font-semibold">{v.total} <span className="text-[10px] text-muted-foreground">{t.units}</span></div>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedWilaya && (() => {
                  const v = agg.get(selectedWilaya)!;
                  return (
                    <div className="mt-3 rounded-xl border border-border bg-muted/40 p-4">
                      <div className="text-sm font-semibold">{selectedWilaya} — {dir==="rtl"?"تفصيل المخزون":"Stock breakdown"}</div>
                      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                        <Stat icon={<Building2 className="h-4 w-4"/>} label={t.pharmacy} value={v.pharmacy} />
                        <Stat icon={<FlaskConical className="h-4 w-4"/>} label={t.producer} value={v.producer} />
                        <Stat icon={<Network className="h-4 w-4"/>} label={t.importer} value={v.importer} />
                        <Stat icon={<Truck className="h-4 w-4"/>} label={t.wholesaler} value={v.wholesaler} />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {tab === "owners" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr className="border-b border-border">
                      <Th>{dir==="rtl"?"المالك":"Owner"}</Th><Th>{dir==="rtl"?"النوع":"Type"}</Th><Th>{t.wilaya}</Th>
                      <Th>{t.quantity}</Th><Th>{t.trustScore}</Th><Th>{t.lastUpdate}</Th><Th></Th>
                    </tr>
                  </thead>
                  <tbody>
                    {med.stocks.slice(0, 12).map((s) => (
                      <tr key={s.ownerId} className="border-b border-border/60">
                        <Td>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{s.ownerName}</span>
                            {s.verified && <ShieldCheck className="h-3.5 w-3.5 text-success" aria-label="verified"/>}
                          </div>
                        </Td>
                        <Td><span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{t[s.ownerType as keyof typeof t] as string}</span></Td>
                        <Td>{s.wilaya}</Td>
                        <Td className="font-semibold">{s.quantity}</Td>
                        <Td><span className={`font-semibold ${s.trustScore>=85?"text-success":s.trustScore>=70?"text-primary":"text-warning"}`}>{s.trustScore}</span></Td>
                        <Td className="text-xs text-muted-foreground">{s.lastUpdate}</Td>
                        <Td>
                          {s.availableForSupply ? (
                            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">{dir==="rtl"?"متاح للتزويد":"Supply OK"}</span>
                          ) : (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{dir==="rtl"?"بيع محلي فقط":"Local only"}</span>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "alternatives" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-warning"/><span>{t.consultWarning}</span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {(med.alternativeIds ?? []).map((aid) => {
                    const a = MEDICINES.find((m) => m.id === aid)!;
                    return (
                      <Link key={aid} to="/medicine/$id" params={{id: aid}} className="rounded-xl border border-border bg-card p-3 hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary"/>
                          <div>
                            <div className="text-sm font-medium">{a.commercial} · {a.dosage}</div>
                            <div className="text-xs text-muted-foreground">{a.scientific}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {(med.alternativeIds ?? []).length === 0 && (
                    <div className="text-sm text-muted-foreground">{dir==="rtl"?"لا توجد بدائل مقترحة.":"No alternatives suggested."}</div>
                  )}
                </div>
              </div>
            )}

            {tab === "advanced" && (
              isAdvancedLocked ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
                  <Lock className="h-6 w-6 text-muted-foreground"/>
                  <div className="text-sm font-medium">{dir==="rtl"?"التفاصيل المتقدمة متاحة لباقات Silver و Gold":"Advanced details require Silver or Gold plans"}</div>
                  <Link to="/subscription" className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">{t.subscription}</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-muted-foreground"><tr className="border-b border-border">
                      <Th>{dir==="rtl"?"المالك":"Owner"}</Th><Th>{t.expiryDate}</Th><Th>{t.batchNumber}</Th>
                      <Th>{t.quantity}</Th><Th>{t.lastUpdate}</Th>
                    </tr></thead>
                    <tbody>
                      {med.stocks.slice(0, 14).map((s) => (
                        <tr key={s.ownerId} className="border-b border-border/60">
                          <Td>{s.ownerName}</Td><Td>{s.expiry}</Td><Td className="font-mono text-xs">{s.batch}</Td>
                          <Td className="font-semibold">{s.quantity}</Td><Td className="text-xs text-muted-foreground">{s.lastUpdate}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {tab === "request" && (
              <button onClick={() => setShowRequest(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                {t.requestSupply} →
              </button>
            )}
          </div>
        </div>
      </div>

      {showRequest && (
        <RequestModal
          med={med}
          onClose={() => { setShowRequest(false); setRequestSent(false); }}
          sent={requestSent}
          onSent={() => setRequestSent(true)}
          onGoToMarketplace={() => navigate({ to: "/marketplace" })}
        />
      )}
    </AppShell>
  );
}

function Th({ children }: { children?: React.ReactNode }) { return <th className="px-3 py-2 text-start font-medium">{children}</th>; }
function Td({ children, className }: { children?: React.ReactNode; className?: string }) { return <td className={`px-3 py-2 ${className ?? ""}`}>{children}</td>; }

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function RequestModal({ med, onClose, sent, onSent, onGoToMarketplace }: { med: typeof MEDICINES[number]; onClose: () => void; sent: boolean; onSent: () => void; onGoToMarketplace: () => void; }) {
  const { t, dir } = useI18n();
  const [qty, setQty] = useState(500);
  const [from, setFrom] = useState("Oran");
  const [to, setTo] = useState("Sétif");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-elevated">
        {!sent ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">{t.requestSupply}</h2>
              <button onClick={onClose} className="rounded-md p-1 hover:bg-muted"><X className="h-4 w-4"/></button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{med.commercial} · {med.scientific} · {med.dosage}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block">
                <div className="text-xs text-muted-foreground">{t.quantity}</div>
                <input type="number" value={qty} onChange={(e)=>setQty(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"/>
              </label>
              <label className="block">
                <div className="text-xs text-muted-foreground">{dir==="rtl"?"الولاية المصدر":"Source wilaya"}</div>
                <select value={from} onChange={(e)=>setFrom(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  {WILAYAS.map((w)=> <option key={w}>{w}</option>)}
                </select>
              </label>
              <label className="block col-span-2">
                <div className="text-xs text-muted-foreground">{dir==="rtl"?"الولاية الهدف":"Target wilaya"}</div>
                <select value={to} onChange={(e)=>setTo(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  {WILAYAS.map((w)=> <option key={w}>{w}</option>)}
                </select>
              </label>
            </div>

            <p className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              {dir==="rtl"?"سيتم إرسال الطلب إلى إدارة MediSave لمراجعته والتواصل مع المورد. MediSave وسيط مهني ولا يتولى النقل الفعلي.":"Your request will be reviewed by MediSave admin who will contact the supplier. MediSave is a professional middleman and does not perform delivery."}
            </p>

            <button onClick={onSent} className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              {t.submit}
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success"><Check className="h-6 w-6"/></div>
            <h3 className="mt-3 text-base font-bold">{dir==="rtl"?"تم إرسال طلب التزويد":"Supply request sent"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.requestStatus.review}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-xs">{t.cancel}</button>
              <button onClick={onGoToMarketplace} className="flex-1 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground">{t.marketplace}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
