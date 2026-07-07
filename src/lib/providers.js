export const FALLBACK_PROVIDERS = [
  { id: 'openai', label: 'OpenAI', default_model: 'gpt-4o-mini', key_placeholder: 'sk-...', models: [{ id: 'gpt-4o-mini', label: 'GPT-4o mini' }, { id: 'gpt-4o', label: 'GPT-4o' }, { id: 'gpt-4.1-mini', label: 'GPT-4.1 mini' }, { id: 'gpt-4.1', label: 'GPT-4.1' }] },
  { id: 'google', label: 'Google Gemini', default_model: 'gemini-2.5-flash', key_placeholder: 'AIza...', models: [{ id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' }, { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' }] },
  { id: 'anthropic', label: 'Anthropic', default_model: 'claude-3-5-haiku-latest', key_placeholder: 'sk-ant-...', models: [{ id: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku' }, { id: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet' }, { id: 'claude-3-opus-latest', label: 'Claude 3 Opus' }] },
  { id: 'deepseek', label: 'DeepSeek', default_model: 'deepseek-chat', key_placeholder: 'sk-...', models: [{ id: 'deepseek-chat', label: 'DeepSeek Chat' }, { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner' }] },
  { id: 'xai', label: 'xAI / Grok', default_model: 'grok-3', key_placeholder: 'xai-...', models: [{ id: 'grok-3', label: 'Grok 3' }, { id: 'grok-3-mini', label: 'Grok 3 Mini' }, { id: 'grok-2-vision', label: 'Grok 2 Vision' }] },
  { id: 'groq', label: 'Groq', default_model: 'llama-3.1-8b-instant', key_placeholder: 'gsk_...', models: [
    { id: 'allam-2-7b', label: 'Allam 2 7B' },
    { id: 'canopylabs/orpheus-arabic-saudi', label: 'Orpheus Arabic Saudi' },
    { id: 'canopylabs/orpheus-v1-english', label: 'Orpheus V1 English' },
    { id: 'groq/compound', label: 'Groq Compound' },
    { id: 'groq/compound-mini', label: 'Groq Compound Mini' },
    { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
    { id: 'meta-llama/llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout 17B' },
    { id: 'meta-llama/llama-prompt-guard-2-22m', label: 'Llama Prompt Guard 22M' },
    { id: 'meta-llama/llama-prompt-guard-2-86m', label: 'Llama Prompt Guard 86M' },
    { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B' },
    { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B' },
    { id: 'openai/gpt-oss-safeguard-20b', label: 'GPT-OSS Safeguard 20B' },
    { id: 'qwen/qwen3-32b', label: 'Qwen 3 32B' },
  ] },
  { id: 'mistral', label: 'Mistral AI', default_model: 'mistral-small-latest', key_placeholder: 'BJtB...', models: [
    { id: 'mistral-large-latest', label: 'Mistral Large 3' },
    { id: 'mistral-medium-latest', label: 'Mistral Medium 3.5' },
    { id: 'mistral-small-latest', label: 'Mistral Small 4' },
    { id: 'codestral-latest', label: 'Codestral' },
    { id: 'open-mistral-nemo', label: 'Mistral Nemo' },
    { id: 'ministral-8b-latest', label: 'Ministral 8B' },
    { id: 'pixtral-large-latest', label: 'Pixtral Large' },
  ] },
  { id: 'together', label: 'Together AI', default_model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', key_placeholder: 'api-key...', models: [
    { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', label: 'Llama 3.3 70B' },
    { id: 'meta-llama/Llama-3.1-8B-Instruct-Turbo', label: 'Llama 3.1 8B' },
    { id: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3' },
    { id: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1' },
    { id: 'meta-llama/Llama-4-Scout-17B-16E-Instruct', label: 'Llama 4 Scout' },
    { id: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8', label: 'Llama 4 Maverick' },
    { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B' },
    { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B' },
  ] },
  { id: 'openrouter', label: 'OpenRouter', default_model: 'openai/gpt-4o-mini', key_placeholder: 'sk-or-...', models: [
    { id: 'openai/gpt-4o-mini', label: 'GPT-4o mini' },
    { id: 'openai/gpt-4o', label: 'GPT-4o' },
    { id: 'anthropic/claude-sonnet-4.5', label: 'Claude Sonnet 4.5' },
    { id: 'anthropic/claude-haiku-4.5', label: 'Claude Haiku 4.5' },
    { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { id: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
    { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' },
    { id: 'mistral/mistral-large-latest', label: 'Mistral Large 3' },
  ] },
  { id: 'perplexity', label: 'Perplexity', default_model: 'sonar', key_placeholder: 'pplx-...', models: [
    { id: 'sonar', label: 'Sonar' },
    { id: 'sonar-pro', label: 'Sonar Pro' },
    { id: 'sonar-reasoning', label: 'Sonar Reasoning' },
    { id: 'sonar-reasoning-pro', label: 'Sonar Reasoning Pro' },
  ] },
  { id: 'cohere', label: 'Cohere', default_model: 'command-r-08-2024', key_placeholder: '...', models: [
    { id: 'command-r7b-12-2024', label: 'Command R7B' },
    { id: 'command-r-08-2024', label: 'Command R' },
    { id: 'command-a-2025-03', label: 'Command A' },
    { id: 'command-r-plus-08-2024', label: 'Command R+' },
  ] },
  { id: 'fireworks', label: 'Fireworks AI', default_model: 'accounts/fireworks/models/llama-v3p3-70b-instruct', key_placeholder: 'fw_...', models: [
    { id: 'accounts/fireworks/models/deepseek-v4-flash', label: 'DeepSeek V4 Flash' },
    { id: 'accounts/fireworks/models/llama-v3p3-70b-instruct', label: 'Llama 3.3 70B' },
    { id: 'accounts/fireworks/models/llama-v3p1-8b-instruct', label: 'Llama 3.1 8B' },
    { id: 'accounts/fireworks/models/deepseek-v4-pro', label: 'DeepSeek V4 Pro' },
    { id: 'accounts/fireworks/models/qwen3-32b', label: 'Qwen3 32B' },
    { id: 'accounts/fireworks/models/mixtral-8x22b-instruct', label: 'Mixtral 8x22B' },
  ] },
  { id: 'deepinfra', label: 'DeepInfra', default_model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', key_placeholder: 'api-key...', models: [
    { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', label: 'Llama 3.3 70B Turbo' },
    { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', label: 'Llama 3.1 8B Turbo' },
    { id: 'Qwen/Qwen3-32B', label: 'Qwen3 32B' },
    { id: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3' },
    { id: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1' },
    { id: 'meta-llama/Llama-4-Scout-17B-16E-Instruct', label: 'Llama 4 Scout' },
  ] },
];

export const providerLabel = (providers, id) => (providers || FALLBACK_PROVIDERS).find((p) => p.id === id)?.label || id || 'Unknown';
export const providerModels = (providers, id) => ((providers || FALLBACK_PROVIDERS).find((p) => p.id === id)?.models || []).map((m) => m.id);
export const providerPlaceholder = (providers, id) => (providers || FALLBACK_PROVIDERS).find((p) => p.id === id)?.key_placeholder || 'sk-...';
export const providerDefaultModel = (providers, id) => (providers || FALLBACK_PROVIDERS).find((p) => p.id === id)?.default_model || providerModels(providers, id)[0] || 'gpt-4o-mini';

export function parseAllowedModels(value) {
  if (!value || value === 'all') return ['all'];
  if (Array.isArray(value)) return value.length ? value : ['all'];
  if (typeof value === 'string') {
    try { return parseAllowedModels(JSON.parse(value)); } catch { return [value]; }
  }
  return ['all'];
}
