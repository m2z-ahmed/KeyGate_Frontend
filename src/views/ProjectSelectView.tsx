import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { LogoFull } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, Trash2, Folder, ChevronRight, LogOut } from 'lucide-react';

export default function ProjectSelectView({ go }: { go: (path: string) => void }) {
  const { projects, projectSearch, setProjectSearch, filteredProjects, billing, deleteProject, projectToDelete, setProjectToDelete, deleteConfirm, setDeleteConfirm, notify, fmtDate } = useApp();
  const { logout } = useAuth();
  const [showDelete, setShowDelete] = useState(false);

  const currentPlan = billing?.plans?.find((p) => p.id === billing.currentPlan) || billing?.plans?.find((p) => p.id === 'free');
  const projectLimit = currentPlan?.limits?.projects ?? 3;
  const projectLimitLabel = projectLimit == null ? 'Unlimited' : String(projectLimit);
  const isAtLimit = projectLimit != null && projects.length >= projectLimit;

  const expectedDeleteText = projectToDelete ? `delete ${projectToDelete.slug}` : '';
  const canDelete = projectToDelete && deleteConfirm.trim() === expectedDeleteText;

  const handleDelete = async () => {
    if (!canDelete || !projectToDelete) return;
    try {
      const ps = await deleteProject();
      setShowDelete(false);
      if (!ps?.length) go('/console/new');
    } catch (e: any) { notify(e.message || 'Failed to delete project', 'error'); }
  };

  return (
    <div className="min-h-screen bg-base-950">
      {/* Header */}
      <header className="border-b border-base-800 bg-base-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <LogoFull size={28} />
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-800 border border-base-700">
              <div className="w-2 h-2 rounded-full bg-success-500" />
              <span className="text-xs font-medium text-gray-300">{currentPlan?.name || 'Free'} plan</span>
              <span className="text-xs text-gray-500">{projects.length} / {projectLimitLabel}</span>
            </div>
            <button onClick={() => go('/console/subscription')} className="btn btn-ghost text-xs hidden sm:inline-flex">Manage subscription</button>
            <button onClick={() => go('/console/new')} disabled={isAtLimit} className="btn btn-primary text-sm">
              <Plus size={16} /> New project
            </button>
            <button onClick={logout} className="btn btn-ghost" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100 mb-1">Projects Console</h1>
          <p className="text-sm text-gray-500">Create, switch, and manage isolated workspaces</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="input pl-11 py-2.5"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            placeholder="Search by name, label, or ID"
          />
        </div>

        {/* Count */}
        <div className="mb-4 text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-300">{projects.length}</span> / {projectLimitLabel} projects
        </div>

        {/* Projects grid */}
        {filteredProjects.length === 0 ? (
          <div className="card p-12 text-center">
            <Folder size={40} className="mx-auto mb-4 text-gray-600" />
            <p className="text-sm font-medium text-gray-400 mb-1">{projects.length === 0 ? 'No projects yet' : 'No matching projects'}</p>
            <p className="text-xs text-gray-500 mb-4">{projects.length === 0 ? 'Create your first project to get started' : 'Try a different search term'}</p>
            {projects.length === 0 && (
              <button onClick={() => go('/console/new')} className="btn btn-primary">
                <Plus size={16} /> Create project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => go(`/console/${p.slug}/overview`)}
                className="card p-5 text-left hover:border-primary-500/40 hover:bg-base-850 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                    <Folder size={20} />
                  </div>
                  <span className={`badge ${p.status === 'active' ? 'badge-active' : 'badge-paused'}`}>{p.status}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-100 mb-1 group-hover:text-primary-300 transition-colors">{p.name}</h3>
                <div className="text-xs text-gray-500 font-mono mb-3">{p.slug}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Created {fmtDate(p.created_at)}</span>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={(e) => { e.stopPropagation(); setProjectToDelete(p); setDeleteConfirm(''); setShowDelete(true); }}
                      className="text-gray-600 hover:text-danger-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </span>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {showDelete && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.target === e.currentTarget && setShowDelete(false)}>
          <div className="w-full max-w-md bg-base-900 border border-base-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
            <div className="px-6 py-4 border-b border-base-700">
              <h2 className="text-base font-semibold text-gray-100">Delete project</h2>
            </div>
            <div className="px-6 py-5">
              <div className="p-3 rounded-lg bg-danger-500/10 border border-danger-500/20 text-xs text-danger-400 leading-relaxed mb-4">
                This action is irreversible. All data related to this project will be deleted and issued keys will stop working.
              </div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Type <code className="font-mono text-gray-300">{expectedDeleteText}</code> to continue
              </label>
              <input
                className="input"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={expectedDeleteText}
              />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-700 bg-base-950/50">
              <button onClick={() => setShowDelete(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleDelete} disabled={!canDelete} className="btn btn-danger">Delete project permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
