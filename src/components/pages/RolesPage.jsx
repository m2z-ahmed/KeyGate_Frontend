import { Card, Badge } from '../kit';
import { ShieldCheck } from 'lucide-react';
import { ROLES } from '../../lib/roles';

export default function RolesPage() {
  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Roles</h1><p className="mt-1 text-sm text-muted-foreground">Use consistent Owner, Admin, Developer, and Viewer permissions when inviting or editing members.</p></div>

      <div className="grid gap-4 md:grid-cols-2">
        {ROLES.map((role) => (
          <Card key={role.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><ShieldCheck size={16} /></div><h3 className="font-heading text-base font-bold">{role.label}</h3></div>
              <Badge tone="neutral" className="font-mono">{role.id}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{role.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {role.permissions.map((permission) => <span key={permission} className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">{permission}</span>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}