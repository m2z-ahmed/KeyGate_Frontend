import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Badge, Input, Label, Select, Modal, EmptyState, Skeleton, cn } from '../kit';
import { FALLBACK_PROVIDERS, providerLabel, providerModels as getProviderModels, parseAllowedModels } from '../../lib/providers';
import { fmtNum, fmtDate, quotaColor } from '../../contexts/LethemContext';
import { KeySquare, Plus, Copy, Check, Pencil, Receipt, Eye, ChevronUp, ChevronDown, Search, RefreshCw } from 'lucide-react';

const fmtCost = (v) => Number(v || 0) ? `$${Number(v).toFixed(6)}` : '—';
const pctUsed = (used, limit) => Math.min(100, Math.round(((Number(used) || 0) / Math.max(Number(limit) || 1, 1)) * 100));
const getMaskedSubkey = (sk) => sk?.token_preview || `${sk?.token_prefix || 'sk-kg-'}••••••••${sk?.token_suffix || ''}`;
const slugifyFilePart = (v) => String(v || 'Subkey').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'Subkey';

function exportReceiptPdf(receipt) {
  const popup = window.open('', '_blank', 'width=1000,height=900');
  if (!popup) return false;
  const rows = receipt.relatedLogs.length
    ? receipt.relatedLogs.map((log) => `<tr><td>${String(log.request_id || '').slice(0, 10) || '—'}</td><td>${log.provider || receipt.providerId}</td><td>${log.model || '—'}</td><td>${log.tokens_used || 0}</td><td>${fmtCost(log.estimated_cost_usd)}</td><td>${log.status || '—'}</td></tr>`).join('')
    : '<tr><td colspan="6">No request logs available yet.</td></tr>';
  popup.document.open();
  popup.document.write(`<!doctype html><html><head><title>${receipt.fileName}</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#111}h1{color:#7c6bff}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid  #ddd;padding:8px;text-align:left;font-size:13px}</style></head><body>
  <h1>Lethem Subkey Receipt</h1>
  <p><strong>${receipt.name}</strong> — <code>${receipt.token}</code></p>
  <p>Project: ${receipt.projectName} (${receipt.projectSlug}) · Provider: ${receipt.provider}</p>
  <p>Quota: ${receipt.quotaUsed} / ${receipt.quotaLimit} tokens (${receipt.quotaPct}%) · Requests: ${receipt.requestsUsed} / ${receipt.requestsLimit}</p>
  <p>Total spent: ${receipt.totalSpentUsd} · Expiry: ${receipt.expiry} · Allowed models: ${receipt.allowedModels}</p>
  <h2>Recent Request Logs</h2>
  <table><thead><tr><th>Request</th><th>Provider</th><th>Model</th><th>Tokens</th><th>Cost</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>