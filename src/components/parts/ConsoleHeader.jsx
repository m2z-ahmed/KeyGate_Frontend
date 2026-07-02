import { useLethem } from '../../contexts/LethemContext';
import { IconChevronRight, IconRefresh, IconMenu } from './Icons';

const PAGE_LABELS = {
  overview: 'Overview', masterkeys: 'Master Keys', subkeys: 'Subkeys',
  logs: 'Gateway Logs', analytics: 'Analytics', demo: 'Live Demo',
  notifications: 'Alerts', health: 'Health', billing: 'Billing',
  usage: 'Usage', members: 'Members', roles: 'Roles', invites: 'Invites',
  danger: 'Danger Zone', profile: 'Profile', workspace: 'Workspace',
  subscription: 'Subscription', invoices: 'Invoices', docs: 'Docs',
  general: 'General', endpoint: 'API Endpoint', security: 'Security', audit: 'Audit Logs',
};

export default function ConsoleHeader({ page, projectSlug, go, onMenuToggle, accountMode }) {
  const lethem = useLethem();
  const selectedProject = lethem?.selectedProject;
  const projectName = selectedProject?.name || selectedProject?.slug || projectSlug || '';

  return (
    <header className='console-header'>
      <div className='console-header-left'>
        <button className='mobile-menu-btn' onClick={onMenuToggle} aria-label='Toggle menu'>
          <IconMenu width={18} height={18} />
        </button>
        <nav className='breadcrumb'>
          {accountMode ? (
            <>
              <span className='breadcrumb-root' onClick={() => go?.('/console')}>Console</span>
              <IconChevronRight width={12} height={12} className='breadcrumb-sep' />
              <span className='breadcrumb-page'>{PAGE_LABELS[page] || page}</span>
            </>
          ) : projectName ? (
            <>
              <span className='breadcrumb-root' onClick={() => go?.('/console')}>{projectName}</span>
              <IconChevronRight width={12} height={12} className='breadcrumb-sep' />
              <span className='breadcrumb-page'>{PAGE_LABELS[page] || page}</span>
            </>
          ) : (
            <span className='breadcrumb-page'>{PAGE_LABELS[page] || page}</span>
          )}
        </nav>
      </div>
      <div className='console-header-right'>
        <div className='header-badge-row'>
          <span className='header-env-badge'>
            <span className='header-env-dot' />
            Live
          </span>
        </div>
      </div>
    </header>
  );
}
