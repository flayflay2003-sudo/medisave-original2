import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Field } from "./login";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin-login")({ component: AdminLogin });

function AdminLogin() {
  const { t, dir } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@medisave.dz");
  const [password, setPassword] = useState("admin1234");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/"><Logo /></Link>
          <LanguageSelector />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-elevated">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5"/></div>
            <div>
              <h1 className="text-lg font-bold">{t.adminLogin}</h1>
              <p className="text-xs text-muted-foreground">{dir==="rtl"?"دخول مخصص لإدارة شركة MediSave":"Reserved for MediSave company staff"}</p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login({ email, name: "Admin MediSave", role: "admin", wilaya: "Alger", status: "approved", plan: "gold", trustScore: 100, verified: true });
              navigate({ to: "/admin" });
            }}
            className="mt-5 space-y-3"
          >
            <Field label={t.email}>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"/>
            </Field>
            <Field label={t.password}>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"/>
            </Field>
            <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">{t.login}</button>
          </form>
        </div>
      </main>
    </div>
  );
}
