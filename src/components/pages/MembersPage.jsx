import { useEffect, useState } from 'react';
import { Card, CardHeader, Button, Input, Label, Select, Badge, EmptyState, Skeleton, cn } from '../kit';
import { ASSIGNABLE_ROLES, roleMeta } from '../../lib/roles';
import { fmtDate } from '../../contexts/LethemContext';
import { Users, UserPlus, ShieldCheck, Trash2 } from 'lucide-react';

export default function MembersPage({ ctx }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('developer');
  const [busy, setBusy] = useState('');
  const [inviteCheck, setInviteCheck] = useState(null);

  useEffect(() => { ctx.loadMembers?.().catch((e) => ctx.notify(e.message, 'error')); }, []);

  const resetInviteCheck = () => setInviteCheck(null);

  const sendInvite = async (targetEmail = email, targetRole = role) => {
    setBusy('invite');
    try { await ctx.inviteMember(targetEmail, targetRole); setEmail(''); setRole('developer'); resetInviteCheck(); }
    catch (e) { ctx.notify(e.message, 'error'); }
    finally { setBusy(''); }
  };

  const invite = async () => {
    setBusy('check'); resetInviteCheck();
    try {
      const check = await ctx.checkInvitee(email);
      if (check.already_member) { ctx.notify('That user is already a member of this project.', 'error'); return; }
      if (!check.exists) { setInviteCheck(check); return; }
      await sendInvite(email, role);
    } catch (e) { ctx.notify(e.message, 'error'); }
    finally { setBusy(''); }
  };

  const changeRole = async (member, nextRole) => { setBusy(member.id); try { await ctx.updateMemberRole(member.id, nextRole); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); } };
  const remove = async (member) => { if (!confirm(`Remove ${member.email || member.name} from this project?`)) return; setBusy(member.id); try { await ctx.removeMember(member.id); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); } };

  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Team Members</h1><p className="mt-1 text-sm text-muted-foreground">Check whether a teammate is already on Lethem, then send an in-app invite or email invite.</p></div>

      <Card className="mb-4">
        <CardHeader title="Invite a teammate" sub="Existing Lethem users receive an in-app invite. New users get an email invite link." />
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
            <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); resetInviteCheck(); }} placeholder="teammate@example.com" />
            <Select value={role} onChange={(e) => setRole(e.target.value)} className="w-auto">{ASSIGNABLE_ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</Select>
            <Button onClick={invite} disabled={busy === 'check' || busy === 'invite' || !email.trim()}>{busy === 'check' ? 'Checking…' : busy === 'invite' ? 'Sending…' : 'Check & Invite'}</Button>
          </div>
          {inviteCheck && !inviteCheck.exists && (
            <div className="mt-3 flex flex-col gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-warning"><strong>{inviteCheck.email}</strong> is not on Lethem yet. Send an email invite so they can sign up and join this project?</p>
              <div className="flex gap-2 shrink-0"><Button variant="ghost" size="sm" onClick={resetInviteCheck}>Cancel</Button><Button size="sm" onClick={() => sendInvite(inviteCheck.email, role)}><UserPlus size={14} /> Send Email Invite</Button></div>
            </div>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <CardHeader title="Current members" sub={`${ctx.members.length} teammate${ctx.members.length === 1 ? '' : 's'} in this project`} />
        {ctx.teamLoading ? <div className="p-5 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        : ctx.members.length === 0 ? <div className="p-5"><EmptyState icon={Users} title="No members yet." /></div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/40">
                <tr><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Member</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Role</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Joined</th><th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ctx.members.map((m) => {
                  const meta = roleMeta(m.role);
                  return (
                    <tr key={m.id} className="transition-colors hover:bg-secondary/20">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {m.picture_url ? <img src={m.picture_url} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{(m.name || m.email || 'L').charAt(0).toUpperCase()}</span>}
                          <div className="min-w-0"><div className="truncate text-sm font-medium">{m.name || m.email || 'Lethem user'}{m.is_current_user ? ' · You' : ''}</div>{m.email && <div className="truncate text-xs text-muted-foreground">{m.email}</div>}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {m.role === 'owner' || m.is_current_user ? <Badge tone="primary"><ShieldCheck size={11} /> {meta.label}</Badge>
                        : <Select value={m.role} onChange={(e) => changeRole(m, e.target.value)} className="w-auto h-8 text-xs">{ASSIGNABLE_ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</Select>}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{ctx.fmtDate(m.joined_at)}</td>
                      <td className="px-4 py-3 text-right">
                        {m.role === 'owner' || m.is_current_user ? <span className="text-xs text-muted-foreground">Protected</span>
                        : <Button variant="ghost" size="sm" onClick={() => remove(m)} disabled={busy === m.id} className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /> {busy === m.id ? 'Removing…' : 'Remove'}</Button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}