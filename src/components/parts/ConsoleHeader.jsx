import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogoFull } from './Logo';
import { IconBell, IconMenu, IconExternal, IconUser, IconSettings, IconBilling, IconLogs } from './Icons';
import { useAuth } from '../../contexts/AuthContext';

export default function ConsoleHeader({ page, selectedProject, projectSlug, onSwitchProject, onOpenMobileMenu, onOpenNotifications, mobileMenuOpen = false, navigate }) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 64, right: 24 });
  const userMenuButtonRef = useRef(null);
  const userMenuPanelRef = useRef(null);
  const pageTitle = String(page || 'overview').replace(/^./, (m) => m.toUpperCase());
  const go = (target) => navigate?.(target);
  const goAccount = (target) => {
    setUserMenuOpen(false);
    const currentPath = `${window.location.pathname}${window.location.search || ''}`;
    const accountPath = /^\/console\/(subscription|billing|profile|workspace|docs)(\/|$)/.test(currentPath);
    let from = accountPath ? '' : currentPath;
    try {
      if (from) sessionStorage.setItem('lethem_last_console_path', from);
      else from = sessionStorage.getItem('lethem_last_console_path') || '';
    } catch (_) {}
    window.history.pushState({ from }, '', `/console/${target}`);
    window.dispatchEvent(new Event('popstate'));
  };
  const userLabel = user?.email || user?.name || 'Signed in';
  const avatar = (user?.email || user?.name || selectedProject?.name || 'K').charAt(0).toUpperCase();

  const updateMenuPosition = () => {
    const rect = userMenuButtonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({
      top: Math.round(rect.bottom + 10),
      right: Math.max(12, Math.round(window.innerWidth - rect.right)),
    });
  };

  useLayoutEffect(() => {
    if (userMenuOpen) updateMenuPosition();
  }, [userMenuOpen, userLabel]);

  useEffect(() => {
    if (!userMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (userMenuButtonRef.current?.contains(event.target) || userMenuPanelRef.current?.contains(event.target)) return;
      setUserMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setUserMenuOpen(false);
    };
    const handleViewportChange = () => updateMenuPosition();

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [userMenuOpen]);

  const userMenuPanel = userMenuOpen ? createPortal(
    <div
      ref={userMenuPanelRef}
      className='user-menu-panel user-menu-panel-overlay open'
      style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
      role='menu'
    >
      <button type='button' role='menuitem' onClick={() => goAccount('profile')}><IconUser /> Profile</button>
      <button type='button' role='menuitem' onClick={() => goAccount('workspace')}><IconSettings /> Workspace Settings</button>
      <button type='button' role='menuitem' onClick={() => goAccount('subscription')}><IconBilling /> Billing</button>
      <button type='button' role='menuitem' onClick={() => goAccount('docs')}><IconLogs /> Documentation</button>
      <button type='button' role='menuitem' className='danger' onClick={() => { setUserMenuOpen(false); logout(); }}>Logout</button>
    </div>,
    document.body,
  ) : null;

  return <>
    <header className='console-header app-shell-header'>
      <div className='app-shell-desktop'>
        <div className='logo app-shell-logo'>
          <LogoFull size={22} />
        </div>
        <div className='app-shell-project'>
          <div className='console-title'>{selectedProject?.name || 'Project'} <span style={{color:'var(--muted)',fontWeight:400}}>&bull;</span> {pageTitle}</div>
          <div className='console-sub'>{selectedProject?.slug || projectSlug} &middot; API Access Manager</div>
        </div>
        <div className='app-shell-actions'>
          <button className='btn btn-ghost btn-sm app-shell-switch' onClick={onSwitchProject}><IconExternal width={14} height={14} /> Switch project</button>
          <div className='user-menu'>
            <button
              ref={userMenuButtonRef}
              className='auth-user-chip user-menu-trigger'
              type='button'
              aria-haspopup='menu'
              aria-expanded={userMenuOpen}
              onClick={() => setUserMenuOpen((open) => !open)}
            >
              <span>{user?.picture ? <img src={user.picture} alt='' /> : avatar}</span>
              <strong>{userLabel}</strong>
            </button>
          </div>
        </div>
      </div>

      <div className='mobile-appbar app-shell-mobile'>
        <button className={`mobile-icon-btn mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={onOpenMobileMenu} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
          <IconMenu width={20} height={20} />
        </button>
        <div>
          <div className='mobile-brand'>Lethem</div>
          <div className='mobile-shell-sub'>{pageTitle}</div>
        </div>
        <div className='mobile-appbar-actions'>
          <button className='mobile-icon-btn' onClick={onOpenNotifications} aria-label='Notifications'><IconBell width={20} height={20} /></button>
          <button className='mobile-avatar' onClick={() => goAccount('profile')} aria-label='Profile'>{avatar}</button>
          <button className='mobile-logout' onClick={logout} aria-label='Logout'>Logout</button>
        </div>
      </div>
    </header>
    {userMenuPanel}
  </>;
}
