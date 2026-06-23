import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { LogoFull } from '../components/Logo';
import { ArrowLeft, FolderPlus } from 'lucide-react';

export default function CreateProjectView({ go }: { go: (path: string) => void }) {
  const { createProject, notify } = useApp();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const p = await createProject(name.trim());
      if (p) { setName(''); go(`/console/${p.slug}/overview`); }
    } catch (e: any) { notify(e.message || 'Failed to create project', 'error'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-base-950">
      <header className="border-b border-base-800 bg-base-900/50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <LogoFull size={28} />
          <button onClick={() => go('/console')} className="btn btn-ghost text-sm">
            <ArrowLeft size={16} /> Back to projects
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-500/10 text-primary-400 mb-4">
            <FolderPlus size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Create a new project</h1>
          <p className="text-sm text-gray-500">Projects are isolated workspaces for your API keys and subkeys.</p>
        </div>

        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Project name</label>
          <input
            className="input py-2.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="e.g. Acme Production"
            autoFocus
          />
          <p className="mt-3 text-xs text-gray-500">
            A unique project ID will be auto-generated (e.g. <code className="font-mono text-gray-400">project-m2zpicks</code>).
          </p>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || busy}
            className="btn btn-primary w-full mt-5 py-2.5"
          >
            {busy ? 'Creating...' : 'Create project'}
          </button>
        </div>
      </div>
    </div>
  );
}
