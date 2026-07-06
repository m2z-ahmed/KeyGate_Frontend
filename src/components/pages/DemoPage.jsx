import { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, Button, Label, Select, Textarea, EmptyState, cn } from '../kit';
import { FALLBACK_PROVIDERS, parseAllowedModels, providerDefaultModel, providerLabel, providerModels } from '../../lib/providers';
import { cacheBust } from '../../lib/cache';
import { Play, Terminal, Copy, Check, KeySquare } from 'lucide-react';

export default function DemoPage({ ctx }) {
  const { subkeys, API, api, notify, sleep, copyText, providers = FALLBACK_PROVIDERS } = ctx;
  const providerOptions = providers.length ? providers : FALLBACK_PROVIDERS;
  const [selectedSubkeyId, setSelectedSubkeyId] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [prompt, setPrompt] = useState('Say hello in exactly 5 words.');
  const endpoint = `${API}/v1/chat/completions`;
  const [consoleLines, setConsoleLines] = useState(['# Lethem live proxy demo', '# Select a subkey and hit "Run test call" to see the magic', 'ready — waiting for request']);
  const [copiedSnippet, setCopiedSnippet] = useState('');

  const active = subkeys.filter((s) => s.status === 'active');
  const selectedSubkey = active.find((s) => s.id === selectedSubkeyId);
  const tokenPreview = selectedSubkey?.token_preview || '';

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

  const preview = !selectedSubkey ? 'Select a subkey to see the request preview...' : `POST /v1/chat/completions\nAuthorization: Bearer ${tokenPreview || 'sk-lt-••••'}\n\n{\n  "model": "${model}",\n  "messages": [{\n    "role": "user",\n    "content": "${prompt}"\n  }]\n}`;
  const add = (line) => setConsoleLines((v) => [...v, line]);

  const curlSnippet = `TOKEN="sk-lt-YourTokenHere"\ncurl ${endpoint} \\\n -H "Authorization: Bearer $TOKEN" \\\n -H "Content-Type: application/json" \\\n -d '{"model":"${model}","messages":[{"role":"user","content":"${prompt}"}]}'`;
  const jsSnippet = `fetch('${endpoint}', {\n method: 'POST',\n headers: { Authorization: 'Bearer sk-lt-YourTokenHere', 'Content-Type': 'application/json' },\n body: JSON.stringify({ model: '${model}', messages: [{ role: 'user', content: '${prompt}' }] })\n}).then(r => r.json()).then(console.log);`;
  const pySnippet = `import requests\nres = requests.post('${endpoint}',\n headers={'Authorization':'Bearer sk-lt-YourTokenHere','Content-Type':'application/json'},\n json={'model':'${model}','messages':[{'role':'user','content':'${prompt}'}]})\nprint(res.json())`;

  const runDemo = async () => {
    if (!selectedSubkey) return notify('Select a subkey first', 'error');
    if (!prompt.trim()) return notify('Enter a prompt', 'error');
    if (!model) return notify('Select a model', 'error');
    const tokenHint = selectedSubkey.token_preview || selectedSubkey.token_prefix || 'sk-lt-';
    setConsoleLines([`$ sending request with subkey ${tokenHint}…`]);
    await sleep(250); add('→ validating subkey + model allowlist');
    await sleep(250); add(`→ provider/model: ${providerLabel(providerOptions, selectedSubkey.provider)} / ${model}`);
    try {
      const demoToken = (await api(`/api/subkeys/${selectedSubkey.id}/demo-token`)).token;
      const res = await fetch(API + '/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-lethem-client': 'dashboard', Authorization: 'Bearer ' + demoToken }, body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], max_tokens: 150 }) });
      const data = await res.json();
      if (!res.ok) { add(`✗ error ${res.status}: ${data.error?.message || 'unknown error'}`); return; }
      add('✓ response received'); add(`→ tokens used: ${data.usage?.total_tokens || 0}`); add('AI response:'); add(data.choices?.[0]?.message?.content || ''); notify('Request proxied — check logs for usage');
      cacheBust('/api/analytics'); cacheBust('/api/subkeys'); cacheBust('/api/master-keys');
    } catch (e) { add(`✗ connection error: ${e.message}`); }
  };

  const snippetCard = (title, code) => (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopiedSnippet(title); setTimeout(() => setCopiedSnippet(''), 1600); }} className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"><Copy size={13} /></button>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-secondary/50 p-3 font-mono text-xs leading-relaxed text-muted-foreground">{code}</pre>
    </Card>
  );

  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Live demo</h1><p className="mt-1 text-sm text-muted-foreground">See exactly how a client uses a subkey — without ever knowing the real key.</p></div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Configure test call" sub={!active.length ? 'No active subkeys available.' : 'Select a subkey and model to test the proxy.'} />
          <div className="p-5 space-y-4">
            {!active.length ? <EmptyState icon={KeySquare} title="No active subkeys" description="Create a subkey first to run a demo." action={<Button size="sm" onClick={() => { window.history.pushState({}, '', window.location.pathname.replace('/demo', '/subkeys')); window.dispatchEvent(new PopStateEvent('popstate')); }}>Create Subkey</Button>} /> : (
              <>
                <div><Label>Subkey to test</Label><Select value={selectedSubkeyId} onChange={(e) => setSelectedSubkeyId(e.target.value)}><option value="">— select a subkey —</option>{active.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></div>
                <div><Label>Provider</Label><div className="rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">{selectedSubkey ? providerLabel(providerOptions, selectedSubkey.provider) : 'Select a subkey'}</div></div>
                <div><Label>Model</Label><Select value={model} onChange={(e) => setModel(e.target.value)}>{allowedModelList.map((m) => <option key={m} value={m}>{m}</option>)}</Select><p className="mt-1.5 text-xs text-muted-foreground">Only models allowed by the selected subkey are shown.</p></div>
                <div><Label>Prompt</Label><Textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} /></div>
                <Button onClick={runDemo} className="w-full" size="lg"><Play size={16} /> Run test call</Button>
              </>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="What the client sends" />
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-muted-foreground">{preview}</pre>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader title="Lethem proxy console" actions={<Terminal size={14} className="text-muted-foreground" />} />
            <div className="bg-black/40 p-4 font-mono text-xs leading-relaxed">
              {consoleLines.map((l, i) => <div key={i} className={cn(l.startsWith('✓') ? 'text-success' : l.startsWith('✗') ? 'text-destructive' : l.startsWith('→') ? 'text-info' : l.startsWith('$') ? 'text-primary' : 'text-muted-foreground')}>{l}</div>)}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">{snippetCard('JavaScript', jsSnippet)}{snippetCard('Python', pySnippet)}{snippetCard('cURL', curlSnippet)}</div>
    </div>
  );
}