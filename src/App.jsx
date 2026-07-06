import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { useEffect, useState } from 'react';
import useConsoleRouteState from '@/hooks/useConsoleRouteState';
import LethemProvider, { useLethem, VALID_PAGES } from '@/contexts/LethemContext';
import { AuthProvider as LethemAuthProvider } from '@/contexts/AuthContext';
import { Spinner, Button } from '@/components/kit';
import { LogoIcon } from '@/components/parts/Logo';
import ProjectSelectView from '@/views/ProjectSelectView';
import CreateProjectView from '@/views/CreateProjectView';
import NotFoundView from '@/views/NotFoundView';
import ConsoleShell from '@/views/ConsoleShell';
import HealthPage from '@/components/pages/HealthPage';
import LoginView from '@/views/LoginView';
import LandingPage from '@/pages/LandingPage';
import PolicyPage from '@/pages/PolicyPage';

function BootSplash() {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <LogoIcon size={40} />
        <div className="font-heading text-lg font-bold">Lethem</div>
        <Spinner size={20} />
        <div className="text-xs text-muted-foreground">Loading workspace</div>
      </div>
    </div>
  );
}

function AppError({ error, onRetry }) {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive font-bold text-xl">!</div>
      <h1 className="font-heading text-xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{error?.message || 'An unexpected error occurred'}</p>
      <Button className="mt-6" onClick={onRetry}>Try again</Button>
    </div>
  );
}

function BootLoader({ go, view, projectSlug, onBootComplete }) {
  const { loadProviders, loadProjects, loadBilling, loadAccount, notify } = useLethem();
  const [bootFailed, setBootFailed] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setBootFailed(null);
    loadProviders().catch(() => {});
    Promise.all([loadProjects(), loadBilling?.().catch(() => null), loadAccount?.().catch(() => null)])
      .then(async ([list, billing]) => {
        if (cancelled) return;
        if (!list.length) {
          if (view === 'account' || view === 'create') { onBootComplete?.(); return; }
          go('/console'); onBootComplete?.(); return;
        }
        if (window.location.pathname === '/') { go('/console'); onBootComplete?.(); return; }
        const currentPlan = billing?.plans?.find((plan) => plan.id === billing.currentPlan);
        const projectLimit = currentPlan?.limits?.projects ?? 3;
        if (view === 'create' && projectLimit != null && list.length >= projectLimit) { go('/console'); onBootComplete?.(); return; }
        if (view === 'account') { onBootComplete?.(); return; }
        if (projectSlug && !list.find((p) => p.slug === projectSlug || p.id === projectSlug)) {
          const refreshed = await loadProjects().catch(() => []);
          if (cancelled) return;
          if (!refreshed.find((p) => p.slug === projectSlug || p.id === projectSlug)) {
            notify('Project not found', 'error');
            go('/console');
          }
        }
        onBootComplete?.();
      })
      .catch((e) => { if (cancelled) return; setBootFailed(e); onBootComplete?.(); });
    return () => { cancelled = true; };
  }, [projectSlug, view]);

  if (bootFailed) return <AppError error={bootFailed} onRetry={() => setBootFailed(null)} />;
  return null;
}

function PublicHealth({ go }) {
  const { ctx } = useLethem();
  const publicCtx = { ...ctx, api: (path, opts = {}) => ctx.api(path, { ...opts, skipAuth: true, headers: {} }) };
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <button onClick={() => go('/')} className="flex items-center gap-2"><LogoIcon size={26} /><span className="font-heading font-bold">Lethem</span></button>
        <a href="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to home</a>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10"><HealthPage ctx={publicCtx} publicMode /></main>
    </div>
  );
}

function AppRouter({ routeState }) {
  const { page, view, projectSlug, go } = routeState;
  const navigate = (p) => go(`/console/${projectSlug}/${p}`);

  if (routeState.publicPage) {
    return routeState.publicPage === 'landing' ? <LandingPage go={go} /> : <PolicyPage type={routeState.publicPage} go={go} />;
  }
  if (routeState.isPublicHealth) return <PublicHealth go={go} />;

  return (
    <>
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
    </>
  );
}

function AuthenticatedApp() {
  const routeState = useConsoleRouteState();
  const { projectSlug, page, isPublicHealth, publicPage, view, go } = routeState;
  const { isAuthenticated, isLoading: authLoading, authError } = useAuth();
  const [booted, setBooted] = useState(false);

  useEffect(() => { setBooted(false); }, [isAuthenticated]);

  if (authError?.type === 'user_not_registered') return <UserNotRegisteredError />;
  if (authLoading && !publicPage) return <BootSplash />;

  // Public pages render without the Lethem auth provider.
  if (publicPage) {
    return publicPage === 'landing' ? <LandingPage go={go} /> : <PolicyPage type={publicPage} go={go} />;
  }
  if (isPublicHealth) {
    return (
      <LethemProvider projectSlug="" page="health">
        <PublicHealth go={go} />
      </LethemProvider>
    );
  }

  // Authenticated console — wrapped in the Lethem (Auth0) auth provider.
  return (
    <LethemAuthProvider>
      {!isAuthenticated ? (
        <LoginView />
      ) : (
        <LethemProvider projectSlug={projectSlug} page={page}>
          {!booted && <BootLoader go={go} view={view} projectSlug={projectSlug} onBootComplete={() => setBooted(true)} />}
          {booted ? <AppRouter routeState={routeState} /> : <BootSplash />}
        </LethemProvider>
      )}
    </LethemAuthProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;