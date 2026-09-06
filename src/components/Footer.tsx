import React from 'react';
import { ShieldCheck, BookOpen, ExternalLink, University } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-900 text-ink-500 text-xs border-t border-ink-700 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-ink-700">

          {/* Institutional block */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-6 h-6 rounded bg-brand text-white flex items-center justify-center font-black text-xs">
                UAM
              </span>
              <span>Universidad Autónoma Metropolitana</span>
            </div>
            <p className="text-ink-500 text-xs leading-relaxed">
              Herramienta Institucional de Autodiagnóstico de IA Responsable para las 5 unidades universitarias (Azcapotzalco, Cuajimalpa, Iztapalapa, Lerma, Xochimilco) y Rectoría General.
            </p>
          </div>

          {/* Legal and Ethical Frameworks */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white/90 uppercase tracking-wider text-[11px]">
              Marcos Éticos y Normativos
            </h4>
            <ul className="space-y-1 text-ink-500 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                <span>Decálogo de Ética para el Uso de la IA en la UAM</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                <span>Recomendación sobre la Ética de la IA - UNESCO (2021)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                <span>Principios de Inteligencia Artificial de la OCDE</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                <span>Ley General de Protección de Datos Personales (LGPDPPSO)</span>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white/90 uppercase tracking-wider text-[11px]">
              Criterio de Evaluación
            </h4>
            <p className="text-ink-500 text-xs leading-relaxed">
              Las puntuaciones de 1 a 5 se multiplican por 2 para generar una escala de 1 a 10:
            </p>
            <div className="flex flex-col gap-1.5 text-[11px] text-ink-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sem-critico shrink-0" /> 1 a 5.9: Rojo / Riesgo Crítico (Requiere salvaguardas inmediatas)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sem-moderado shrink-0" /> 6 a 8.9: Amarillo / Riesgo Moderado (Requiere mejoras técnicas/normativas)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sem-optimo shrink-0" /> 9 a 10: Verde / Cumplimiento Óptimo (Alineado con directrices)</span>
            </div>
          </div>

        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-ink-500 text-[11px]">
          <span>
            © {new Date().getFullYear()} Universidad Autónoma Metropolitana — <em>Casa abierta al tiempo</em>.
          </span>
          <span>
            Desarrollado para el fortalecimiento de la docencia, investigación y gestión ética de la IA.
          </span>
        </div>
      </div>
    </footer>
  );
};
