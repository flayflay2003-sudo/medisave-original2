import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { searchMedicines, aggregateByWilaya, WILAYAS } from "@/lib/mockData";
import { Search, Pill, MapPin, Filter, ArrowRight } from "lucide-react";

interface SearchParams { q?: string; wilaya?: string; }

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: (s.q as string) ?? "",
    wilaya: (s.wilaya as string) ?? "",
  }),
  component: SearchPage,
});

function SearchPage() {
  const { user } = useAuth();
  const { t, dir } = useI18n();
  const { q: initial, wilaya: initialW } = Route.useSearch();
  const [q, setQ] = useState(initial ?? "");
  const [wilaya, setWilaya] = useState(initialW ?? "");
  const navigate = useNavigate();

  const results = useMemo(() => {
    const found = searchMedicines(q);
    if (!wilaya) return found;
    return found.filter((m) => m.stocks.some((s) => s.wilaya === wilaya && s.quantity > 0));
  }, [q, wilaya]);

  const body = (
    <div className="space-y-5">
      {/* Search bar */}
      <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus value={q} onChange={(e)=>setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={wilaya} onChange={(e)=>setWilaya(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="">{t.allWilayas}</option>
              {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          {["Doliprane","Paracetamol","Augmentin","Ventolin","Insulin","Glucophage","Aspégic"].map((s) => (
            <button key={s} onClick={()=>setQ(s)} className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground hover:bg-primary/10 hover:text-primary">
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {results.length} {dir==="rtl"?"نتيجة":"results"}
      </div>

      {/* Results */}
      <div className="grid gap-3 md:grid-cols-2">
        {results.map((m) => {
          const agg = aggregateByWilaya(m);
          const top = [...agg.entries()].filter(([,v])=>v.total>0).sort((a,b)=>b[1].total-a[1].total).slice(0,3);
          return (
            <Link key={m.id} to="/medicine/$id" params={{ id: m.id }}
              className="group rounded-2xl border border-border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Pill className="h-5 w-5"/></div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{m.commercial} <span className="text-muted-foreground">· {m.dosage}</span></div>
                    <div className="text-xs text-muted-foreground">{m.scientific}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{m.form}</span>
                      <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">{m.category}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className={`mt-1 h-4 w-4 text-muted-foreground transition group-hover:text-primary ${dir==="rtl"?"rotate-180":""}`} />
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <div className="text-[11px] text-muted-foreground">{dir==="rtl"?"أفضل توفّر:":"Top availability:"}</div>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {top.length === 0 && <div className="col-span-3 text-xs text-destructive">{t.unavailable}</div>}
                  {top.map(([w, v]) => (
                    <div key={w} className="rounded-lg bg-muted/60 px-2 py-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><MapPin className="h-3 w-3"/>{w}</div>
                      <div className="text-sm font-semibold text-foreground">{v.total} <span className="text-[10px] text-muted-foreground">{t.units}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
        {results.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground md:col-span-2">{t.noResults}</div>
        )}
      </div>
    </div>
  );

  if (user) return <AppShell>{body}</AppShell>;
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-3">
            <LanguageSelector compact />
            <Link to="/login" className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted">{t.login}</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{body}</main>
    </div>
  );
}
