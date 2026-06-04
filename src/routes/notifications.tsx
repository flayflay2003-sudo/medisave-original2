import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { MOCK_NOTIFICATIONS } from "@/lib/mockData";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

function Notifications() {
  const { t } = useI18n();
  return (
    <AppShell>
      <div className="space-y-3">
        <h1 className="text-xl font-bold">{t.notifications}</h1>
        <div className="space-y-2">
          {MOCK_NOTIFICATIONS.map((n) => (
            <div key={n.id} className={`flex gap-3 rounded-xl border p-4 ${n.read ? "border-border bg-card" : "border-primary/30 bg-primary/5"}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Bell className="h-4 w-4"/></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-[10px] text-muted-foreground">{n.time}</div>
                </div>
                <div className="text-xs text-muted-foreground">{n.body}</div>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"/>}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
