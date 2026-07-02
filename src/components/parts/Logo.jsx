export function LogoIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect width='30' height='30' rx='8' fill='url(#logoGrad)' />
      <path d='M8 9h4v12H8V9z' fill='white' fillOpacity='0.9' />
      <path d='M8 18h10v3H8v-3z' fill='white' fillOpacity='0.6' />
      <path d='M16 9l6 6-6 6' stroke='white' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' fill='none' opacity='0.85' />
      <defs>
        <linearGradient id='logoGrad' x1='0' y1='0' x2='30' y2='30' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#7c6bff' />
          <stop offset='1' stopColor='#a67cff' />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({ className = '' }) {
  return (
    <div className={`logo-mark ${className}`}>
      <div className='logo-icon'>
        <LogoIcon size={30} />
      </div>
      <div>
        <div className='logo-name'>Lethem</div>
        <div className='logo-sub'>AI Access Control</div>
      </div>
    </div>
  );
}
