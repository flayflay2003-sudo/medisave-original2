import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth, type Role } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Logo } from "./Logo";
import { LanguageSelector } from "./LanguageSelector";
import {
  LayoutDashboard, Search, Package, Boxes, Bell, CreditCard,
  MessageCircle, Flag, LogOut, ShieldCheck, Users, Stethoscope,
} from "lucide-react";

import type { ReactNode } from "react";

interface NavItem { to: string; label: string; icon: ReactNode; }

function navFor(role: Role, t: ReturnType<typeof useI18n>["t"]): NavItem[] {
  const base: NavItem[] = [
    { to: "/dashboard", label: t.dashboard, icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: "/search", label: t.medicines, icon: <Search className="h-4 w-4" /> },
  ];
  const supply: NavItem = { to: "/marketplace", label: t.marketplace, icon: <Boxes className="h-4 w-4" /> };
  const stock: NavItem = { to: "/stock", label: t.stock, icon: <Package className="h-4 w-4" /> };
  const notif: NavItem = { to: "/notifications", label: t.notifications, icon: <Bell className="h-4 w-4" /> };
  const sub: NavItem = { to: "/subscription", label: t.subscription, icon: <CreditCard className="h-4 w-4" /> };
  const support: NavItem = { to: "/support", label: t.support, icon: <MessageCircle className="h-4 w-4" /> };
  const reports: NavItem = { to: "/reports", label: t.reports, icon: <Flag className="h-4 w-4" /> };

  if (role === "citizen") return [base[1], notif];
  if (role === "doctor") return [...base, notif, sub, support];
  if (role === "admin")
    return [
      { to: "/admin", label: t.dashboard, icon: <LayoutDashboard className="h-4 w-4" /> },
      { to: "/marketplace", label: t.requests, icon: <Boxes className="h-4 w-4" /> },
      { to: "/notifications", label: t.notifications, icon: <Bell className="h-4 w-4" /> },
      { to: "/support", label: t.support, icon: <MessageCircle className="h-4 w-4" /> },
    ];

  return [...base, stock, supply, notif, reports, sub, support];
}

const ROLE_ICON: Record<Role, ReactNode> = {
  pharmacy: <ShieldCheck className="h-4 w-4" />,
  doctor: <Stethoscope className="h-4 w-4" />,
  importer: <Boxes className="h-4 w-4" />,
  producer: <Package className="h-4 w-4" />,
  wholesaler: <Boxes className="h-4 w-4" />,
  citizen: <Users className="h-4 w-4" />,
  admin: <ShieldCheck className="h-4 w-4" />,
};

export function AppShell({ children }: { children?: ReactNode }) {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const loc = useLocation();

  if (!user) {
    if (typeof window !== "undefined") navigate({ to: "/login" });
    return null;
  }

  const items = navFor(user.role, t);
  const roleLabel = t[user.role as keyof typeof t] as string;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/"><Logo size={32} /></Link>
            <span className="hidden text-xs text-muted-foreground sm:inline">/ {roleLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector compact />
            <Link to="/notifications" className="relative rounded-md p-2 hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute end-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </Link>
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 md:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                {ROLE_ICON[user.role]}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-medium">{user.name}</div>
                <div className="text-[10px] text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <button onClick={() => { logout(); navigate({ to: "/" }); }} className="rounded-md p-2 text-muted-foreground hover:bg-muted">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-20 space-y-1">
            {items.map((it) => {
              const active = loc.pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                    active ? "bg-primary text-primary-foreground shadow-card" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {it.icon}
                  <span>{it.label}</span>
                </Link>
              );
            })}
            {user.role !== "citizen" && user.role !== "admin" && (
              <div className="mt-4 rounded-lg border border-border bg-card p-3">
                <div className="text-xs text-muted-foreground">{t.trustScore}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">{user.trustScore}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
                {user.verified && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                    <ShieldCheck className="h-3 w-3" /> {t.verified}
                  </span>
                )}
              </div>
            )}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
