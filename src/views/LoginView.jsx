import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from '../components/parts/Logo';
import { Button } from '../components/kit';
import { ShieldCheck, KeyRound, Activity, ArrowRight, AlertTriangle } from 'lucide-react';

export default function LoginView() {
  const { login, authError, isConfigured } = useAuth();

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden border-r border-border bg-card lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.04]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-info/10 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <LogoIcon size={34} />
            <div>
              <div className="font-heading text-lg font-bold">Lethem</div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">API access manager</div>
            </div>
          </div>

          <div className="relative max-w-md">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Secure AI access gateway
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-gradient">
              Share API access without sharing your real keys.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Manage provider master keys, scoped subkeys, quota controls, and gateway logs from a protected console.
            </p>
            <div className="mt-8 space-y-3">
              {[
                { icon: KeyRound, text: 'Scoped, revocable subkeys per team or customer' },
                { icon: ShieldCheck, text: 'Master keys encrypted at rest, never exposed' },
                { icon: Activity, text: 'Full request logs, analytics & abuse detection' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><f.icon size={15} /></div>
                  <span className="text-muted-foreground">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative text-xs text-muted-foreground/60">© {new Date().getFullYear()} Lethem. All rights reserved.</div>
        </div>

        {/* Auth panel */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <LogoIcon size={28} />
              <span className="font-heading text-lg font-bold">Lethem</span>
            </div>

            <h2 className="font-heading text-2xl font-bold tracking-tight">Sign in to Lethem</h2>
            <p className="mt-2 text-sm text-muted-foreground">Continue to your secure API access console.</p>

            <div className="mt-8 space-y-3">
              {!isConfigured && (
                <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  <span>Auth0 is not configured. Set <code className="font-mono">VITE_AUTH0_DOMAIN</code>, <code className="font-mono">VITE_CLIENT_ID</code>, and <code className="font-mono">VITE_AUTH0_AUDIENCE</code> in your environment.</span>
                </div>
              )}
              {authError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
              <Button onClick={login} size="lg" className="w-full">
                Continue with Auth0 <ArrowRight size={16} />
              </Button>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Google and email/password sign-in are handled by your Auth0 Universal Login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}