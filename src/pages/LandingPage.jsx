import { LogoIcon } from '../components/parts/Logo';

export default function LandingPage() {
  return (
    <div className='landing-page'>
      <header className='landing-header'>
        <div className='landing-logo'>
          <LogoIcon size={32} />
          <span>Lethem</span>
        </div>
        <a href='/console' className='btn btn-primary'>Open Console</a>
      </header>
      <main className='landing-hero'>
        <h1>AI access governance for teams</h1>
        <p>Issue scoped API keys, enforce quota limits, and monitor every LLM call — from one gateway.</p>
        <a href='/console' className='btn btn-primary btn-lg'>Get started →</a>
      </main>
    </div>
  );
}
