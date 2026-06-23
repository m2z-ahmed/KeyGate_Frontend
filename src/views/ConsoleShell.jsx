import { useLethem } from '../contexts/LethemContext';
import Sidebar from '../components/parts/Sidebar';
import ConsoleHeader from '../components/parts/ConsoleHeader';
import OverviewPage from '../components/pages/OverviewPage';
import MasterKeysPage from '../components/pages/MasterKeysPage';
import SubkeysPage from '../components/pages/SubkeysPage';
import LogsPage from '../components/pages/LogsPage';
import DemoPage from '../components/pages/DemoPage';
import HealthPage from '../components/pages/HealthPage';
import NotificationsPage from '../components/pages/NotificationsPage';
import BillingPage from '../components/pages/BillingPage';
import PlaceholderPage from '../components/pages/PlaceholderPage';
import AnalyticsPage from '../components/pages/AnalyticsPage';
import UsagePage from '../components/pages/UsagePage';
import DangerPage from '../components/pages/DangerPage';

const PLACEHOLDER_PAGES = new Set(['members', 'roles', 'invites', 'invoices', 'general', 'endpoint', 'security', 'audit', 'profile', 'workspace', 'docs']);

const PAGES = {
  overview: OverviewPage,
  masterkeys: MasterKeysPage,
  subkeys: SubkeysPage,
  logs: LogsPage,
  demo: DemoPage,
  health: HealthPage,
  notifications: NotificationsPage,
  billing: BillingPage,
  subscription: BillingPage,
  analytics: AnalyticsPage,
  usage: UsagePage,
  danger: DangerPage,
};

export default function ConsoleShell({ go, page, projectSlug, accountMode = false }) {
  const { ctx, projects, selectedProject, mobileMenuOpen, setMobileMenuOpen, notif, deleteProject, setProjectToDelete } = useLethem();
  const accountProject = selectedProject || { name: 'Account', slug: 'user subscription' };

  const navigate = (p) => accountMode ? go(`/console/${p}`) : go(`/console/${projectSlug}/${p}`);
  const getAccountBackPath = () => {
    const fromState = window.history.state?.from;
    let fromStored = '';
    try { fromStored = sessionStorage.getItem('lethem_last_console_path') || ''; } catch (_) {}
    const fallback = selectedProject?.slug ? `/console/${selectedProject.slug}/overview` : '/console';
    const target = fromState || fromStored || fallback;
    return /^\/console(\/|$)/.test(target) && !/^\/console\/(subscription|billing|profile|workspace|docs)(\/|$)/.test(target) ? target : fallback;
  };
  const goAccountBack = () => go(getAccountBackPath());
  const PageComponent = PAGES[page];

  return (
    <>
      <div className={`app ${accountMode ? 'account-mode' : ''}`}>
        <ConsoleHeader
          page={page}
          selectedProject={accountProject}
          projectSlug={accountMode ? 'account' : projectSlug}
          onSwitchProject={() => go('/console')}
          onOpenMobileMenu={() => setMobileMenuOpen((open) => !open)}
          onOpenNotifications={() => navigate('notifications')}
          mobileMenuOpen={mobileMenuOpen}
          navigate={navigate}
        />
        {!accountMode && <Sidebar
          page={page}
          navigate={navigate}
          onBackToConsole={() => go('/console')}
          drawerOpen={mobileMenuOpen}
          setDrawerOpen={setMobileMenuOpen}
        />}
        <main className='main'>
          <div key={page} className='page-transition'>
            {PLACEHOLDER_PAGES.has(page) ? (
              <PlaceholderPage type={page} onBack={accountMode ? goAccountBack : null} />
            ) : PageComponent && (
              page === 'overview'
                ? <OverviewPage navigate={navigate} ctx={ctx} />
                : page === 'usage' ? <UsagePage ctx={{ ...ctx, projects }} billing={ctx.billing} />
                : page === 'danger' ? <DangerPage ctx={ctx} selectedProject={selectedProject} deleteProject={deleteProject} setProjectToDelete={setProjectToDelete} />
                : <PageComponent ctx={ctx} onBack={accountMode ? goAccountBack : null} />
            )}
          </div>
        </main>
      </div>
      <div className={`notif ${notif.show ? 'show' : ''} ${notif.type}`}>{notif.msg}</div>
    </>
  );
}