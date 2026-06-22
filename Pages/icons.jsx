const PATHS = {
  ArrowRight: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
  Check: <path d="m20 6-11 11-5-5"/>,
  ChevronDown: <path d="m6 9 6 6 6-6"/>,
  ChevronRight: <path d="m9 18 6-6-6-6"/>,
  Shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>,
  Sparkles: <><path d="m12 3-1.9 5.8L4 11l6.1 2.2L12 19l1.9-5.8L20 11l-6.1-2.2L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></>,
  Star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z"/>,
  Lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
  Github: <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.3-.4-2.6-1.3-3.5.1-.4.5-1.8-.1-3.5 0 0-1-.3-3.5 1.3a12.1 12.1 0 0 0-6.2 0C6.4 1.7 5.4 2 5.4 2c-.6 1.7-.2 3.1-.1 3.5A5 5 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.4.5-.8 1.2-.9 2.2-.8.4-2.9 1-4.1-1.2 0 0-.8-1.5-2.2-1.6 0 0-1.4 0-.1.9 0 0 .9.4 1.5 2 0 0 .8 2.7 4.8 1.8V22"/>,
  Zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>,
  Globe: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></>,
  Menu: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
  X: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  Mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  FileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h1"/></>,
  KeyRound: <><path d="M2 18a5 5 0 1 1 9.9-1H22v4h-3v-2h-2v2h-3v-2h-2.1A5 5 0 0 1 2 18Z"/><circle cx="7" cy="18" r="1"/></>,
  Gauge: <><path d="M12 14 16 8"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/></>,
  BarChart3: <><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></>,
  ScrollText: <><path d="M8 21h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8"/><path d="M6 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2v18Z"/><path d="M10 8h8"/><path d="M10 12h8"/><path d="M10 16h5"/></>,
  RefreshCw: <><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/></>,
  CheckCircle2: <><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></>,
  Clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
};
function Icon({ name, className = '', strokeWidth = 2, ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props}>{PATHS[name]}</svg>;
}
export const ArrowRight=(p)=><Icon name="ArrowRight" {...p}/>; export const Check=(p)=><Icon name="Check" {...p}/>; export const ChevronDown=(p)=><Icon name="ChevronDown" {...p}/>; export const ChevronRight=(p)=><Icon name="ChevronRight" {...p}/>; export const Shield=(p)=><Icon name="Shield" {...p}/>; export const Sparkles=(p)=><Icon name="Sparkles" {...p}/>; export const Star=(p)=><Icon name="Star" {...p}/>; export const Lock=(p)=><Icon name="Lock" {...p}/>; export const Github=(p)=><Icon name="Github" {...p}/>; export const Zap=(p)=><Icon name="Zap" {...p}/>; export const Globe=(p)=><Icon name="Globe" {...p}/>; export const Menu=(p)=><Icon name="Menu" {...p}/>; export const X=(p)=><Icon name="X" {...p}/>; export const Mail=(p)=><Icon name="Mail" {...p}/>; export const FileText=(p)=><Icon name="FileText" {...p}/>; export const KeyRound=(p)=><Icon name="KeyRound" {...p}/>; export const Gauge=(p)=><Icon name="Gauge" {...p}/>; export const BarChart3=(p)=><Icon name="BarChart3" {...p}/>; export const ScrollText=(p)=><Icon name="ScrollText" {...p}/>; export const RefreshCw=(p)=><Icon name="RefreshCw" {...p}/>; export const CheckCircle2=(p)=><Icon name="CheckCircle2" {...p}/>; export const Clock=(p)=><Icon name="Clock" {...p}/>;
