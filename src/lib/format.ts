export const fmtNum = (n: number): string =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n || 0);

export const fmtTime = (ts: number): string =>
  !ts ? '—' : new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export const fmtDate = (ts: number | null | undefined): string =>
  !ts ? 'Never' : new Date(ts * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

export const fmtCost = (v: number): string =>
  Number(v || 0) ? `$${Number(v).toFixed(6)}` : '—';

export const quotaColor = (used: number, limit: number): 'over' | 'warn' | 'ok' => {
  const pct = (used / Math.max(limit, 1)) * 100;
  return pct > 90 ? 'over' : pct > 70 ? 'warn' : 'ok';
};

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export const generateToken = (prefix = 'sk-kg-'): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [prefix];
  for (let s = 0; s < 3; s++) {
    let seg = '';
    for (let i = 0; i < 12; i++) seg += chars[Math.floor(Math.random() * chars.length)];
    segments.push(seg);
  }
  return segments.join('');
};

export const maskKey = (key: string): string => {
  if (!key) return 'sk-••••';
  if (key.length <= 8) return `${key.slice(0, 3)}••••`;
  return `${key.slice(0, 5)}••••${key.slice(-4)}`;
};
