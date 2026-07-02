import { useEffect } from 'react';

const PAGE_SHORTCUTS = {
  g1: 'overview', g2: 'masterkeys', g3: 'subkeys', g4: 'logs', g5: 'analytics',
  g6: 'demo', g7: 'notifications', g8: 'health',
};

export default function KeyboardShortcuts({ view, page, navigate }) {
  useEffect(() => {
    let pending = '';
    let timer;
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      clearTimeout(timer);
      const combo = pending + key;
      if (PAGE_SHORTCUTS[combo]) { e.preventDefault(); navigate(PAGE_SHORTCUTS[combo]); pending = ''; return; }
      if (key === 'g') { pending = 'g'; timer = setTimeout(() => { pending = ''; }, 1000); return; }
      pending = '';
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); clearTimeout(timer); };
  }, [navigate, view, page]);
  return null;
}
