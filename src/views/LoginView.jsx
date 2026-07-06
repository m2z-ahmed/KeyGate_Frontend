import { LogoIcon, LogoFull } from '../components/parts/Logo';
import { useAuth } from '../contexts/AuthContext';

export default function LoginView() {
  const { login, authError, isConfigured } = useAuth();

  return (
    <div className='auth-page-split'>
      {/* Left Branding Panel */}
      <div className='auth-branding'>
        <div className='auth-branding-bg'>
          <div className='auth-radial-glow' />
          <div className='auth-decorative-grid' />
          <div className='auth-decorative-ring' />
          <div className='auth-particles'>
            {[...Array(30)].map((_, i) => (
              <div key={i} className='auth-particle' style={{ '--delay': `${Math.random() * 8}s`, '--x': `${Math.random() * 100}%`, '--y': `${Math.random() * 100}%`, '--size': `${Math.random() * 3 + 1}px`, '--duration': `${Math.random() * 4 + 4}s` }} />
            ))}
          </div>
        </div>
        <div className='auth-branding-content'>
          <div className='auth-branding-logo'>
            <LogoIcon size={32} />
            <span className='auth-branding-name'>Lethem</span>
          </div>
          <div className='auth-branding-label'>API ACCESS MANAGER</div>
          <h2 className='auth-branding-headline'>
            Secure access. Complete control. Total <span className='auth-highlight'>visibility</span>.
          </h2>
          <p className='auth-branding-desc'>
            Manage provider master keys, scoped subkeys, quota controls, and gateway logs from a protected console.
          </p>
          <div className='auth-branding-quote'>
            <p>"Security is a process, not a product."</p>
            <cite>— Bruce Schneier</cite>
          </div>
          <div className='auth-features'>
            <div className='auth-feature-card'>
              <div className='auth-feature-icon'>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/>
                </svg>
              </div>
              <div className='auth-feature-text'>
                <strong>Secure</strong>
                <span>Your master keys never leave the gateway</span>
              </div>
            </div>
            <div className='auth-feature-card'>
              <div className='auth-feature-icon'>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M3 3v18h18'/>
                  <path d='M18.7 8l-5.1 5.2-2.8-2.7L7 14.3'/>
                </svg>
              </div>
              <div className='auth-feature-text'>
                <strong>Monitor</strong>
                <span>Real-time request logging and analytics</span>
              </div>
            </div>
            <div className='auth-feature-card'>
              <div className='auth-feature-icon'>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <circle cx='12' cy='12' r='3'/>
                  <path d='M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83'/>
                </svg>
              </div>
              <div className='auth-feature-text'>
                <strong>Control</strong>
                <span>Fine-grained quotas and rate limits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className='auth-login-panel'>
        <div className='auth-card-modern'>
          <div className='auth-card-logo'>
            <LogoFull size={28} showSub={false} />
          </div>
          <div className='auth-card-badge'>SECURE AI ACCESS GATEWAY</div>
          <h1 className='auth-card-title'>Welcome back</h1>
          <p className='auth-card-subtitle'>Sign in to continue to Lethem</p>
          {!isConfigured && (
            <div className='auth-warning-modern'>
              Auth0 is not configured. Add VITE_AUTH0_DOMAIN, VITE_CLIENT_ID, and VITE_AUTH0_AUDIENCE in Vercel.
            </div>
          )}
          {authError && <div className='auth-warning-modern'>{authError}</div>}
          <button className='auth-button-modern' onClick={login}>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4'/>
              <polyline points='10 17 15 12 10 7'/>
              <line x1='15' y1='12' x2='3' y2='12'/>
            </svg>
            Continue with Auth0
          </button>
          <p className='auth-card-note'>Google and email/password sign-in are handled by your Auth0 Universal Login.</p>
        </div>
        <div className='auth-footer-badge'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/>
          </svg>
          Enterprise-grade security &bull; Built for developers
        </div>
      </div>
    </div>
  );
}
