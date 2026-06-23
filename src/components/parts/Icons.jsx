/* ── SVG Icon Components ── */
/* Clean, minimal icons at 20×20 viewBox, currentColor fill/stroke */

const s = { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const IconOverview = (p) => <svg {...s} {...p}><rect x={2} y={2} width={7} height={7} rx={1.5} /><rect x={11} y={2} width={7} height={7} rx={1.5} /><rect x={2} y={11} width={7} height={7} rx={1.5} /><rect x={11} y={11} width={7} height={7} rx={1.5} /></svg>;

export const IconMasterKey = (p) => <svg {...s} {...p}><path d="M8 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" /><path d="M12.5 12.5 18 18" /><path d="m13.5 11.5 1 1" /></svg>;

export const IconSubkey = (p) => <svg {...s} {...p}><path d="M8 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" /><path d="M11.5 11.5 16 16" /><path d="M14 4h4v4" /><path d="M12 8.5 18 2.5" /></svg>;

export const IconLogs = (p) => <svg {...s} {...p}><path d="M4 4h12v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4Z" /><path d="M7 2v2" /><path d="M13 2v2" /><path d="M7 8h6" /><path d="M7 11h6" /><path d="M7 14h4" /></svg>;

export const IconDemo = (p) => <svg {...s} {...p}><circle cx={10} cy={10} r={8} /><path d="m8 6 6 4-6 4V6Z" /></svg>;

export const IconHealth = (p) => <svg {...s} {...p}><path d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" /><path d="m5.5 10 2.5 2.5 2.5-2.5" /><path d="M8 12.5V7" /></svg>;

export const IconNotifications = (p) => <svg {...s} {...p}><path d="M10 3a5 5 0 0 0-5 5v3l-1.5 2.5h13L15 11V8a5 5 0 0 0-5-5Z" /><path d="M12 15a2 2 0 1 1-4 0" /></svg>;

export const IconArrowLeft = (p) => <svg {...s} {...p}><path d="M15 10H5" /><path d="m9 6-4 4 4 4" /></svg>;

export const IconCopy = (p) => <svg {...s} {...p}><rect x={6} y={6} width={10} height={10} rx={1.5} /><path d="M4 12V4h8" /></svg>;

export const IconCheck = (p) => <svg {...s} {...p}><path d="M15 6 8 14l-3-3" /></svg>;

export const IconX = (p) => <svg {...s} {...p}><path d="M6 6l8 8M14 6l-8 8" /></svg>;

export const IconMenu = (p) => <svg {...s} {...p}><path d="M3 5h14M3 10h14M3 15h14" /></svg>;

export const IconPlus = (p) => <svg {...s} {...p}><path d="M10 5v10M5 10h10" /></svg>;

export const IconBell = (p) => <svg {...s} {...p}><path d="M10 2a5 5 0 0 0-5 5v3l-2 3h14l-2-3V7a5 5 0 0 0-5-5Z" /><path d="M12 14a2 2 0 1 1-4 0" /></svg>;

export const IconRefresh = (p) => <svg {...s} {...p}><path d="M15 8a6 6 0 0 0-10.3-3.3" /><path d="M17 2v4h-4" /><path d="M5 12a6 6 0 0 0 10.3 3.3" /><path d="M3 18v-4h4" /></svg>;

export const IconTrash = (p) => <svg {...s} {...p}><path d="M4 5h12" /><path d="M7 5V3.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V5" /><path d="M6 5v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5" /></svg>;

export const IconExternal = (p) => <svg {...s} {...p}><path d="M11 3h6v6" /><path d="M17 3 9 11" /><path d="M15 13v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" /></svg>;

export const IconSearch = (p) => <svg {...s} {...p}><circle cx={9} cy={9} r={4.5} /><path d="m15 15-3.5-3.5" /></svg>;

export const IconAnalytics = (p) => <svg {...s} {...p}><path d="M4 16V9" /><path d="M10 16V4" /><path d="M16 16v-6" /><path d="M3 16h14" /></svg>;

export const IconTeam = (p) => <svg {...s} {...p}><path d="M7.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M2.5 17a5 5 0 0 1 10 0" /><path d="M14 10a2.5 2.5 0 1 0 0-5" /><path d="M14.5 13c1.5.5 2.6 1.8 3 4" /></svg>;

export const IconBilling = (p) => <svg {...s} {...p}><rect x={3} y={5} width={14} height={10} rx={2} /><path d="M3 8h14" /><path d="M6 12h3" /></svg>;

export const IconSettings = (p) => <svg {...s} {...p}><path d="M8.5 3h3l.5 2 1.8.8 1.8-1 1.5 2.6-1.6 1.2.1 1.4 1.5 1.2-1.5 2.6-1.8-1-1.8.8-.5 2h-3l-.5-2-1.8-.8-1.8 1-1.5-2.6L5 10l-.1-1.4-1.5-1.2 1.5-2.6 1.8 1 1.8-.8.5-2Z" /><circle cx={10} cy={10} r={2.5} /></svg>;

export const IconUser = (p) => <svg {...s} {...p}><circle cx={10} cy={6.5} r={3} /><path d="M4 17a6 6 0 0 1 12 0" /></svg>;
