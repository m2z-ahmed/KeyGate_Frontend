import { Button } from '../components/kit';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundView({ go, page, navigate }) {
  return (
    <div className="dark flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <Compass size={26} />
      </div>
      <h1 className="font-heading text-3xl font-bold tracking-tight">404 — Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        “{page}” doesn’t exist in this console.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {navigate && <Button variant="outline" onClick={() => navigate('overview')}><ArrowLeft size={15} /> Go to Overview</Button>}
        <Button variant="ghost" onClick={() => go('/console')}><Home size={15} /> All projects</Button>
      </div>
    </div>
  );
}