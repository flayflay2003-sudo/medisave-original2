import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";
import { useAuth, type Role } from "@/lib/auth";
import { Building2, Stethoscope, Truck, FlaskConical, Network, User, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

const ROLES: { v: Role; icon: typeof Building2 }[] = [
  { v: "pharmacy", icon: Building2 },
  { v: "doctor", icon: Stethoscope },
  { v: "wholesaler", icon: Truck },
  { v: "producer", icon: FlaskConical },
  { v: "importer", icon: Network },
  { v: "citizen", icon: User },
];

function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("pharmacy");
  const [email, setEmail] = useState("demo@medisave.dz");
  const [password, setPassword] = useState("demo1234");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const labels: Record<Role, string> = {
      pharmacy: "Pharmacie El Hayat", doctor: "Dr. Karim Belkacem",
      importer: "Imex Pharma DZ", producer: "Saidal Group",
      wholesaler: "Sopharm Distribution", citizen: "Mehdi Benali", admin: "Admin MediSave",
    };
    login({
      email, name: labels[role], role,
      wilaya: "Alger", status: "approved", plan: role === "doctor" ? "basic" : "silver",
      trustScore: role === "producer" ? 96 : 82, verified: true,
    });
    navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/"><Logo /></Link>
          <LanguageSelector />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-elevated">
          <h1 className="text-xl font-bold">{t.login}</h1>
          <p className="mt-1 text-sm text-muted-foreground">MediSave</p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = role === r.v;
              return (
                <button
                  key={r.v}
                  type="button"
                  onClick={() => setRole(r.v)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs transition ${
                    active ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t[r.v as keyof typeof t] as string}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <Field label={t.email}>
              <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"/>
            </Field>
            <Field label={t.password}>
              <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"/>
            </Field>
            <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              {t.login}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            <Link to="/signup" className="text-primary hover:underline">{t.signup} →</Link>
            <Link to="/admin-login" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <ShieldCheck className="h-3 w-3" /> {t.adminLogin}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}
