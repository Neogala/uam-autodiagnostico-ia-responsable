import { EvaluationReportState } from '../types';

const INDEX_KEY = 'uam_autodx_projects_index_v1';
const PROJECT_KEY_PREFIX = 'uam_autodx_project_v1_';
const CURRENT_ID_KEY = 'uam_autodx_current_project_id_v1';

export interface ProjectIndexEntry {
  id: string;
  title: string;
  timestamp: string;
}

function isStorageAvailable(): boolean {
  try {
    const testKey = '__uam_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function listProjects(): ProjectIndexEntry[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a: ProjectIndexEntry, b: ProjectIndexEntry) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch {
    return [];
  }
}

function writeIndex(entries: ProjectIndexEntry[]): void {
  try {
    window.localStorage.setItem(INDEX_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable or full — app continues working in memory only.
  }
}

export function saveProject(id: string, state: EvaluationReportState): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(PROJECT_KEY_PREFIX + id, JSON.stringify(state));
    const entries = listProjects().filter(e => e.id !== id);
    entries.push({
      id,
      title: state.projectTitle.trim() || 'Proyecto sin título',
      timestamp: state.timestamp
    });
    writeIndex(entries);
  } catch {
    // localStorage unavailable or full — app continues working in memory only.
  }
}

export function loadProject(id: string): EvaluationReportState | null {
  if (!isStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(PROJECT_KEY_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as EvaluationReportState;
  } catch {
    return null;
  }
}

export function deleteProject(id: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(PROJECT_KEY_PREFIX + id);
    writeIndex(listProjects().filter(e => e.id !== id));
  } catch {
    // ignore
  }
}

export function duplicateProject(id: string): string | null {
  const original = loadProject(id);
  if (!original) return null;
  const newId = generateProjectId();
  const copy: EvaluationReportState = {
    ...original,
    projectTitle: `${original.projectTitle || 'Proyecto'} (copia)`,
    timestamp: new Date().toISOString()
  };
  saveProject(newId, copy);
  return newId;
}

export function getCurrentProjectId(): string | null {
  if (!isStorageAvailable()) return null;
  try {
    return window.localStorage.getItem(CURRENT_ID_KEY);
  } catch {
    return null;
  }
}

export function setCurrentProjectId(id: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(CURRENT_ID_KEY, id);
  } catch {
    // ignore
  }
}
