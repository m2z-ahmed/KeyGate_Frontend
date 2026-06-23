import { useState } from 'react';
import { IconOverview, IconMasterKey, IconSubkey, IconLogs, IconDemo, IconHealth, IconNotifications, IconArrowLeft, IconAnalytics, IconTeam, IconBilling, IconSettings, IconUser } from './Icons';

const sections = [
  { label: 'Overview', items: [['overview', 'Overview', IconOverview]] },
  { label: 'Access', items: [['masterkeys', 'Master keys', IconMasterKey], ['subkeys', 'Subkeys', IconSubkey], ['demo', 'Live demo', IconDemo]] },
  { label: 'Monitoring', items: [['analytics', 'Analytics', IconAnalytics], ['usage', 'Usage', IconBilling], ['logs', 'Request logs', IconLogs], ['notifications', 'Notifications', IconNotifications], ['health', 'Health', IconHealth]] },
  { label: 'Team', items: [['members', 'Members', IconTeam], ['roles', 'Roles', IconUser], ['invites', 'Invites', IconNotifications]] },
  { label: 'Settings', items: [['general', 'General', IconSettings], ['endpoint', 'API Endpoint', IconDemo], ['security', 'Security', IconMasterKey], ['audit', 'Audit Logs', IconLogs], ['danger', 'Danger Zone', IconHealth]] },
];

const mobileItems = [
  ['overview', 'Overview', IconOverview],
  ['masterkeys', 'Access', IconMasterKey],
  ['analytics', 'Monitor', IconAnalytics],
  ['members', 'Team', IconTeam],
  ['usage', 'Usage', IconBilling],
];

export default function Sidebar({ page, navigate, onBackToConsole, drawerOpen, setDrawerOpen }) {
  const [collapsed, setCollapsed] = useState(() => ({}));
  const toggleSection = (label) => setCollapsed((v) => ({ ...v, [label]: !v[label] }));
  const go = (next) => {
    navigate(next);
    setDrawerOpen(false);
  };

  const renderItem = ([key, label, Icon], mobile = false) => (
    <button key={key} className={`${mobile ? 'mobile-drawer-item' : 'nav-item'} ${key === 'danger' ? 'danger-nav-item' : ''} ${page === key ? 'active' : ''}`} onClick={() => (mobile ? go(key) : navigate(key))}>
      <Icon /> {label}{key === 'demo' && <span className='nav-dot' />}
    </button>
  );

  return <>
    <aside className='sidebar'>
      <nav className='nav'>
        {onBackToConsole && <button className='nav-item' onClick={onBackToConsole}><IconArrowLeft /> Back to console</button>}
        {sections.map((section) => (
          <div className='nav-section' key={section.label}>
            <button className='nav-label nav-label-button' onClick={() => toggleSection(section.label)} aria-expanded={!collapsed[section.label]}>{section.label}<span>{collapsed[section.label] ? '+' : '−'}</span></button>
            {!collapsed[section.label] && section.items.map((item) => renderItem(item))}
          </div>
        ))}
      </nav>
      <div className='sidebar-footer'><div className='api-url-box'><div className='api-url-label'>Proxy endpoint</div><div className='api-url'>https://lethem-backend.onrender.com/</div></div></div>
    </aside>

    <div className={`mobile-drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && setDrawerOpen(false)}>
      <aside className='mobile-drawer'>
        <div className='mobile-drawer-title'>Lethem</div>
        <div className='mobile-drawer-list'>
          {sections.map((section) => (
            <div className='mobile-drawer-section' key={section.label}>
              <button className='nav-label nav-label-button' onClick={() => toggleSection(section.label)} aria-expanded={!collapsed[section.label]}>{section.label}<span>{collapsed[section.label] ? '+' : '−'}</span></button>
              {!collapsed[section.label] && section.items.map((item) => renderItem(item, true))}
            </div>
          ))}
        </div>
        <div className='mobile-drawer-footer'>https://lethem-backend.onrender.com/</div>
      </aside>
    </div>

    <nav className='mobile-tabbar' aria-label='Mobile navigation'>
      {mobileItems.map(([key, label, Icon]) => <button key={key} className={`mobile-tab ${page === key ? 'active' : ''}`} onClick={() => go(key)}><Icon width={18} height={18} /><span>{label}</span></button>)}
    </nav>
  </>;
}
