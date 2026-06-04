import { useI18n, type Lang } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  const options: { v: Lang; label: string }[] = [
    { v: "ar", label: "العربية" },
    { v: "fr", label: "Français" },
    { v: "en", label: "English" },
  ];
  return (
    <div className={`inline-flex items-center gap-1 rounded-lg border border-border bg-card ${compact ? "p-0.5" : "p-1"}`}>
      <Globe className="ms-1.5 h-3.5 w-3.5 text-muted-foreground" />
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => setLang(o.v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            lang === o.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
