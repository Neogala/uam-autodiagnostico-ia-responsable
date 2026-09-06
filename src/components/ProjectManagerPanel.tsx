import React from 'react';
import { FolderOpen, Copy, Trash2, ChevronDown, ChevronUp, FileStack } from 'lucide-react';
import { ProjectIndexEntry } from '../utils/storage';

interface ProjectManagerPanelProps {
  projects: ProjectIndexEntry[];
  currentProjectId: string;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectManagerPanel: React.FC<ProjectManagerPanelProps> = ({
  projects,
  currentProjectId,
  onOpen,
  onDuplicate,
  onDelete
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`¿Borrar el registro guardado "${title}"? Esta acción no se puede deshacer.`)) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white border border-line rounded-xl shadow-xs mb-6 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between gap-2 px-4 sm:px-5 py-3.5 text-sm font-bold text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <span className="flex items-center gap-2">
          <FileStack className="w-4 h-4 text-brand-ink" />
          Mis registros guardados ({projects.length})
        </span>
        {expanded ? <ChevronUp className="w-4 h-4 text-ink-500" /> : <ChevronDown className="w-4 h-4 text-ink-500" />}
      </button>

      {expanded && (
        <div className="border-t border-line p-4 sm:p-5">
          {projects.length === 0 ? (
            <p className="text-xs text-ink-500">Aún no hay registros guardados. Se guardan automáticamente conforme escribes.</p>
          ) : (
            <ul className="divide-y divide-line">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold truncate ${p.id === currentProjectId ? 'text-brand-ink' : 'text-ink-900'}`}>
                      {p.title} {p.id === currentProjectId && <span className="text-[10px] font-bold text-brand-ink ml-1">(actual)</span>}
                    </div>
                    <div className="text-[11px] text-ink-500">
                      {new Date(p.timestamp).toLocaleString('es-MX')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onOpen(p.id)}
                      disabled={p.id === currentProjectId}
                      className="p-1.5 rounded text-ink-500 hover:text-brand-ink hover:bg-brand-tint transition disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      title="Abrir este registro"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicate(p.id)}
                      className="p-1.5 rounded text-ink-500 hover:text-blue-700 hover:bg-blue-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      title="Duplicar este registro"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-1.5 rounded text-ink-500 hover:text-sem-critico hover:bg-sem-critico-bg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      title="Borrar este registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
