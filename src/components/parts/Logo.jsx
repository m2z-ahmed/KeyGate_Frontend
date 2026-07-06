export function LogoIcon({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lethem-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a594ff" />
          <stop offset="1" stopColor="#7c6bff" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#lethem-logo-grad)" />
      <rect x="2" y="2" width="28" height="28" rx="9" fill="black" fillOpacity="0.05" />
      <path d="M16 8.5a3.5 3.5 0 0 1 1.5 6.65v2.2l2.2 2.2-1.6 1.6-2.1-2.1-2.1 2.1-1.6-1.6 2.2-2.2v-2.2A3.5 3.5 0 0 1 16 8.5Z" fill="white" />
      <circle cx="16" cy="12.5" r="1.4" fill="#7c6bff" />
    </svg>
  );
}

export function LogoFull({ size = 28, showSub = true, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={size} />
      <div className="leading-none">
        <div className={`font-heading font-bold text-[17px] tracking-tight ${light ? 'text-white' : 'text-foreground'}`}>Lethem</div>
        {showSub && <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mt-0.5">API access manager</div>}
      </div>
    </div>
  );
}