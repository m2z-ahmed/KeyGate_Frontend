import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { AlertTriangle, Ban, Trash2, Loader2 } from 'lucide-react';

export default function DangerPage({ selectedProject, deleteProject, setProjectToDelete }: {
  selectedProject: any;
  deleteProject: (p?: any) => Promise<any>;
  setProjectToDelete: (p: any) => void;
}) {
  const { notify, loadSubkeys, subkeys = [], api } = useApp();
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState('');
  const projectName = selectedProject?.name || selectedProject?.slug || 'this project';
  const canDelete = confirm === projectName;

  const revokeAll = async () => {
    setBusy('revoke');
    try {
      const rows = subkeys.length ? subkeys : await api('/api/subkeys');
      await Promise.all(rows.filter((s: any) => s.status !== 'revoked').map((s: any) => api(`/api/subkeys/${s.id}`, { method: 'PATCH', body: { status: 'revoked' } })));
      await loadSubkeys?.();
      notify('All active subkeys were revoked.');
    } catch (e: any) { notify(e.message || 'Failed to revoke subkeys', 'error'); }
    finally { setBusy(''); }
  };

  const removeProject = async () => {
    if (!canDelete) return;
    setBusy('delete');
    try {
      setProjectToDelete?.(selectedProject);
      await deleteProject?.(selectedProject);
      window.history.pushState({}, '', '/console');
      window.dispatchEvent(new Event('popstate'));
    } catch (e: any) { notify(e.message || 'Failed to delete project', 'error'); }
    finally { setBusy(''); }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100 mb-1">Danger Zone</h1>
        <p className="text-sm text-gray-500">Protected destructive actions for {projectName}. These actions can interrupt API access immediately.</p>
      </div>

      <div className="card p-5 mb-4 border-accent-500/20">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-gray-100 mb-1">Revoke every subkey</h2>
            <p className="text-xs text-gray-500">Immediately blocks all shared KeyGate subkeys for this project while leaving master keys untouched.</p>
          </div>
          <button onClick={revokeAll} disabled={busy === 'revoke'} className="btn btn-warning flex-shrink-0">
            {busy === 'revoke' ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />} Revoke all subkeys
          </button>
        </div>
      </div>

      <div className="card p-5 border-danger-500/20">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={20} className="text-danger-400 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-gray-100 mb-1">Delete project permanently</h2>
            <p className="text-xs text-gray-500">Type <strong className="text-gray-300">{projectName}</strong> to confirm. This removes the project and returns you to the console.</p>
          </div>
        </div>
        <input className="input mb-4" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={projectName} />
        <button onClick={removeProject} disabled={!canDelete || busy === 'delete'} className="btn btn-danger">
          {busy === 'delete' ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete project
        </button>
      </div>
    </div>
  );
}
