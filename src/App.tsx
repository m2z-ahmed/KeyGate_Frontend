import { useEffect, useState } from 'react';
import useConsoleRouteState from './hooks/useConsoleRouteState';
import { AppProvider, VALID_PAGES, useApp } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import { LogoIcon } from './components/Logo';
import ProjectSelectView from './views/ProjectSelectView';
import CreateProjectView from './views/CreateProjectView';
import NotFoundView from './views/NotFoundView';
import ConsoleShell from './views/ConsoleShell';
import HealthPage from './components/pages/HealthPage';
import LoginView from './views/LoginView';
import OverviewPage from './components/pages/OverviewPage';
import MasterKeysPage from './components/pages/MasterKeysPage';
import SubkeysPage from './components/pages/SubkeysPage';
import LogsPage from './components/pages/LogsPage';
import DemoPage from './components/pages/DemoPage';
import NotificationsPage from './components/pages/NotificationsPage';
import BillingPage from './components/pages/BillingPage';
import PlaceholderPage from './components/pages/PlaceholderPage';
import AnalyticsPage from './components/pages/AnalyticsPage';
import UsagePage from './components/pages/UsagePage';
import DangerPage from './components/pages/DangerPage';

const PLACEHOLDER_PAGES = new Set(['members', 'roles', 'invites', 'invoices', 'general', 'endpoint', 'security', 'audit', 'profile', 'workspace', 'docs']);

const PAGES: Record<string, React.ComponentType<any>> = {
  overview: OverviewPage, masterkeys: MasterKeysPage, subkeys: SubkeysPage, logs: LogsPage,
  demo: DemoPage, health: HealthPage, notifications: NotificationsPage, billing: BillingPage,
  subscription: BillingPage, analytics: AnalyticsPage, usage: UsagePage, danger: DangerPage,
};

function BootSplash() {
  return (
    <div className="min-h-screen bg-base-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse-soft"><LogoIcon size={48} /></div>
        <div className="text-sm text-gray-500">Loading workspace</div>
      </div>
    </div>
  );
}

function AppRouter({ routeState }: { routeState: ReturnType<typeof useConsoleRouteState> }) {
  const { page, view, projectSlug, go, isPublicHealth } = routeState;
  const ctx = useApp();

  if (isPublicHealth) return <HealthPage publicMode />;

  const navigate = (p: string) => go(`/console/${projectSlug}/${p}`);

  if (view === 'create') return <CreateProjectView go={go} />;
  if (view === 'account') return <ConsoleShell go={go} page={page} projectSlug={projectSlug} accountMode>{renderPage(page, ctx, go, navigate, projectSlug)}</ConsoleShell>;
  if (view === 'select' || !projectSlug) return <ProjectSelectView go={go} />;
  if (view === 'console' && page && !VALID_PAGES.includes(page)) return <NotFoundView go={go} page={page} navigate={navigate} />;
  return <ConsoleShell go={go} page={page} projectSlug={projectSlug}>{renderPage(page, ctx, go, navigate, projectSlug)}</ConsoleShell>;
}

function renderPage(page: string, ctx: any, go: (p: string) => void, navigate: (p: string) => void, _projectSlug: string) {
  if (PLACEHOLDER_PAGES.has(page)) {
    const accountPath = /^\/console\/(subscription|billing|profile|workspace|docs)(\/|$)/.test(window.location.pathname);
    const getBack = () => {
      const fromState = (window.history.state as any)?.from;
      let fromStored = '';
      try { fromStored = sessionStorage.getItem('keygate_last_console_path') || ''; } catch { /* skip */ }
      const fallback = ctx.selectedProject?.slug ? `/console/${ctx.selectedProject.slug}/overview` : '/console';
      const target = fromState || fromStored || fallback;
      return /^\/console(\/|$)/.test(target) && !/^\/console\/(subscription|billing|profile|workspace|docs)(\/|$)/.test(target) ? target : fallback;
    };
    return <PlaceholderPage type={page} onBack={accountPath ? () => go(getBack()) : null} />;
  }

  if (page === 'overview') return <OverviewPage navigate={navigate} />;
  if (page === 'usage') return <UsagePage />;
  if (page === 'danger') return <DangerPage selectedProject={ctx.selectedProject} deleteProject={ctx.deleteProject} setProjectToDelete={ctx.setProjectToDelete} />;
  if (page === 'billing' || page === 'subscription') {
    const accountPath = /^\/console\/(subscription|billing|profile|workspace|docs)(\/|$)/.test(window.location.pathname);
    const getBack = () => {
      const fromState = (window.history.state as any)?.from;
      let fromStored = '';
      try { fromStored = sessionStorage.getItem('keygate_last_console_path') || ''; } catch { /* skip */ }
      const fallback = ctx.selectedProject?.slug ? `/console/${ctx.selectedProject.slug}/overview` : '/console';
      const target = fromState || fromStored || fallback;
      return /^\/console(\/|$)/.test(target) && !/^\/console\/(subscription|billing|profile|workspace|docs)(\/|$)/.test(target) ? target : fallback;
    };
    return <BillingPage onBack={accountPath ? () => go(getBack()) : undefined} />;
  }

  const PageComponent = PAGES[page];
  return PageComponent ? <PageComponent /> : <PlaceholderPage type={page} />;
}

function BootLoader({ go, view, projectSlug, onBootComplete }: { go: (p: string) => void; view: string; projectSlug: string; onBootComplete: () => void }) {
  const { loadProviders, loadProjects, loadBilling, notify } = useApp();
  const [bootFailed, setBootFailed] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBootFailed(null);
    loadProviders().catch(() => {});
    Promise.all([loadProjects(), loadBilling?.().catch(() => null)])
      .then(([list, billing]) => {
        if (cancelled) return;
        if (!list.length) { if (view !== 'create' && view !== 'account') go('/console/new'); onBootComplete(); return; }
        if (window.location.pathname === '/') { go('/console'); onBootComplete(); return; }
        const currentPlan = (billing as any)?.plans?.find((plan: any) => plan.id === (billing as any).currentPlan);
        const projectLimit = currentPlan?.limits?.projects ?? 3;
        if (view === 'create' && projectLimit != null && list.length >= projectLimit) { go('/console'); onBootComplete(); return; }
        if (view === 'account') { onBootComplete(); return; }
        if (projectSlug && !list.find((p: any) => p.slug === projectSlug || p.id === projectSlug)) { notify('Project not found', 'error'); go('/console'); }
        onBootComplete();
      })
      .catch((e) => { if (!cancelled) setBootFailed(e.message); onBootComplete(); });
    return () => { cancelled = true; };
  }, [projectSlug, view]);

  if (bootFailed) return <div className="p-8 text-center text-danger-400">Failed to load: {bootFailed}</div>;
  return null;
}

export default function App() {
  const routeState = useConsoleRouteState();
  const { projectSlug, page, isPublicHealth } = routeState;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [booted, setBooted] = useState(false);

  useEffect(() => { setBooted(false); }, [isAuthenticated]);

  if (authLoading && !isPublicHealth) return <BootSplash />;

  if (isPublicHealth) {
    return (
      <AppProvider projectSlug="" page={page}>
        <AppRouter routeState={routeState} />
      </AppProvider>
    );
  }

  if (!isAuthenticated) return <LoginView />;

  return (
    <AppProvider projectSlug={projectSlug} page={page}>
      {!booted && <BootLoader go={routeState.go} view={routeState.view} projectSlug={projectSlug} onBootComplete={() => setBooted(true)} />}
      {booted ? <AppRouter routeState={routeState} /> : <BootSplash />}
    </AppProvider>
  );
}
