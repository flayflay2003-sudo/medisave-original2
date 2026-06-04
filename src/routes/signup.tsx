import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import { useAuth, type Role } from "@/lib/auth";
import { WILAYAS } from "@/lib/mockData";
import { Field } from "./login";
import { ShieldCheck, FileCheck2, Upload, X } from "lucide-react";

export const Route = createFileRoute("/signup")({ component: SignupPage });

const ROLE_OPTIONS: Role[] = ["pharmacy","doctor","importer","producer","wholesaler","citizen"];

function SignupPage() {
  const { t, dir } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("pharmacy");
  const [step, setStep] = useState<1 | 2>(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ wilaya: "Alger" });

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  function fields(): { k: string; label: string; type?: string; options?: string[] }[] {
    const wilayaField = { k: "wilaya", label: t.wilaya, type: "select", options: WILAYAS };
    if (role === "pharmacy") return [
      { k: "name", label: dir==="rtl"?"اسم الصيدلية":"Pharmacy name" },
      { k: "responsible", label: dir==="rtl"?"اسم المسؤول":"Responsible person" },
      wilayaField, { k: "commune", label: t.commune }, { k: "address", label: t.address },
      { k: "phone", label: t.phone }, { k: "email", label: t.email, type: "email" },
      { k: "rc", label: dir==="rtl"?"رقم السجل التجاري":"Commercial register #" },
      { k: "license", label: dir==="rtl"?"رقم رخصة الصيدلية":"Pharmacy license #" },
    ];
    if (role === "doctor") return [
      { k: "name", label: t.fullName }, { k: "specialty", label: dir==="rtl"?"التخصص":"Specialty" },
      { k: "regNumber", label: dir==="rtl"?"رقم التسجيل المهني":"Professional reg. #" },
      wilayaField, { k: "workplace", label: dir==="rtl"?"مكان العمل (عيادة / مستشفى)":"Workplace (clinic / hospital)" },
      { k: "phone", label: t.phone }, { k: "email", label: t.email, type: "email" },
    ];
    if (role === "importer") return [
      { k: "company", label: dir==="rtl"?"اسم الشركة":"Company name" },
      { k: "responsible", label: dir==="rtl"?"اسم المسؤول":"Responsible person" },
      { k: "license", label: dir==="rtl"?"رقم الترخيص":"License #" },
      { k: "countries", label: dir==="rtl"?"الدول المستورد منها":"Countries imported from" },
      { k: "types", label: dir==="rtl"?"أصناف الأدوية":"Types of medicines" },
      wilayaField, { k: "phone", label: t.phone }, { k: "email", label: t.email, type: "email" },
    ];
    if (role === "producer") return [
      { k: "factory", label: dir==="rtl"?"اسم المصنع / الشركة":"Factory / Company" },
      { k: "license", label: dir==="rtl"?"رقم رخصة الإنتاج":"Production license #" },
      { k: "products", label: dir==="rtl"?"الأدوية المُنتجة":"Medicines produced" },
      { k: "capacity", label: dir==="rtl"?"الطاقة الإنتاجية":"Production capacity" },
      wilayaField, { k: "phone", label: t.phone }, { k: "email", label: t.email, type: "email" },
    ];
    if (role === "wholesaler") return [
      { k: "company", label: dir==="rtl"?"اسم الشركة":"Company name" },
      { k: "responsible", label: dir==="rtl"?"اسم المسؤول":"Responsible" },
      { k: "covered", label: dir==="rtl"?"الولايات المغطّاة":"Covered wilayas" },
      { k: "warehouses", label: dir==="rtl"?"مواقع المخازن":"Warehouse locations" },
      { k: "types", label: dir==="rtl"?"أصناف الأدوية":"Medicine types" },
      { k: "rc", label: dir==="rtl"?"رقم السجل التجاري":"Commercial register #" },
      wilayaField, { k: "phone", label: t.phone }, { k: "email", label: t.email, type: "email" },
    ];
    return [
      { k: "name", label: t.fullName }, { k: "phone", label: t.phone },
      wilayaField, { k: "medicines", label: dir==="rtl"?"أدوية تريد متابعتها":"Medicines to follow" },
    ];
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    if (role === "citizen") {
      login({ email: form.phone || "citizen@medisave.dz", name: form.name || "Citizen", role: "citizen", wilaya: form.wilaya, status: "approved", plan: "basic", trustScore: 0, verified: false });
      navigate({ to: "/dashboard" });
      return;
    }
    setShowConfirm(true);
  }

  const f = fields();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/"><Logo /></Link>
          <LanguageSelector />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h1 className="text-xl font-bold">{t.signup}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.accountType}</p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ROLE_OPTIONS.map((r) => {
              const active = role === r;
              return (
                <button key={r} type="button" onClick={() => { setRole(r); setStep(1); }}
                  className={`rounded-xl border p-3 text-sm transition ${active ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}>
                  {t[r as keyof typeof t] as string}
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            {f.map((fld) => (
              <Field key={fld.k} label={fld.label}>
                {fld.type === "select" ? (
                  <select value={form[fld.k] ?? ""} onChange={(e) => set(fld.k, e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    {(fld.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input required type={fld.type ?? "text"} value={form[fld.k] ?? ""} onChange={(e) => set(fld.k, e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"/>
                )}
              </Field>
            ))}

            {role !== "citizen" && (
              <div className="sm:col-span-2">
                <Field label={dir==="rtl"?"الوثائق الرسمية (رخصة، سجل، تفويض)":"Official documents (license, register, authorization)"}>
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-input bg-background px-3 py-3 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span>{dir==="rtl"?"اسحب الملفات هنا أو اختر":"Drag files or click to upload"}</span>
                  </div>
                </Field>
              </div>
            )}

            <label className="flex items-start gap-2 text-xs text-muted-foreground sm:col-span-2">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
              <span>{t.declarationCheckbox}</span>
            </label>

            <div className="sm:col-span-2">
              <button disabled={!agreed} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {t.submit}
              </button>
            </div>
          </form>
        </div>
      </main>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="max-h-[88vh] w-full max-w-2xl overflow-auto rounded-2xl bg-card p-6 shadow-elevated">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5"/></div>
                <div>
                  <h2 className="text-base font-bold">{t.legalNotice}</h2>
                  <p className="text-xs text-muted-foreground">MediSave — Compliance & Trust</p>
                </div>
              </div>
              <button onClick={() => setShowConfirm(false)} className="rounded-md p-1 hover:bg-muted"><X className="h-4 w-4"/></button>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-7 text-foreground">
              <p>
                تم إرسال طلب التسجيل بنجاح. ستقوم إدارة MediSave بمراجعة معلوماتك المهنية والوثائق المرفقة قبل تفعيل الحساب.
                نؤكد أن البيانات الشخصية والمهنية التي تقدمها تتم معالجتها وحفظها بشكل آمن، ولا تُستعمل إلا لأغراض التحقق،
                إدارة الحساب، تتبع توفر الأدوية، وتنظيم طلبات التزويد داخل المنصة، وذلك وفقاً للتشريعات الجزائرية المتعلقة
                بحماية البيانات الشخصية، خاصة القانون رقم 18-07 المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في
                معالجة المعطيات ذات الطابع الشخصي.
              </p>
              <p>
                يلتزم المستخدم بتقديم معلومات صحيحة ودقيقة حول هويته المهنية، الرخص، المخزون، كميات الأدوية، تواريخ الصلاحية،
                ومصادر التزويد. أي تصريح كاذب، تزوير وثائق، إخفاء معلومات مهمة، أو نشر بيانات غير صحيحة حول توفر أو كمية أو
                صلاحية الأدوية قد يؤدي إلى رفض الحساب أو تعليقه أو إحالته للمراجعة القانونية، مع إمكانية اتخاذ الإجراءات
                المناسبة وفق القوانين الجزائرية المنظمة للنشاط الصيدلاني، مكافحة الغش، التزوير، وحماية الصحة العامة.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <FileCheck2 className="h-4 w-4 text-success" />
              <span>{dir==="rtl"?"حالة الحساب: قيد المراجعة من طرف إدارة MediSave":"Account status: pending MediSave admin review"}</span>
            </div>

            <button
              onClick={() => {
                login({
                  email: form.email || "user@medisave.dz", name: form.name || form.company || form.factory || "Account",
                  role, wilaya: form.wilaya, status: "pending", plan: "basic", trustScore: 0, verified: false,
                });
                navigate({ to: "/dashboard" });
              }}
              className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t.understood}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
