import { useEffect, useState } from 'react';
import { Card, CardHeader, Button, Input, Label, Select, Badge, EmptyState, Skeleton } from '../kit';
import { ASSIGNABLE_ROLES, roleMeta } from '../../lib/roles';
import { fmtDate } from '../../contexts/LethemContext';
import { Mail, UserPlus, Trash2, Check, X } from 'lucide-react';

export default function InvitesPage({ ctx }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('developer');
  const [busy, setBusy] = useState('');
  useEffect(() => { ctx.loadInvites?.().catch((e) => ctx.notify(e.message, 'error')); }, []);

  const send = async () => { setBusy('send'); try { await ctx.inviteMember(email, role); setEmail(''); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); } };
  const revoke = async (invite) => { if (!window.confirm(`Revoke invite for ${invite.email || invite.project_name || 'this user'}?`)) return; setBusy(invite.id); try { await ctx.revokeInvite(invite.id); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); } };
  const deleteInvite = async (invite) => { if (!window.confirm(`Delete invitation history for ${invite.email || invite.project_name || 'this invite'}?\n\nThis only removes the history row and cannot be undone.`)) return; setBusy(invite.id); try { await ctx.deleteInvite(invite.id); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); } };
  const accept = async (invite) => { setBusy(invite.id); try { await ctx.acceptInvite(invite.id); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); } };

  const received = ctx.invites.filter((i) => i.direction === 'received');
  const sent = ctx.invites.filter((i) => i.direction !== 'received');
  const statusTone = (status) => status === 'pending' ? 'warning' : status === 'accepted' ? 'success' : 'danger';
  const actionFor = (i, mode) => {
    if (mode === 'received' && i.can_accept) return <Button size="sm" onClick={() => accept(i)} disabled={busy === i.id}><Check size={13} /> Accept</Button>;
    if (mode === 'sent' && i.status === 'pending') return <Button variant="ghost" size="sm" onClick={() => revoke(i)} disabled={busy === i.id} className="text-destructive hover:bg-destructive/10"><X size={13} /> Revoke</Button>;
    if (mode === 'sent' && i.status !== 'pending') return <Button variant="ghost" size="sm" onClick={() => deleteInvite(i)} disabled={busy === i.id} className="text-destructive hover:bg-destructive/10"><Trash2 size={13} /> Delete</Button>;
    return <span className="text-xs text-muted-foreground">—</span>;
  };

  const Table = ({ rows, mode }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border bg-secondary/40"><tr><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{mode === 'received' ? 'Project' : 'Email'}</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Role</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Expires</th><th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th></tr></thead>
        <tbody className="divide-y divide-border">
          {rows.map((i) => (
            <tr key={i.id} className="transition-colors hover:bg-secondary/20">
              <td className="px-4 py-3 text-sm font-medium">{mode === 'received' ? (i.project_name || i.organization_name) : i.email}</td>
              <td className="px-4 py-3"><Badge tone="neutral">{roleMeta(i.role).label}</Badge></td>
              <td className="px-4 py-3"><Badge tone={statusTone(i.status)}>{i.status}</Badge></td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{ctx.fmtDate(i.expires_at)}</td>
              <td className="px-4 py-3 text-right">{actionFor(i, mode)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Invites</h1><p className="mt-1 text-sm text-muted-foreground">Accept project invites sent to you, or track invites you sent from this project.</p></div>

      <Card className="mb-4">
        <CardHeader title="Send invite" sub="Existing users receive in-app invites. New users receive email invite links." />
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@example.com" />
            <Select value={role} onChange={(e) => setRole(e.target.value)} className="w-auto">{ASSIGNABLE_ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</Select>
            <Button onClick={send} disabled={busy === 'send' || !email.trim()}><UserPlus size={15} /> {busy === 'send' ? 'Sending…' : 'Send invite'}</Button>
          </div>
        </div>
      </Card>

      <Card className="mb-4 overflow-hidden p-0">
        <CardHeader title="Invites for you" sub={`${received.length} invite${received.length === 1 ? '' : 's'} waiting for this account`} />
        {ctx.teamLoading ? <div className="p-5 space-y-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        : received.length === 0 ? <div className="p-5"><EmptyState icon={Mail} title="No incoming invites." /></div> : <Table rows={received} mode="received" />}
      </Card>

      <Card className="overflow-hidden p-0">
        <CardHeader title="Sent invitation history" sub={`${sent.length} invite${sent.length === 1 ? '' : 's'} sent from this project`} />
        {ctx.teamLoading ? <div className="p-5 space-y-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        : sent.length === 0 ? <div className="p-5"><EmptyState icon={Mail} title="No invites sent yet." /></div> : <Table rows={sent} mode="sent" />}
      </Card>
    </div>
  );
}