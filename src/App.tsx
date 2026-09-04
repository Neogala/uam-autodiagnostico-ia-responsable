/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  UAMUnit,
  EvaluationReportState,
  UAM_DECALOGO_PRINCIPLES,
  calculatePrincipleResult,
  PrincipleScoreResult
} from './types';
import { Header } from './components/Header';
import { ProjectMetadataBar } from './components/ProjectMetadataBar';
import { ProjectManagerPanel } from './components/ProjectManagerPanel';
import { QuestionnaireSection } from './components/QuestionnaireSection';
import { ResultsTableSection } from './components/ResultsTableSection';
import { RadarChartSection } from './components/RadarChartSection';
import { DynamicAnalysisSection } from './components/DynamicAnalysisSection';
import { ExportModal } from './components/ExportModal';
import { PrintableReportView } from './components/PrintableReportView';
import { Footer } from './components/Footer';
import { GlobalIndexBar } from './components/GlobalIndexBar';
import { StepNav, StepId } from './components/StepNav';
import { triggerOfficialPrintOrDownload } from './utils/printReport';
import {
  ProjectIndexEntry,
  generateProjectId,
  listProjects,
  saveProject,
  loadProject,
  deleteProject,
  duplicateProject,
  getCurrentProjectId,
  setCurrentProjectId
} from './utils/storage';

function buildEmptyState(unit: UAMUnit = 'Azcapotzalco'): EvaluationReportState {
  return {
    projectTitle: '',
    unit,
    division: '',
    evaluatorName: '',
    role: 'Docente',
    projectDescription: '',
    scores: {
      1: null, 2: null, 3: null, 4: null, 5: null,
      6: null, 7: null, 8: null, 9: null, 10: null
    },
    completedSafeguards: {},
    timestamp: new Date().toISOString()
  };
}

// Pure (no localStorage writes) so it stays safe under React StrictMode's
// double-invoke of state initializers in development.
function initializeSession(): { id: string; state: EvaluationReportState } {
  const existingId = getCurrentProjectId();
  if (existingId) {
    const loaded = loadProject(existingId);
    if (loaded) {
      return { id: existingId, state: loaded };
    }
  }
  return { id: generateProjectId(), state: buildEmptyState() };
}

export default function App() {
  const [session] = useState(initializeSession);

  const [currentProjectId, setCurrentProjectIdState] = useState<string>(session.id);
  const [state, setState] = useState<EvaluationReportState>(session.state);
  const [currentStep, setCurrentStep] = useState<StepId>('datos');
  const [projects, setProjects] = useState<ProjectIndexEntry[]>(() => listProjects());

  // UI Modals
  const [isExportOpen, setIsExportOpen] = useState(false);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist which project id is "current" once on mount.
  useEffect(() => {
    setCurrentProjectId(session.id);
  }, [session.id]);

  // Autosave (debounced) whenever the working state changes.
  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveProject(currentProjectId, state);
      setProjects(listProjects());
    }, 400);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [state, currentProjectId]);

  // Compute calculated results for all 10 principles
  const results: PrincipleScoreResult[] = useMemo(() => {
    return UAM_DECALOGO_PRINCIPLES.map((principle) => {
      const raw = state.scores[principle.id] ?? null;
      return calculatePrincipleResult(principle, raw);
    });
  }, [state.scores]);

  const answeredCount = results.filter(r => r.riskClass !== 'unscored').length;

  // Global score (average of scaled scores 1..10 among answered principles only)
  const globalScore = useMemo(() => {
    const answered = results.filter(r => r.scaledScore != null);
    if (answered.length === 0) return 0;
    const sum = answered.reduce((acc, curr) => acc + (curr.scaledScore as number), 0);
    return sum / answered.length;
  }, [results]);

  const completedSteps: StepId[] = useMemo(() => {
    const done: StepId[] = [];
    if (state.projectTitle.trim() !== '') done.push('datos');
    if (answeredCount === 10) done.push('autoevaluacion');
    if (answeredCount > 0) done.push('resultados');
    return done;
  }, [state.projectTitle, answeredCount]);

  // Handlers
  const handleScoreChange = (principleId: number, newScore: number) => {
    setState(prev => ({ ...prev, scores: { ...prev.scores, [principleId]: newScore } }));
  };

  const handleSetAllScores = (score: number) => {
    const newScores: Record<number, number | null> = {};
    UAM_DECALOGO_PRINCIPLES.forEach(p => { newScores[p.id] = score; });
    setState(prev => ({ ...prev, scores: newScores }));

    if (score === 5) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleResetScores = () => {
    const newScores: Record<number, number | null> = {};
    UAM_DECALOGO_PRINCIPLES.forEach(p => { newScores[p.id] = null; });
    setState(prev => ({ ...prev, scores: newScores }));
  };

  const handleToggleSafeguard = (principleId: number) => {
    setState(prev => ({
      ...prev,
      completedSafeguards: { ...prev.completedSafeguards, [principleId]: !prev.completedSafeguards[principleId] }
    }));
  };

  const startNewProject = () => {
    const newId = generateProjectId();
    const newState = buildEmptyState(state.unit);
    saveProject(newId, newState);
    setCurrentProjectId(newId);
    setCurrentProjectIdState(newId);
    setState(newState);
    setProjects(listProjects());
    setCurrentStep('datos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewProject = () => {
    const hasData = state.projectTitle.trim() !== '' || answeredCount > 0;
    if (!hasData || window.confirm('¿Deseas iniciar un Nuevo Registro de Proyecto? El registro actual ya está guardado y podrás retomarlo desde "Mis registros guardados".')) {
      startNewProject();
    }
  };

  const handleOpenProject = (id: string) => {
    const loaded = loadProject(id);
    if (!loaded) return;
    setCurrentProjectId(id);
    setCurrentProjectIdState(id);
    setState(loaded);
    setCurrentStep('datos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicateProject = (id: string) => {
    const newId = duplicateProject(id);
    setProjects(listProjects());
    if (newId) handleOpenProject(newId);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    const remaining = listProjects();
    setProjects(remaining);
    if (id === currentProjectId) {
      startNewProject();
    }
  };

  const handlePrint = () => {
    triggerOfficialPrintOrDownload(state, results, globalScore);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-col antialiased">

      {/* Top Navbar */}
      <Header
        activeUnit={state.unit}
        onUnitChange={(unit: UAMUnit) => setState(prev => ({ ...prev, unit }))}
        onNewProject={handleNewProject}
      />

      {/* Sticky global index + progress bar, visible across all steps */}
      <div className="print:hidden">
        <GlobalIndexBar results={results} globalScore={globalScore} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:hidden">

        <StepNav currentStep={currentStep} onStepChange={setCurrentStep} completedSteps={completedSteps} />

        {/* Floating Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-3 rounded-xl shadow-sm mb-8 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Autodiagnóstico Institucional UAM</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-amber-300 hidden sm:inline">10 Principios del Decálogo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-quick-new-project"
              onClick={handleNewProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-lg transition border border-slate-700 cursor-pointer"
              title="Iniciar nuevo proyecto"
            >
              <span>+ Nuevo Registro</span>
            </button>

            <button
              id="btn-open-export-modal"
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition shadow-xs cursor-pointer"
            >
              <span>Generar Dictamen y Entregables</span>
            </button>

            <button
              id="btn-quick-print"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 cursor-pointer"
            >
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Step 1: Datos del proyecto */}
        {currentStep === 'datos' && (
          <>
            <ProjectMetadataBar
              state={state}
              onChangeState={(updates) => setState(prev => ({ ...prev, ...updates }))}
              onNewProject={handleNewProject}
              onResetScores={handleResetScores}
            />
            <ProjectManagerPanel
              projects={projects}
              currentProjectId={currentProjectId}
              onOpen={handleOpenProject}
              onDuplicate={handleDuplicateProject}
              onDelete={handleDeleteProject}
            />
          </>
        )}

        {/* Step 2: Autoevaluación */}
        {currentStep === 'autoevaluacion' && (
          <QuestionnaireSection
            principles={UAM_DECALOGO_PRINCIPLES}
            scores={state.scores}
            onScoreChange={handleScoreChange}
            onSetAllScores={handleSetAllScores}
          />
        )}

        {/* Step 3: Resultados */}
        {currentStep === 'resultados' && (
          <>
            <ResultsTableSection results={results} globalScore={globalScore} />
            <RadarChartSection results={results} />
          </>
        )}

        {/* Step 4: Dictamen y entregables */}
        {currentStep === 'dictamen' && (
          <DynamicAnalysisSection
            results={results}
            completedSafeguards={state.completedSafeguards}
            onToggleSafeguard={handleToggleSafeguard}
            onPrintReport={handlePrint}
          />
        )}

      </main>

      {/* Printable official letterhead layout for print/PDF */}
      <PrintableReportView
        state={state}
        results={results}
        globalScore={globalScore}
      />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        state={state}
        results={results}
        globalScore={globalScore}
        onPrint={handlePrint}
      />

    </div>
  );
}
