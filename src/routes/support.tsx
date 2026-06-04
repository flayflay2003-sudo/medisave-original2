import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { Send, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/support")({ component: Support });

interface Msg { id: number; from: "user"|"admin"; text: string; time: string; }

function Support() {
  const { t, dir } = useI18n();
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, from: "admin", text: dir==="rtl"?"مرحباً بك في دعم MediSave 24/7. كيف يمكننا مساعدتك؟":"Welcome to MediSave 24/7 support. How can we help?", time: "09:00" },
  ]);

  function send() {
    if (!text.trim()) return;
    setMsgs((m)=>[...m, { id: Date.now(), from: "user", text, time: "now" }]);
    setText("");
    setTimeout(()=> setMsgs((m)=>[...m, { id: Date.now()+1, from: "admin", text: dir==="rtl"?"تم استلام رسالتك. سيقوم فريقنا بالرد قريباً.":"We received your message. Our team will reply shortly.", time: "now" }]), 800);
  }

  return (
    <AppShell>
      <div className="flex h-[70vh] flex-col rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="h-4 w-4"/></div>
          <div>
            <div className="text-sm font-semibold">{t.contactSupport}</div>
            <div className="text-[10px] text-success">● {dir==="rtl"?"متصل · 24/7":"Online · 24/7"}</div>
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from==="user"?"bg-primary text-primary-foreground":"bg-muted text-foreground"}`}>
                {m.text}<div className="mt-0.5 text-[10px] opacity-70">{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <input value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder={t.typeMessage} className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"/>
            <button onClick={send} className="rounded-lg bg-primary p-2 text-primary-foreground"><Send className="h-4 w-4"/></button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
