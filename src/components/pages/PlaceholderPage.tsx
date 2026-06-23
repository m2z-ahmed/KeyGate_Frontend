
const PAGE_DATA: Record<string, { title: string; sub: string; status: string; cards: [string, string, string][] }> = {
  analytics: { title: 'Analytics', sub: 'Track token spend, request volume, latency, and provider trends across this project.', status: 'Dashboard preview', cards: [['Requests this month', '128.4k', '18% above last month'], ['Tokens used', '8.2M', '62% of Pro allowance'], ['Avg latency', '842ms', 'Across all providers'], ['Success rate', '99.2%', 'Last 24 hours']] },
  members: { title: 'Team Members', sub: 'Manage teammates who can view projects, rotate keys, and monitor usage.', status: 'Starter+ preview', cards: [['Owner', 'You', 'Full workspace access'], ['Developers', '3 seats', 'Can manage API access'], ['Viewers', '5 seats', 'Read-only monitoring']] },
  roles: { title: 'Roles', sub: 'Create permission bundles for access, monitoring, billing, and settings areas.', status: 'Starter+ preview', cards: [['Admin', 'All access', 'Billing, settings, keys'], ['Developer', 'Build access', 'Keys, demos, logs'], ['Analyst', 'Monitor access', 'Analytics and logs']] },
  invites: { title: 'Invites', sub: 'Invite teammates into this organization and track pending invitations.', status: 'Starter+ preview', cards: [['Pending invites', '2', 'Expire in 7 days'], ['Invite link', 'Disabled', 'Use email invites for now'], ['Allowed domains', 'Any', 'Domain controls coming soon']] },
  invoices: { title: 'Invoices', sub: 'Download receipts and PDFs for your organization billing history.', status: 'Billing preview', cards: [['Invoice #003', '$39.00', 'Paid Jun 14'], ['Invoice #002', '$39.00', 'Paid May 14'], ['Invoice #001', '$0.00', 'Free trial']] },
  general: { title: 'General Settings', sub: 'Edit project identity, default workspace behavior, and organization metadata.', status: 'Settings preview', cards: [['Workspace', 'Current organization', 'Organization layer ready'], ['Project', 'Current project', 'Primary development project'], ['Region', 'US', 'Default API routing']] },
  endpoint: { title: 'API Endpoint', sub: 'Configure proxy endpoints, environments, and SDK connection details.', status: 'Settings preview', cards: [['Proxy endpoint', 'lethem-backend.onrender.com', 'Production gateway'], ['Environment', 'Production', 'Live traffic enabled'], ['SDK status', 'Ready', 'Use this endpoint in clients']] },
  security: { title: 'Security', sub: 'Harden access with token policies, rotation windows, and provider restrictions.', status: 'Settings preview', cards: [['Token rotation', '30 days', 'Recommended cadence'], ['MFA policy', 'Optional', 'Auth provider managed'], ['IP allowlist', 'Off', 'Available on Scale']] },
  audit: { title: 'Audit Logs', sub: 'Review administrative events such as key creation, revocations, and billing changes.', status: 'Settings preview', cards: [['Key rotated', '2h ago', 'Performed by owner'], ['Subkey created', 'Yesterday', 'Project staging'], ['Plan viewed', 'Recently', 'Billing page opened']] },
  profile: { title: 'Profile', sub: 'View personal identity details supplied by your authentication provider.', status: 'Account preview', cards: [['Name', 'KeyGate User', 'Editable in auth provider'], ['Email', 'user@example.com', 'Verified'], ['Auth provider', 'Auth0', 'Single sign-on ready']] },
  workspace: { title: 'Workspace Settings', sub: 'Manage organization-wide defaults, project limits, and workspace membership.', status: 'Organization preview', cards: [['Organization', 'Your workspace', 'Multi-project ready'], ['Projects', 'Plan limit', 'Controlled by billing'], ['Plan', 'Current subscription', 'Shared billing owner']] },
  docs: { title: 'Documentation', sub: 'Quick links for SDK setup, API access patterns, and production rollout guidance.', status: 'Resource hub', cards: [['Quickstart', '5 min', 'Create a master key and subkey'], ['SDKs', 'Coming soon', 'Node, Python, and cURL examples'], ['Best practices', 'Recommended', 'Rotation, scopes, and logs']] },
};

export default function PlaceholderPage({ type = 'general', onBack = null }: { type?: string; onBack?: (() => void) | null }) {
  const data = PAGE_DATA[type] || PAGE_DATA.general;
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {onBack && <button onClick={onBack} className="btn btn-ghost text-xs mb-4">← Back to previous page</button>}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100 mb-1">{data.title}</h1>
        <p className="text-sm text-gray-500">{data.sub}</p>
      </div>
      <div className="card p-6 mb-6">
        <span className="badge badge-active mb-3 inline-block">{data.status}</span>
        <h2 className="text-base font-semibold text-gray-100 mb-2">{data.title} is ready for product wiring</h2>
        <p className="text-sm text-gray-500 leading-relaxed">These preview screens reserve the final information architecture so billing, teams, organizations, and settings can be connected without reshuffling navigation later.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.cards.map(([label, value, helper]) => (
          <div key={label} className="card p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">{label}</div>
            <div className="text-lg font-bold text-gray-100 mb-1">{value}</div>
            <div className="text-xs text-gray-500">{helper}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
