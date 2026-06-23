import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FALLBACK_PROVIDERS, parseAllowedModels, providerDefaultModel, providerLabel, providerModels } from '../../lib/providers';
import { cacheBust } from '../../lib/cache';
import { Copy, Check, Play, Terminal } from 'lucide-react';

export default function DemoPage() {
  const { subkeys, API, api, notify, sleep, copyText, copiedItem, providers = FALLBACK_PROVIDERS } = useApp();
  const providerOptions = providers.length ? providers : FALLBACK_PROVIDERS;
  const [selectedSubkeyId, setSelectedSubkeyId] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [prompt, setPrompt] = useState('Say hello in exactly 5 words.');
  const [consoleLines, setConsoleLines] = useState<string[]>(['# KeyGate live proxy demo', '# Select a subkey and hit "Run test call" to see the magic', 'ready — waiting for request']);
  const [running, setRunning] = useState(false);

  const active = subkeys.filter((s) => s.status === 'active');
  const selectedSubkey = active.find((s) => s.id === selectedSubkeyId);
  const tokenPreview = (selectedSubkey as any)?.token_preview || '';

  const allowedModelList = useMemo(() => {
    if (!selectedSubkey) return providerModels(providerOptions, 'openai');
    const providerDefaults = providerModels(providerOptions, selectedSubkey.provider);
    const allowed = parseAllowedModels(selectedSubkey.allowed_models);
    if (!allowed.length || allowed.includes('all')) return providerDefaults;
    const filtered = allowed.filter((m) => providerDefaults.includes(m));
    return filtered.length ? filtered : providerDefaults;
  }, [selectedSubkey, providerOptions]);

  useEffect(() => {
    if (!allowedModelList.includes(model)) setModel(allowedModelList[0] || providerDefaultModel(providerOptions, selectedSubkey?.provider || 'openai'));
  }, [allowedModelList, model, selectedSubkey, providerOptions]);

  const preview = !selectedSubkey ? 'Select a subkey to see the request preview...' :
    `POST /v1/chat/completions\nAuthorization: Bearer ${tokenPreview || 'sk-kg-••••'}\n\n{\n  "model": "${model}",\n  "messages": [{\n    "role": "user",\n    "content": "${prompt}"\n  }]\n}`;

  const add = (line: string) => setConsoleLines((v) => [...v, line]);

  const curlSnippet = `TOKEN="sk-kg-YourTokenHere"\ncurl ${API}/v1/chat/completions \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"${model}","messages":[{"role":"user","content":"${prompt}"}]}'`;
  const jsSnippet = `fetch('${API}/v1/chat/completions', {\n  method: 'POST',\n  headers: { Authorization: 'Bearer sk-kg-YourTokenHere', 'Content-Type': 'application/json' },\n  body: JSON.stringify({ model: '${model}', messages: [{ role: 'user', content: '${prompt}' }] })\n}).then(r => r.json()).then(console.log);`;
  const pySnippet = `import requests\nres = requests.post('${API}/v1/chat/completions',\n  headers={'Authorization':'Bearer sk-kg-YourTokenHere','Content-Type':'application/json'},\n  json={'model':'${model}','messages':[{'role':'user','content':'${prompt}'}]})\nprint(res.json())`;

  const runDemo = async () => {
    if (!selectedSubkey) return notify('Select a subkey first', 'error');
    if (!prompt.trim()) return notify('Enter a prompt', 'error');
    if (!model) return notify('Select a model', 'error');
    const tokenHint = (selectedSubkey as any).token_preview || (selectedSubkey as any).token_prefix || 'sk-kg-';
    setRunning(true);
    setConsoleLines([`$ sending request with subkey ${tokenHint}…`]);
    await sleep(250); add('→ validating subkey + model allowlist');
    await sleep(250); add(`→ provider/model: ${providerLabel(providerOptions, selectedSubkey.provider)} / ${model}`);
    try {
      const demoToken = (await api<{ token: string }>(`/api/subkeys/${selectedSubkey.id}/demo-token`)).token;
      const res = await fetch(API + '/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-keygate-client': 'dashboard', Authorization: 'Bearer ' + demoToken },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], max_tokens: 150 }),
      });
      const data = await res.json();
      if (!res.ok) { add(`✗ error ${res.status}: ${data.error?.message || 'unknown error'}`); return; }
      add('✓ response received'); add(`→ tokens used: ${data.usage?.total_tokens || 0}`); add('AI response:'); add(data.choices?.[0]?.message?.content || '');
      notify('Request proxied — check logs for usage');
      cacheBust('/api/analytics', 'public'); cacheBust('/api/subkeys', 'public');
    } catch (e: any) { add(`✗ connection error: ${e.message}`); }
    finally { setRunning(false); }
  };

  const SnippetCard = ({ title, code, id }: { title: string; code: string; id: string }) => (
    <div className="card p-4 cursor-pointer hover:border-primary-500/30 transition-colors" onClick={() => copyText(code, id)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-400">{title}</span>
        {copiedItem === id ? <Check size={14} className="text-success-400" /> : <Copy size={14} className="text-gray-500" />}
      </div>
      <pre className="text-xs font-mono text-gray-400 whitespace-pre-wrap leading-relaxed">{code}</pre>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100 mb-1">Live demo</h1>
        <p className="text-sm text-gray-500">See exactly how a client uses a subkey — without ever knowing the real key</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Config */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-100 mb-4">Configure test call</h2>
          {!active.length && <p className="text-sm text-gray-500 mb-4">No active subkeys. Create one first.</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Subkey to test</label>
              <select className="input" value={selectedSubkeyId} onChange={(e) => setSelectedSubkeyId(e.target.value)}>
                <option value="">— select a subkey —</option>
                {active.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Provider</label>
              <div className="badge badge-active">{selectedSubkey ? providerLabel(providerOptions, selectedSubkey.provider) : 'Select a subkey'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Model</label>
              <select className="input" value={model} onChange={(e) => setModel(e.target.value)}>
                {allowedModelList.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <p className="mt-1.5 text-xs text-gray-500">Only models allowed by the selected subkey are shown.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Prompt</label>
              <input className="input" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            </div>
            <button onClick={runDemo} disabled={running || !selectedSubkey} className="btn btn-primary w-full py-2.5">
              {running ? <><span className="animate-pulse-soft">Running...</span></> : <><Play size={16} /> Run test call →</>}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="card p-5 bg-base-950">
          <h2 className="text-sm font-semibold text-gray-100 mb-3">What the client sends</h2>
          <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">{preview}</pre>
        </div>
      </div>

      {/* Console */}
      <div className="card overflow-hidden mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-base-850 border-b border-base-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-danger-500/70" />
            <div className="w-3 h-3 rounded-full bg-accent-500/70" />
            <div className="w-3 h-3 rounded-full bg-success-500/70" />
          </div>
          <Terminal size={14} className="text-gray-500 ml-2" />
          <span className="text-xs text-gray-500">KeyGate proxy console</span>
        </div>
        <div className="p-4 bg-base-950 font-mono text-xs space-y-1 min-h-[120px]">
          {consoleLines.map((l, i) => (
            <p key={i} className={l.startsWith('✓') ? 'text-success-400' : l.startsWith('✗') ? 'text-danger-400' : l.startsWith('→') ? 'text-primary-400' : l.startsWith('AI') ? 'text-gray-100 font-medium' : 'text-gray-500'}>{l}</p>
          ))}
        </div>
      </div>

      {/* Code snippets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SnippetCard title="JavaScript" code={jsSnippet} id="js" />
        <SnippetCard title="Python" code={pySnippet} id="py" />
        <SnippetCard title="cURL" code={curlSnippet} id="curl" />
      </div>
    </div>
  );
}
