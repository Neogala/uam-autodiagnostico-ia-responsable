import React from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FileText,
  Printer,
  Code2,
  FileCheck2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  EvaluationReportState,
  PrincipleScoreResult,
  generateMarkdownReport,
  generateStandaloneRadarHtml
} from '../types';
import { generateOfficialPrintableReport, triggerOfficialPrintOrDownload } from '../utils/printReport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: EvaluationReportState;
  results: PrincipleScoreResult[];
  globalScore: number;
  onPrint: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  state,
  results,
  globalScore,
  onPrint
}) => {
  const [copiedMd, setCopiedMd] = React.useState(false);
  const [copiedHtml, setCopiedHtml] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  if (!isOpen) return null;

  const markdownContent = generateMarkdownReport(
    state.projectTitle,
    state.unit,
    state.division,
    state.evaluatorName,
    state.role,
    results,
    globalScore,
    {
      perfilProyecto: state.perfilProyecto,
      autovaloraciones: state.autovaloraciones,
      notasPorPrincipio: state.notasPorPrincipio
    }
  );

  const htmlContent = generateStandaloneRadarHtml(
    state.projectTitle,
    results,
    globalScore
  );

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uam_dictamen_etica_ia_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadOfficialHtml = () => {
    const fullHtml = generateOfficialPrintableReport(state, results, globalScore);
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uam_dictamen_imprimible_pdf_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRadarHtml = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uam_radar_chart_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch (err) {
      console.error('Failed to copy html:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/70 backdrop-blur-xs">
      <div className="bg-white border border-line rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-surface-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ink-900 text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-900">
                Exportar Reporte y Entregables UAM
              </h3>
              <p className="text-xs text-ink-500">
                Dictamen estructurado: Tabla de resultados, Código Radar Chart HTML/JS y Recomendaciones dinámicas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900 p-1 rounded-lg hover:bg-line transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="p-4 bg-surface-2 border-b border-line flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-surface-2 text-ink-700 rounded-lg border border-line shadow-2xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-sem-optimo" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? '¡Copiado!' : 'Copiar Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadOfficialHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-surface-2 text-ink-700 rounded-lg border border-line shadow-2xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              title="Descargar dictamen oficial en HTML imprimible con membrete y estilos"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-sem-optimo" />
              <span>Descargar Dictamen HTML/PDF</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-surface-2 text-ink-700 rounded-lg border border-line shadow-2xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Download className="w-3.5 h-3.5 text-brand-ink" />
              <span>Descargar .md</span>
            </button>

            <button
              onClick={handleDownloadRadarHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-surface-2 text-ink-700 rounded-lg border border-line shadow-2xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Radar .html</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              triggerOfficialPrintOrDownload(state, results, globalScore);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-brand hover:bg-brand-hover text-white rounded-lg transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>

        {/* Advanced: embeddable radar chart code / iframe preview */}
        <div className="border-b border-line">
          <button
            type="button"
            onClick={() => setShowAdvanced(prev => !prev)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-semibold text-ink-700 hover:text-ink-900 bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-ink-500" />
              Exportar / insertar (avanzado): código HTML/JS del radar e iframe
            </span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="p-4 space-y-4 bg-white">
              <div className="flex items-center justify-between bg-ink-900 text-white px-4 py-2 rounded-t-lg text-xs">
                <span className="font-mono font-medium flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-white/70" />
                  radar_chart_uam_standalone.html (Chart.js v4)
                </span>
                <button
                  onClick={handleCopyHtml}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHtml ? '¡Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>
              <pre className="bg-ink-900 text-white/90 p-4 rounded-b-lg text-xs font-mono overflow-x-auto max-h-[280px] border border-ink-700 leading-relaxed select-all -mt-4">
                {htmlContent}
              </pre>

              <div>
                <p className="text-xs text-ink-500 mb-2">
                  <strong>Vista previa embebida (iframe):</strong> ejecución aislada del archivo HTML autónomo.
                </p>
                <div className="w-full h-[360px] rounded-xl border border-line overflow-hidden shadow-inner bg-ink-900">
                  <iframe
                    title="Radar Chart Standalone Preview"
                    srcDoc={htmlContent}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Markdown preview content */}
        <div className="flex-1 overflow-y-auto p-4 bg-ink-900 font-mono text-xs text-white/90 leading-relaxed select-all">
          <pre className="whitespace-pre-wrap">{markdownContent}</pre>
        </div>

      </div>
    </div>
  );
};
