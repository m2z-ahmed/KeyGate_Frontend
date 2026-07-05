import { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, Button, Input, Label, Badge } from '../kit';
import { Save, RotateCcw } from 'lucide-react';

const clean = (value) => String(value || '').trim();

export default function WorkspacePage({ ctx }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workspace, setWorkspace] = useState({ name: '', slug: '', role: '', plan: '' });
  const [originalName, setOriginalName] = useState('');

  useEffect(() => {
    let cancelled = false; setLoading(true);
    ctx.api('/api/me').then((data) => { if (cancelled) return; const org = data?.organization || {}; setWorkspace({ name: org.name || '', slug: org.slug || '', role: org.role || '', plan: org.plan || 'free' }); setOriginalName(org.name || ''); })
      .catch((err) => ctx.notify(err.message || 'Unable to load workspace', 'error')).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const changed = useMemo(() => clean(workspace.name) !== clean(originalName), [workspace.name, originalName]);

  const saveWorkspace = async (e) => {
    e.preventDefault();
    if (!clean(workspace.name)) return ctx.notify('Workspace name is required', 'error');
    setSaving(true);
    try {
      const data = await ctx.api('/api/me', { method: 'PATCH', body: { workspaceName: clean(workspace.name) } });
      const org = data?.organization || {};
      setWorkspace((c) => ({ ...c, name: org.name || clean(workspace.name), slug: org.slug || c.slug, plan: org.plan || c.plan, role: org.role || c.role }));
      setOriginalName(org.name || clean(workspace.name));
      ctx.notify('Workspace updated');
    } catch (err) { ctx.notify(err.message || 'Unable to update workspace', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Workspace Settings</h1><p className="mt-1 text-sm text-muted-foreground">Manage the organization identity shared across projects, billing, and teammates.</p></div>

      <Card>
        <CardHeader title="Workspace identity" sub="Rename the workspace your account owns or administers." actions={<Badge tone={loading ? 'warning' : 'success'}>{loading ? 'Loading' : 'Editable'}</Badge>} />
        <form onSubmit={saveWorkspace} className="space-y-4 p-5">
          <div><Label>Workspace name</Label><Input value={workspace.name} onChange={(e) => setWorkspace((v) => ({ ...v, name: e.target.value }))} placeholder="Acme Workspace" disabled={loading || saving} /></div>
          {workspace.slug && <div><Label>Workspace slug</Label><Input value={workspace.slug} disabled /><p className="mt-1.5 text-xs text-muted-foreground">The slug is auto-generated and cannot be changed.</p></div>}
          <div className="flex justify-end gap-2 pt-2">
            {changed && <Button type="button" variant="ghost" onClick={() => setWorkspace((v) => ({ ...v, name: originalName }))}><RotateCcw size={15} /> Reset</Button>}
            <Button type="submit" disabled={saving || !changed}><Save size={15} /> {saving ? 'Saving…' : 'Save workspace'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}