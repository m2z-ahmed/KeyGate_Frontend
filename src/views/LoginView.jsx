import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from '../components/parts/Logo';

export default function LoginView() {
  const { login, authError, isConfigured } = useAuth();
  return (
    <div className='login-view'>
      <div className='login-card'>
        <div className='login-logo'>
          <LogoIcon size={48} />
        </div>
        <div className='login-head'>
          <h1 className='login-title'>Lethem Console</h1>
          <p className='login-sub'>AI access governance — sign in to continue</p>
        </div>
        {authError && (
          <div className='login-error'>
            {authError}
          </div>
        )}
        {!isConfigured && (
          <div className='login-config-warn'>
            <strong>Auth0 not configured.</strong>
            <br />
            Add <code>VITE_AUTH0_DOMAIN</code>, <code>VITE_CLIENT_ID</code>, and <code>VITE_AUTH0_AUDIENCE</code> to your environment variables.
          </div>
        )}
        <button className='btn btn-primary btn-login' onClick={login} disabled={!isConfigured}>
          Sign in with Auth0
        </button>
        <p className='login-hint'>You'll be redirected to Auth0 to authenticate.</p>
      </div>
      <div className='login-bg-orb login-bg-orb-1' />
      <div className='login-bg-orb login-bg-orb-2' />
    </div>
  );
}
