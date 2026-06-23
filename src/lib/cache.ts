const KEY_PREFIX = 'keygate_cache_';
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000;

function currentScope(): string {
  if (typeof window !== 'undefined' && (window as any).__KEYGATE_CACHE_SCOPE) return (window as any).__KEYGATE_CACHE_SCOPE;
  return 'public';
}

function safeScope(scope: string): string {
  return String(scope || currentScope()).replace(/[^a-zA-Z0-9._:-]/g, '_');
}

function cacheKey(path: string, scope: string): string {
  return `${KEY_PREFIX}${safeScope(scope)}:${path}`;
}

function isCacheKey(key: string): boolean {
  return Boolean(key && key.startsWith(KEY_PREFIX));
}

function eachCacheKey(callback: (key: string) => void): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isCacheKey(key)) keys.push(key);
  }
  keys.forEach(callback);
}

export function cachePruneExpired(): void {
  try {
    eachCacheKey((key) => {
      try {
        const entry = JSON.parse(localStorage.getItem(key) || 'null');
        if (!entry?.ts || Date.now() - entry.ts > MAX_CACHE_AGE) localStorage.removeItem(key);
      } catch { localStorage.removeItem(key); }
    });
  } catch { /* localStorage unavailable */ }
}

export function cacheGet<T>(path: string, scope: string): T | null {
  try {
    const key = cacheKey(path, scope);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry?.ts || Date.now() - entry.ts > MAX_CACHE_AGE) { localStorage.removeItem(key); return null; }
    return entry.data as T;
  } catch { return null; }
}

export function cacheSet<T>(path: string, data: T, scope: string): void {
  try {
    cachePruneExpired();
    const entry = { data, ts: Date.now(), ttl: MAX_CACHE_AGE };
    localStorage.setItem(cacheKey(path, scope), JSON.stringify(entry));
  } catch { /* full or unavailable */ }
}

export function cacheBust(pathOrPrefix: string, scope: string): void {
  try {
    const prefix = cacheKey(pathOrPrefix, scope);
    eachCacheKey((key) => { if (key.startsWith(prefix)) localStorage.removeItem(key); });
  } catch { /* skip */ }
}

export function cacheBustAfterMutation(path: string, scope: string): void {
  cacheBust(path, scope);
  const segments = path.split('/').filter(Boolean);
  while (segments.length > 1) {
    segments.pop();
    cacheBust('/' + segments.join('/'), scope);
  }
  if (path.startsWith('/api/subkeys') || path.startsWith('/api/master-keys') || path.startsWith('/api/projects') || path.startsWith('/v1/')) {
    cacheBust('/api/analytics', scope);
    cacheBust('/api/subkeys', scope);
    cacheBust('/api/projects', scope);
  }
  if (path.startsWith('/api/billing')) cacheBust('/api/billing', scope);
}

export function cacheClearAll(): void {
  try { eachCacheKey((key) => localStorage.removeItem(key)); } catch { /* skip */ }
}

export function setCacheScope(scope: string): void {
  if (typeof window !== 'undefined') (window as any).__KEYGATE_CACHE_SCOPE = safeScope(scope || 'public');
}
