export function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MediSave logo">
        <defs>
          <linearGradient id="msgrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="oklch(0.52 0.14 230)" />
            <stop offset="1" stopColor="oklch(0.65 0.13 165)" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#msgrad)" />
        {/* medical cross */}
        <rect x="20" y="10" width="8" height="28" rx="2" fill="white" />
        <rect x="10" y="20" width="28" height="8" rx="2" fill="white" />
        {/* network nodes */}
        <circle cx="10" cy="10" r="2.5" fill="white" fillOpacity="0.85" />
        <circle cx="38" cy="10" r="2.5" fill="white" fillOpacity="0.85" />
        <circle cx="10" cy="38" r="2.5" fill="white" fillOpacity="0.85" />
        <circle cx="38" cy="38" r="2.5" fill="white" fillOpacity="0.85" />
      </svg>
      {withText && (
        <div className="leading-tight">
          <div className="text-lg font-bold tracking-tight text-foreground">MediSave</div>
          <div className="text-[10px] text-muted-foreground">Algeria</div>
        </div>
      )}
    </div>
  );
}
