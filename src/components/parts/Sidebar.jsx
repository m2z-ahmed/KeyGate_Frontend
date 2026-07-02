import Logo from './Logo';
import {
  IconHome, IconKey, IconKeys, IconActivity, IconLog, IconAnalytics,
  IconBell, IconTerminal, IconHeart, IconCreditCard, IconUser,
  IconUsers, IconShield, IconUserPlus, IconSettings, IconAlertTriangle,
  IconFolder, IconGrid, IconLogout, IconChevronDown, IconChevronRight,
  IconInbox, IconExternalLink
} from './Icons';
import { useAuth } from '../../contexts/AuthContext';
import { useLethem } from '../../contexts/LethemContext';
import { API_BASE_URL } from '../../lib/config';
import { useState } from 'react';

const NAV = {
  project: [
    { id: 'overview',      label: 'Overview',      Icon: IconHome },
    { id: 'masterkeys',    label: 'Master Keys',   Icon: IconKey },
    { id: 'subkeys',       label: 'Subkeys',       Icon: IconKeys },
    { id: 'logs',          label: 'Gateway Logs',  Icon: IconLog },
    { id: 'analytics',     label: 'Analytics',     Icon: IconAnalytics },
    { id: 'demo',          label: 'Live Demo',     Icon: IconTerminal },
    { id: 'notifications', label: 'Alerts',        Icon: IconBell },
    { id: 'health',        label: 'Health',        Icon: IconHeart },
  ],
  team: [
    { id: 'members',  label: 'Members',  Icon: IconUsers },
    { id: 'roles',    label: 'Roles',    Icon: IconShield },
    { id: 'invites',  label: 'Invites',  Icon: IconUserPlus },
  ],
  settings: [
    { id: 'billing',   label: 'Billing',   Icon: IconCreditCard },
    { id: 'usage',     label: 'Usage',     Icon: IconActivity },
    { id: 'danger',    label: 'Danger',    Icon: IconAlertTriangle, danger: true },
  ],
  account: [
    { id: 'profile',    label: 'Profile',    Icon: IconUser },
    { id: 'workspace',  label: 'Workspace',  Icon: IconSettings },
    { id: 'billing',    label: 'Billing',    Icon: IconCreditCard },
    { id: 'usage',      label: 'Usage',      Icon: IconActivity },
  ],
};

function NavItem({ id, label, Icon, active, onClick, danger = false }) {
  return (
    <button className={`nav-item${active ? ' active' : ''}${danger ? ' nav-item-danger' : ''}`} onClick={() => onClick(id)}>
      <Icon width={15} height={15} />
      <span>{label}</span>
      {active && <span className='nav-dot' />}
    </button>
  );
}

function NavSection({ label, items, page, onNav }) {
  return (
    <div className='nav-section'>
      {label && <div className='nav-label'>{label}</div>}
      {items.map(({ id, label, Icon, danger }) => (
        <NavItem key={id} id={id} label={label} Icon={Icon} active={page === id} onClick={onNav} danger={danger} />
      ))}
    </div>
  );
}

export default function Sidebar({ page, navigate, go, projectSlug, accountMode }) {
  const { user, logout } = useAuth();
  const lethem = useLethem();
  const selectedProject = lethem?.selectedProject;
  const projects = lethem?.projects || [];
  const [projectsOpen, setProjectsOpen] = useState(false);

  const onNav = (p) => {
    if (navigate) navigate(p);
  };

  const goHome = () => go?.('/console');

  return (
    <aside className='sidebar'>
      <div className='logo'>
        <button className='logo-btn' onClick={goHome}>
          <Logo />
        </button>
      </div>

      <div className='sidebar-scroll'>
        {!accountMode && selectedProject && (
          <div className='project-switcher' onClick={() => setProjectsOpen((v) => !v)}>
            <div className='project-switcher-icon'>
              <IconFolder width={13} height={13} />
            </div>
            <div className='project-switcher-name'>
              <span className='project-switcher-label'>Project</span>
              <span className='project-switcher-val'>{selectedProject.name || selectedProject.slug}</span>
            </div>
            <IconChevronDown width={13} height={13} style={{ opacity: 0.5, marginLeft: 'auto', flexShrink: 0 }} />
          </div>
        )}
        {!accountMode && projectsOpen && projects.length > 1 && (
          <div className='project-dropdown'>
            {projects.map((p) => (
              <button key={p.id || p.slug} className={`project-dropdown-item${(p.slug === projectSlug || p.id === projectSlug) ? ' active' : ''}`} onClick={() => { setProjectsOpen(false); go?.(`/console/${p.slug || p.id}/overview`); }}>
                <IconFolder width={12} height={12} />
                {p.name || p.slug}
              </button>
            ))}
            <button className='project-dropdown-item project-dropdown-new' onClick={() => { setProjectsOpen(false); go?.('/console/new'); }}>
              + New project
            </button>
          </div>
        )}

        <nav className='nav'>
          {accountMode ? (
            <NavSection items={NAV.account} page={page} onNav={onNav} />
          ) : (
            <>
              <NavSection label='Project' items={NAV.project} page={page} onNav={onNav} />
              <NavSection label='Team' items={NAV.team} page={page} onNav={onNav} />
              <NavSection label='Settings' items={NAV.settings} page={page} onNav={onNav} />
            </>
          )}
        </nav>
      </div>

      <div className='sidebar-footer'>
        <div className='api-url-box'>
          <div className='api-url-label'>Gateway</div>
          <div className='api-url'>{API_BASE_URL.replace(/^https?:\/\//, '')}</div>
        </div>
        {user && (
          <div className='sidebar-user'>
            <div className='sidebar-user-avatar'>
              {user.picture ? <img src={user.picture} alt='' /> : (user.name || 'L').charAt(0).toUpperCase()}
            </div>
            <div className='sidebar-user-info'>
              <div className='sidebar-user-name'>{user.name || 'Lethem User'}</div>
              <div className='sidebar-user-email'>{user.email || ''}</div>
            </div>
            <button className='sidebar-logout' onClick={logout} title='Sign out'>
              <IconLogout width={14} height={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
