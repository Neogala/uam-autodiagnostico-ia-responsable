export type UAMUnit = 
  | 'Azcapotzalco' 
  | 'Cuajimalpa' 
  | 'Iztapalapa' 
  | 'Lerma' 
  | 'Xochimilco' 
  | 'Rectoría General';

export type UserRole = 
  | 'Docente' 
  | 'Investigador(a)' 
  | 'Personal Administrativo' 
  | 'Alumnado de Posgrado / Licenciatura'
  | 'Coordinador(a) Académico(a) o Directivo(a)';

export type RiskLevel = 'Sin evaluar' | 'Rojo / Riesgo Crítico' | 'Amarillo / Riesgo Moderado' | 'Verde / Cumplimiento Óptimo';
export type RiskClass = 'unscored' | 'critical' | 'moderate' | 'optimal';

// ---------------------------------------------------------------------------
// Ampliación metodológica (patrones ALTAI) — ver plan "Identidad visual
// UAM-Azcapotzalco + rediseño metodológico ALTAI". Todo lo de aquí abajo es
// ADITIVO: no se toca ninguno de los campos de DecalogoPrinciple/EvaluationReportState
// que ya usan tabla/radar/dictamen/export. `intro`/`subdimensiones`/`marcos` son
// opcionales a propósito: los principios sin contenido piloto simplemente no
// muestran esas secciones (degradan con gracia).
// ---------------------------------------------------------------------------

export type TipoRespuesta = 'binaria' | 'opcion_multiple' | 'texto';
export type Marco = 'Decalogo UAM' | 'UNESCO 2021' | 'OCDE' | 'LGPDPPSO';
export type NivelMadurez = 'no_existente' | 'bajo' | 'moderado' | 'significativo' | 'alto';
export type SupervisionHumana = 'in-the-loop' | 'on-the-loop' | 'in-command' | 'no_aplica';

export const NIVEL_MADUREZ_LABEL: Record<NivelMadurez, string> = {
  no_existente: 'No existente',
  bajo: 'Bajo',
  moderado: 'Moderado',
  significativo: 'Significativo',
  alto: 'Alto'
};

export interface PerfilProyecto {
  tipoSistema: string[];
  autonomo: boolean;
  autoaprendizaje: boolean;
  decideSobrePersonas: boolean;
  supervision: SupervisionHumana;
  abortoSeguro: boolean;
}

export function buildEmptyPerfilProyecto(): PerfilProyecto {
  return {
    tipoSistema: [],
    autonomo: false,
    autoaprendizaje: false,
    decideSobrePersonas: false,
    supervision: 'no_aplica',
    abortoSeguro: false
  };
}

export interface PreguntaCualitativa {
  id: string;
  enunciado: string;
  tipo: TipoRespuesta;
  /** Requerido para tipo 'opcion_multiple' o 'binaria' (p.ej. ['Sí','No','En cierto grado','No sé']). */
  opciones?: string[];
  permiteJustificacion?: boolean;
  marcos: Marco[];
  /** Distingue si la pregunta se refiere a quien opera el sistema o a quien recibe sus efectos. */
  distincionSujeto?: 'usuario' | 'sujeto_afectado';
  /** Si se define, la pregunta solo se muestra cuando el perfil del proyecto cumple esta condición. */
  aplicaSiPerfil?: (perfil: PerfilProyecto) => boolean;
}

export interface Subdimension {
  id: string;
  nombre: string;
  preguntas: PreguntaCualitativa[];
  banco: Record<'critical' | 'moderate' | 'optimal', { diagnostico: string; recomendacion: string; fuente: string }>;
}

export interface DecalogoPrinciple {
  id: number;
  /** Nombre canónico: usado en cuestionario, tabla de resultados y dictamen. */
  name: string;
  /** Eje corto para el radar (mismo principio, etiqueta reducida por espacio). */
  shortName: string;
  question: string;
  explanation: string;
  indicators: string[];
  // TODO(revisión UAM): confirmar que cada fuente técnica/normativa corresponde
  // al principio correcto antes de publicar la app en producción.
  sources: {
    technical: string;
    normative: string;
  };
  recommendations: {
    critical: {
      diagnostic: string;
      technical: string;
      normative: string;
    };
    moderate: {
      diagnostic: string;
      technical: string;
      normative: string;
    };
    optimal: {
      diagnostic: string;
      technical: string;
      normative: string;
    };
  };
  /**
   * Contenido metodológico ALTAI opcional. Solo 2 principios piloto lo tienen
   * mientras se valida el patrón — borrador pedagógico, no es texto oficial
   * del Decálogo UAM. Ver comentario junto a UAM_DECALOGO_PRINCIPLES.
   */
  intro?: { definiciones: string[]; ejemplosUAM: string[] };
  subdimensiones?: Subdimension[];
  marcos?: Marco[];
}

export const UAM_DECALOGO_PRINCIPLES: DecalogoPrinciple[] = [
  {
    id: 1,
    name: '1. Dignidad y derechos humanos',
    shortName: 'Dignidad y DDHH',
    question: '¿Existe supervisión humana obligatoria y mecanismos para que las personas usuarias soliciten revisión o impugnación de decisiones?',
    explanation: 'Garantiza que la IA permanezca al servicio del ser humano, preservando la dignidad y evitando decisiones automatizadas irreversibles sin supervisión humana.',
    indicators: [
      'Existe un procedimiento claro para apelar o impugnar inferencias automatizadas.',
      'Hay una persona responsable con facultad de anular decisiones tomadas por el sistema.',
      'Se respetan las garantías y derechos de la comunidad universitaria en todo momento.'
    ],
    sources: {
      technical: 'UNESCO (2021) «Ética de la IA» (Supervisión humana / Human-in-the-loop) y NIST AI RMF 1.0 (GOVERN 1.2).',
      normative: 'Decálogo de Ética UAM (Principio 1), Estatuto Orgánico de la UAM y Reglamento de Estudios Superiores (Derecho de revisión académica).'
    },
    recommendations: {
      critical: {
        diagnostic: 'Existe ausencia de supervisión humana y mecanismos de apelación, lo que expone a la institución a vulneraciones de derechos fundamentales.',
        technical: 'Implementar de inmediato un módulo de control "Human-in-the-loop" donde toda decisión con impacto en las personas requiera confirmación humana obligatoria antes de ejecutarse.',
        normative: 'Redactar y publicar en la interfaz el Protocolo UAM de Impugnación y Revisión Humana conforme al Estatuto Orgánico.'
      },
      moderate: {
        diagnostic: 'Hay supervisión parcial o informal, pero carece de un canal formalizado para que la comunidad usuaria solicite revisión.',
        technical: 'Añadir un botón visible de "Solicitar revisión por el personal académico / persona responsable" y registrar las solicitudes en una base de datos auditable.',
        normative: 'Definir el tiempo máximo de respuesta institucional para las solicitudes de aclaración o revisión de los resultados del sistema.'
      },
      optimal: {
        diagnostic: 'El proyecto cuenta con supervisión humana rigurosa, protocolos de apelación definidos y pleno respeto a los derechos humanos.',
        technical: 'Mantener bitácoras periódicas de las decisiones humanas ratificadas o rectificadas para mejora continua del modelo.',
        normative: 'Documentar el flujo como buena práctica transferible a otras áreas y divisiones de la UAM.'
      }
    },
    // --- Piloto ALTAI (borrador pedagógico, pendiente de validación UAM) ---
    intro: {
      definiciones: [
        'Supervisión humana ("human-in-the-loop"): mecanismo por el cual una persona debe validar, o puede anular, una decisión del sistema antes de que surta efecto sobre alguien.',
        'Persona afectada (o "sujeto afectado"): quien recibe las consecuencias de una decisión asistida por IA, sin ser necesariamente quien la opera.'
      ],
      ejemplosUAM: [
        'Un sistema que sugiere una calificación o retroalimentación automática debe permitir que la persona docente la revise y modifique antes de publicarla.',
        'Un algoritmo que preselecciona solicitudes de beca debe permitir que el área administrativa revise manualmente los casos marcados como rechazados antes de notificar a la persona solicitante.'
      ]
    },
    marcos: ['Decalogo UAM', 'UNESCO 2021'],
    subdimensiones: [
      {
        id: 'p1-sd1',
        nombre: 'Supervisión humana efectiva',
        preguntas: [
          {
            id: 'p1-sd1-q1',
            enunciado: '¿Existe una persona identificada con autoridad para revisar o revertir una decisión del sistema antes de que tenga efectos sobre alguien?',
            tipo: 'binaria',
            opciones: ['Sí', 'No', 'En cierto grado', 'No sé'],
            permiteJustificacion: true,
            marcos: ['Decalogo UAM', 'UNESCO 2021'],
            distincionSujeto: 'usuario'
          },
          {
            id: 'p1-sd1-q2',
            enunciado: '¿Las personas afectadas por una decisión del sistema saben que pueden solicitar su revisión?',
            tipo: 'binaria',
            opciones: ['Sí', 'No', 'En cierto grado', 'No sé'],
            permiteJustificacion: true,
            marcos: ['Decalogo UAM'],
            distincionSujeto: 'sujeto_afectado'
          }
        ],
        banco: {
          critical: {
            diagnostico: 'No hay una persona claramente responsable de revisar o revertir decisiones del sistema, ni las personas afectadas saben que pueden pedir revisión.',
            recomendacion: 'Nombrar formalmente a la persona o instancia responsable de la supervisión humana y comunicarlo a quienes usan o reciben efectos del sistema.',
            fuente: 'Decálogo de Ética UAM (Principio 1); UNESCO (2021), Recomendación sobre la Ética de la IA.'
          },
          moderate: {
            diagnostico: 'La supervisión humana existe pero es informal o poco conocida por las personas afectadas.',
            recomendacion: 'Formalizar el rol de supervisión (quién revisa, cuándo, con qué criterio) y hacerlo visible en la interfaz o en la comunicación del proyecto.',
            fuente: 'Decálogo de Ética UAM (Principio 1); UNESCO (2021), Recomendación sobre la Ética de la IA.'
          },
          optimal: {
            diagnostico: 'La supervisión humana está formalizada, es conocida por las personas afectadas y es efectiva en la práctica.',
            recomendacion: 'Documentar el mecanismo como referencia para otros proyectos de la unidad universitaria.',
            fuente: 'Decálogo de Ética UAM (Principio 1); UNESCO (2021), Recomendación sobre la Ética de la IA.'
          }
        }
      },
      {
        id: 'p1-sd2',
        nombre: 'Mecanismo de impugnación',
        preguntas: [
          {
            id: 'p1-sd2-q1',
            enunciado: '¿Qué tan formalizado está el canal para impugnar una decisión asistida por el sistema?',
            tipo: 'opcion_multiple',
            opciones: ['No existe', 'Informal (correo o verbal)', 'Formal pero no documentado', 'Formal y documentado'],
            marcos: ['Decalogo UAM', 'UNESCO 2021']
          },
          {
            id: 'p1-sd2-q2',
            enunciado: '¿Se registra y se da seguimiento a las solicitudes de revisión recibidas?',
            tipo: 'binaria',
            opciones: ['Sí', 'No', 'En cierto grado', 'No sé'],
            permiteJustificacion: true,
            marcos: ['Decalogo UAM']
          }
        ],
        banco: {
          critical: {
            diagnostico: 'No existe un canal de impugnación ni registro de las solicitudes de revisión.',
            recomendacion: 'Crear un canal mínimo (formulario o correo dedicado) y llevar un registro simple de cada solicitud recibida.',
            fuente: 'Decálogo de Ética UAM (Principio 1); Reglamento de Estudios Superiores de la UAM (derecho de revisión académica).'
          },
          moderate: {
            diagnostico: 'Existe un canal, pero es informal o el seguimiento de las solicitudes es inconsistente.',
            recomendacion: 'Documentar el procedimiento (plazos, responsable, criterios de resolución) y darle seguimiento sistemático.',
            fuente: 'Decálogo de Ética UAM (Principio 1); Reglamento de Estudios Superiores de la UAM (derecho de revisión académica).'
          },
          optimal: {
            diagnostico: 'El canal de impugnación está formalizado, documentado y con seguimiento sistemático de cada caso.',
            recomendacion: 'Revisar periódicamente los casos registrados para identificar patrones que ameriten ajustes al sistema.',
            fuente: 'Decálogo de Ética UAM (Principio 1); Reglamento de Estudios Superiores de la UAM (derecho de revisión académica).'
          }
        }
      }
    ]
  },
  {
    id: 2,
    name: '2. Diversidad, igualdad y solidaridad',
    shortName: 'Diversidad e Igualdad',
    question: '¿Se verificó que el sistema no discrimine por género, etnia o condición, y que la interfaz sea accesible para todas las personas?',
    explanation: 'Promueve la inclusión, la no discriminación algorítmica y la accesibilidad digital conforme a estándares internacionales (WCAG).',
    indicators: [
      'Auditoría previa para verificar que no existan sesgos contra identidades o grupos históricamente vulnerados.',
      'Interfaz compatible con lectores de pantalla, contraste adecuado y diseño universal.',
      'Lenguaje incluyente y libre de estereotipos en las respuestas o salidas del modelo.'
    ],
    sources: {
      technical: 'Pautas de Accesibilidad W3C WCAG 2.1 nivel AA y Métricas de Paridad Demográfica (Fairlearn / AIF360).',
      normative: 'Decálogo de Ética UAM (Principio 2) y Políticas Institucionales para la Inclusión, Equidad y Prevención de la Violencia de Género de la UAM.'
    },
    recommendations: {
      critical: {
        diagnostic: 'El sistema no ha sido evaluado contra sesgos discriminatorios y su interfaz presenta barreras de accesibilidad.',
        technical: 'Ejecutar pruebas de estrés con conjuntos de datos de prueba para evaluar paridad de trato y aplicar directrices de accesibilidad WCAG 2.1 nivel AA.',
        normative: 'Revisar la guía de género e inclusión de la UAM para alinear el comportamiento del sistema con las políticas universitarias.'
      },
      moderate: {
        diagnostic: 'Se contempló la no discriminación básica, pero faltan pruebas sistemáticas de sesgo y ajustes finos de accesibilidad.',
        technical: 'Integrar librerías de detección de sesgo (ej. AIF360 o Fairlearn) y realizar pruebas de uso con personas con discapacidad.',
        normative: 'Formalizar el compromiso de inclusión en los términos de uso del proyecto.'
      },
      optimal: {
        diagnostic: 'Excelente compromiso con la equidad, accesibilidad universal y eliminación proactiva de sesgos discriminatorios.',
        technical: 'Monitorear métricas de paridad demográfica en producción de forma trimestral.',
        normative: 'Presentar los resultados de accesibilidad e inclusión ante el consejo divisional correspondiente.'
      }
    }
  },
  {
    id: 3,
    name: '3. Cultura de paz',
    shortName: 'Cultura de Paz',
    question: '¿Cuenta con filtros activos contra violencia, acoso o generación de discursos de odio?',
    explanation: 'Evita que el sistema genere, amplifique o tolere contenidos que promuevan la violencia, el acoso escolar/laboral o la polarización.',
    indicators: [
      'Barandales de seguridad (guardrails/moderation filters) activos y configurados.',
      'Protocolos de detección y bloqueo de incitación al odio, hostigamiento o agresiones.',
      'Reporte automático de incidentes críticos para salvaguarda de la comunidad.'
    ],
    sources: {
      technical: 'NIST AI RMF 1.0 (MANAGE 2.4 - Mitigación de daños) y clasificadores de seguridad contextual (Perspective API / Llama Guard).',
      normative: 'Decálogo de Ética UAM (Principio 3), Protocolo de Convivencia y Reglamento del Alumnado de la UAM.'
    },
    recommendations: {
      critical: {
        diagnostic: 'Riesgo inminente de generación o propagación de respuestas violentas, ofensivas o de acoso.',
        technical: 'Configurar barandales de seguridad semántica y filtros de moderación en el backend antes de cualquier despliegue público.',
        normative: 'Incorporar cláusula expresa de tolerancia cero al acoso y violencia digital en concordancia con el Reglamento del Alumnado y normatividad UAM.'
      },
      moderate: {
        diagnostic: 'Existen filtros genéricos por palabras clave, pero son vulnerables a ataques de inyección o contextos sutiles.',
        technical: 'Reforzar con clasificadores de moderación contextuales (ej. Perspective API o capas de validación semántica).',
        normative: 'Establecer un canal de reporte anónimo para incidentes de contenido inadecuado generado por el sistema.'
      },
      optimal: {
        diagnostic: 'El sistema cuenta con robustos mecanismos de contención que garantizan una interacción constructiva y pacífica.',
        technical: 'Programar pruebas periódicas de "red teaming" para asegurar la solidez ante nuevas técnicas de bypass o jailbreak.',
        normative: 'Mantener actualizado el catálogo de riesgos en materia de convivencia universitaria.'
      }
    }
  },
  {
    id: 4,
    name: '4. Honradez y responsabilidad',
    shortName: 'Honradez y Responsabilidad',
    question: '¿Se informa explícitamente el uso de IA y se asignó a una persona o unidad académica como titular responsable?',
    explanation: 'Exige sinceridad ante la comunidad usuaria sobre la naturaleza artificial del sistema y asigna titularidad jurídica y técnica clara.',
    indicators: [
      'Aviso visible que indica que el contenido o procesamiento proviene de IA.',
      'Ficha técnica con el nombre de la persona responsable técnica/académica y unidad universitaria.',
      'Canal de contacto institucional para soporte, dudas o aclaraciones.'
    ],
    sources: {
      technical: 'Principios de IA de la OCDE (Principio 1.3 - Transparencia y Explicabilidad) y Model Cards for Model Reporting (Mitchell et al.).',
      normative: 'Decálogo de Ética UAM (Principio 4) y Lineamientos Generales de Integridad Académica de la UAM.'
    },
    recommendations: {
      critical: {
        diagnostic: 'El sistema opera de forma opaca sin declarar su naturaleza artificial ni contar con una persona titular formalmente asignada.',
        technical: 'Insertar un aviso permanente en el encabezado y en cada salida generada especificando que es una IA desarrollada en la UAM.',
        normative: 'Designar mediante oficio institucional a la persona titular técnica y académica responsable del sistema.'
      },
      moderate: {
        diagnostic: 'Se menciona el uso de IA pero de forma poco visible, o la cadena de responsabilidad no está formalizada institucionalmente.',
        technical: 'Mejorar la visibilidad de la etiqueta de IA e incluir enlace a la ficha técnica del proyecto.',
        normative: 'Registrar formalmente el proyecto ante la jefatura de departamento o coordinación divisional correspondiente.'
      },
      optimal: {
        diagnostic: 'Transparencia ejemplar: aviso visible, titularidad explícita y canales de contacto institucionales funcionales.',
        technical: 'Mantener actualizada la ficha técnica y la versión del modelo en la sección informativa.',
        normative: 'Cumple a cabalidad con las directrices de atribución y honestidad académica de la UAM.'
      }
    }
  },
  {
    id: 5,
    name: '5. Vocación de servicio a la sociedad',
    shortName: 'Servicio a la Sociedad',
    question: '¿Demuestra un impacto o beneficio claro en las funciones de docencia, investigación o difusión cultural?',
    explanation: 'Asegura que el desarrollo tecnológico aporte valor público, democratice el conocimiento y fortalezca la misión sustantiva de la UAM.',
    indicators: [
      'Alineación directa con planes y programas de estudio o líneas de investigación institucionales.',
      'Beneficio tangible y medible para el alumnado, profesorado o sociedad.',
      'Orientación hacia el bien común y acceso abierto al conocimiento.'
    ],
    sources: {
      technical: 'UNESCO (2021) «IA para el Desarrollo Sostenible y el Bien Social» y métricas de utilidad educativa/social.',
      normative: 'Decálogo de Ética UAM (Principio 5), Ley Orgánica de la UAM (Fines sustantivos) y Planes de Desarrollo Institucional.'
    },
    recommendations: {
      critical: {
        diagnostic: 'No se identifica un beneficio claro para las funciones sustantivas de la UAM ni retorno social.',
        technical: 'Replantear los casos de uso para vincular directamente la herramienta con materias curriculares o proyectos de investigación activos.',
        normative: 'Someter la propuesta a consulta con el claustro docente o colegiado para definir su valor pedagógico/social.'
      },
      moderate: {
        diagnostic: 'El proyecto tiene potencial benéfico, pero falta definir indicadores de impacto y métricas de aprovechamiento.',
        technical: 'Incorporar telemetría de satisfacción y valor de aprendizaje (encuestas breves de utilidad).',
        normative: 'Elaborar un informe semestral de impacto académico para las autoridades de la división.'
      },
      optimal: {
        diagnostic: 'Alto impacto social y académico; contribuye directamente a la excelencia y vocación comunitaria de la UAM.',
        technical: 'Habilitar módulos de exportación de estadísticas agregadas para sustentar publicaciones académicas.',
        normative: 'Promover el sistema en foros inter-unidades de innovación educativa UAM.'
      }
    }
  },
  {
    id: 6,
    name: '6. Sostenibilidad',
    shortName: 'Sostenibilidad',
    question: '¿Se estimó y optimizó la eficiencia energética y el cómputo requerido para el sistema?',
    explanation: 'Promueve la "Green AI", reduciendo la huella de carbono, optimizando llamadas a APIs y seleccionando modelos computacionalmente eficientes.',
    indicators: [
      'Uso de modelos optimizados (cuantización, modelos ligeros, destilación o caché semántica).',
      'Estimación del costo energético y computacional del entrenamiento/inferencia.',
      'Políticas de optimización de peticiones en horarios de alta o baja demanda.'
    ],
    sources: {
      technical: 'Green AI Frameworks (Schwartz et al., ACM) y Directrices de Eficiencia Energética en Inferencia (MLPerf / CodeCarbon).',
      normative: 'Decálogo de Ética UAM (Principio 6) y Plan Institucional Hacia la Sustentabilidad de la UAM.'
    },
    recommendations: {
      critical: {
        diagnostic: 'Consumo computacional desproporcionado sin optimización de recursos ni conciencia de huella de carbono.',
        technical: 'Implementar memoria caché para consultas recurrentes, emplear modelos de menor tamaño (ej. Flash o modelos cuantizados) y limitar tokens.',
        normative: 'Elaborar una ficha de estimación de impacto ambiental y consumo de infraestructura en servidores universitarios.'
      },
      moderate: {
        diagnostic: 'Se utilizan modelos comerciales sin una estrategia deliberada de optimización y reducción de llamadas.',
        technical: 'Optimizar prompts, implementar técnicas de procesamiento por lotes (batching) y evaluar modelos locales ligeros en infraestructura universitaria.',
        normative: 'Fijar cuotas de uso razonable por persona usuaria para evitar el desperdicio computacional.'
      },
      optimal: {
        diagnostic: 'Excelente gestión de eficiencia energética, bajo consumo de recursos y alineación con criterios de Green AI.',
        technical: 'Monitorear métricas de tiempo de respuesta y consumo de GPU/CPU para mantener la eficiencia.',
        normative: 'Destacar la eficiencia ecológica del proyecto en las memorias anuales de gestión sustentable.'
      }
    }
  },
  {
    id: 7,
    name: '7. Legalidad y seguridad',
    shortName: 'Legalidad y Seguridad',
    question: '¿Implementa protocolos de ciberseguridad probados para proteger la infraestructura institucional?',
    explanation: 'Asegura la protección contra vulnerabilidades técnicas, inyección de prompts, fugas de credenciales y ataques a la red de la UAM.',
    indicators: [
      'Almacenamiento seguro de llaves de API y credenciales sin exposición en el cliente.',
      'Protección contra inyección de instrucciones (prompt injection) y desbordamientos.',
      'Cifrado en tránsito (HTTPS/TLS) y en reposo para datos institucionales.'
    ],
    sources: {
      technical: 'OWASP Top 10 for LLM Applications (2025) y NIST Cybersecurity Framework (CSF 2.0).',
      normative: 'Decálogo de Ética UAM (Principio 7) y Lineamientos de Seguridad de la Información de la Dirección de Tecnologías de la Información UAM.'
    },
    recommendations: {
      critical: {
        diagnostic: 'Vulnerabilidades severas de seguridad: posibles fugas de API keys o falta de cifrado en la comunicación.',
        technical: 'Mover inmediatamente toda lógica de conexión e invocación de IA a un servidor backend proxy; nunca exponer llaves en frontend.',
        normative: 'Solicitar un dictamen de ciberseguridad a la Dirección de Tecnologías de la Información de la UAM antes del pase a producción.'
      },
      moderate: {
        diagnostic: 'Seguridad básica implementada, pero sin defensas activas contra inyección de prompts o ataques de denegación de servicio.',
        technical: 'Agregar limitación de tasa (rate-limiting), validación y sanitización estricta de entradas de texto y cabeceras de seguridad HTTP.',
        normative: 'Elaborar un plan de respuesta ante incidentes de seguridad tecnológica.'
      },
      optimal: {
        diagnostic: 'Arquitectura robusta con cifrado integral, API keys protegidas en backend y defensas activas de ciberseguridad.',
        technical: 'Efectuar revisiones continuas de dependencias y escaneo de vulnerabilidades en el pipeline.',
        normative: 'Cumple con el marco de seguridad de la información institucional de la UAM.'
      }
    }
  },
  {
    id: 8,
    name: '8. Imparcialidad',
    shortName: 'Imparcialidad',
    question: '¿Se verificó que los datos o reglas de entrada no contengan ni reproduzcan sesgos sistemáticos?',
    explanation: 'Garantiza objetividad metodológica, representatividad de datos y neutralidad para no beneficiar ni perjudicar arbitrariamente a ningún grupo.',
    indicators: [
      'Curaduría crítica de los datos de entrenamiento, ajuste fino o corpus RAG.',
      'Evaluación de respuestas ante consultas controversiales para mantener neutralidad académica.',
      'Validación cruzada de resultados por pares académicos diversos.'
    ],
    sources: {
      technical: 'IEEE 7003-2024 (Standard for Algorithmic Bias Considerations) y UNESCO (2021) «Gobernanza de Datos Imparciales».',
      normative: 'Decálogo de Ética UAM (Principio 8) y Reglamento del Personal Académico de la UAM (Rigor y libertad de investigación con responsabilidad).'
    },
    recommendations: {
      critical: {
        diagnostic: 'Riesgo alto de sesgos sistemáticos en el corpus o reglas del modelo que pueden distorsionar resultados académicos.',
        technical: 'Auditar el corpus documental para eliminar fuentes sesgadas, desactualizadas o no representativas del rigor universitario.',
        normative: 'Conformar un comité revisor paritario para validar la representatividad y balance de las fuentes utilizadas.'
      },
      moderate: {
        diagnostic: 'El corpus es general pero no se han realizado pruebas de balance temático o metodológico sistemáticas.',
        technical: 'Incorporar instrucciones de sistema (system prompts) que instruyan al modelo a presentar múltiples perspectivas fundamentadas.',
        normative: 'Documentar las limitaciones metodológicas en la guía de la persona usuaria del sistema.'
      },
      optimal: {
        diagnostic: 'Corpus rigurosamente balanceado, con instrucciones de neutralidad y validación académica multidisciplinaria.',
        technical: 'Implementar pruebas automatizadas de consistencia e imparcialidad en lotes de preguntas de referencia.',
        normative: 'Referente institucional en rigurosidad metodológica e imparcialidad.'
      }
    }
  },
  {
    id: 9,
    name: '9. Transparencia y rendición de cuentas',
    shortName: 'Transparencia y Cuentas',
    question: '¿El sistema genera registros (bitácoras) auditables para rastrear el origen de cada resultado?',
    explanation: 'Permite la trazabilidad, auditoría técnica posterior y explicabilidad de las fuentes que fundamentaron una inferencia o respuesta.',
    indicators: [
      'Generación de bitácoras de eventos, fechas, tokens y versión del modelo empleado.',
      'Citas y referencias exactas a las fuentes documentales en sistemas RAG o generativos.',
      'Disponibilidad de métricas de desempeño y errores para auditoría interna.'
    ],
    sources: {
      technical: 'ISO/IEC 42001:2023 (Artificial Intelligence Management System - Trazabilidad) y W3C PROV Data Model.',
      normative: 'Decálogo de Ética UAM (Principio 9), Ley General de Transparencia y Acceso a la Información Pública y Reglamento de Transparencia de la UAM.'
    },
    recommendations: {
      critical: {
        diagnostic: 'Imposibilidad de auditar o reconstruir cómo el sistema llegó a una conclusión o generó un contenido específico.',
        technical: 'Crear un esquema de bitácoras estructurado que almacene identificador de consulta, fecha/hora, modelo, parámetros y fuentes recuperadas.',
        normative: 'Establecer una política institucional de retención y custodia de bitácoras conforme a los lineamientos del archivo universitario.'
      },
      moderate: {
        diagnostic: 'Se cuenta con registros de servidor básicos, pero no se almacena la trazabilidad de las fuentes ni explicabilidad para la persona usuaria.',
        technical: 'Enriquecer la salida del sistema con metadatos de explicabilidad (citas con hipervínculo y extracto del documento de origen).',
        normative: 'Permitir que las coordinaciones académicas accedan al panel de auditoría cuando sea requerido.'
      },
      optimal: {
        diagnostic: 'Trazabilidad total: citas documentales precisas, bitácoras estructuradas y total auditabilidad técnica y pedagógica.',
        technical: 'Mantener tableros analíticos de auditoría en tiempo real para supervisión del rendimiento.',
        normative: 'Cumplimiento ejemplar con la política de transparencia de la UAM.'
      }
    },
    // --- Piloto ALTAI (borrador pedagógico, pendiente de validación UAM) ---
    intro: {
      definiciones: [
        'Trazabilidad: capacidad de reconstruir, después de los hechos, el origen y el proceso que produjo un resultado específico del sistema.',
        'Rendición de cuentas: existencia de una persona o instancia institucional identificable, responsable de explicar y responder por el funcionamiento del sistema.'
      ],
      ejemplosUAM: [
        'Un asistente que responde preguntas sobre trámites escolares debe poder mostrar de qué documento o normativa tomó la respuesta.',
        'Si un sistema de detección de similitud (plagio) marca un trabajo como sospechoso, debe quedar registro de qué fuentes comparó y con qué criterio, para que la persona docente pueda explicarlo a la persona estudiante.'
      ]
    },
    marcos: ['Decalogo UAM', 'LGPDPPSO'],
    subdimensiones: [
      {
        id: 'p9-sd1',
        nombre: 'Trazabilidad técnica',
        preguntas: [
          {
            id: 'p9-sd1-q1',
            enunciado: '¿El sistema registra automáticamente qué versión del modelo y qué fuentes se usaron para generar cada resultado?',
            tipo: 'binaria',
            opciones: ['Sí', 'No', 'En cierto grado', 'No sé'],
            permiteJustificacion: true,
            marcos: ['Decalogo UAM']
          },
          {
            id: 'p9-sd1-q2',
            enunciado: '¿Es posible reconstruir, después de los hechos, cómo se llegó a un resultado específico?',
            tipo: 'binaria',
            opciones: ['Sí', 'No', 'En cierto grado', 'No sé'],
            permiteJustificacion: true,
            marcos: ['Decalogo UAM']
          }
        ],
        banco: {
          critical: {
            diagnostico: 'No hay registro de versiones, parámetros ni fuentes usadas por el sistema; los resultados no son reconstruibles.',
            recomendacion: 'Implementar un esquema mínimo de bitácora (fecha, versión del modelo, fuentes/parámetros usados) para cada resultado relevante.',
            fuente: 'Decálogo de Ética UAM (Principio 9); ISO/IEC 42001:2023 (trazabilidad).'
          },
          moderate: {
            diagnostico: 'Existen registros básicos, pero incompletos o no siempre permiten reconstruir un resultado específico.',
            recomendacion: 'Enriquecer las bitácoras con metadatos suficientes para explicar cualquier resultado individual a solicitud.',
            fuente: 'Decálogo de Ética UAM (Principio 9); ISO/IEC 42001:2023 (trazabilidad).'
          },
          optimal: {
            diagnostico: 'La trazabilidad técnica es completa: cualquier resultado puede reconstruirse y explicarse con precisión.',
            recomendacion: 'Mantener y auditar periódicamente el esquema de bitácoras conforme evolucione el sistema.',
            fuente: 'Decálogo de Ética UAM (Principio 9); ISO/IEC 42001:2023 (trazabilidad).'
          }
        }
      },
      {
        id: 'p9-sd2',
        nombre: 'Rendición de cuentas ante la comunidad',
        preguntas: [
          {
            id: 'p9-sd2-q1',
            enunciado: '¿Quién puede solicitar y obtener una explicación sobre un resultado del sistema?',
            tipo: 'opcion_multiple',
            opciones: ['Nadie / no está definido', 'Solo el área que lo administra', 'Cualquier persona usuaria que lo solicite', 'Cualquier persona usuaria o afectada, con procedimiento documentado'],
            marcos: ['Decalogo UAM', 'LGPDPPSO'],
            distincionSujeto: 'sujeto_afectado'
          },
          {
            id: 'p9-sd2-q2',
            enunciado: '¿Existe un responsable institucional identificado a quien rendirle cuentas sobre el funcionamiento del sistema?',
            tipo: 'binaria',
            opciones: ['Sí', 'No', 'En cierto grado', 'No sé'],
            permiteJustificacion: true,
            marcos: ['Decalogo UAM']
          }
        ],
        banco: {
          critical: {
            diagnostico: 'No hay una vía definida para solicitar explicaciones ni un responsable institucional identificado.',
            recomendacion: 'Designar formalmente a la persona o instancia responsable y publicar cómo solicitar una explicación sobre el sistema.',
            fuente: 'Decálogo de Ética UAM (Principio 9); Reglamento de Transparencia de la UAM.'
          },
          moderate: {
            diagnostico: 'Existe un responsable o una vía de solicitud, pero no ambos, o no están comunicados a toda la comunidad afectada.',
            recomendacion: 'Documentar y difundir tanto al responsable institucional como el procedimiento para solicitar explicaciones.',
            fuente: 'Decálogo de Ética UAM (Principio 9); Reglamento de Transparencia de la UAM.'
          },
          optimal: {
            diagnostico: 'Hay un responsable institucional claro y un procedimiento documentado y conocido para solicitar explicaciones.',
            recomendacion: 'Revisar periódicamente las solicitudes recibidas para identificar mejoras al sistema o a su comunicación.',
            fuente: 'Decálogo de Ética UAM (Principio 9); Reglamento de Transparencia de la UAM.'
          }
        }
      }
    ]
  },
  {
    id: 10,
    name: '10. Protección de datos y propiedad intelectual',
    shortName: 'Privacidad y PI',
    question: '¿Garantiza la anonimización de datos personales y el respeto estricto a los derechos de autor y licencias?',
    explanation: 'Cumplimiento irrestricto de la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados (LGPDPPSO) y Ley Federal del Derecho de Autor.',
    indicators: [
      'Anonimización previa de datos personales (nombres, matrículas, correos, expedientes, calificaciones).',
      'Uso exclusivo de obras y corpus con autorización, licencia Creative Commons o de dominio público.',
      'Garantía de que los datos institucionales no sean utilizados para entrenar modelos públicos externos sin consentimiento.'
    ],
    sources: {
      technical: 'Técnicas de Privacidad Diferencial, Reconocimiento de Entidades Nombradas (NER) para desidentificación y Cifrado AES-256.',
      normative: 'Decálogo de Ética UAM (Principio 10), Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados (LGPDPPSO), Ley Federal del Derecho de Autor y Avisos de Privacidad de la Unidad de Transparencia UAM.'
    },
    recommendations: {
      critical: {
        diagnostic: 'Riesgo inminente de violación a la LGPDPPSO por envío de datos personales a APIs externas o uso de material protegido sin licencia.',
        technical: 'Implementar capas de anonimización (expresiones regulares / NER) que enmascaren datos sensibles antes de enviarlos al modelo y purgar conjuntos de datos no licenciados.',
        normative: 'Obtener la validación del Comité de Transparencia de la UAM y elaborar los consentimientos informados requeridos.'
      },
      moderate: {
        diagnostic: 'Se respetan licencias generales pero falta un filtro automatizado para prevenir que las personas usuarias introduzcan accidentalmente datos personales.',
        technical: 'Añadir filtros automáticos de entrada que detecten y bloqueen patrones de correos, matrículas UAM y CURP.',
        normative: 'Publicar el Aviso de Privacidad Integral de la UAM directamente en el portal de la aplicación.'
      },
      optimal: {
        diagnostic: 'Protección integral de datos personales y pleno apego a la propiedad intelectual y licencias universitarias.',
        technical: 'Auditorías periódicas de cumplimiento de privacidad con herramientas criptográficas de hash y enmascaramiento.',
        normative: 'Modelo ejemplar de soberanía de datos y ética en propiedad intelectual institucional.'
      }
    }
  }
];

export interface PrincipleScoreResult {
  principle: DecalogoPrinciple;
  rawScore: number | null; // 1 to 5, or null if not yet evaluated
  scaledScore: number | null; // 2 to 10, or null if not yet evaluated
  riskLevel: RiskLevel;
  riskClass: RiskClass;
  diagnostic: string;
  technicalRecommendation: string;
  normativeRecommendation: string;
}

export type ProgresoPrincipio = 'sin_responder' | 'parcial' | 'completado_validado';

export interface RespuestaCualitativa {
  valor: string;
  justificacion?: string;
}

export interface EvaluationReportState {
  projectTitle: string;
  unit: UAMUnit;
  division: string;
  evaluatorName: string;
  role: UserRole;
  projectDescription: string;
  scores: Record<number, number | null>; // principleId -> 1..5, null = sin evaluar
  completedSafeguards: Record<number, boolean>; // principleId -> salvaguarda atendida
  timestamp: string;
  // --- Ampliación ALTAI (aditivo, ver comentario arriba de PerfilProyecto) ---
  perfilProyecto: PerfilProyecto;
  autovaloraciones: Record<number, NivelMadurez | null>; // principleId -> autovaloración previa al cálculo
  respuestasCualitativas: Record<string, RespuestaCualitativa>; // key = preguntaId
  notasPorPrincipio: Record<number, string>;
  progresoPorPrincipio: Record<number, ProgresoPrincipio>;
}

/**
 * Trazabilidad a marcos normativos (punto 9, Bloque B): si el principio no
 * define `marcos` explícitamente (solo los pilotos lo hacen), se infiere leyendo
 * las fuentes técnica/normativa YA presentes en el dato — no se agrega ninguna
 * atribución nueva, solo se hace explícito lo que el texto existente ya cita.
 */
export function getMarcosForPrinciple(principle: DecalogoPrinciple): Marco[] {
  if (principle.marcos && principle.marcos.length > 0) return principle.marcos;
  const text = `${principle.sources.technical} ${principle.sources.normative}`.toLowerCase();
  const marcos: Marco[] = ['Decalogo UAM'];
  if (text.includes('unesco')) marcos.push('UNESCO 2021');
  if (text.includes('ocde') || text.includes('oecd')) marcos.push('OCDE');
  if (text.includes('lgpdppso') || text.includes('protección de datos') || text.includes('datos personales')) marcos.push('LGPDPPSO');
  return marcos;
}

export function calculatePrincipleResult(principle: DecalogoPrinciple, rawScore: number | null): PrincipleScoreResult {
  if (rawScore == null) {
    return {
      principle,
      rawScore: null,
      scaledScore: null,
      riskLevel: 'Sin evaluar',
      riskClass: 'unscored',
      diagnostic: 'Este principio aún no ha sido evaluado. Responde la pregunta correspondiente en el cuestionario para obtener el diagnóstico y las recomendaciones.',
      technicalRecommendation: '',
      normativeRecommendation: '',
    };
  }

  const scaledScore = Math.min(10, Math.max(1, rawScore * 2));
  let riskLevel: RiskLevel;
  let riskClass: RiskClass;
  let diagnostic: string;
  let technical: string;
  let normative: string;

  if (scaledScore < 6) {
    riskLevel = 'Rojo / Riesgo Crítico';
    riskClass = 'critical';
    diagnostic = principle.recommendations.critical.diagnostic;
    technical = principle.recommendations.critical.technical;
    normative = principle.recommendations.critical.normative;
  } else if (scaledScore < 9) {
    riskLevel = 'Amarillo / Riesgo Moderado';
    riskClass = 'moderate';
    diagnostic = principle.recommendations.moderate.diagnostic;
    technical = principle.recommendations.moderate.technical;
    normative = principle.recommendations.moderate.normative;
  } else {
    riskLevel = 'Verde / Cumplimiento Óptimo';
    riskClass = 'optimal';
    diagnostic = principle.recommendations.optimal.diagnostic;
    technical = principle.recommendations.optimal.technical;
    normative = principle.recommendations.optimal.normative;
  }

  return {
    principle,
    rawScore,
    scaledScore,
    riskLevel,
    riskClass,
    diagnostic,
    technicalRecommendation: technical,
    normativeRecommendation: normative,
  };
}

export function generateStandaloneRadarHtml(
  projectTitle: string,
  results: PrincipleScoreResult[],
  globalScore: number
): string {
  const labels = results.map(r => r.principle.shortName);
  const data = results.map(r => r.scaledScore ?? 0);
  const recommendations = results.map(r => {
    return `${r.principle.name}: [${r.riskLevel}] ${r.technicalRecommendation || 'Sin evaluar todavía.'}`;
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Radar de IA Responsable UAM - ${projectTitle.replace(/"/g, '&quot;')}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #16181D;
      color: #F6F8FA;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      margin: 0;
    }
    .card {
      background: #1F2229;
      border: 1px solid #3A414A;
      border-radius: 16px;
      padding: 24px;
      max-width: 800px;
      width: 100%;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    h1 {
      font-size: 1.5rem;
      margin: 0 0 8px 0;
      color: #CD032E;
      text-align: center;
    }
    p.subtitle {
      color: #9AA3AD;
      font-size: 0.9rem;
      text-align: center;
      margin-bottom: 20px;
    }
    .chart-container {
      position: relative;
      height: 480px;
      width: 100%;
    }
    .hover-tip {
      margin-top: 16px;
      padding: 12px 16px;
      background: #16181D;
      border-left: 4px solid #CD032E;
      border-radius: 6px;
      font-size: 0.85rem;
      color: #E4E8EC;
      min-height: 48px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>UAM: Diagnóstico Ético de IA (Decálogo Institucional)</h1>
    <p class="subtitle">Proyecto: <strong>${projectTitle.replace(/</g, '&lt;')}</strong> | Calificación Global: <strong>${globalScore > 0 ? globalScore.toFixed(1) + ' / 10' : 'Sin evaluar'}</strong></p>
    <div class="chart-container">
      <canvas id="uamRadarChart"></canvas>
    </div>
    <div id="dynamicHoverInfo" class="hover-tip">
      👉 <em>Pasa el cursor sobre los vértices o datos del gráfico para ver la recomendación específica de cada principio.</em>
    </div>
  </div>

  <script>
    const labels = ${JSON.stringify(labels)};
    const dataPoints = ${JSON.stringify(data)};
    const recs = ${JSON.stringify(recommendations)};

    const ctx = document.getElementById('uamRadarChart').getContext('2d');
    const tipBox = document.getElementById('dynamicHoverInfo');

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Puntaje de Alineación (Escala 1 a 10)',
          data: dataPoints,
          backgroundColor: 'rgba(58, 65, 74, 0.20)',
          borderColor: '#3A414A',
          borderWidth: 2.5,
          pointBackgroundColor: dataPoints.map(v => v === 0 ? '#9AA3AD' : v >= 9 ? '#1E7D34' : (v >= 6 ? '#B26A00' : '#B00710')),
          pointBorderColor: '#ffffff',
          pointHoverRadius: 8,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
              color: '#9AA3AD',
              backdropColor: 'transparent'
            },
            grid: { color: 'rgba(228, 232, 236, 0.15)' },
            angleLines: { color: 'rgba(228, 232, 236, 0.2)' },
            pointLabels: {
              color: '#F6F8FA',
              font: { size: 12, weight: '600' }
            }
          }
        },
        plugins: {
          legend: { labels: { color: '#E4E8EC' } },
          tooltip: {
            callbacks: {
              afterLabel: function(context) {
                const index = context.dataIndex;
                return "\\nRecomendación: " + recs[index];
              }
            }
          }
        },
        onHover: (event, activeElements) => {
          if (activeElements && activeElements.length > 0) {
            const index = activeElements[0].index;
            const score = dataPoints[index];
            const status = score >= 9 ? '🟢 Cumplimiento Óptimo' : (score >= 6 ? '🟡 Riesgo Moderado' : '🔴 Riesgo Crítico');
            tipBox.innerHTML = '<strong>' + labels[index] + ' (' + score + '/10) [' + status + ']:</strong> ' + recs[index];
          }
        }
      }
    });
  </script>
</body>
</html>`;
}

export function generateMarkdownReport(
  projectTitle: string,
  unit: UAMUnit,
  division: string,
  evaluatorName: string,
  role: UserRole,
  results: PrincipleScoreResult[],
  globalScore: number,
  extra?: {
    perfilProyecto?: PerfilProyecto;
    autovaloraciones?: Record<number, NivelMadurez | null>;
    notasPorPrincipio?: Record<number, string>;
  }
): string {
  const perfilSection = (() => {
    const p = extra?.perfilProyecto;
    if (!p) return '';
    const hasData = p.tipoSistema.length > 0 || p.autonomo || p.autoaprendizaje || p.decideSobrePersonas || p.abortoSeguro || p.supervision !== 'no_aplica';
    if (!hasData) return '';
    return `
## Perfil del Sistema de IA
- **Tipo de sistema:** ${p.tipoSistema.length > 0 ? p.tipoSistema.join(', ') : 'No especificado'}
- **Autónomo:** ${p.autonomo ? 'Sí' : 'No'} | **Se reentrena en producción:** ${p.autoaprendizaje ? 'Sí' : 'No'} | **Decide sobre personas:** ${p.decideSobrePersonas ? 'Sí' : 'No'}
- **Supervisión humana:** ${p.supervision}
- **Mecanismo de detención segura ("stop"):** ${p.abortoSeguro ? 'Sí' : 'No'}

---
`;
  })();

  const autovaloracionSection = (() => {
    const av = extra?.autovaloraciones;
    if (!av) return '';
    const entries = results
      .map(r => ({ r, nivel: av[r.principle.id] }))
      .filter(e => e.nivel != null);
    if (entries.length === 0) return '';
    const rows = entries
      .map(({ r, nivel }) => `| ${r.principle.name} | ${NIVEL_MADUREZ_LABEL[nivel as NivelMadurez]} | ${r.riskLevel} |`)
      .join('\n');
    return `
## Autovaloración vs. Resultado Calculado

| Principio | Tu autovaloración | Resultado calculado |
| :--- | :--- | :--- |
${rows}

---
`;
  })();

  const notasSection = (() => {
    const notas = extra?.notasPorPrincipio;
    if (!notas) return '';
    const entries = results
      .map(r => ({ r, texto: notas[r.principle.id] }))
      .filter(e => e.texto && e.texto.trim() !== '');
    if (entries.length === 0) return '';
    const items = entries.map(({ r, texto }) => `- **${r.principle.name}:** ${texto}`).join('\n');
    return `
## Notas de Seguimiento

${items}

---
`;
  })();

  const tableRows = results
    .map(
      r => `| **${r.principle.name}** | **${r.scaledScore != null ? r.scaledScore.toFixed(1) + ' / 10' : 'Sin evaluar'}** | **${r.riskLevel}** |`
    )
    .join('\n');

  const detailedSections = results
    .map(
      r => `### ${r.principle.name}
- **Puntaje Escala 1-10:** ${r.scaledScore != null ? r.scaledScore + ' / 10' : 'Sin evaluar'}
- **Semáforo de Riesgo:** ${r.riskLevel}
- **Marcos:** ${getMarcosForPrinciple(r.principle).join(', ')}
- **Diagnóstico:** ${r.diagnostic}
- **Recomendación Técnica:** ${r.technicalRecommendation || 'N/A — principio sin evaluar.'}
  * *Fuente Técnica:* ${r.principle.sources.technical}
- **Recomendación Normativa (UAM):** ${r.normativeRecommendation || 'N/A — principio sin evaluar.'}
  * *Fuente Normativa:* ${r.principle.sources.normative}
`
    )
    .join('\n\n');

  return `# REPORTE DE AUTODIAGNÓSTICO DE IA RESPONSABLE UAM
**Universidad Autónoma Metropolitana**
*Evaluación Institucional conforme al Decálogo de Ética para el Uso de la IA*

---

> **Aviso institucional:** El diagnóstico y las recomendaciones de este reporte provienen de contenido fijo, predefinido a partir del Decálogo de Ética UAM para cada nivel de la escala. Los resultados son de carácter orientativo e ilustrativo y deben ser verificados y validados formalmente por personas especialistas o comités colegiados institucionales de la UAM.

---

## 1. Datos del Proyecto Evaluado
- **Título del Proyecto:** ${projectTitle || 'No especificado'}
- **Unidad Universitaria:** ${unit}
- **División / Coordinación:** ${division || 'No especificada'}
- **Persona Evaluadora / Titular:** ${evaluatorName || 'No especificada'} (${role})
- **Calificación Global:** **${globalScore > 0 ? globalScore.toFixed(1) + ' / 10' : 'Sin evaluar aún'}**
- **Fecha de Dictamen:** ${new Date().toLocaleDateString('es-MX', { dateStyle: 'full' })}

---

## 2. a) TABLA DE RESULTADOS

| Principio del Decálogo UAM | Puntaje (1-10) | Estado de Riesgo |
| :--- | :---: | :--- |
${tableRows}

---
${perfilSection}${autovaloracionSection}${notasSection}
## 3. b) CÓDIGO DEL GRÁFICO RADIAL (RADAR CHART - HTML/JS)

\`\`\`html
${generateStandaloneRadarHtml(projectTitle, results, globalScore)}
\`\`\`

---

## 4. c) ANÁLISIS Y RECOMENDACIONES DINÁMICAS POR PRINCIPIO

${detailedSections}

---
*Reporte generado con base en el Decálogo de Ética para el Uso de la IA de la UAM, la Recomendación de la UNESCO sobre la Ética de la IA (2021), los Principios de la OCDE y la LGPDPPSO.*
`;
}
