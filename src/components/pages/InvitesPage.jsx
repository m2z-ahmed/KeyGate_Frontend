import { useEffect, useState } from 'react';
import { ASSIGNABLE_ROLES, roleMeta } from '../../lib/roles';

export default function InvitesPage({ ctx }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('developer');
  const [busy, setBusy] = useState('');
  useEffect(() => { ctx.loadInvites?.().catch((e) => ctx.notify(e.message, 'error')); }, []);
  const send = async () => { setBusy('send'); try { await ctx.inviteMember(email, role); setEmail(''); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); } };
  const revoke = async (invite) => {
    if (!window.confirm(`Revoke invite for ${invite.email || invite.project_name || 'this user'}?`)) return;
    setBusy(invite.id); try { await ctx.revokeInvite(invite.id); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); }
  };
  const deleteInvite = async (invite) => {
    if (!window.confirm(`Delete invitation history for ${invite.email || invite.project_name || 'this invite'}?\n\nThis only removes the history row and cannot be undone.`)) return;
    setBusy(invite.id); try { await ctx.deleteInvite(invite.id); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); }
  };
  const accept = async (invite) => { setBusy(invite.id); try { await ctx.acceptInvite(invite.id); } catch (e) { ctx.notify(e.message, 'error'); } finally { setBusy(''); } };
  const received = ctx.invites.filter((invite) => invite.direction === 'received');
  const sent = ctx.invites.filter((invite) => invite.direction !== 'received');
  const statusTone = (status) => status === 'pending' ? 'paused' : status === 'accepted' ? 'active' : 'revoked';
  const actionFor = (i, mode) => {
    if (mode === 'received' && i.can_accept) return <button className='btn btn-primary btn-sm' disabled={busy === i.id} onClick={() => accept(i)}>Accept</button>;
    if (mode === 'sent' && i.status === 'pending') return <button className='btn btn-danger btn-sm' disabled={busy === i.id} onClick={() => revoke(i)}>Revoke</button>;
    if (mode === 'sent' && i.status !== 'pending') return <button className='btn btn-danger btn-sm invite-delete-btn' disabled={busy === i.id} onClick={() => deleteInvite(i)}><span aria-hidden='true'>🗑️</span> Delete</button>;
    return <span className='muted-text'>—</span>;
  };
  const renderRows = (rows, mode) => rows.map((i) => <tr key={`${mode}-${i.id}`}><td>{mode === 'received' ? (i.project_name || i.organization_name) : i.email}</td><td><span className={`badge ${roleMeta(i.role).tone}`}>{roleMeta(i.role).label}</span></td><td><span className={`badge ${statusTone(i.status)}`}>{i.status}</span></td><td>{ctx.fmtDate(i.expires_at)}</td><td>{actionFor(i, mode)}</td></tr>);
  const renderCards = (rows, mode) => <div className='invite-mobile-cards'>{rows.map((i) => <article className='invite-mobile-card' key={`${mode}-card-${i.id}`}><div className='invite-mobile-top'><div><strong>{mode === 'received' ? (i.project_name || i.organization_name) : i.email}</strong><span>{ctx.fmtDate(i.expires_at)}</span></div><span className={`badge ${statusTone(i.status)}`}>{i.status}</span></div><div className='invite-mobile-meta'><span className={`badge ${roleMeta(i.role).tone}`}>{roleMeta(i.role).label}</span>{actionFor(i, mode)}</div></article>)}</div>;
  return (
    <section className='page active team-page invites-page'>
      <div className='page-header'><h1 className='page-title'>Invites</h1><p className='page-sub'>Accept project invites sent to you, or track invites you sent from this project.</p></div>
      <div className='card invite-card'><div className='card-header'><div><div className='card-title'>Send invite</div><div className='card-sub'>Existing users receive in-app invites. New users receive email invite links.</div></div></div><div className='invite-form'><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='teammate@example.com' type='email' /><select value={role} onChange={(e) => setRole(e.target.value)}>{ASSIGNABLE_ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select><button className='btn btn-primary' disabled={busy === 'send' || !email} onClick={send}>{busy === 'send' ? 'Sending…' : 'Send An Invite'}</button></div></div>
      <div className='card invite-history-card'><div className='card-header'><div><div className='card-title'>Invites for you</div><div className='card-sub'>{received.length} invite{received.length === 1 ? '' : 's'} waiting for this account</div></div></div>{ctx.teamLoading ? <div className='empty'>Loading invites…</div> : received.length === 0 ? <div className='empty'><div className='empty-text'>No incoming invites.</div></div> : <><div className='table-wrap team-table-wrap'><table><thead><tr><th>Project</th><th>Role</th><th>Status</th><th>Expires</th><th>Actions</th></tr></thead><tbody>{renderRows(received, 'received')}</tbody></table></div>{renderCards(received, 'received')}</>}</div>
      <div className='card invite-history-card'><div className='card-header'><div><div className='card-title'>Sent invitation history</div><div className='card-sub'>{sent.length} invite{sent.length === 1 ? '' : 's'} sent from this project</div></div></div>{ctx.teamLoading ? <div className='empty'>Loading invites…</div> : sent.length === 0 ? <div className='empty'><div className='empty-text'>No invites sent yet.</div></div> : <><div className='table-wrap team-table-wrap'><table><thead><tr><th>Email</th><th>Role</th><th>Status</th><th>Expires</th><th>Actions</th></tr></thead><tbody>{renderRows(sent, 'sent')}</tbody></table></div>{renderCards(sent, 'sent')}</>}</div>
    </section>
  );
}
