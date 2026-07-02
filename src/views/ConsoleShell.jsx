import { useEffect, useRef } from 'react';
import Sidebar from '../components/parts/Sidebar';
import ConsoleHeader from '../components/parts/ConsoleHeader';
import OverviewPage from '../components/pages/OverviewPage';
import MasterKeysPage from '../components/pages/MasterKeysPage';
import SubkeysPage from '../components/pages/SubkeysPage';
import LogsPage from '../components/pages/LogsPage';
import AnalyticsPage from '../components/pages/AnalyticsPage';
import DemoPage from '../components/pages/DemoPage';
import NotificationsPage from '../components/pages/NotificationsPage';
import HealthPage from '../components/pages/HealthPage';
import BillingPage from '../components/pages/BillingPage';
import ProfilePage from '../components/pages/ProfilePage';
import WorkspacePage from '../components/pages/WorkspacePage';
import DangerPage from '../components/pages/DangerPage';
import MembersPage from '../components/pages/MembersPage';
import RolesPage from '../components/pages/RolesPage';
import InvitesPage from '../components/pages/InvitesPage';
import UsagePage from '../components/pages/UsagePage';
import PlaceholderPage from '../components/pages/PlaceholderPage';
import { useLethem } from '../contexts/LethemContext';

function Notification({ notif }) {
  if (!notif?.show) return null;
  return (
    <div className={`toast toast-${notif.type}`}>
      <span>{notif.msg}</span>
    </div>
  );
}

function PageShell({ page, ctx, go, projectSlug, accountMode, billing, selectedProject, deleteProject, setProjectToDelete }) {
  if (accountMode) {
    if (page === 'profile') return <ProfilePage ctx={ctx} />;
    if (page === 'workspace') return <WorkspacePage ctx={ctx} />;
    if (page === 'billing') return <BillingPage ctx={ctx} onBack={() => go?.('/console')} />;
    if (page === 'usage') return <UsagePage ctx={ctx} billing={billing} />;
    return <PlaceholderPage type={page} onBack={() => go?.('/console')} />;
  }

  if (page === 'overview') return <OverviewPage ctx={ctx} />;
  if (page === 'masterkeys') return <MasterKeysPage ctx={ctx} />;
  if (page === 'subkeys') return <SubkeysPage ctx={ctx} />;
  if (page === 'logs') return <LogsPage ctx={ctx} />;
  if (page === 'analytics') return <AnalyticsPage ctx={ctx} />;
  if (page === 'demo') return <DemoPage ctx={ctx} />;
  if (page === 'notifications') return <NotificationsPage ctx={ctx} />;
  if (page === 'health') return <HealthPage ctx={ctx} />;
  if (page === 'billing') return <BillingPage ctx={ctx} />;
  if (page === 'usage') return <UsagePage ctx={ctx} billing={billing} />;
  if (page === 'members') return <MembersPage ctx={ctx} />;
  if (page === 'roles') return <RolesPage ctx={ctx} />;
  if (page === 'invites') return <InvitesPage ctx={ctx} />;
  if (page === 'danger') return <DangerPage ctx={ctx} selectedProject={selectedProject} deleteProject={deleteProject} setProjectToDelete={setProjectToDelete} />;
  return <PlaceholderPage type={page} />;
}

export default function ConsoleShell({ go, page, projectSlug, accountMode }) {
  const lethem = useLethem();
  const { ctx, notif, selectedProject, deleteProject, setProjectToDelete } = lethem || {};
  const mainRef = useRef(null);

  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [page]);

  const navigate = (p) => {
    if (accountMode) go?.(`/console/${p}`);
    else go?.(`/console/${projectSlug}/${p}`);
  };

  return (
    <div className='app'>
      <Sidebar
        page={page}
        navigate={navigate}
        go={go}
        projectSlug={projectSlug}
        accountMode={accountMode}
      />
      <div className='main' ref={mainRef}>
        <ConsoleHeader
          page={page}
          projectSlug={projectSlug}
          go={go}
          accountMode={accountMode}
        />
        <div className='page-content'>
          <PageShell
            page={page}
            ctx={ctx}
            go={go}
            projectSlug={projectSlug}
            accountMode={accountMode}
            billing={ctx?.billing}
            selectedProject={selectedProject}
            deleteProject={deleteProject}
            setProjectToDelete={setProjectToDelete}
          />
        </div>
      </div>
      <Notification notif={notif} />
    </div>
  );
}
