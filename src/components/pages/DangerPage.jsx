import { useState } from 'react';

export default function DangerPage({ ctx, selectedProject, deleteProject, setProjectToDelete }) {
  const { notify, loadSubkeys, subkeys = [], api } = ctx;
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState('');
  const projectName = selectedProject?.name || selectedProject?.slug || 'this project';
  const canDelete = confirm === projectName;

  const revokeAll = async () => {
    setBusy('revoke');
    try {
      const rows = subkeys.length ? subkeys : await api('/api/subkeys');
      await Promise.all(rows.filter((s) => s.status !== 'revoked').map((s) => api(`/api/subkeys/${s.id}`, { method: 'PATCH', body: { status: 'revoked' } })));
      await loadSubkeys?.();
      notify('All active subkeys were revoked.');
    } catch (e) {
      notify(e.message || 'Failed to revoke subkeys', 'error');
    } finally {
      setBusy('');
    }
  };

  const removeProject = async () => {
    if (!canDelete) return;
    setBusy('delete');
    try {
      setProjectToDelete?.(selectedProject);
      await deleteProject?.(selectedProject);
      window.history.pushState({}, '', '/console');
      window.dispatchEvent(new Event('popstate'));
    } catch (e) {
      notify(e.message || 'Failed to delete project', 'error');
    } finally {
      setBusy('');
    }
  };

  return (
    <section className='page active danger-page'>
      <div className='page-header'>
        <h1 className='page-title'>Danger Zone</h1>
        <p className='page-sub'>Protected destructive actions for {projectName}. These actions can interrupt API access immediately.</p>
      </div>
      <div className='card danger-action-card'>
        <div>
          <h2>Revoke every subkey</h2>
          <p>Immediately blocks all shared Lethem subkeys for this project while leaving master keys untouched.</p>
        </div>
        <button className='btn btn-danger' disabled={busy === 'revoke'} onClick={revokeAll}>{busy === 'revoke' ? 'Revoking…' : 'Revoke all subkeys'}</button>
      </div>
      <div className='card danger-action-card danger-action-card-critical'>
        <div>
          <h2>Delete project permanently</h2>
          <p>Type <strong>{projectName}</strong> to confirm. This removes the project and returns you to the console.</p>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={projectName} />
        </div>
        <button className='btn btn-danger' disabled={!canDelete || busy === 'delete'} onClick={removeProject}>{busy === 'delete' ? 'Deleting…' : 'Delete project'}</button>
      </div>
    </section>
  );
}
