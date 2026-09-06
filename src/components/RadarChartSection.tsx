import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Info, LayoutGrid, Layers } from 'lucide-react';
import { PrincipleScoreResult, RespuestaCualitativa } from '../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Chart.js renders to <canvas>, so it needs literal hex values matching the
// design tokens in src/index.css (Tailwind classes don't reach canvas draws).
const HEX = {
  neutralLine: '#3A414A', // ink-700
  grid: '#E4E8EC',        // line
  tickText: '#6B7480',    // ink-500
  pointLabelText: '#16181D', // ink-900
  legendText: '#3A414A',  // ink-700
  unscored: '#9AA3AD',
  critico: '#B00710',
  moderado: '#B26A00',
  optimo: '#1E7D34'
};

interface RadarChartSectionProps {
  results: PrincipleScoreResult[];
  respuestasCualitativas: Record<string, RespuestaCualitativa>;
}

interface SubdimensionAxis {
  key: string;
  label: string;
  principleName: string;
  /** % de respuestas "Sí" entre las preguntas contestadas de la subdimensión, 0-10. */
  value: number;
  answeredCount: number;
  totalCount: number;
}

export const RadarChartSection: React.FC<RadarChartSectionProps> = ({
  results,
  respuestasCualitativas
}) => {
  const [hoveredPrinciple, setHoveredPrinciple] = React.useState<PrincipleScoreResult | null>(null);
  const [viewMode, setViewMode] = React.useState<'principio' | 'subdimension'>('principio');

  const subdimensionAxes: SubdimensionAxis[] = React.useMemo(() => {
    const axes: SubdimensionAxis[] = [];
    results.forEach(r => {
      (r.principle.subdimensiones || []).forEach(sub => {
        const answered = sub.preguntas
          .map(p => respuestasCualitativas[p.id]?.valor)
          .filter((v): v is string => !!v);
        const afirmativas = answered.filter(v => v === 'Sí').length;
        const value = answered.length > 0 ? (afirmativas / answered.length) * 10 : 0;
        axes.push({
          key: sub.id,
          label: sub.nombre,
          principleName: r.principle.name,
          value,
          answeredCount: answered.length,
          totalCount: sub.preguntas.length
        });
      });
    });
    return axes;
  }, [results, respuestasCualitativas]);

  const hasSubdimensiones = subdimensionAxes.length > 0;
  const effectiveMode = hasSubdimensiones ? viewMode : 'principio';

  const labels = effectiveMode === 'principio'
    ? results.map(r => r.principle.shortName)
    : subdimensionAxes.map(a => a.label);
  const dataValues = effectiveMode === 'principio'
    ? results.map(r => r.scaledScore ?? 0)
    : subdimensionAxes.map(a => a.value);

  const chartData: ChartData<'radar'> = {
    labels,
    datasets: [
      {
        label: effectiveMode === 'principio'
          ? 'Alineación Ética UAM (Escala 1 a 10)'
          : '% de respuestas afirmativas por subdimensión (escala 0 a 10)',
        data: dataValues,
        backgroundColor: 'rgba(58, 65, 74, 0.15)', // ink-700 tint (neutral, not brand red)
        borderColor: HEX.neutralLine,
        borderWidth: 2.5,
        pointBackgroundColor: dataValues.map(v => v === 0 ? HEX.unscored : v >= 9 ? HEX.optimo : (v >= 6 ? HEX.moderado : HEX.critico)),
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: HEX.neutralLine,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
      }
    ]
  };

  const chartOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          color: HEX.tickText,
          backdropColor: 'transparent',
          font: { size: 10, weight: 600 }
        },
        grid: {
          color: HEX.grid,
        },
        angleLines: {
          color: HEX.grid,
        },
        pointLabels: {
          color: HEX.pointLabelText,
          font: {
            size: 11,
            weight: 600,
            family: 'system-ui, sans-serif'
          },
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: HEX.legendText,
          font: { size: 12, weight: 600 }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => ` Puntaje: ${context.formattedValue} / 10`,
          afterBody: (tooltipItems) => {
            if (tooltipItems.length === 0) return [];
            const index = tooltipItems[0].dataIndex;
            if (effectiveMode === 'principio') {
              const res = results[index];
              return [
                `Estado: ${res.riskLevel}`,
                `Recomendación: ${res.technicalRecommendation || 'Sin evaluar todavía.'}`
              ];
            }
            const axis = subdimensionAxes[index];
            return [
              `Principio: ${axis.principleName}`,
              `Preguntas respondidas: ${axis.answeredCount} / ${axis.totalCount}`
            ];
          }
        }
      }
    },
    onHover: (event, activeElements) => {
      if (effectiveMode !== 'principio') return;
      if (activeElements && activeElements.length > 0) {
        const index = activeElements[0].index;
        setHoveredPrinciple(results[index]);
      }
    }
  };

  React.useEffect(() => {
    if (effectiveMode !== 'principio') setHoveredPrinciple(null);
  }, [effectiveMode]);

  return (
    <section id="uam-radar-chart-section" className="bg-white border border-line rounded-xl shadow-xs p-5 sm:p-6 mb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-ink-900">
            Gráfico Radial de Alineación Ética
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            {effectiveMode === 'principio'
              ? 'Visualización de los 10 principios del Decálogo UAM. Pasa el cursor sobre un punto para ver el diagnóstico y la recomendación correspondiente.'
              : 'Vista granular: cada eje es una subdimensión (solo disponible en los principios piloto). El valor es el % de respuestas afirmativas registradas en el cuestionario.'}
          </p>
        </div>

        {hasSubdimensiones && (
          <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-line text-xs shrink-0">
            <button
              onClick={() => setViewMode('principio')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                viewMode === 'principio' ? 'bg-white text-ink-900 shadow-2xs' : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Por principio</span>
            </button>
            <button
              onClick={() => setViewMode('subdimension')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                viewMode === 'subdimension' ? 'bg-white text-ink-900 shadow-2xs' : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Por subdimensión</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="relative h-[430px] sm:h-[480px] w-full bg-surface-2/50 rounded-xl p-3 border border-line flex items-center justify-center">
          <Radar data={chartData} options={chartOptions} />
        </div>

        {/* Dynamic Hover / Selection Feedback Card */}
        <div className="bg-ink-900 text-white rounded-xl p-4 border border-ink-700 shadow-sm transition-all duration-200">
          {hoveredPrinciple ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-700 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{
                    backgroundColor: hoveredPrinciple.scaledScore == null ? HEX.unscored : hoveredPrinciple.scaledScore >= 9 ? HEX.optimo : (hoveredPrinciple.scaledScore >= 6 ? HEX.moderado : HEX.critico)
                  }}></span>
                  <h4 className="text-sm font-bold text-white">
                    {hoveredPrinciple.principle.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
                    {hoveredPrinciple.scaledScore != null ? `${hoveredPrinciple.scaledScore} / 10` : 'Sin evaluar'}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    hoveredPrinciple.riskClass === 'optimal'
                      ? 'bg-sem-optimo/20 text-white border-sem-optimo/50'
                      : hoveredPrinciple.riskClass === 'moderate'
                      ? 'bg-sem-moderado/20 text-white border-sem-moderado/50'
                      : hoveredPrinciple.riskClass === 'critical'
                      ? 'bg-sem-critico/20 text-white border-sem-critico/50'
                      : 'bg-white/10 text-white/80 border-white/20'
                  }`}>
                    {hoveredPrinciple.riskLevel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/60 font-semibold block mb-0.5">Diagnóstico detectado:</span>
                  <p className="text-white/90">{hoveredPrinciple.diagnostic}</p>
                </div>
                <div>
                  <span className="text-white/60 font-semibold block mb-0.5">Recomendación técnica inmediata:</span>
                  <p className="text-white/90">{hoveredPrinciple.technicalRecommendation || 'Disponible una vez que califiques este principio.'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-xs text-white/80 py-1">
              <Info className="w-4 h-4 text-white/60 shrink-0" />
              <span>
                <strong>Tip interactivo:</strong> Pasa el cursor sobre cualquiera de los 10 puntos del gráfico radial para desplegar en vivo el diagnóstico y la recomendación técnica correspondiente.
              </span>
            </div>
          )}
        </div>
      </div>

    </section>
  );
};
