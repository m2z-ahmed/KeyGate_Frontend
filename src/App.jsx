import { useEffect, useState } from 'react';
import useConsoleRouteState from './hooks/useConsoleRouteState';
import LethemProvider, { useLethem, VALID_PAGES } from './contexts/LethemContext';
import KeyboardShortcuts from './components/parts/KeyboardShortcuts';
import ProjectSelectView from './views/ProjectSelectView';
import CreateProjectView from './views/CreateProjectView';
import NotFoundView from './views/NotFoundView';
import ConsoleShell from './views/ConsoleShell';
import HealthPage from './components/pages/HealthPage';
import LoginView from './views/LoginView';
import { useAuth } from './contexts/AuthContext';
import { LogoIcon } from './components/parts/Logo';
import LandingPage from '../Pages/LandingPage';
import PolicyPage from '../Pages/PolicyPage';

// ── Splash screen shown during initial boot ──
function BootSplash() {
  return (
    <div className='boot-splash'>
      <div className='boot-splash-inner'>
        <div className='boot-splash-logo'>
          <LogoIcon size={40} />
        </div>
        <div className='boot-splash-ring' />
      </div>
      <div className='boot-splash-text'>Loading workspace</div>
    </div>
  );
}

// ── Error boundary fallback UI ──
function AppError({ error, onRetry }) {
  return (
    <div className='app-error'>
      <div className='app-error-card'>
        <div className='app-error-icon'>!</div>
        <h2 className='app-error-title'>Something went wrong</h2>
        <p className='app-error-msg'>{error?.message || 'An unexpected error occurred'}</p>
        <button className='btn btn-primary' onClick={onRetry}>Try again</button>
      </div>
    </div>
  );
}

// ── Initial data loader: fetches providers & projects, then routes ──
function BootLoader({ go, view, projectSlug, onBootComplete }) {
  const { loadProviders, loadProjects, loadBilling, notify } = useLethem();
  const [bootFailed, setBootFailed] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setBootFailed(null);

    loadProviders().catch(() => {});
    Promise.all([loadProjects(), loadBilling?.().catch(() => null)])
      .then(([list, billing]) => {
        if (cancelled) return;
        if (!list.length) {
          if (view !== 'create' && view !== 'account') go('/console/new');
          onBootComplete?.();
          return;
        }
        if (window.location.pathname === '/') { go('/console'); onBootComplete?.(); return; }
        const currentPlan = billing?.plans?.find((plan) => plan.id === billing.currentPlan);
        const projectLimit = currentPlan?.limits?.projects ?? 3;
        if (view === 'create' && projectLimit != null && list.length >= projectLimit) { go('/console'); onBootComplete?.(); return; }
        if (view === 'account') { onBootComplete?.(); return; }
        if (projectSlug && !list.find((p) => p.slug === projectSlug || p.id === projectSlug)) {
          notify('Project not found', 'error');
          go('/console');
        }
        onBootComplete?.();
      })
      .catch((e) => {
        if (cancelled) return;
        setBootFailed(e);
        onBootComplete?.();
      });

    return () => { cancelled = true; };
  }, [projectSlug, view]);

  if (bootFailed) return <AppError error={bootFailed} onRetry={() => setBootFailed(null)} />;

  return null;
}

// ── View transitions: applies CSS class for animated transitions ──
function ViewTransition({ view, children }) {
  return (
    <div key={view} className='view-transition'>
      {children}
    </div>
  );
}

// ── Router: renders the correct view based on route state ──
function AppRouter({ routeState }) {
  const { page, view, projectSlug, go, isPublicHealth, publicPage } = routeState;
  const { ctx } = useLethem();

  if (publicPage) {
    if (publicPage === 'landing') return <LandingPage />;
    return <PolicyPage type={publicPage} />;
  }

  if (isPublicHealth) {
    const publicCtx = { ...ctx, api: (path, opts = {}) => ctx.api(path, { ...opts, skipAuth: true, headers: {} }) };
    return <HealthPage ctx={publicCtx} publicMode />;
  }

  const navigate = (p) => go(`/console/${projectSlug}/${p}`);

  return (
    <>
      <KeyboardShortcuts view={view} page={page} navigate={navigate} />

      <ViewTransition view={view}>
        {view === 'create' ? (
          <CreateProjectView go={go} />
        ) : view === 'account' ? (
          <ConsoleShell go={go} page={page} projectSlug={projectSlug} accountMode />
        ) : view === 'select' || !projectSlug ? (
          <ProjectSelectView go={go} />
        ) : view === 'console' && page && !VALID_PAGES.includes(page) ? (
          <NotFoundView go={go} page={page} navigate={navigate} />
        ) : (
          <ConsoleShell go={go} page={page} projectSlug={projectSlug} />
        )}
      </ViewTransition>
    </>
  );
}

// ── App shell: wraps the entire app with header, branding, and global UI chrome ──
function AppShell({ children }) {
  return (
    <div className='app-shell'>
      {children}
    </div>
  );
}

// ── App entry: single route state, single provider, boot splash, global shell ──
export default function App() {
  const routeState = useConsoleRouteState();
  const { projectSlug, page, isPublicHealth, publicPage } = routeState;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [booted, setBooted] = useState(false);
  const [hasError, setHasError] = useState(null);

  useEffect(() => { setBooted(false); }, [isAuthenticated]);

  if (hasError) {
    return <AppError error={hasError} onRetry={() => setHasError(null)} />;
  }

  if (authLoading && !publicPage) return <BootSplash />;

  return (
    <LethemProvider projectSlug={isPublicHealth ? '' : projectSlug} page={page}>
      <AppShell>
        {publicPage ? (
          <AppRouter routeState={routeState} />
        ) : !isPublicHealth && !isAuthenticated ? (
          <LoginView />
        ) : isPublicHealth ? (
          <AppRouter routeState={routeState} />
        ) : (
          <>
            {!booted && (
              <BootLoader
                go={routeState.go}
                view={routeState.view}
                projectSlug={projectSlug}
                onBootComplete={() => setBooted(true)}
              />
            )}
            {booted ? (
              <AppRouter routeState={routeState} />
            ) : (
              <BootSplash />
            )}
          </>
        )}
      </AppShell>
    </LethemProvider>
  );
}
