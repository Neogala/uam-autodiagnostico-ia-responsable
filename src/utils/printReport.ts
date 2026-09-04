import { EvaluationReportState, PrincipleScoreResult } from '../types';

/**
 * Generates an SVG radar chart for the 10 principles with exact points and polygon fill.
 */
function generateRadarSvg(results: PrincipleScoreResult[], size = 420): string {
  const center = size / 2;
  const radius = (size / 2) - 50;
  const total = results.length;
  const angleStep = (Math.PI * 2) / total;

  // Concentric background grid polygons (levels 2, 4, 6, 8, 10)
  const gridLevels = [2, 4, 6, 8, 10];
  let gridSvg = '';
  gridLevels.forEach(level => {
    const levelRadius = (radius * level) / 10;
    const points: string[] = [];
    for (let i = 0; i < total; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + levelRadius * Math.cos(angle);
      const y = center + levelRadius * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    gridSvg += `<polygon points="${points.join(' ')}" fill="none" stroke="#cbd5e1" stroke-dasharray="${level === 10 ? 'none' : '2,2'}" stroke-width="1"/>`;
    // Label for level
    gridSvg += `<text x="${center + 4}" y="${(center - levelRadius + 11).toFixed(1)}" font-size="9" fill="#94a3b8" font-family="sans-serif">${level}</text>`;
  });

  // Spokes
  let spokesSvg = '';
  for (let i = 0; i < total; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    spokesSvg += `<line x1="${center}" y1="${center}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/>`;
  }

  // Data polygon
  const dataPoints: { x: number; y: number; score: number; color: string; label: string }[] = [];
  const polygonCoords: string[] = [];
  results.forEach((r, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const scaled = r.scaledScore ?? 0;
    const scoreRadius = (radius * Math.max(0, Math.min(10, scaled))) / 10;
    const x = center + scoreRadius * Math.cos(angle);
    const y = center + scoreRadius * Math.sin(angle);
    polygonCoords.push(`${x.toFixed(1)},${y.toFixed(1)}`);

    const color = r.scaledScore == null ? '#94a3b8' : scaled >= 9 ? '#10b981' : scaled >= 6 ? '#f59e0b' : '#ef4444';
    dataPoints.push({ x, y, score: scaled, color, label: `P${r.principle.id}` });
  });

  // Data fill polygon
  const dataPolySvg = `<polygon points="${polygonCoords.join(' ')}" fill="rgba(245, 158, 11, 0.35)" stroke="#d97706" stroke-width="2.5"/>`;

  // Data circles & label positions
  let pointsSvg = '';
  let labelsSvg = '';
  results.forEach((r, i) => {
    const pt = dataPoints[i];
    pointsSvg += `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="5" fill="${pt.color}" stroke="#ffffff" stroke-width="2"/>`;

    // Outer label position
    const angle = i * angleStep - Math.PI / 2;
    const labelRadius = radius + 26;
    const lx = center + labelRadius * Math.cos(angle);
    const ly = center + labelRadius * Math.sin(angle);
    const textAnchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';

    labelsSvg += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="10" font-weight="bold" fill="#1e293b" text-anchor="${textAnchor}" font-family="sans-serif">P${r.principle.id} (${r.scaledScore ?? 'N/E'})</text>`;
  });

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="mx-auto">
      ${gridSvg}
      ${spokesSvg}
      ${dataPolySvg}
      ${pointsSvg}
      ${labelsSvg}
    </svg>
  `;
}

/**
 * Builds the standalone official UAM printable HTML document.
 */
export function generateOfficialPrintableReport(
  state: EvaluationReportState,
  results: PrincipleScoreResult[],
  globalScore: number
): string {
  const radarSvg = generateRadarSvg(results, 380);

  const rowsHtml = results.map(r => {
    const badgeColor = r.scaledScore == null
      ? 'background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;'
      : r.scaledScore >= 9
      ? 'background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;'
      : r.scaledScore >= 6
      ? 'background: #fef3c7; color: #92400e; border: 1px solid #fcd34d;'
      : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;';

    return `
      <tr>
        <td style="padding: 9px 12px; border: 1px solid #cbd5e1; font-weight: 600; font-size: 11px;">
          ${r.principle.name}
        </td>
        <td style="padding: 9px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; font-family: monospace; font-size: 13px;">
          ${r.scaledScore != null ? r.scaledScore + ' / 10' : 'Sin evaluar'}
        </td>
        <td style="padding: 9px 12px; border: 1px solid #cbd5e1; text-align: center;">
          <span style="display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; ${badgeColor}">
            ${r.riskLevel}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  const analysisCardsHtml = results.map(r => {
    const borderColor = r.scaledScore == null ? '#94a3b8' : r.scaledScore >= 9 ? '#10b981' : r.scaledScore >= 6 ? '#f59e0b' : '#ef4444';
    const bgBadge = r.scaledScore == null ? '#f1f5f9' : r.scaledScore >= 9 ? '#d1fae5' : r.scaledScore >= 6 ? '#fef3c7' : '#fee2e2';
    const textBadge = r.scaledScore == null ? '#475569' : r.scaledScore >= 9 ? '#065f46' : r.scaledScore >= 6 ? '#92400e' : '#991b1b';

    return `
      <div style="border: 1px solid #e2e8f0; border-left: 4px solid ${borderColor}; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; page-break-inside: avoid; background: #fafafa;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
          <h4 style="margin: 0; font-size: 12px; font-weight: bold; color: #0f172a;">
            ${r.principle.name}
          </h4>
          <span style="font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px; background: ${bgBadge}; color: ${textBadge};">
            ${r.scaledScore != null ? r.scaledScore + ' / 10' : 'Sin evaluar'} • ${r.riskLevel}
          </span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 6px; font-size: 11px; line-height: 1.45;">
          <div>
            <strong style="color: #475569;">● Diagnóstico de Situación:</strong>
            <span style="color: #334155;"> ${r.diagnostic}</span>
          </div>
          <div style="background: #eff6ff; padding: 6px 8px; border-radius: 6px; border: 1px solid #dbeafe;">
            <strong style="color: #1e40af;">● Recomendación Técnica:</strong>
            <span style="color: #1e3a8a;"> ${r.technicalRecommendation || 'N/A — principio sin evaluar.'}</span>
            <div style="font-size: 10px; color: #3b82f6; margin-top: 3px; font-style: italic;">
              📚 Fuente técnica: ${r.principle.sources.technical}
            </div>
          </div>
          <div style="background: #fffbeb; padding: 6px 8px; border-radius: 6px; border: 1px solid #fef3c7;">
            <strong style="color: #b45309;">● Recomendación Normativa UAM:</strong>
            <span style="color: #78350f;"> ${r.normativeRecommendation || 'N/A — principio sin evaluar.'}</span>
            <div style="font-size: 10px; color: #d97706; margin-top: 3px; font-style: italic;">
              🏛️ Fuente normativa: ${r.principle.sources.normative}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const hasAnyScore = results.some(r => r.scaledScore != null);

  const globalBadgeStyle = !hasAnyScore
    ? 'background: #64748b; color: #ffffff;'
    : globalScore >= 9
    ? 'background: #059669; color: #ffffff;'
    : globalScore >= 6
    ? 'background: #d97706; color: #ffffff;'
    : 'background: #dc2626; color: #ffffff;';

  const globalStatusText = !hasAnyScore
    ? 'Sin evaluar'
    : globalScore >= 9
    ? 'Cumplimiento Óptimo'
    : globalScore >= 6
    ? 'Riesgo Moderado (Requiere Salvaguardas)'
    : 'Riesgo Crítico (No recomendado para despliegue sin mitigaciones)';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dictamen Institucional de IA Responsable - UAM</title>
  <style>
    @page {
      size: letter portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .no-print-bar {
      background: #0f172a;
      color: white;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .no-print-btn {
      background: #f59e0b;
      color: #0f172a;
      border: none;
      font-weight: bold;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.2s;
    }
    .no-print-btn:hover {
      background: #fbbf24;
    }
    .container {
      max-width: 840px;
      margin: 20px auto;
      background: #ffffff;
      padding: 36px 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }
    @media print {
      body { background: #ffffff; }
      .no-print-bar { display: none !important; }
      .container {
        margin: 0;
        padding: 0;
        border: none;
        box-shadow: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>

  <!-- Floating top bar for screen preview and printing -->
  <div class="no-print-bar">
    <div style="font-size: 13px; font-weight: bold;">
      🏛️ Vista Previa del Dictamen Oficial de IA Responsable — Universidad Autónoma Metropolitana
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="no-print-btn" onclick="window.print()">
        🖨️ Imprimir / Guardar como PDF
      </button>
      <button style="background: #334155; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 13px;" onclick="window.close()">
        ✕ Cerrar
      </button>
    </div>
  </div>

  <div class="container">
    
    <!-- Institutional Letterhead Header -->
    <div style="border-bottom: 3px solid #0f172a; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
          <div style="background: #0f172a; color: #f59e0b; font-weight: 900; font-size: 18px; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px;">
            UAM
          </div>
          <div>
            <h1 style="margin: 0; font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px;">
              Universidad Autónoma Metropolitana
            </h1>
            <div style="font-size: 12px; font-weight: 600; color: #475569;">
              Unidad ${state.unit} • ${state.division || 'División Académica'}
            </div>
          </div>
        </div>
        <div style="font-size: 11px; color: #64748b; font-style: italic; margin-top: 2px;">
          Casa abierta al tiempo — Decálogo de Ética para el Uso de la IA
        </div>
      </div>

      <div style="text-align: right; font-size: 11px; color: #475569;">
        <div style="font-weight: bold; text-transform: uppercase; color: #0f172a;">Dictamen de Autodiagnóstico</div>
        <div>Fecha: ${new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })}</div>
      </div>
    </div>

    <!-- Project Metadata Banner -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 22px;">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; align-items: center;">
        <div>
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
            Proyecto Evaluado
          </div>
          <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 2px;">
            ${state.projectTitle || 'Sistema de Inteligencia Artificial Sin Título'}
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">
            <strong>Evaluador(a):</strong> ${state.evaluatorName || 'No especificado'} (${state.role})
          </div>
        </div>

        <div style="text-align: right; border-left: 1px solid #e2e8f0; padding-left: 14px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b;">
            Índice Global Ético
          </div>
          <div style="font-size: 22px; font-weight: 900; color: #0f172a; font-family: monospace;">
            ${hasAnyScore ? globalScore.toFixed(1) : '—'} <span style="font-size: 12px; color: #64748b;">/ 10</span>
          </div>
          <div style="margin-top: 2px;">
            <span style="font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px; ${globalBadgeStyle}">
              ${globalStatusText}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section a: Results Table -->
    <div style="margin-bottom: 24px; page-break-inside: avoid;">
      <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px;">
        a) Tabla de Resultados y Semáforo de Riesgo (Escala 1 a 10)
      </h2>
      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 11px;">
        <thead>
          <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold; color: #1e293b;">Principio del Decálogo UAM</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; width: 110px; color: #1e293b;">Puntaje (1-10)</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; width: 170px; color: #1e293b;">Estado de Riesgo</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <!-- Section b: Visual Radar Chart -->
    <div style="margin-bottom: 24px; text-align: center; page-break-inside: avoid;">
      <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 12px; text-align: left;">
        b) Mapa de Cumplimiento Ético (Gráfico Radial)
      </h2>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; display: inline-block;">
        ${radarSvg}
      </div>
      <div style="font-size: 10px; color: #64748b; margin-top: 6px;">
        Visualización radial de los 10 principios del Decálogo UAM calibrados en escala 1 a 10.
      </div>
    </div>

    <!-- Section c: Dynamic Analysis & Recommendations -->
    <div style="margin-bottom: 28px;">
      <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 12px;">
        c) Análisis y Recomendaciones Dinámicas por Principio
      </h2>
      <div style="background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 10px 12px; margin-bottom: 14px; font-size: 10.5px; color: #78350f; line-height: 1.45;">
        <strong>Nota metodológica y aviso institucional:</strong> Las recomendaciones técnicas, normativas y diagnósticos provienen de contenido fijo, predefinido a partir del Decálogo de Ética UAM para cada nivel de la escala, como guía ilustrativa e indicativa. Los resultados deben ser revisados, contrastados con las fuentes citadas y validados formalmente por personas especialistas o comités colegiados institucionales de la UAM antes de su aplicación definitiva.
      </div>
      ${analysisCardsHtml}
    </div>

    <!-- Signatures section -->
    <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #cbd5e1; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: center; font-size: 11px; page-break-inside: avoid;">
      <div>
        <div style="border-bottom: 1px solid #475569; height: 38px; margin-bottom: 6px;"></div>
        <div style="font-weight: bold; color: #0f172a;">${state.evaluatorName || 'Responsable del Proyecto'}</div>
        <div style="color: #64748b;">${state.role} • UAM ${state.unit}</div>
      </div>
      <div>
        <div style="border-bottom: 1px solid #475569; height: 38px; margin-bottom: 6px;"></div>
        <div style="font-weight: bold; color: #0f172a;">Comité / Coordinación Colegiada</div>
        <div style="color: #64748b;">${state.division || 'Universidad Autónoma Metropolitana'}</div>
      </div>
    </div>

  </div>

</body>
</html>`;
}

/**
 * Triggers printing of the official report:
 * 1. Tries opening a popup window with the printable document and triggers .print().
 * 2. If blocked or within restricted iframe, automatically creates a downloadable self-contained .html file.
 */
export function triggerOfficialPrintOrDownload(
  state: EvaluationReportState,
  results: PrincipleScoreResult[],
  globalScore: number
): void {
  const htmlContent = generateOfficialPrintableReport(state, results, globalScore);

  try {
    const printWindow = window.open('', '_blank', 'width=950,height=800,menubar=yes,scrollbars=yes,status=yes');
    if (printWindow && !printWindow.closed) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Focus and trigger print after render
      setTimeout(() => {
        printWindow.focus();
        try {
          printWindow.print();
        } catch (e) {
          console.warn('Direct print call in popup was prevented, document remains visible for user printing:', e);
        }
      }, 500);
      return;
    }
  } catch (err) {
    console.warn('Popup blocked or iframe restriction encountered, switching to direct download fallback:', err);
  }

  // Fallback: Download self-contained HTML report
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dictamen_ia_uam_${(state.projectTitle || 'evaluacion').toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
