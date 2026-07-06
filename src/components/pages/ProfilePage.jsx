import { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, Button, Input, Label, Badge } from '../kit';
import { useAuth } from '../../contexts/AuthContext';
import { Save, RotateCcw } from 'lucide-react';

const clean = (value) => String(value || '').trim();

export default function ProfilePage({ ctx }) {
  const { user, updateLocalUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [original, setOriginal] = useState(null);

  useEffect(() => {
    let cancelled = false; setLoading(true);
    ctx.api('/api/me').then((data) => {
      if (cancelled) return;
      const next = { name: data?.user?.name || user?.name || '', email: data?.user?.email || user?.email || '' };
      setForm(next); setOriginal(next);
      updateLocalUser?.({ name: next.name, email: next.email, picture: data?.user?.picture_url || user?.picture });
    }).catch((err) => ctx.notify(err.message || 'Unable to load profile', 'error')).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const changed = useMemo(() => original ? clean(form.name) !== clean(original.name) : false, [form.name, original]);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!clean(form.name)) return ctx.notify('Name is required', 'error');
    setSaving(true);
    try {
      const data = await ctx.api('/api/me', { method: 'PATCH', body: { name: clean(form.name) } });
      const next = { name: data?.user?.name || clean(form.name), email: data?.user?.email || form.email };
      setForm(next); setOriginal(next);
      updateLocalUser?.({ name: next.name, email: next.email, picture: data?.user?.picture_url || user?.picture });
      ctx.notify('Profile updated');
    } catch (err) { ctx.notify(err.message || 'Unable to update profile', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Profile</h1><p className="mt-1 text-sm text-muted-foreground">Edit your display name. Your sign-in email is shown for reference and is managed by Auth0.</p></div>

      <Card>
        <CardHeader title="Personal details" sub="Profile data is cached for fast loads and refreshed after saving changes." actions={<Badge tone={loading ? 'warning' : 'success'}>{loading ? 'Loading' : 'Editable'}</Badge>} />
        <form onSubmit={saveProfile} className="space-y-4 p-5">
          <div><Label>Display name</Label><Input value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} placeholder="Your name" disabled={loading || saving} /></div>
          <div><Label>Email</Label><Input value={form.email} disabled /><p className="mt-1.5 text-xs text-muted-foreground">Email editing is disabled here to keep your Lethem account aligned with Auth0.</p></div>
          <div className="flex justify-end gap-2 pt-2">
            {changed && <Button type="button" variant="ghost" onClick={() => setForm(original)}><RotateCcw size={15} /> Reset</Button>}
            <Button type="submit" disabled={saving || !changed}><Save size={15} /> {saving ? 'Saving…' : 'Save changes'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}