import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import { Search, Pill, MapPin, ShieldCheck, Network, Activity, ArrowRight, Building2, Truck, FlaskConical } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediSave — تتبع توفر الأدوية وتنسيق التزويد في الجزائر" },
      { name: "description", content: "MediSave: smart medicine availability tracking and inter-wilaya supply coordination in Algeria." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, dir } = useI18n();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <Link to="/login" className="hidden rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted sm:inline-block">
              {t.login}
            </Link>
            <Link to="/signup" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-card hover:bg-primary/90">
              {t.signup}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-hero opacity-95" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,white_0%,transparent_50%)] opacity-20" />
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 text-primary-foreground">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Activity className="h-3.5 w-3.5" /> MediSave · Algeria · {dir === "rtl" ? "نسخة تجريبية" : "Prototype"}
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                {t.slogan}
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/90">{t.intro}</p>

              {/* Quick search */}
              <div className="mt-7 rounded-2xl bg-white p-2 shadow-elevated">
                <form
                  onSubmit={(e) => { e.preventDefault(); navigate({ to: "/search", search: { q } as never }); }}
                  className="flex items-center gap-2"
                >
                  <Search className="ms-2 h-5 w-5 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    {t.search}
                  </button>
                </form>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/85">
                {["Doliprane","Paracetamol","Augmentin","Ventolin","Insulin","Glucophage"].map((s) => (
                  <Link key={s} to="/search" search={{ q: s } as never} className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">{s}</Link>
                ))}
              </div>
            </div>

            {/* KPI mock card */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "1,240+", l: dir==="rtl"?"دواء في القاعدة":"medicines indexed", i: <Pill className="h-5 w-5" /> },
                { k: "58", l: dir==="rtl"?"ولاية مغطّاة":"wilayas covered", i: <MapPin className="h-5 w-5" /> },
                { k: "320+", l: dir==="rtl"?"صيدلية / مورد":"pharmacies & suppliers", i: <Building2 className="h-5 w-5" /> },
                { k: "98%", l: dir==="rtl"?"حسابات موثّقة":"verified accounts", i: <ShieldCheck className="h-5 w-5" /> },
              ].map((c) => (
                <div key={c.l} className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/20">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">{c.i}</div>
                  <div className="mt-3 text-2xl font-bold">{c.k}</div>
                  <div className="text-xs text-white/80">{c.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-bold text-foreground">
          {dir === "rtl" ? "حلول مخصصة لكل فاعل في منظومة الدواء" : "Solutions for every actor in the medicine ecosystem"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {dir === "rtl"
            ? "صيدليات، أطباء، منتجون، مستوردون، تجار جملة، ومواطنون — كل دور يحصل على تجربة وأدوات مناسبة."
            : "Pharmacies, doctors, producers, importers, wholesalers and citizens — each role gets the right tools."}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { i: <Building2 className="h-5 w-5"/>, t: t.pharmacy, d: dir==="rtl"?"تحديث المخزون، طلب التزويد، متابعة الحالة.":"Stock updates, supply requests, tracking."},
            { i: <FlaskConical className="h-5 w-5"/>, t: t.doctor, d: dir==="rtl"?"البحث عن الأدوية والبدائل وتنبيهات التوفر.":"Search medicines, alternatives, availability alerts."},
            { i: <Truck className="h-5 w-5"/>, t: t.wholesaler, d: dir==="rtl"?"رؤية الطلب بين الولايات وفرص التزويد.":"Inter-wilaya demand and supply opportunities."},
            { i: <FlaskConical className="h-5 w-5"/>, t: t.producer, d: dir==="rtl"?"تحليلات الطلب وإدارة الإنتاج.":"Demand analytics, production stock."},
            { i: <Network className="h-5 w-5"/>, t: t.importer, d: dir==="rtl"?"إدارة المخزون المستورد ورؤية السوق.":"Manage imported stock & market visibility."},
            { i: <ShieldCheck className="h-5 w-5"/>, t: t.citizen, d: dir==="rtl"?"بحث سريع عن دواء قرب مكانك.":"Quick search for medicines near you."},
          ].map((r) => (
            <Link to="/signup" key={r.t} className="group rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{r.i}</div>
                <ArrowRight className={`h-4 w-4 text-muted-foreground transition group-hover:text-primary ${dir==="rtl"?"rotate-180":""}`} />
              </div>
              <div className="mt-4 text-base font-semibold text-foreground">{r.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{r.d}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-foreground">
            {dir === "rtl" ? "كيف تعمل منصة MediSave كوسيط مهني" : "How MediSave works as a professional middleman"}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { n: "01", t: dir==="rtl"?"نقص في ولاية":"Shortage detected", d: dir==="rtl"?"صيدلية في سطيف تحتاج Paracetamol.":"A pharmacy in Sétif needs Paracetamol."},
              { n: "02", t: dir==="rtl"?"البحث في المنصة":"Search platform", d: dir==="rtl"?"تعرض MediSave أن وهران تتوفّر على 1000 وحدة.":"MediSave shows Oran has 1000 units."},
              { n: "03", t: dir==="rtl"?"مراجعة الطلب":"Request reviewed", d: dir==="rtl"?"إدارة MediSave تتواصل مع المورّد.":"MediSave admin contacts the stock owner."},
              { n: "04", t: dir==="rtl"?"تنسيق العملية":"Operation coordinated", d: dir==="rtl"?"المشتري يدفع للمورّد، وMediSave تتقاضى عمولة.":"Buyer pays supplier; MediSave earns a fee."},
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="text-xs font-semibold text-primary">{s.n}</div>
                <div className="mt-2 text-base font-semibold text-foreground">{s.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-xs text-muted-foreground">
            {dir === "rtl"
              ? "ملاحظة: MediSave لا تتولّى النقل الفعلي للأدوية. تُراجع الطلبات، تتواصل مع أصحاب المخزون، وتنظّم الصلة التجارية بين الطرفين."
              : "Note: MediSave does not perform physical delivery. It reviews requests, contacts stock owners, and arranges the commercial connection."}
          </p>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row">
          <Logo size={28} />
          <div>© 2026 MediSave — {dir==="rtl"?"جميع الحقوق محفوظة":"All rights reserved"}</div>
          <div>{dir==="rtl"?"يلتزم بقانون 18-07 لحماية المعطيات الشخصية":"Compliant with Algerian Law 18-07 on personal data"}</div>
        </div>
      </footer>
    </div>
  );
}
