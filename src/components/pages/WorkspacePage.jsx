import { useEffect, useMemo, useState } from 'react';

const clean = (value) => String(value || '').trim();

export default function WorkspacePage({ ctx }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workspace, setWorkspace] = useState({ name: '', slug: '', role: '', plan: '' });
  const [originalName, setOriginalName] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ctx.api('/api/me')
      .then((data) => {
        if (cancelled) return;
        const org = data?.organization || {};
        setWorkspace({ name: org.name || '', slug: org.slug || '', role: org.role || '', plan: org.plan || 'free' });
        setOriginalName(org.name || '');
      })
      .catch((err) => ctx.notify(err.message || 'Unable to load workspace', 'error'))
      .finally(() => { if (!cancelled) setLoading(false); });
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
      setWorkspace((current) => ({ ...current, name: org.name || clean(workspace.name), slug: org.slug || current.slug, plan: org.plan || current.plan, role: org.role || current.role }));
      setOriginalName(org.name || clean(workspace.name));
      ctx.notify('Workspace updated');
    } catch (err) {
      ctx.notify(err.message || 'Unable to update workspace', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className='page active workspace-page'>
      <div className='page-header'>
        <h1 className='page-title'>Workspace Settings</h1>
        <p className='page-sub'>Manage the organization identity shared across projects, billing, and teammates.</p>
      </div>

      <div className='profile-grid'>
        <form className='card profile-editor-card' onSubmit={saveWorkspace}>
          <div className='card-header'>
            <div>
              <div className='card-title'>Workspace identity</div>
              <div className='card-sub'>Rename the workspace your account owns or administers.</div>
            </div>
            <span className='badge active'>{loading ? 'Loading' : 'Editable'}</span>
          </div>
          <div className='form-row single'>
            <div className='field'>
              <label>Workspace name</label>
              <input value={workspace.name} onChange={(e) => setWorkspace((v) => ({ ...v, name: e.target.value }))} placeholder='Acme Workspace' disabled={loading || saving} />
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-ghost' disabled={!changed || saving || loading} onClick={() => setWorkspace((v) => ({ ...v, name: originalName }))}>Reset</button>
            <button type='submit' className='btn btn-primary' disabled={!changed || saving || loading}>{saving ? 'Saving…' : 'Save workspace'}</button>
          </div>
        </form>

        <aside className='card profile-summary-card'>
          <div className='profile-avatar'>{clean(workspace.name || 'W').charAt(0).toUpperCase()}</div>
          <h2>{workspace.name || 'Workspace'}</h2>
          <p>{workspace.slug || 'Workspace slug'}</p>
          <div className='profile-summary-list'>
            <span><b>Your role</b>{workspace.role || '—'}</span>
            <span><b>Plan</b>{workspace.plan || 'free'}</span>
            <span><b>Scope</b>Account-level settings</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
