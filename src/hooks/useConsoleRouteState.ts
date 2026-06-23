import { useEffect, useState } from 'react';

const ACCOUNT_PAGES = new Set(['subscription', 'billing', 'profile', 'workspace', 'docs']);

export interface RouteState {
  page: string;
  view: string;
  projectSlug: string;
  go: (path: string) => void;
  isPublicHealth: boolean;
}

export default function useConsoleRouteState(): RouteState {
  const [page, setPage] = useState('overview');
  const [view, setView] = useState('select');
  const [projectSlug, setProjectSlug] = useState('');
  const [isPublicHealth, setIsPublicHealth] = useState(false);

  const rememberReturnPath = () => {
    const path = `${window.location.pathname}${window.location.search || ''}`;
    try { sessionStorage.setItem('keygate_last_console_path', path); } catch { /* skip */ }
  };

  const parsePath = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('code') && params.has('state')) return;

    if (window.location.pathname === '/health') {
      setIsPublicHealth(true);
      setView('select');
      setProjectSlug('');
      setPage('health');
      return;
    }

    setIsPublicHealth(false);
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'console') {
      window.history.pushState({}, '', '/console');
      return parsePath();
    }
    if (!parts[1]) { rememberReturnPath(); setView('select'); setProjectSlug(''); setPage('overview'); return; }
    if (parts[1] === 'new') { rememberReturnPath(); setView('create'); setProjectSlug(''); setPage('overview'); return; }
    if (ACCOUNT_PAGES.has(parts[1])) { setView('account'); setProjectSlug(''); setPage(parts[1]); return; }
    rememberReturnPath();
    setView('console');
    setProjectSlug(parts[1]);
    setPage(parts[2] || 'overview');
  };

  const go = (path: string) => { window.history.pushState({}, '', path); parsePath(); };

  useEffect(() => {
    const h = () => parsePath();
    window.addEventListener('popstate', h);
    parsePath();
    return () => window.removeEventListener('popstate', h);
  }, []);

  return { page, view, projectSlug, go, isPublicHealth };
}
