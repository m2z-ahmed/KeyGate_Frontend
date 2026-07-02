import { useState } from 'react';
import { FALLBACK_PROVIDERS, providerLabel, providerPlaceholder } from '../../lib/providers';

export default function MasterKeysPage({ ctx }) {
  const { masterKeys, api, loadMasterKeys, notify, fmtDate, modal, setModal, providers = FALLBACK_PROVIDERS, loading } = ctx;
  const providerOptions = providers.length ? providers : FALLBACK_PROVIDERS;
  const [provider, setProvider] = useState('openai');
  const [keyName, setKeyName] = useState('Primary OpenAI Key');
  const [apiKey, setApiKey] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const isLoading = loading?.masterkeys;

  const onProviderChange = (next) => {
    setProvider(next);
    setKeyName(`Primary ${providerLabel(providerOptions, next)} Key`);
  };

  const saveMasterKey = async () => {
    if (!apiKey.trim()) return notify('Enter an API key', 'error');
    await api('/api/master-keys', { method: 'POST', body: { provider, name: keyName.trim(), api_key: apiKey.trim() } });
    setApiKey(''); onProviderChange('openai'); setModal(''); notify('Master key saved — encrypted'); loadMasterKeys();
  };

  const deleteMasterKey = async (mk) => {
    const okay = window.confirm(`Delete master key "${mk.name || mk.provider}"?\n\nThis cannot be undone.`);
    if (!okay) return;
    setDeletingId(mk.id);
    try { await api(`/api/master-keys/${mk.id}`, { method: 'DELETE' }); notify('Master key deleted'); await loadMasterKeys(); }
    finally { setDeletingId(''); }
  };

  const providerEmoji = (id) => ({ openai: '⬛', google: '🔵', anthropic: '🟧', deepseek: '🌊', xai: '✕', groq: '⚡' }[id] || '🔐');

  return (
    <div className='page active'>
      <div className='page-inner'>
        <div className='page-header' style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className='page-title'>Master Keys</div>
            <div className='page-sub'>Your real provider API keys — stored encrypted, never exposed</div>
          </div>
          <button className='btn btn-primary' onClick={() => setModal('addkey')}>+ Add key</button>
        </div>

        <div className='card info-card'>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>⚡</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--amber)', marginBottom: '4px' }}>Keys are encrypted at rest</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.7 }}>Your master keys are encrypted before storage. They are never returned in any API response, never logged, and only injected server-side at request time. Your clients only ever see subkeys.</div>
            </div>
          </div>
        </div>

        {isLoading ? (
          Array.from({length:3}).map((_,i) => (
            <div className='card' key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className='skel skel-avatar' />
              <div style={{ flex: 1 }}>
                <div className='skel skel-block skel-h skel-w40' style={{marginBottom:6}} />
                <div className='skel skel-block skel-h skel-w60' />
              </div>
              <div className='skel skel-block skel-h skel-w20' />
            </div>
          ))
        ) : !masterKeys.length ? (
          <div className='empty'>
            <div className='empty-icon'>🔑</div>
            <div className='empty-text'>No master keys configured</div>
            <button className='btn btn-primary' onClick={() => setModal('addkey')}>Add your first key</button>
          </div>
        ) : masterKeys.map((mk) => (
          <div className='card master-key-card' key={mk.id}>
            <div className='master-key-icon'>{providerEmoji(mk.provider)}</div>
            <div className='master-key-info'>
              <div className='master-key-name'>{mk.name || providerLabel(providerOptions, mk.provider)}</div>
              <div className='master-key-masked mono'>{mk.key_masked}</div>
            </div>
            <div className='master-key-meta'>
              <div style={{ fontSize: '12px', color: 'var(--dim)' }}>Added {fmtDate(mk.created_at)}</div>
              <button className='btn btn-sm btn-danger' disabled={deletingId === mk.id} onClick={() => deleteMasterKey(mk)}>{deletingId === mk.id ? 'Deleting...' : 'Delete'}</button>
            </div>
            <span className='badge active'>{providerLabel(providerOptions, mk.provider)}</span>
          </div>
        ))}

        <div className={`modal-backdrop ${modal === 'addkey' ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && setModal('')}>
          <div className='modal'>
            <div className='modal-title'>Add provider key</div>
            <div className='form-row single'><div className='field'><label>Name for master key</label><input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder='e.g. Production OpenAI Key' /></div></div>
            <div className='form-row single'><div className='field'><label>Provider</label><select value={provider} onChange={(e) => onProviderChange(e.target.value)}>{providerOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div></div>
            <div className='form-row single'><div className='field'><label>API key</label><input type='password' value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={providerPlaceholder(providerOptions, provider)} autoComplete='off' /></div></div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>This key will be encrypted immediately. You won't be able to retrieve it — only replace it.</div>
            <div className='modal-footer'><button className='btn btn-ghost' onClick={() => setModal('')}>Cancel</button><button className='btn btn-primary' onClick={saveMasterKey}>Save encrypted key</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
