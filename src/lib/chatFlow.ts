export type StepId =
  | "welcome"
  | "procedure_known"
  | "procedure_area"
  | "procedure_type"
  | "procedure_goal"
  | "procedure_select"
  | "preparation_first_time"
  | "preparation_evaluation"
  | "preparation_timeline"
  | "previous_procedures"
  | "professional_known"
  | "professional_validate"
  | "matching_city"
  | "matching_budget"
  | "matching_gender"
  | "matching_priority"
  | "education"
  | "summary"
  | "form";

export interface ChatMessage {
  id: string;
  type: "bot" | "user" | "options" | "education" | "safety-alert" | "multiselect";
  content: string;
  options?: ChatOption[];
  multiSelectOptions?: string[];
  delay?: number;
}

export interface ChatOption {
  label: string;
  value: string;
  icon?: string;
}

export interface UserProfile {
  procedure?: string;
  procedureArea?: string;
  procedureType?: string;
  procedureGoal?: string;
  isFirstTime?: boolean;
  previousProcedures?: string[];
  hasEvaluation?: boolean;
  timeline?: string;
  preparationLevel?: string;
  hasProfessional?: boolean;
  professionalAction?: string;
  city?: string;
  budget?: string;
  genderPreference?: string;
  priority?: string;
  _welcomeChoice?: string;
}

export const PROCEDURES: Record<string, string[]> = {
  facial: [
    "Rinoplastia",
    "Blefaroplastia",
    "Lifting facial",
    "Otoplastia",
    "Mentoplastia",
    "Bichectomía",
  ],
  corporal: [
    "Liposucción",
    "Abdominoplastia",
    "Aumento mamario",
    "Reducción mamaria",
    "Mastopexia",
    "Gluteoplastia",
    "Lipoescultura",
  ],
  reconstructivo: [
    "Mamoplastia",
    "Injerto cutáneo",
    "Rinoplastia",
    "Queiloplastia",
    "Palatoplastia",
  ],
};

export const PREV_PROCEDURES = [
  "Rinoplastia","Blefaroplastia","Lifting facial","Otoplastia","Mentoplastia",
  "Bichectomía","Mamoplastia","Injerto cutáneo","Queiloplastia","Palatoplastia",
  "Liposucción","Abdominoplastia","Aumento mamario","Reducción mamaria",
  "Mastopexia","Gluteoplastia","Lipoescultura"
];

export function getStepMessages(
  stepId: StepId,
  profile: UserProfile
): ChatMessage[] {
  const id = () => Math.random().toString(36).slice(2);

  switch (stepId) {
    case "welcome":
      return [
        {
          id: id(),
          type: "bot",
          content: "¡Hola! 👋 Bienvenido/a a nuestra plataforma. Estamos aquí para acompañarte en tu proceso de manera segura y consultiva.",
        },
        {
          id: id(),
          type: "bot",
          content: "Te ayudaremos a explorar opciones, resolver dudas y conectarte con profesionales certificados. No damos diagnósticos ni reemplazamos la consulta médica.",
          delay: 900,
        },
        {
          id: id(),
          type: "options",
          content: "¿Tienes claro qué procedimiento te interesa?",
          options: [
            { label: "Sí, lo tengo claro", value: "yes", icon: "✓" },
            { label: "Tengo una idea general", value: "idea", icon: "💭" },
            { label: "No estoy seguro/a", value: "no", icon: "🤔" },
          ],
          delay: 1200,
        },
      ];

    case "procedure_area":
      return [
        ...(profile._welcomeChoice === "yes" ? [] : [{
          id: id(),
          type: "bot" as const,
          content: "No te preocupes, te ayudaremos a identificarlo. Vamos paso a paso.",
        }]),
        {
          id: id(),
          type: "options",
          content: "¿En qué zona del cuerpo estás pensando?",
          options: [
            { label: "Facial", value: "facial", icon: "👤" },
            { label: "Corporal", value: "corporal", icon: "🧍" },
            { label: "No estoy seguro/a", value: "unsure", icon: "❓" },
          ],
          delay: profile._welcomeChoice === "yes" ? 300 : 700,
        },
      ];

    case "procedure_type":
      return [
        {
          id: id(),
          type: "options",
          content: "¿Tu interés es estético o reconstructivo?",
          options: [
            { label: "Estético", value: "aesthetic", icon: "✨" },
            { label: "Reconstructivo", value: "reconstructive", icon: "🏥" },
            { label: "No lo sé aún", value: "unsure", icon: "🤔" },
          ],
        },
      ];

    case "procedure_select": {
      const area = profile.procedureType === "reconstructive"
        ? "reconstructivo"
        : (profile.procedureArea || "facial");
      const procedures = PROCEDURES[area] || [...PROCEDURES.facial, ...PROCEDURES.corporal];
      return [
        {
          id: id(),
          type: "bot",
          content: "Estos son algunos de los procedimientos más comunes en esa área:",
        },
        {
          id: id(),
          type: "options",
          content: "¿Cuál te interesa explorar?",
          options: [
            ...procedures.map((p) => ({ label: p, value: p.toLowerCase() })),
            { label: "Otro procedimiento", value: "other" },
          ],
          delay: 400,
        },
      ];
    }

    case "procedure_goal":
      return [
        {
          id: id(),
          type: "options",
          content: "¿Qué te gustaría mejorar o cambiar?",
          options: [
            { label: "Corregir algo que me incomoda", value: "correct" },
            { label: "Mejorar mi apariencia", value: "improve" },
            { label: "Reconstrucción por accidente/condición", value: "reconstruct" },
            { label: "Prefiero no decir aún", value: "skip" },
          ],
        },
      ];

    case "preparation_first_time":
      return [
        {
          id: id(),
          type: "bot",
          content: "Perfecto. Ahora quiero entender mejor en qué punto del proceso te encuentras.",
        },
        {
          id: id(),
          type: "options",
          content: "¿Es la primera vez que consideras un procedimiento de cirugía plástica?",
          options: [
            { label: "Sí, es mi primera vez", value: "yes", icon: "🌟" },
            { label: "No, ya he tenido procedimientos", value: "no", icon: "📋" },
          ],
          delay: 600,
        },
      ];

    case "previous_procedures":
      return [
        {
          id: id(),
          type: "multiselect",
          content: "¿Qué procedimientos has tenido previamente?",
          multiSelectOptions: PREV_PROCEDURES,
        },
      ];

    case "preparation_evaluation":
      return [
        {
          id: id(),
          type: "options",
          content: "¿Has tenido una valoración médica previa relacionada con este procedimiento?",
          options: [
            { label: "Sí, ya tuve valoración", value: "yes" },
            { label: "No, aún no", value: "no" },
          ],
        },
      ];

    case "preparation_timeline":
      return [
        {
          id: id(),
          type: "options",
          content: "¿Cuál es tu horizonte de tiempo?",
          options: [
            { label: "Lo antes posible", value: "asap", icon: "⚡" },
            { label: "En los próximos 3-6 meses", value: "soon", icon: "📅" },
            { label: "Solo estoy explorando", value: "exploring", icon: "🔍" },
          ],
        },
      ];

    case "professional_known":
      return [
        {
          id: id(),
          type: "bot",
          content: "Hablemos sobre el profesional que realizaría el procedimiento.",
        },
        {
          id: id(),
          type: "options",
          content: "¿Ya tienes un cirujano en mente?",
          options: [
            { label: "Sí, ya tengo uno", value: "yes", icon: "👨‍⚕️" },
            { label: "No, necesito encontrar uno", value: "no", icon: "🔎" },
          ],
          delay: 400,
        },
      ];

    case "professional_validate":
      return [
        {
          id: id(),
          type: "options",
          content: "¿Cómo te gustaría que te ayudemos?",
          options: [
            { label: "Ir al perfil de tu cirujano", value: "profile" },
            { label: "Agendar una asesoría", value: "schedule" },
            { label: "Ver otros profesionales", value: "explore" },
          ],
        },
      ];

    case "matching_city":
      return [
        {
          id: id(),
          type: "bot",
          content: "Te ayudaremos a encontrar al profesional ideal. Necesitamos algunos datos.",
        },
        {
          id: id(),
          type: "options",
          content: "¿En qué ciudad o país te gustaría realizarlo?",
          options: [
            { label: "Medellín", value: "medellin" },
            { label: "Bogotá", value: "bogota" },
            { label: "Barranquilla", value: "barranquilla" },
            { label: "Cali", value: "cali" },
            { label: "Otra ciudad", value: "other" },
          ],
          delay: 400,
        },
      ];

    case "matching_budget":
      return [
        {
          id: id(),
          type: "options",
          content: "¿Cuál es tu presupuesto estimado?",
          options: [
            { label: "Menos de 15 millones", value: "low" },
            { label: "Entre 15 y 20 millones", value: "mid" },
            { label: "Entre 20 y 30 millones", value: "high" },
            { label: "Prefiero no decir", value: "skip" },
          ],
        },
      ];

    case "matching_gender":
      return [
        {
          id: id(),
          type: "options",
          content: "¿Tienes preferencia de género del profesional? (completamente opcional)",
          options: [
            { label: "Masculino", value: "male" },
            { label: "Femenino", value: "female" },
            { label: "Sin preferencia", value: "none" },
          ],
        },
      ];

    case "matching_priority":
      return [
        {
          id: id(),
          type: "options",
          content: "¿Qué es lo más importante para ti al elegir un profesional?",
          options: [
            { label: "Experiencia comprobada", value: "experience", icon: "🏆" },
            { label: "Resultados naturales", value: "natural", icon: "🌿" },
            { label: "Mejor precio", value: "price", icon: "💰" },
            { label: "Cercanía geográfica", value: "location", icon: "📍" },
          ],
        },
      ];

    case "education":
      return [
        {
          id: id(),
          type: "education",
          content: "education-block",
        },
      ];

    case "summary":
      return [
        {
          id: id(),
          type: "bot",
          content: buildSummary(profile),
        },
        {
          id: id(),
          type: "options",
          content: "¿Cómo te gustaría continuar?",
          options: [
            { label: "Ver profesionales recomendados", value: "recommendations", icon: "👨‍⚕️" },
            { label: "Explorar otros profesionales", value: "explore", icon: "🔍" },
            { label: "Explorar otros procedimientos", value: "procedures", icon: "🔬" },
          ],
          delay: 600,
        },
      ];

    default:
      return [];
  }
}

function buildSummary(profile: UserProfile): string {
  const lines: string[] = ["📋 *Resumen de tu perfil:*\n"];

  if (profile.procedure)
    lines.push(`• **Procedimiento de interés:** ${profile.procedure}`);
  if (profile.previousProcedures && profile.previousProcedures.length)
    lines.push(`• **Procedimientos previos:** ${profile.previousProcedures.join(", ")}`);
  if (profile.preparationLevel)
    lines.push(`• **Nivel de decisión:** ${profile.preparationLevel}`);
  if (profile.city)
    lines.push(`• **Ciudad:** ${profile.city}`);
  if (profile.budget)
    lines.push(`• **Presupuesto:** ${profile.budget}`);
  if (profile.priority)
    lines.push(`• **Prioridad:** ${profile.priority}`);

  lines.push("\n_Recuerda: la valoración final siempre debe hacerse con un profesional de la salud._");

  return lines.join("\n");
}

export function getNextStep(
  currentStep: StepId,
  selectedValue: string,
  profile: UserProfile
): StepId {
  void profile;
  switch (currentStep) {
    case "welcome":
      return "procedure_area";
    case "procedure_area":
      if (selectedValue === "unsure") return "procedure_goal";
      return "procedure_type";
    case "procedure_type":
      return "procedure_select";
    case "procedure_goal":
      return "procedure_select";
    case "procedure_known":
      return "procedure_select";
    case "procedure_select":
      return "preparation_first_time";
    case "preparation_first_time":
      return selectedValue === "yes" ? "preparation_evaluation" : "previous_procedures";
    case "previous_procedures":
      return "preparation_evaluation";
    case "preparation_evaluation":
      return "preparation_timeline";
    case "preparation_timeline":
      return "professional_known";
    case "professional_known":
      return selectedValue === "yes" ? "professional_validate" : "matching_city";
    case "professional_validate":
      return "matching_city";
    case "matching_city":
      return "matching_budget";
    case "matching_budget":
      return "matching_gender";
    case "matching_gender":
      return "matching_priority";
    case "matching_priority":
      return "education";
    case "education":
      return "summary";
    case "summary":
      return "form";
    default:
      return "form";
  }
}

export function updateProfile(
  profile: UserProfile,
  step: StepId,
  value: string
): UserProfile {
  const updated = { ...profile };

  switch (step) {
    case "welcome":
      updated._welcomeChoice = value;
      break;
    case "procedure_area":
      updated.procedureArea = value === "unsure" ? "facial" : value;
      break;
    case "procedure_type":
      updated.procedureType = value;
      break;
    case "procedure_goal":
      updated.procedureGoal = value;
      break;
    case "procedure_select":
      updated.procedure = value;
      break;
    case "preparation_first_time":
      updated.isFirstTime = value === "yes";
      break;
    case "preparation_evaluation":
      updated.hasEvaluation = value === "yes";
      break;
    case "preparation_timeline":
      updated.timeline = value;
      updated.preparationLevel =
        value === "exploring" ? "Exploración" :
        value === "soon" ? "Evaluación activa" : "Decisión próxima";
      break;
    case "professional_known":
      updated.hasProfessional = value === "yes";
      break;
    case "professional_validate":
      updated.professionalAction = value;
      break;
    case "matching_city":
      updated.city =
        value === "medellin" ? "Medellín" :
        value === "bogota" ? "Bogotá" :
        value === "barranquilla" ? "Barranquilla" :
        value === "cali" ? "Cali" : value;
      break;
    case "matching_budget":
      updated.budget =
        value === "low" ? "< 15 millones" :
        value === "mid" ? "15–20 millones" :
        value === "high" ? "20–30 millones" : "No especificado";
      break;
    case "matching_gender":
      updated.genderPreference = value;
      break;
    case "matching_priority":
      updated.priority =
        value === "experience" ? "Experiencia" :
        value === "natural" ? "Resultados naturales" :
        value === "price" ? "Precio" : "Cercanía";
      break;
  }

  return updated;
}