import { LogoIcon } from '../components/Logo';
import { Compass } from 'lucide-react';

export default function NotFoundView({ go, page, navigate }: { go: (p: string) => void; page: string; navigate: (p: string) => void }) {
  return (
    <div className="min-h-screen bg-base-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6"><LogoIcon size={56} /></div>
        <Compass size={48} className="mx-auto mb-4 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-100 mb-2">404 — Page not found</h1>
        <p className="text-sm text-gray-500 mb-6">"{page}" doesn't exist in this console.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate('overview')} className="btn btn-primary">Go to Overview</button>
          <button onClick={() => go('/console')} className="btn btn-ghost">All projects</button>
        </div>
      </div>
    </div>
  );
}
