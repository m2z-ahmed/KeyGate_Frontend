import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const clean = (value) => String(value || '').trim();
const maskAuthId = (value) => {
  const raw = String(value || '');
  if (!raw) return '—';
  if (raw.length <= 10) return `${raw.slice(0, 2)}••••${raw.slice(-2)}`;
  const [provider, id] = raw.split('|');
  const tail = (id || raw).slice(-6);
  return `${provider && id ? `${provider}|` : ''}••••••${tail}`;
};

export default function ProfilePage({ ctx }) {
  const { user, updateLocalUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [original, setOriginal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ctx.api('/api/me')
      .then((data) => {
        if (cancelled) return;
        const next = {
          name: data?.user?.name || user?.name || '',
          email: data?.user?.email || user?.email || '',
        };
        setForm(next);
        setOriginal(next);
        updateLocalUser?.({ name: next.name, email: next.email, picture: data?.user?.picture_url || user?.picture });
      })
      .catch((err) => ctx.notify(err.message || 'Unable to load profile', 'error'))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const changed = useMemo(() => original ? clean(form.name) !== clean(original.name) : false, [form.name, original]);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!clean(form.name)) return ctx.notify('Name is required', 'error');
    setSaving(true);
    try {
      const data = await ctx.api('/api/me', {
        method: 'PATCH',
        body: { name: clean(form.name) },
      });
      const next = {
        name: data?.user?.name || clean(form.name),
        email: data?.user?.email || form.email,
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
        <p className='page-sub'>Edit your display name. Your sign-in email is shown for reference and is managed by Auth0.</p>
      </div>

      <div className='profile-grid'>
        <form className='card profile-editor-card' onSubmit={saveProfile}>
          <div className='card-header'>
            <div>
              <div className='card-title'>Personal details</div>
              <div className='card-sub'>Profile data is cached for fast loads and refreshed after saving changes.</div>
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
              <input type='email' value={form.email} readOnly disabled aria-readonly='true' title='Email is managed by your Auth0 sign-in account.' />
              <small className='field-help'>Email editing is disabled here to keep your Lethem account aligned with Auth0.</small>
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-ghost' disabled={!changed || saving || loading} onClick={() => setForm(original)}>Reset</button>
            <button type='submit' className='btn btn-primary' disabled={!changed || saving || loading}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>

        <aside className='card profile-summary-card'>
          <div className='profile-avatar'>{user?.picture ? <img src={user.picture} alt='' /> : clean(form.name || form.email || 'U').charAt(0).toUpperCase()}</div>
          <h2>{form.name || 'Lethem User'}</h2>
          <p>{form.email || 'No email set'}</p>
          <div className='profile-summary-list'>
            <span><b>Auth ID</b>{maskAuthId(user?.sub)}</span>
            <span><b>Email source</b>Auth0</span>
            <span><b>Status</b>Active account</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
