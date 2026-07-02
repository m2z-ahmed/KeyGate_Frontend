import { useEffect, useMemo, useRef, useState } from 'react';
import { useLethem } from '../../contexts/LethemContext';
import { IconOverview, IconMasterKey, IconSubkey, IconLogs, IconDemo, IconHealth, IconNotifications, IconArrowLeft, IconAnalytics, IconTeam, IconBilling, IconSettings, IconUser } from './Icons';

const sections = [
  { label: 'Overview', items: [['overview', 'Overview', IconOverview]] },
  { label: 'Access', items: [['masterkeys', 'Master keys', IconMasterKey], ['subkeys', 'Subkeys', IconSubkey], ['demo', 'Live demo', IconDemo]] },
  { label: 'Monitoring', items: [['analytics', 'Analytics', IconAnalytics], ['usage', 'Usage', IconBilling], ['logs', 'Request logs', IconLogs], ['notifications', 'Notifications', IconNotifications], ['health', 'Health', IconHealth]] },
  { label: 'Team', items: [['members', 'Members', IconTeam], ['roles', 'Roles', IconUser], ['invites', 'Invites', IconNotifications]] },
  { label: 'Settings', items: [['general', 'General', IconSettings], ['endpoint', 'API Endpoint', IconDemo], ['security', 'Security', IconMasterKey], ['audit', 'Audit Logs', IconLogs]] },
];

const mobileItems = [
  { key: 'overview', label: 'Overview', Icon: IconOverview, items: [['overview', 'Overview', IconOverview]] },
  { key: 'access', label: 'Access', Icon: IconMasterKey, items: sections[1].items },
  { key: 'monitor', label: 'Monitor', Icon: IconAnalytics, items: sections[2].items },
  { key: 'team', label: 'Team', Icon: IconTeam, items: sections[3].items },
  { key: 'settings', label: 'Settings', Icon: IconSettings, items: sections[4].items },
];

function MobileNavPopover({ item, anchorRef, onNavigate, onClose }) {
  const panelRef = useRef(null);
  const [style, setStyle] = useState({ left: 12, bottom: 86, width: 220 });

  useEffect(() => {
    const update = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const width = Math.min(240, window.innerWidth - 24);
      const left = Math.max(12, Math.min(window.innerWidth - width - 12, anchor.left + (anchor.width / 2) - (width / 2)));
      const bottom = Math.max(84, window.innerHeight - anchor.top + 10);
      setStyle({ left, bottom, width });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('orientationchange', update); };
  }, [anchorRef, item]);

  useEffect(() => {
    const close = (event) => {
      if (panelRef.current?.contains(event.target) || anchorRef.current?.contains(event.target)) return;
      onClose();
    };
    const escape = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [anchorRef, onClose]);

  return <div ref={panelRef} className='mobile-nav-popover' style={style} role='menu' aria-label={`${item.label} pages`}>
    <span className='mobile-nav-popover-caret' />
    {item.items.map(([key, label, Icon]) => <button key={key} type='button' role='menuitem' onClick={() => onNavigate(key)}><Icon width={17} height={17} /><span>{label}</span></button>)}
  </div>;
}

export default function Sidebar({ page, navigate, onBackToConsole, drawerOpen, setDrawerOpen }) {
  const [collapsed, setCollapsed] = useState(() => ({}));
  const [openMobileKey, setOpenMobileKey] = useState('');
  const tabRefs = useRef({});
  const { ctx } = useLethem();
  const endpoint = `${ctx.API}/`;
  const copyEndpoint = () => ctx.copyText(endpoint, 'proxy-endpoint');
  const toggleSection = (label) => setCollapsed((v) => ({ ...v, [label]: !v[label] }));
  const go = (next) => { navigate(next); setDrawerOpen(false); setOpenMobileKey(''); };
  const activeMobileKey = useMemo(() => mobileItems.find((item) => item.items.some(([key]) => key === page))?.key || 'overview', [page]);

  const renderItem = ([key, label, Icon], mobile = false) => (
    <button key={key} className={`${mobile ? 'mobile-drawer-item' : 'nav-item'} ${page === key ? 'active' : ''}`} onClick={() => (mobile ? go(key) : navigate(key))}>
      <Icon /> {label}{key === 'demo' && <span className='nav-dot' />}
    </button>
  );

  return <>
    <aside className='sidebar'><nav className='nav'>
      {onBackToConsole && <button className='nav-item' onClick={onBackToConsole}><IconArrowLeft /> Back to console</button>}
      {sections.map((section) => <div className='nav-section' key={section.label}><button className='nav-label nav-label-button' onClick={() => toggleSection(section.label)} aria-expanded={!collapsed[section.label]}>{section.label}<span>{collapsed[section.label] ? '+' : '−'}</span></button>{!collapsed[section.label] && section.items.map((item) => renderItem(item))}</div>)}
    </nav><div className='sidebar-footer'><button type='button' className='api-url-box api-url-button' onClick={copyEndpoint} title='Copy proxy endpoint'><div className='api-url-label'>Proxy endpoint</div><div className='api-url'>{ctx.copiedItem === 'proxy-endpoint' ? 'Copied!' : endpoint}</div></button></div></aside>

    <div className={`mobile-drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && setDrawerOpen(false)}><aside className='mobile-drawer'><div className='mobile-drawer-title'>Lethem</div>{onBackToConsole && <button className='mobile-drawer-item mobile-drawer-back' onClick={() => { onBackToConsole(); setDrawerOpen(false); }}><IconArrowLeft /> Back to console</button>}<div className='mobile-drawer-list'>{sections.map((section) => <div className='mobile-drawer-section' key={section.label}><button className='nav-label nav-label-button' onClick={() => toggleSection(section.label)} aria-expanded={!collapsed[section.label]}>{section.label}<span>{collapsed[section.label] ? '+' : '−'}</span></button>{!collapsed[section.label] && section.items.map((item) => renderItem(item, true))}</div>)}</div><button type='button' className='mobile-drawer-footer api-url-button' onClick={copyEndpoint}>{ctx.copiedItem === 'proxy-endpoint' ? 'Copied!' : endpoint}</button></aside></div>

    <nav className='mobile-tabbar' aria-label='Mobile navigation'>
      {mobileItems.map((item) => { const Icon = item.Icon; return <button key={item.key} ref={(node) => { tabRefs.current[item.key] = node; }} className={`mobile-tab ${activeMobileKey === item.key ? 'active' : ''} ${openMobileKey === item.key ? 'popover-open' : ''}`} onClick={() => item.items.length === 1 ? go(item.items[0][0]) : setOpenMobileKey((key) => key === item.key ? '' : item.key)} aria-haspopup={item.items.length > 1 ? 'menu' : undefined} aria-expanded={openMobileKey === item.key}><Icon width={18} height={18} /><span>{item.label}</span></button>; })}
    </nav>
    {openMobileKey && <MobileNavPopover item={mobileItems.find((item) => item.key === openMobileKey)} anchorRef={{ current: tabRefs.current[openMobileKey] }} onNavigate={go} onClose={() => setOpenMobileKey('')} />}
  </>;
}
