import { useState } from 'react';
import { useLethem } from '../contexts/LethemContext';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from '../components/parts/Logo';
import { IconFolder, IconPlus, IconGrid, IconLogout, IconUser } from '../components/parts/Icons';

export default function ProjectSelectView({ go }) {
  const lethem = useLethem();
  const { user, logout } = useAuth();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  if (!lethem) return null;
  const { filteredProjects, projectSearch, setProjectSearch, createProject, notif } = lethem;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      const p = await createProject(name.trim());
      if (p) { setName(''); setCreating(false); go?.(`/console/${p.slug || p.id}/overview`); }
    } finally { setBusy(false); }
  };

  return (
    <div className='project-select-view'>
      <div className='project-select-bg-orb orb-1' />
      <div className='project-select-bg-orb orb-2' />

      <header className='project-select-header'>
        <div className='project-select-logo'>
          <LogoIcon size={28} />
          <span>Lethem</span>
        </div>
        {user && (
          <div className='project-select-user'>
            <div className='ps-avatar'>
              {user.picture ? <img src={user.picture} alt='' /> : (user.name || 'L').charAt(0).toUpperCase()}
            </div>
            <span>{user.name || user.email}</span>
            <button className='btn btn-ghost btn-sm' onClick={logout}>
              <IconLogout width={13} height={13} />
              Sign out
            </button>
          </div>
        )}
      </header>

      <main className='project-select-main'>
        <div className='project-select-hero'>
          <h1>Select a project</h1>
          <p>Choose a project to open its console, or create a new one.</p>
        </div>

        {filteredProjects.length > 3 && (
          <div className='project-search-row'>
            <input
              className='project-search-input'
              type='search'
              placeholder='Search projects…'
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
          </div>
        )}

        {filteredProjects.length > 0 ? (
          <div className='project-grid'>
            {filteredProjects.map((p) => (
              <button key={p.id || p.slug} className='project-card' onClick={() => go?.(`/console/${p.slug || p.id}/overview`)}>
                <div className='project-card-icon'>
                  <IconFolder width={18} height={18} />
                </div>
                <div className='project-card-info'>
                  <div className='project-card-name'>{p.name || p.slug}</div>
                  <div className='project-card-slug'>{p.slug || p.id}</div>
                </div>
              </button>
            ))}
            <button className='project-card project-card-new' onClick={() => go?.('/console/new')}>
              <div className='project-card-icon project-card-icon-new'>
                <IconPlus width={18} height={18} />
              </div>
              <div className='project-card-info'>
                <div className='project-card-name'>New project</div>
                <div className='project-card-slug'>Create a project</div>
              </div>
            </button>
          </div>
        ) : (
          <div className='project-empty'>
            <div className='project-empty-icon'>
              <IconGrid width={28} height={28} />
            </div>
            <h2>No projects yet</h2>
            <p>Create your first project to start issuing API access keys.</p>
            {!creating ? (
              <button className='btn btn-primary' onClick={() => setCreating(true)}>
                <IconPlus width={14} height={14} />
                Create project
              </button>
            ) : (
              <form className='project-create-form' onSubmit={handleCreate}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Production API' autoFocus />
                <button type='submit' className='btn btn-primary' disabled={busy || !name.trim()}>{busy ? 'Creating…' : 'Create'}</button>
                <button type='button' className='btn btn-ghost' onClick={() => setCreating(false)}>Cancel</button>
              </form>
            )}
          </div>
        )}

        {filteredProjects.length > 0 && (
          <div className='project-select-actions'>
            <button className='btn btn-ghost' onClick={() => go?.('/console/new')}>
              <IconPlus width={13} height={13} />
              New project
            </button>
            <button className='btn btn-ghost' onClick={() => go?.('/console/profile')}>
              <IconUser width={13} height={13} />
              Account settings
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
