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