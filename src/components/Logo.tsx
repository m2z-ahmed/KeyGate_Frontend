import { ShieldCheck } from 'lucide-react';

export function LogoIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 ${className}`}
      style={{ width: size, height: size }}
    >
      <ShieldCheck size={size * 0.6} className="text-base-950" strokeWidth={2.5} />
    </div>
  );
}

export function LogoFull({ size = 28, showSub = true }: { size?: number; showSub?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={size} />
      <div>
        <div className="text-base font-semibold text-gray-100 leading-none" style={{ fontSize: size * 0.6 }}>
          KeyGate
        </div>
        {showSub && (
          <div className="text-[10px] text-gray-500 leading-none mt-0.5 tracking-wide uppercase">
            API Access Manager
          </div>
        )}
      </div>
    </div>
  );
}
