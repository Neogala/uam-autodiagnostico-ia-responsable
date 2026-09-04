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
import { Info } from 'lucide-react';
import { PrincipleScoreResult } from '../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartSectionProps {
  results: PrincipleScoreResult[];
}

export const RadarChartSection: React.FC<RadarChartSectionProps> = ({
  results
}) => {
  const [hoveredPrinciple, setHoveredPrinciple] = React.useState<PrincipleScoreResult | null>(null);

  const labels = results.map(r => r.principle.shortName);
  const dataValues = results.map(r => r.scaledScore ?? 0);

  const chartData: ChartData<'radar'> = {
    labels,
    datasets: [
      {
        label: 'Alineación Ética UAM (Escala 1 a 10)',
        data: dataValues,
        backgroundColor: 'rgba(217, 119, 6, 0.25)', // Amber-600 with opacity
        borderColor: '#d97706', // UAM Amber accent
        borderWidth: 2.5,
        pointBackgroundColor: dataValues.map(v => v === 0 ? '#94a3b8' : v >= 9 ? '#10b981' : (v >= 6 ? '#f59e0b' : '#ef4444')),
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#d97706',
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
          color: '#64748b',
          backdropColor: 'transparent',
          font: { size: 10, weight: 600 }
        },
        grid: {
          color: '#e2e8f0',
        },
        angleLines: {
          color: '#cbd5e1',
        },
        pointLabels: {
          color: '#1e293b',
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
          color: '#334155',
          font: { size: 12, weight: 600 }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => ` Puntaje: ${context.formattedValue} / 10`,
          afterBody: (tooltipItems) => {
            if (tooltipItems.length > 0) {
              const index = tooltipItems[0].dataIndex;
              const res = results[index];
              return [
                `Estado: ${res.riskLevel}`,
                `Recomendación: ${res.technicalRecommendation || 'Sin evaluar todavía.'}`
              ];
            }
            return [];
          }
        }
      }
    },
    onHover: (event, activeElements) => {
      if (activeElements && activeElements.length > 0) {
        const index = activeElements[0].index;
        setHoveredPrinciple(results[index]);
      }
    }
  };

  return (
    <section id="uam-radar-chart-section" className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 sm:p-6 mb-8">

      {/* Header */}
      <div className="border-b border-slate-200 pb-4 mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Gráfico Radial de Alineación Ética
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Visualización de los 10 principios del Decálogo UAM. Pasa el cursor sobre un punto para ver el diagnóstico y la recomendación correspondiente.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative h-[430px] sm:h-[480px] w-full bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-center">
          <Radar data={chartData} options={chartOptions} />
        </div>

        {/* Dynamic Hover / Selection Feedback Card */}
        <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm transition-all duration-200">
          {hoveredPrinciple ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{
                    backgroundColor: hoveredPrinciple.scaledScore == null ? '#94a3b8' : hoveredPrinciple.scaledScore >= 9 ? '#10b981' : (hoveredPrinciple.scaledScore >= 6 ? '#f59e0b' : '#ef4444')
                  }}></span>
                  <h4 className="text-sm font-bold text-slate-100">
                    {hoveredPrinciple.principle.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                    {hoveredPrinciple.scaledScore != null ? `${hoveredPrinciple.scaledScore} / 10` : 'Sin evaluar'}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    hoveredPrinciple.riskClass === 'optimal'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : hoveredPrinciple.riskClass === 'moderate'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : hoveredPrinciple.riskClass === 'critical'
                      ? 'bg-red-950 text-red-300 border border-red-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-600/60'
                  }`}>
                    {hoveredPrinciple.riskLevel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Diagnóstico detectado:</span>
                  <p className="text-slate-200">{hoveredPrinciple.diagnostic}</p>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold block mb-0.5">Recomendación técnica inmediata:</span>
                  <p className="text-slate-200">{hoveredPrinciple.technicalRecommendation || 'Disponible una vez que califiques este principio.'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-xs text-slate-300 py-1">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
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
