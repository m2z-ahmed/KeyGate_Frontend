import { useState } from 'react';
import { Card, CardHeader, Button, Input, Badge } from '../kit';
import { ShieldAlert, Ban, Trash2 } from 'lucide-react';

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
    } catch (e) { notify(e.message || 'Failed to revoke subkeys', 'error'); }
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
    } catch (e) { notify(e.message || 'Failed to delete project', 'error'); }
    finally { setBusy(''); }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Danger Zone</h1><p className="mt-1 text-sm text-muted-foreground">Protected destructive actions for {projectName}. These actions can interrupt API access immediately.</p></div>

      <div className="space-y-4">
        <Card className="border-warning/30">
          <CardHeader title="Revoke every subkey" sub="Immediately blocks all shared Lethem subkeys for this project while leaving master keys untouched." actions={<Ban size={16} className="text-warning" />} />
          <div className="flex items-center justify-between gap-4 p-5">
            <p className="text-sm text-muted-foreground">All active subkeys will be set to revoked status. This cannot be undone, but you can create new subkeys afterward.</p>
            <Button variant="outline" onClick={revokeAll} disabled={busy === 'revoke'} className="border-warning/40 text-warning hover:bg-warning/10 shrink-0">{busy === 'revoke' ? 'Revoking…' : 'Revoke all subkeys'}</Button>
          </div>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader title="Delete project permanently" sub={`Type ${projectName} to confirm. This removes the project and returns you to the console.`} actions={<Trash2 size={16} className="text-destructive" />} />
          <div className="space-y-3 p-5">
            <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={projectName} />
            <div className="flex justify-end"><Button variant="danger" onClick={removeProject} disabled={!canDelete || busy === 'delete'}><Trash2 size={15} /> {busy === 'delete' ? 'Deleting…' : 'Delete project'}</Button></div>
          </div>
        </Card>
      </div>
    </div>
  );
}