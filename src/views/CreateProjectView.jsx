import { useState } from 'react';
import { useLethem } from '../contexts/LethemContext';
import { LogoIcon } from '../components/parts/Logo';

export default function CreateProjectView({ go }) {
  const lethem = useLethem();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Project name is required.');
    setError('');
    setBusy(true);
    try {
      const p = await lethem.createProject(name.trim());
      if (p) go?.(`/console/${p.slug || p.id}/overview`);
    } catch (err) {
      setError(err.message || 'Unable to create project');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className='create-project-view'>
      <div className='create-project-bg-orb orb-1' />
      <div className='create-project-bg-orb orb-2' />
      <div className='create-project-card'>
        <div className='create-project-logo'>
          <LogoIcon size={36} />
        </div>
        <h1 className='create-project-title'>New project</h1>
        <p className='create-project-sub'>Projects are workspaces for managing AI access keys and usage monitoring.</p>
        {error && <div className='create-project-error'>{error}</div>}
        <form onSubmit={handleCreate}>
          <div className='field'>
            <label>Project name</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder='e.g. Production API, Staging, Research'
              autoFocus
              disabled={busy}
            />
          </div>
          <div className='create-project-actions'>
            <button type='button' className='btn btn-ghost' onClick={() => go?.('/console')}>Cancel</button>
            <button type='submit' className='btn btn-primary' disabled={busy || !name.trim()}>{busy ? 'Creating…' : 'Create project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
