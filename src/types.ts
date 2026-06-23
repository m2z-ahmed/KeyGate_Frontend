export interface Project {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: number;
}

export interface MasterKey {
  id: string;
  provider: string;
  name: string;
  key_masked: string;
  created_at: number;
}

export interface Subkey {
  id: string;
  name: string;
  provider: string;
  token: string;
  token_preview: string;
  token_prefix?: string;
  status: 'active' | 'paused' | 'revoked';
  monthly_token_limit: number;
  tokens_used: number;
  max_requests: number;
  request_count: number;
  spend_limit_usd: number | null;
  allowed_models: string[] | string;
  auto_route_on_exhausted: boolean;
  expires_at: number | null;
  created_at: number;
}

export interface LogEntry {
  id: string;
  subkey_id?: string;
  subkey_name: string;
  provider: string;
  model: string;
  status: 'success' | 'error' | 'quota';
  tokens_used: number;
  prompt_tokens: number;
  completion_tokens: number;
  estimated_cost_usd: number;
  latency_ms: number | null;
  error_reason: string | null;
  source: string;
  request_id: string | null;
  created_at: number;
}

export interface Analytics {
  totalRequests: number;
  totalTokens: number;
  avgLatency: string | number;
  costAttribution?: { est_cost_usd: number }[];
  topModels?: { model: string; count: number }[];
  logs?: LogEntry[];
}

export interface QuotaRequest {
  id: string;
  subkey_id: string;
  subkey_name: string;
  request_type: string;
  amount: string;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: number;
}

export interface HealthCheck {
  day: string;
  internal_ok: boolean | null;
  db_ok: boolean | null;
  redis_ok: boolean | null;
  details: Record<string, unknown>;
}

export interface BillingPlan {
  id: string;
  name: string;
  description: string;
  monthlyUsd: number;
  monthlyInr: number | null;
  popular: boolean;
  features: string[];
  limits: {
    projects: number | null;
    subkeys: number | null;
    tokens: number;
    logsDays: number;
  };
}

export interface Billing {
  currentPlan: string;
  subscriptionId: string | null;
  subscriptionStatus: string;
  currency: string;
  testMode: boolean;
  keyId: string | null;
  plans: BillingPlan[];
}

export interface Provider {
  id: string;
  label: string;
  default_model: string;
  key_placeholder: string;
  models: { id: string; label: string }[];
}
