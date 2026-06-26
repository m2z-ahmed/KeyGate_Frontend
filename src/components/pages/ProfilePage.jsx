import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const clean = (value) => String(value || '').trim();

export default function ProfilePage({ ctx }) {
  const { user, updateLocalUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', workspaceName: '' });
  const [original, setOriginal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ctx.api('/api/me', { noCache: true })
      .then((data) => {
        if (cancelled) return;
        const next = {
          name: data?.user?.name || user?.name || '',
          email: data?.user?.email || user?.email || '',
          workspaceName: data?.organization?.name || '',
        };
        setForm(next);
        setOriginal(next);
        updateLocalUser?.({ name: next.name, email: next.email, picture: data?.user?.picture_url || user?.picture });
      })
      .catch((err) => ctx.notify(err.message || 'Unable to load profile', 'error'))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const changed = useMemo(() => {
    if (!original) return false;
    return clean(form.name) !== clean(original.name)
      || clean(form.email).toLowerCase() !== clean(original.email).toLowerCase()
      || clean(form.workspaceName) !== clean(original.workspaceName);
  }, [form, original]);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!clean(form.name)) return ctx.notify('Name is required', 'error');
    if (!/^\S+@\S+\.\S+$/.test(clean(form.email))) return ctx.notify('Enter a valid email address', 'error');
    if (!clean(form.workspaceName)) return ctx.notify('Workspace name is required', 'error');
    setSaving(true);
    try {
      const data = await ctx.api('/api/me', {
        method: 'PATCH',
        body: { name: clean(form.name), email: clean(form.email), workspaceName: clean(form.workspaceName) },
      });
      const next = {
        name: data?.user?.name || clean(form.name),
        email: data?.user?.email || clean(form.email),
        workspaceName: data?.organization?.name || clean(form.workspaceName),
      };
      setForm(next);
      setOriginal(next);
      updateLocalUser?.({ name: next.name, email: next.email, picture: data?.user?.picture_url || user?.picture });
      ctx.notify('Profile updated');
    } catch (err) {
      ctx.notify(err.message || 'Unable to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className='page active profile-page'>
      <div className='page-header'>
        <h1 className='page-title'>Profile</h1>
        <p className='page-sub'>Edit your account identity and workspace name used across Lethem.</p>
      </div>

      <div className='profile-grid'>
        <form className='card profile-editor-card' onSubmit={saveProfile}>
          <div className='card-header'>
            <div>
              <div className='card-title'>Personal details</div>
              <div className='card-sub'>These values are stored in Lethem and shown in the console.</div>
            </div>
            <span className='badge active'>{loading ? 'Loading' : 'Editable'}</span>
          </div>
          <div className='form-row single'>
            <div className='field'>
              <label>Display name</label>
              <input value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} placeholder='Your name' disabled={loading || saving} />
            </div>
          </div>
          <div className='form-row single'>
            <div className='field'>
              <label>Email</label>
              <input type='email' value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} placeholder='you@example.com' disabled={loading || saving} />
            </div>
          </div>
          <div className='form-row single'>
            <div className='field'>
              <label>Workspace name</label>
              <input value={form.workspaceName} onChange={(e) => setForm((v) => ({ ...v, workspaceName: e.target.value }))} placeholder='Acme Workspace' disabled={loading || saving} />
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-ghost' disabled={!changed || saving || loading} onClick={() => setForm(original)}>Reset</button>
            <button type='submit' className='btn btn-primary' disabled={!changed || saving || loading}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>

        <aside className='card profile-summary-card'>
          <div className='profile-avatar'>{clean(form.name || form.email || 'U').charAt(0).toUpperCase()}</div>
          <h2>{form.name || 'Lethem User'}</h2>
          <p>{form.email || 'No email set'}</p>
          <div className='profile-summary-list'>
            <span><b>Workspace</b>{form.workspaceName || '—'}</span>
            <span><b>Auth ID</b>{user?.sub || '—'}</span>
            <span><b>Status</b>Active account</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
