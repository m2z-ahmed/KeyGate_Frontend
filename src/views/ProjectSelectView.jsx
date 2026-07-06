import { useEffect, useMemo, useRef, useState } from 'react';
import { useLethem } from '../contexts/LethemContext';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from '../components/parts/Logo';
import { Button, Card, Input, Label, Modal, Badge, Skeleton, EmptyState, Toast, cn } from '../components/kit';
import { fmtNum, fmtDate } from '../contexts/LethemContext';
import { cacheGet, cacheSet } from '../lib/cache';
import { Plus, Search, Trash2, FolderKanban, Bell, LogOut, ChevronDown, X, ArrowRight, Check, Sparkles, Building2, KeyRound, Zap, Activity } from 'lucide-react';

export default function ProjectSelectView({ go }) {
  const {
    projects, projectSearch, setProjectSearch, filteredProjects,
    showPlanBanner, setShowPlanBanner, projectToDelete, setProjectToDelete,
    deleteConfirm, setDeleteConfirm, deleteProject, notif, notify,
    account, updateAccount,
    ctx: { API, fmtDate, fmtNum, billing, subkeys, masterKeys, analytics, copyText, copiedItem, invites, loadInvites, acceptInvite, revokeInvite, api },
  } = useLethem();
  const { user, logout, getAccessToken, isAuthenticated } = useAuth();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountUsage, setAccountUsage] = useState({ subkeys: 0, masterKeys: 0, tokens: 0, requests: 0, loading: false });
  const [quotaRequests, setQuotaRequests] = useState([]);
  const [notificationBusy, setNotificationBusy] = useState('');
  const [hideOnboarding, setHideOnboarding] = useState(false);
  const [setupStep, setSetupStep] = useState('name');
  const [setupSaving, setSetupSaving] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const authName = user?.name && user.name !== user.email ? user.name : '';
  const [setupName, setSetupName] = useState(authName || 'Lethem User');
  const [setupWorkspaceName, setSetupWorkspaceName] = useState('My Workspace');
  const notifWrapRef = useRef(null);
  const onboardingCacheScope = user?.sub || 'anonymous';

  const currentPlan = billing?.plans?.find((p) => p.id === billing.currentPlan) || billing?.plans?.find((p) => p.id === 'free');
  const limits = currentPlan?.limits || {};
  const projectLimit = limits.projects ?? 3;
  const isAtProjectLimit = projectLimit != null && projects.length >= projectLimit;
  const userLabel = user?.name || user?.email || 'Signed in';
  const avatar = (userLabel).charAt(0).toUpperCase();
  const pendingInvites = (invites || []).filter((i) => i.direction === 'received' && i.can_accept);
  const notificationCount = pendingInvites.length + quotaRequests.filter((r) => r.status === 'pending').length;
  const needsSetup = account && !account.user?.onboarding_completed_at;

  useEffect(() => {
    if (!account) return;
    setSetupName(account.user?.name || authName || 'Lethem User');
    setSetupWorkspaceName(account.organization?.name || 'My Workspace');
  }, [account?.user?.name, account?.organization?.name, authName]);

  const loadNotificationData = async () => {
    await loadInvites?.().catch(() => []);
    if (!projects.length) { setQuotaRequests([]); return []; }
    const results = await Promise.allSettled(projects.map(async (project) => {
      const projectId = project.slug || project.id;
      const rows = await api('/api/quota-requests', { noCache: true, headers: { 'x-project-id': projectId } });
      return (Array.isArray(rows) ? rows : []).map((r) => ({ ...r, project_id: projectId, project_name: project.name }));
    }));
    const rows = results.flatMap((r) => r.status === 'fulfilled' ? r.value : []);
    setQuotaRequests(rows);
    return rows;
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadNotificationData().catch(() => {});
  }, [isAuthenticated, projects]);

  useEffect(() => {
    if (!notificationsOpen) return;
    const onDown = (e) => { if (!notifWrapRef.current?.contains(e.target)) setNotificationsOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [notificationsOpen]);

  // Aggregate account usage across all projects (real backend data)
  useEffect(() => {
    const fallback = { subkeys: subkeys.length, masterKeys: masterKeys.length, tokens: analytics?.totalTokens || 0, requests: analytics?.totalRequests || analytics?.logs?.length || 0 };
    if (!projects.length || !isAuthenticated) { setAccountUsage((c) => ({ ...c, ...fallback })); return; }
    const cacheScope = user?.sub || 'anonymous';
    const summaryKey = (project) => `/console-page/project/${project.slug || project.id}/summary`;
    const cached = projects.map((p) => cacheGet(summaryKey(p), cacheScope));
    const total = cached.reduce((t, s) => { if (!s) return t; t.subkeys += Number(s.subkeys || 0); t.masterKeys += Number(s.masterKeys || 0); t.tokens += Number(s.tokens || 0); t.requests += Number(s.requests || 0); return t; }, { subkeys: 0, masterKeys: 0, tokens: 0, requests: 0 });
    if (cached.every(Boolean)) { setAccountUsage({ ...total, loading: false }); return; }
    setAccountUsage((c) => ({ ...c, loading: true }));
    let cancelled = false;
    (async () => {
      const fetchJson = async (project, path) => {
        const token = await getAccessToken(); const pid = project.slug || project.id;
        const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}`, 'x-project-id': pid } });
        if (!res.ok) return null; return res.json().catch(() => null);
      };
      await Promise.allSettled(projects.map(async (project, idx) => {
        if (cached[idx]) return cached[idx];
        const [s, m, an] = await Promise.all([fetchJson(project, '/api/subkeys'), fetchJson(project, '/api/master-keys'), fetchJson(project, '/api/analytics')]);
        const summary = { subkeys: Array.isArray(s) ? s.length : 0, masterKeys: Array.isArray(m) ? m.length : 0, tokens: an?.totalTokens || 0, requests: an?.totalRequests || an?.logs?.length || 0 };
        cacheSet(summaryKey(project), summary, cacheScope);
        return summary;
      }));
      if (cancelled) return;
      const refreshed = projects.map((p) => cacheGet(summaryKey(p), cacheScope)).filter(Boolean);
      const sum = refreshed.reduce((t, s) => { t.subkeys += Number(s.subkeys || 0); t.masterKeys += Number(s.masterKeys || 0); t.tokens += Number(s.tokens || 0); t.requests += Number(s.requests || 0); return t; }, { subkeys: 0, masterKeys: 0, tokens: 0, requests: 0 });
      setAccountUsage({ ...sum, loading: false });
    })();
    return () => { cancelled = true; };
  }, [projects, isAuthenticated]);

  const saveSetupName = async (skip = false) => {
    setSetupSaving(true);
    try { await updateAccount({ name: skip ? 'Lethem User' : (setupName.trim() || 'Lethem User') }); setSetupStep('workspace'); }
    catch (e) { notify(e.message || 'Unable to save your name', 'error'); }
    finally { setSetupSaving(false); }
  };
  const saveSetupWorkspace = async (skip = false) => {
    setSetupSaving(true);
    try { await updateAccount({ workspaceName: skip ? 'My Workspace' : (setupWorkspaceName.trim() || 'My Workspace'), onboardingCompleted: true }); setSetupStep('greet'); setTimeout(() => go('/console'), 1200); }
    catch (e) { notify(e.message || 'Unable to save your workspace', 'error'); }
    finally { setSetupSaving(false); }
  };

  const decideInvite = async (invite, action) => {
    const k = `invite:${invite.id}`; setNotificationBusy(k);
    try { if (action === 'accept') await acceptInvite(invite.id); if (action === 'reject') await revokeInvite(invite.id); await loadNotificationData(); }
    catch (e) { notify(e.message || 'Unable to update invite', 'error'); }
    finally { setNotificationBusy(''); }
  };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    try { await deleteProject(projectToDelete); setProjectToDelete(null); }
    catch (e) { notify(e.message || 'Failed to delete project', 'error'); }
    finally { setDeleteBusy(false); }
  };

  const stats = [
    { label: 'Projects', value: projects.length, icon: FolderKanban, limit: projectLimit },
    { label: 'Subkeys', value: accountUsage.subkeys, icon: KeyRound },
    { label: 'Tokens used', value: fmtNum(accountUsage.tokens), icon: Zap },
    { label: 'Requests', value: fmtNum(accountUsage.requests), icon: Activity },
  ];

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/70 px-4 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-2.5"><LogoIcon size={28} /><div><div className="font-heading text-base font-bold leading-none">Lethem</div><div className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Console</div></div></div>
        <div className="flex items-center gap-1.5">
          <div className="relative" ref={notifWrapRef}>
            <button onClick={() => setNotificationsOpen((v) => !v)} className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <Bell size={18} />{notificationCount > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">{notificationCount}</span>}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-popover p-2 shadow-2xl animate-fade-up">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Notifications</div>
                {!pendingInvites.length && !quotaRequests.filter((r) => r.status === 'pending').length ? <div className="px-3 py-6 text-center text-xs text-muted-foreground">You're all caught up.</div> : (
                  <div className="max-h-80 space-y-1 overflow-y-auto">
                    {pendingInvites.map((i) => (
                      <div key={i.id} className="rounded-lg p-2.5 hover:bg-secondary/50">
                        <div className="text-xs"><span className="font-medium">{i.project_name || i.organization_name}</span> invited you as {i.role}</div>
                        <div className="mt-1.5 flex gap-1.5">
                          <Button size="sm" className="h-7 text-xs" disabled={notificationBusy === `invite:${i.id}`} onClick={() => decideInvite(i, 'accept')}><Check size={12} /> Accept</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" disabled={notificationBusy === `invite:${i.id}`} onClick={() => decideInvite(i, 'reject')}><X size={12} /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <button onClick={() => setUserMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-lg p-1 pl-1.5 hover:bg-secondary/60 transition-colors">
            {user?.picture ? <img src={user.picture} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{avatar}</span>}
            <ChevronDown size={14} className="hidden text-muted-foreground sm:block" />
          </button>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-4 top-12 z-50 w-56 rounded-xl border border-border bg-popover p-1.5 shadow-2xl animate-fade-up">
                <div className="border-b border-border px-3 py-2.5 mb-1.5"><div className="truncate text-sm font-medium">{userLabel}</div>{user?.email && user.email !== userLabel && <div className="truncate text-xs text-muted-foreground">{user.email}</div>}</div>
                <button onClick={() => { setUserMenuOpen(false); go('/console/profile'); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">Profile</button>
                <button onClick={() => { setUserMenuOpen(false); go('/console/subscription'); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">Billing</button>
                <div className="my-1.5 border-t border-border" />
                <button onClick={() => { setUserMenuOpen(false); logout(); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"><LogOut size={15} /> Logout</button>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        {/* Onboarding setup */}
        {needsSetup && !hideOnboarding && (
          <Modal open={!hideOnboarding} onClose={() => setHideOnboarding(true)} title={setupStep === 'name' ? 'Welcome to Lethem' : setupStep === 'workspace' ? 'Name your workspace' : 'You’re all set'}>
            {setupStep === 'name' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Let’s set up your account. What should we call you?</p>
                <div><Label>Your name</Label><Input value={setupName} onChange={(e) => setSetupName(e.target.value)} placeholder="Your name" autoFocus /></div>
                <div className="flex justify-between"><Button variant="ghost" onClick={() => saveSetupName(true)}>Skip</Button><Button onClick={() => saveSetupName(false)} disabled={setupSaving}>Continue <ArrowRight size={15} /></Button></div>
              </div>
            )}
            {setupStep === 'workspace' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Name the workspace for your organization. This is shared across projects and billing.</p>
                <div><Label>Workspace name</Label><Input value={setupWorkspaceName} onChange={(e) => setSetupWorkspaceName(e.target.value)} placeholder="Acme Workspace" autoFocus /></div>
                <div className="flex justify-between"><Button variant="ghost" onClick={() => saveSetupWorkspace(true)}>Skip</Button><Button onClick={() => saveSetupWorkspace(false)} disabled={setupSaving}><Building2 size={15} /> {setupSaving ? 'Saving…' : 'Save workspace'}</Button></div>
              </div>
            )}
            {setupStep === 'greet' && <div className="py-6 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success"><Check size={24} /></div><p className="font-heading text-lg font-bold">You’re all set!</p><p className="mt-1 text-sm text-muted-foreground">Redirecting to your console…</p></div>}
          </Modal>
        )}

        {/* Hero */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-gradient">Your workspace</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Select a project to manage its keys, subkeys, logs, and team.</p>
        </div>

        {/* Usage stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between"><span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{s.label}</span><s.icon size={15} className="text-muted-foreground/60" /></div>
              <div className="mt-2 font-mono text-2xl font-semibold">{s.loading ? '—' : s.value}{s.limit != null && <span className="ml-1 text-sm text-muted-foreground">/ {s.limit}</span>}</div>
            </Card>
          ))}
        </div>

        {/* Plan banner */}
        {showPlanBanner && currentPlan && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <Sparkles size={18} className="shrink-0 text-primary" />
            <div className="flex-1 text-sm"><span className="font-semibold">You’re on the {currentPlan.name} plan.</span> <span className="text-muted-foreground">{currentPlan.description || 'Upgrade for more projects, subkeys, and tokens.'}</span></div>
            <Button variant="ghost" size="sm" onClick={() => go('/console/subscription')}>Manage <ArrowRight size={14} /></Button>
            <button onClick={() => setShowPlanBanner(false)} className="rounded p-1 text-muted-foreground hover:text-foreground"><X size={15} /></button>
          </div>
        )}

        {/* Projects */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-semibold">Projects</h2>
          <div className="flex items-center gap-2">
            <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Search projects…" className="pl-9 w-full sm:w-64" /></div>
            <Button onClick={() => go('/console/new')} disabled={isAtProjectLimit}><Plus size={15} /> New</Button>
          </div>
        </div>

        {!projects.length ? (
          <EmptyState icon={FolderKanban} title="No projects yet" description="Create your first project to start managing API keys and subkeys." action={<Button onClick={() => go('/console/new')}><Plus size={15} /> Create project</Button>} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((p) => (
              <Card key={p.id || p.slug} className="group relative cursor-pointer p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5" onClick={() => go(`/console/${p.slug || p.id}/overview`)}>
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary"><FolderKanban size={20} /></div>
                  <button onClick={(e) => { e.stopPropagation(); setProjectToDelete(p); }} className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"><Trash2 size={15} /></button>
                </div>
                <h3 className="mt-3 truncate font-heading text-base font-semibold">{p.name}</h3>
                <code className="font-mono text-xs text-muted-foreground">{p.slug || p.id}</code>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created {fmtDate(p.created_at)}</span>
                  <ArrowRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      <Modal open={Boolean(projectToDelete)} onClose={() => setProjectToDelete(null)} title="Delete project" sub={`Type ${projectToDelete?.name} to confirm. This cannot be undone.`}
        footer={<><Button variant="ghost" onClick={() => setProjectToDelete(null)}>Cancel</Button><Button variant="danger" onClick={confirmDelete} disabled={deleteConfirm !== projectToDelete?.name || deleteBusy}><Trash2 size={15} /> {deleteBusy ? 'Deleting…' : 'Delete project'}</Button></>}>
        <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={projectToDelete?.name} autoFocus />
      </Modal>

      <Toast notif={notif} />
    </div>
  );
}