import { Button } from './kit';
import { UserX } from 'lucide-react';

export default function UserNotRegisteredError() {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning"><UserX size={24} /></div>
      <h1 className="font-heading text-xl font-bold">Account not registered</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">Your sign-in was successful, but this account isn’t registered for Lethem yet.</p>
      <Button className="mt-6" onClick={() => { window.location.href = '/'; }}>Back to home</Button>
    </div>
  );
}