import { LogoIcon } from '../components/parts/Logo';

export default function PolicyPage({ type = 'privacy' }) {
  const titles = { privacy: 'Privacy Policy', terms: 'Terms & Conditions', refund: 'Refund & Cancellation Policy', shipping: 'Shipping & Delivery Policy' };
  return (
    <div className='policy-page'>
      <header className='landing-header'>
        <div className='landing-logo'>
          <LogoIcon size={28} />
          <span>Lethem</span>
        </div>
        <a href='/console' className='btn btn-ghost btn-sm'>← Back to Console</a>
      </header>
      <main className='policy-content'>
        <h1>{titles[type] || 'Policy'}</h1>
        <p>Please contact us for the full policy document.</p>
      </main>
    </div>
  );
}
