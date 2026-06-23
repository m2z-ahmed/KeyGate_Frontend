import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from '../components/Logo';
import { ShieldCheck, KeyRound, Activity, Lock } from 'lucide-react';

export default function LoginView() {
  const { login, authError, isConfigured } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-950 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="card p-8 shadow-2xl animate-slide-up">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <LogoIcon size={56} />
          </div>

          <div className="text-center mb-8">
            <div className="text-xs font-medium text-primary-400 uppercase tracking-wider mb-2">Secure AI Access Gateway</div>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">Sign in to KeyGate</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Manage provider master keys, scoped subkeys, quota controls, and gateway logs from a protected console.
            </p>
          </div>

          {!isConfigured && (
            <div className="mb-4 p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-xs text-accent-400 leading-relaxed">
              Auth0 is not configured. Add <code className="font-mono">VITE_AUTH0_DOMAIN</code>, <code className="font-mono">VITE_AUTH0_CLIENT_ID</code>, and <code className="font-mono">VITE_AUTH0_AUDIENCE</code> to your environment.
            </div>
          )}

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-danger-500/10 border border-danger-500/20 text-xs text-danger-400 leading-relaxed">
              {authError}
            </div>
          )}

          <button
            onClick={login}
            className="btn btn-primary w-full py-3 text-base font-semibold"
          >
            Continue with Auth0
          </button>

          <p className="mt-4 text-center text-xs text-gray-600">
            Google and email/password sign-in are handled by your Auth0 Universal Login.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: <KeyRound size={18} />, label: 'Scoped subkeys' },
            { icon: <Activity size={18} />, label: 'Usage analytics' },
            { icon: <Lock size={18} />, label: 'Encrypted at rest' },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2 p-3 card">
              <div className="text-primary-400">{f.icon}</div>
              <span className="text-[11px] text-gray-500 text-center">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          <ShieldCheck size={14} />
          <span>Keys are encrypted before storage and never returned in API responses.</span>
        </div>
      </div>
    </div>
  );
}
