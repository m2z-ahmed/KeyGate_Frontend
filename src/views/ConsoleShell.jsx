import { useLethem } from '../contexts/LethemContext';
import Sidebar from '../components/parts/Sidebar';
import ConsoleHeader from '../components/parts/ConsoleHeader';
import { Toast, Button, cn } from '../components/kit';
import { ArrowLeft, User, Settings, CreditCard, FileText } from 'lucide-react';

import OverviewPage from '../components/pages/OverviewPage';
import MasterKeysPage from '../components/pages/MasterKeysPage';
import SubkeysPage from '../components/pages/SubkeysPage';
import LogsPage from '../components/pages/LogsPage';
import DemoPage from '../components/pages/DemoPage';
import HealthPage from '../components/pages/HealthPage';
import NotificationsPage from '../components/pages/NotificationsPage';
import BillingPage from '../components/pages/BillingPage';
import ProfilePage from '../components/pages/ProfilePage';
import WorkspacePage from '../components/pages/WorkspacePage';
import PlaceholderPage from '../components/pages/PlaceholderPage';
import AnalyticsPage from '../components/pages/AnalyticsPage';
import UsagePage from '../components/pages/UsagePage';
import DangerPage from '../components/pages/DangerPage';
import MembersPage from '../components/pages/MembersPage';
import RolesPage from '../components/pages/RolesPage';
import InvitesPage from '../components/pages/InvitesPage';

const PLACEHOLDER_PAGES = new Set(['invoices', 'general', 'endpoint', 'security', 'audit', 'docs']);

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
  profile: ProfilePage,
  workspace: WorkspacePage,
  analytics: AnalyticsPage,
  usage: UsagePage,
  danger: DangerPage,
  members: MembersPage,
  roles: RolesPage,
  invites: InvitesPage,
};

const ACCOUNT_ITEMS = [
  ['profile', 'Profile', User],
  ['workspace', 'Workspace Settings', Settings],
  ['subscription', 'Billing', CreditCard],
  ['docs', 'Documentation', FileText],
];

function AccountSidebar({ page, navigate, onBack }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card/40 lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-border px-4">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft size={15} /> Back</Button>
      </div>
      <nav className="flex-1 px-3 py-4">
        <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">Account</div>
        <div className="space-y-0.5">
          {ACCOUNT_ITEMS.map(([key, label, Icon]) => {
            const active = page === key || (key === 'subscription' && (page === 'subscription' || page === 'billing'));
            return (
              <button key={key} onClick={() => navigate(key)} className={cn('group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all', active ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground')}>
                {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />}
                <Icon size={16} className={cn(active ? 'text-primary' : 'opacity-70')} /> <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export default function ConsoleShell({ go, page, projectSlug, accountMode = false }) {
  const { ctx, selectedProject, mobileMenuOpen, setMobileMenuOpen, notif, deleteProject, setProjectToDelete } = useLethem();

  const navigate = (p) => accountMode ? go(`/console/${p}`) : go(`/console/${projectSlug}/${p}`);
  const goAccountBack = () => {
    const fromState = window.history.state?.from;
    let fromStored = '';
    try { fromStored = sessionStorage.getItem('lethem_last_console_path') || ''; } catch (_) {}
    const fallback = selectedProject?.slug ? `/console/${selectedProject.slug}/overview` : '/console';
    const target = fromState || fromStored || fallback;
    const safe = /^\/console(\/|$)/.test(target) && !/^\/console\/(subscription|billing|profile|workspace|docs)(\/|$)/.test(target) ? target : fallback;
    go(safe);
  };

  const PageComponent = PAGES[page];

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      {accountMode ? (
        <AccountSidebar page={page} navigate={navigate} onBack={goAccountBack} />
      ) : (
        <Sidebar page={page} navigate={navigate} onBackToConsole={() => go('/console')} drawerOpen={mobileMenuOpen} setDrawerOpen={setMobileMenuOpen} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <ConsoleHeader
          page={page}
          selectedProject={selectedProject}
          projectSlug={projectSlug}
          onSwitchProject={() => go('/console')}
          onOpenMobileMenu={() => setMobileMenuOpen((open) => !open)}
          onOpenNotifications={() => navigate('notifications')}
          mobileMenuOpen={mobileMenuOpen}
          navigate={navigate}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl animate-fade-in px-4 py-6 sm:px-6 sm:py-8">
            {PLACEHOLDER_PAGES.has(page) ? (
              <PlaceholderPage type={page} onBack={goAccountBack} />
            ) : PageComponent ? (
              page === 'overview' ? <OverviewPage ctx={ctx} navigate={navigate} /> :
              page === 'usage' ? <UsagePage ctx={ctx} billing={ctx.billing} /> :
              page === 'danger' ? <DangerPage ctx={ctx} selectedProject={selectedProject} deleteProject={deleteProject} setProjectToDelete={setProjectToDelete} /> :
              page === 'billing' || page === 'subscription' ? <BillingPage ctx={ctx} onBack={goAccountBack} /> :
              <PageComponent ctx={ctx} />
            ) : null}
          </div>
        </main>
      </div>

      <Toast notif={notif} />
    </div>
  );
}