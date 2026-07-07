import { useState } from 'react';

export default function SettingsPage({ ctx }) {
  const { allowedDomains, projectMode, addAllowedDomain, removeAllowedDomain, updateProjectMode, billing, notify } = ctx;
  const [domainInput, setDomainInput] = useState('');
  const [modeBusy, setModeBusy] = useState('');
  const [domainBusy, setDomainBusy] = useState('');
  const [showModeConfirm, setShowModeConfirm] = useState(false);

  const maxDomains = billing?.plans?.find((p) => p.id === billing.currentPlan)?.limits?.allowedDomains ?? 999999;
  const modeLabel = projectMode === 'test' ? 'Test Mode' : 'Production Mode';

  const handleAddDomain = async () => {
    let domain = domainInput.trim();
    if (!domain) { notify('Enter a domain URL', 'error'); return; }
    if (!/^https?:\/\//i.test(domain)) domain = `https://${domain}`;
    try { new URL(domain); } catch { notify('Enter a valid URL (e.g. https://app.example.com)', 'error'); return; }
    if (allowedDomains.some((d) => d.domain === domain.replace(/\/+$/, ''))) { notify('Domain already added', 'error'); return; }
    setDomainBusy('add');
    try {
      await addAllowedDomain(domain);
      setDomainInput('');
      notify('Domain added');
    } catch (e) { notify(e.message, 'error'); }
    finally { setDomainBusy(''); }
  };

  const handleRemoveDomain = async (id) => {
    if (!confirm('Remove this domain?')) return;
    setDomainBusy(id);
    try { await removeAllowedDomain(id); notify('Domain removed'); }
    catch (e) { notify(e.message, 'error'); }
    finally { setDomainBusy(''); }
  };

  const handleToggleMode = async () => {
    const next = projectMode === 'test' ? 'production' : 'test';
    if (next === 'production' && !showModeConfirm) { setShowModeConfirm(true); return; }
    setModeBusy(true);
    try {
      await updateProjectMode(next);
      notify(`Switched to ${next === 'test' ? 'Test' : 'Production'} Mode`);
      setShowModeConfirm(false);
    } catch (e) { notify(e.message, 'error'); }
    finally { setModeBusy(false); }
  };

  const handleCancelMode = () => { setShowModeConfirm(false); };

  return (
    <section className='page active settings-page'>
      <div className='page-header'>
        <h1 className='page-title'>Project Settings</h1>
        <p className='page-sub'>Manage project mode and allowed domains for access control.</p>
      </div>

      <div className='card'>
        <div className='card-header'>
          <div>
            <div className='card-title'>Project Mode</div>
            <div className='card-sub'>Controls how origin validation behaves for API requests.</div>
          </div>
        </div>
        <div className='settings-mode-section'>
          <div className='settings-mode-option'>
            <div className='settings-mode-indicator'>
              <span className={`badge ${projectMode === 'test' ? 'badge-warn' : 'badge-muted'}`}>{modeLabel}</span>
            </div>
            <div className='settings-mode-info'>
              {projectMode === 'test' ? (
                <>
                  <div className='settings-mode-features'>
                    <span className='settings-mode-check'>✓</span> Localhost origins allowed automatically
                  </div>
                  <div className='settings-mode-features'>
                    <span className='settings-mode-check'>✓</span> Development-friendly
                  </div>
                </>
              ) : (
                <>
                  <div className='settings-mode-features'>
                    <span className='settings-mode-check'>✓</span> Only Allowed Domains can access this project
                  </div>
                  <div className='settings-mode-features'>
                    <span className='settings-mode-check'>✓</span> Recommended for production
                  </div>
                </>
              )}
            </div>
          </div>

          {showModeConfirm ? (
            <div className='invite-confirm-box' style={{ marginTop: 12 }}>
              <div><strong>Switch to Production Mode?</strong> Localhost access will stop working. Only explicitly allowed domains will be accepted. Make sure you have added your production domains below.</div>
              <div className='row-actions' style={{ marginTop: 8 }}>
                <button className='btn btn-ghost btn-sm' onClick={handleCancelMode} disabled={modeBusy}>Cancel</button>
                <button className='btn btn-primary btn-sm' onClick={handleToggleMode} disabled={modeBusy}>{modeBusy ? 'Switching…' : 'Switch to Production'}</button>
              </div>
            </div>
          ) : (
            <button className='btn btn-primary' onClick={handleToggleMode} disabled={modeBusy} style={{ marginTop: 12 }}>
              {modeBusy ? 'Switching…' : `Switch to ${projectMode === 'test' ? 'Production' : 'Test'} Mode`}
            </button>
          )}
        </div>
      </div>

      <div className='card'>
        <div className='card-header'>
          <div>
            <div className='card-title'>Allowed Domains</div>
            <div className='card-sub'>
              Only requests from these domains are accepted when the project is in Production Mode.
              {maxDomains !== null && maxDomains < 999999 && <span> {allowedDomains.length}/{maxDomains} domains used.</span>}
            </div>
          </div>
        </div>
        <div className='settings-domains-form'>
          <input
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder='https://app.example.com'
            onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
          />
          <button className='btn btn-primary' disabled={domainBusy === 'add' || !domainInput.trim()} onClick={handleAddDomain}>
            {domainBusy === 'add' ? 'Adding…' : 'Add Domain'}
          </button>
        </div>
        <div className='settings-domains-list'>
          {allowedDomains.length === 0 ? (
            <div className='empty'><div className='empty-text'>No domains configured yet.</div></div>
          ) : (
            allowedDomains.map((d) => (
              <div key={d.id} className='settings-domain-row'>
                <span className='settings-domain-check'>✓</span>
                <span className='settings-domain-url'>{d.domain}</span>
                <button
                  className='btn btn-danger btn-sm'
                  disabled={domainBusy === d.id}
                  onClick={() => handleRemoveDomain(d.id)}
                >
                  {domainBusy === d.id ? '…' : 'Remove'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
