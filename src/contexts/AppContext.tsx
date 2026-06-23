import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cacheGet, cacheSet, cacheBust, cacheBustAfterMutation, cachePruneExpired, setCacheScope } from '../lib/cache';
import { FALLBACK_PROVIDERS, type Provider } from '../lib/providers';
import { fmtNum, fmtTime, fmtDate, quotaColor, sleep } from '../lib/format';
import type { Project, MasterKey, Subkey, LogEntry, Analytics, Billing } from '../types';

export const VALID_PAGES = ['overview', 'masterkeys', 'subkeys', 'logs', 'demo', 'health', 'notifications', 'billing', 'analytics', 'usage', 'members', 'roles', 'invites', 'subscription', 'invoices', 'general', 'endpoint', 'security', 'audit', 'danger', 'profile', 'workspace', 'docs'];

const API = import.meta.env.VITE_API_URL || 'https://lethem-backend.onrender.com';

interface AppContextValue {
  API: string;
  providers: Provider[];
  loadProviders: () => Promise<Provider[]>;
  api: <T = any>(path: string, opts?: ApiOptions) => Promise<T>;
  notify: (msg: string, type?: 'success' | 'error') => void;
  copyText: (text: string, id?: string) => Promise<void>;
  modal: string;
  setModal: (m: string) => void;
  revealedToken: string;
  setRevealedToken: (t: string) => void;
  loadMasterKeys: () => Promise<void>;
  loadSubkeys: () => Promise<void>;
  loadLogs: () => Promise<void>;
  loadOverview: () => Promise<void>;
  loadBilling: (opts?: { refresh?: boolean }) => Promise<Billing>;
  loadProjects: () => Promise<Project[]>;
  createProject: (name: string) => Promise<Project | null>;
  deleteProject: (target?: Project | null) => Promise<Project[] | undefined>;
  subkeys: Subkey[];
  setSubkeys: React.Dispatch<React.SetStateAction<Subkey[]>>;
  masterKeys: MasterKey[];
  logs: LogEntry[];
  analytics: Analytics;
  billing: Billing | null;
  setBilling: React.Dispatch<React.SetStateAction<Billing | null>>;
  loading: Record<string, boolean>;
  copiedItem: string;
  projects: Project[];
  projectSearch: string;
  setProjectSearch: (s: string) => void;
  filteredProjects: Project[];
  selectedProject: Project | undefined;
  projectToDelete: Project | null;
  setProjectToDelete: (p: Project | null) => void;
  deleteConfirm: string;
  setDeleteConfirm: (s: string) => void;
  notif: { show: boolean; msg: string; type: string };
  fmtNum: typeof fmtNum;
  fmtTime: typeof fmtTime;
  fmtDate: typeof fmtDate;
  quotaColor: typeof quotaColor;
  sleep: typeof sleep;
}

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  noCache?: boolean;
}

const CTX = createContext<AppContextValue | null>(null);
export const useApp = () => {
  const ctx = useContext(CTX);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export function AppProvider({ children, projectSlug, page }: { children: ReactNode; projectSlug: string; page: string }) {
  const { getAccessToken, isAuthenticated, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [subkeys, setSubkeys] = useState<Subkey[]>([]);
  const [masterKeys, setMasterKeys] = useState<MasterKey[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ totalRequests: 0, totalTokens: 0, avgLatency: '—' });
  const [notif, setNotif] = useState({ show: false, msg: '', type: 'success' });
  const [modal, setModal] = useState('');
  const [revealedToken, setRevealedToken] = useState('—');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({ overview: true, masterkeys: true, subkeys: true, logs: true });
  const [copiedItem, setCopiedItem] = useState('');
  const [billing, setBilling] = useState<Billing | null>(null);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotif({ show: true, msg, type });
    setTimeout(() => setNotif((v) => ({ ...v, show: false })), 3000);
  };

  useEffect(() => {
    setCacheScope(isAuthenticated && user?.sub ? user.sub : 'public');
    cachePruneExpired();
  }, [isAuthenticated, user?.sub]);

  const copyText = async (text: string, id = '') => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedItem(id); setTimeout(() => setCopiedItem((v) => (v === id ? '' : v)), 1600); }
      else notify('Copied to clipboard');
    } catch { notify('Failed to copy', 'error'); }
  };

  const api = async <T = any>(path: string, opts: ApiOptions = {}): Promise<T> => {
    const hasBody = opts.body !== undefined;
    const method = (opts.method || 'GET').toUpperCase();
    const isRead = method === 'GET';
    const noCache = Boolean(opts.noCache);
    const headers: Record<string, string> = {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(projectSlug ? { 'x-project-id': projectSlug } : {}),
      ...opts.headers,
    };
    const skipAuth = Boolean(opts.skipAuth || opts.headers?.Authorization);
    const cacheScope = skipAuth ? 'public' : (user?.sub || 'anonymous');
    if (!skipAuth && isAuthenticated) {
      headers.Authorization = `Bearer ${await getAccessToken()}`;
    }

    if (isRead && !noCache) {
      const cached = cacheGet<T>(path, cacheScope);
      if (cached !== null) return cached;
    }

    const res = await fetch(API + path, { method, headers, body: hasBody ? JSON.stringify(opts.body) : undefined });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data?.error?.message || data?.error || `HTTP ${res.status}`) as any;
      err.code = data?.error?.code || null;
      throw err;
    }

    if (isRead) { if (!noCache) cacheSet(path, data, cacheScope); }
    else { cacheBustAfterMutation(path, cacheScope); }
    return data as T;
  };

  const loadProviders = async (): Promise<Provider[]> => {
    try {
      const res = await api<{ providers: Provider[] }>('/api/providers', { skipAuth: true });
      setProviders(res.providers || []);
      return res.providers || [];
    } catch { return []; }
  };

  const loadProjects = async (): Promise<Project[]> => {
    const rows = await api<Project[]>('/api/projects');
    setProjects(rows);
    return rows;
  };

  const loadBilling = async ({ refresh = false } = {}): Promise<Billing> => {
    if (refresh) cacheBust('/api/billing/plans', user?.sub || 'anonymous');
    const data = await api<Billing>('/api/billing/plans', { noCache: true });
    setBilling(data);
    return data;
  };

  const loadOverview = async () => {
    setLoading((v) => ({ ...v, overview: true }));
    try {
      const [sks, an] = await Promise.all([api<Subkey[]>('/api/subkeys'), api<Analytics>('/api/analytics')]);
      setSubkeys(sks);
      setLogs(an.logs || []);
      setAnalytics(an);
      setLoading((v) => ({ ...v, logs: false }));
    } finally { setLoading((v) => ({ ...v, overview: false })); }
  };

  const loadMasterKeys = async () => {
    setLoading((v) => ({ ...v, masterkeys: true }));
    try { setMasterKeys(await api<MasterKey[]>('/api/master-keys')); }
    finally { setLoading((v) => ({ ...v, masterkeys: false })); }
  };

  const loadSubkeys = async () => {
    setLoading((v) => ({ ...v, subkeys: true }));
    try { setSubkeys(await api<Subkey[]>('/api/subkeys')); }
    finally { setLoading((v) => ({ ...v, subkeys: false })); }
  };

  const loadLogs = async () => {
    setLoading((v) => ({ ...v, logs: true }));
    try {
      const an = await api<Analytics>('/api/analytics');
      setLogs(an.logs || []);
      setAnalytics(an);
    } finally { setLoading((v) => ({ ...v, logs: false })); }
  };

  const createProject = async (name: string): Promise<Project | null> => {
    const projectLimit = billing?.plans?.find((p) => p.id === billing.currentPlan)?.limits?.projects ?? 3;
    if (projectLimit !== null && projects.length >= projectLimit) {
      notify(`Maximum ${projectLimit} projects allowed on your current plan`, 'error');
      return null;
    }
    const p = await api<Project>('/api/projects', { method: 'POST', body: { name } });
    await loadProjects();
    return p;
  };

  const deleteProject = async (target: Project | null = projectToDelete): Promise<Project[] | undefined> => {
    if (!target) return;
    const ref = encodeURIComponent(target.slug || target.id);
    const attempts = [
      { path: `/api/projects/by-slug/${ref}`, method: 'DELETE' },
      { path: `/api/projects/${encodeURIComponent(target.id)}`, method: 'DELETE' },
    ];
    let deleted = false;
    for (const attempt of attempts) {
      try {
        const data = await api(attempt.path, { method: attempt.method });
        if (data?.success !== false) { deleted = true; break; }
      } catch { /* try next */ }
    }
    if (!deleted) throw new Error('Failed to delete project');
    cacheBust('/api/projects', user?.sub || 'anonymous');
    setDeleteConfirm('');
    setProjectToDelete(null);
    notify('Project deleted');
    return await loadProjects();
  };

  useEffect(() => {
    if (!projectSlug) return;
    if (page === 'overview' || page === 'analytics' || page === 'usage') loadOverview().catch((e) => notify(e.message, 'error'));
    if (page === 'usage') loadBilling().catch(() => {});
    if (page === 'masterkeys') loadMasterKeys().catch((e) => notify(e.message, 'error'));
    if (page === 'subkeys') loadSubkeys().catch((e) => notify(e.message, 'error'));
    if (page === 'logs') loadLogs().catch((e) => notify(e.message, 'error'));
    if (page === 'demo' || page === 'notifications') {
      loadSubkeys().catch((e) => notify(e.message, 'error'));
      setLoading((v) => ({ ...v, subkeys: true }));
    }
  }, [page, projectSlug]);

  useEffect(() => {
    if ((page === 'demo' || page === 'notifications') && subkeys.length > 0) {
      setLoading((v) => ({ ...v, subkeys: false }));
    }
  }, [subkeys, page]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || !projectSlug) return;
      if (page === 'overview' || page === 'analytics' || page === 'usage') loadOverview().catch(() => {});
      else if (page === 'masterkeys') loadMasterKeys().catch(() => {});
      else if (page === 'subkeys') loadSubkeys().catch(() => {});
      else if (page === 'logs') loadLogs().catch(() => {});
      else if (page === 'demo' || page === 'notifications') loadSubkeys().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [page, projectSlug]);

  const filteredProjects = projects.filter((p) =>
    `${p.name} ${p.slug} ${p.id}`.toLowerCase().includes(projectSearch.toLowerCase())
  );
  const selectedProject = projects.find((p) => p.slug === projectSlug || p.id === projectSlug);

  const value = useMemo<AppContextValue>(() => ({
    API, providers: providers.length ? providers : FALLBACK_PROVIDERS, loadProviders,
    api, notify, copyText, modal, setModal, revealedToken, setRevealedToken,
    loadMasterKeys, loadSubkeys, loadLogs, loadOverview, loadBilling, loadProjects,
    createProject, deleteProject,
    subkeys, setSubkeys, masterKeys, logs, analytics, billing, setBilling, loading, copiedItem,
    projects, projectSearch, setProjectSearch, filteredProjects, selectedProject,
    projectToDelete, setProjectToDelete, deleteConfirm, setDeleteConfirm, notif,
    fmtNum, fmtTime, fmtDate, quotaColor, sleep,
  }), [modal, subkeys, masterKeys, logs, analytics, billing, revealedToken, page, projectSlug, providers, loading, copiedItem, projects, projectSearch, projectToDelete, deleteConfirm, notif, isAuthenticated, user?.sub]);

  return <CTX.Provider value={value}>{children}</CTX.Provider>;
}
