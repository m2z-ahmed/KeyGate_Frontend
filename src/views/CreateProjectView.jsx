import { useState } from 'react';
import { useLethem } from '../contexts/LethemContext';
import { Button, Input, Label, PageHeader, Toast } from '../components/kit';
import { FolderPlus, ArrowRight } from 'lucide-react';

export default function CreateProjectView({ go }) {
  const { createProject, notif } = useLethem();
  const [projectName, setProjectName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const p = await createProject(projectName);
      if (p) {
        setProjectName('');
        go('/console');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl">
        <PageHeader
          title="Create project"
          subtitle="Organize provider keys, subkeys, and team access inside an isolated project."
        />

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Label>Project name</Label>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && projectName.trim()) handleCreate(); }}
            placeholder="Acme Production"
            autoFocus
          />
          <p className="mt-3 text-xs text-muted-foreground">
            A project ID is auto-generated (for example: <span className="font-mono text-primary/80">project-m2zpicks</span>).
          </p>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleCreate} disabled={!projectName.trim() || saving} size="lg">
              <FolderPlus size={16} /> {saving ? 'Creating…' : 'Create project'}
            </Button>
          </div>
        </div>
      </div>
      <Toast notif={notif} />
    </div>
  );
}