export type TranslationKeys = {
  sidebar: {
    home: string;
    analytics: string;
    users: string;
    campaigns: string;
    settings: string;
  };
  topbar: {
    projectLabel: string;
    projectSelectorAlert: string;
    searchPlaceholder: string;
    searchAlert: string;
    layoutAlert: string;
    notificationsAlert: string;
    profileAlert: string;
  };
  page: {
    title: string;
    subtitle: string;
  };
  riskOverview: {
    title: string;
    low: string;
    medium: string;
    high: string;
    riskWord: string;
  };
  customerList: {
    title: string;
    searchPlaceholder: string;
    filterLabel: string;
    filterAlert: string;
    colName: string;
    colPlan: string;
    colRisk: string;
    colStatus: string;
    statusAtRisk: string;
    statusNeutral: string;
    statusStable: string;
    riskScore: (score: number) => string;
  };
  customerProfile: {
    title: string;
    joined: (date: string) => string;
    xaiTitle: string;
    xaiSubtitle: string;
    pricing: string;
    support: string;
    features: string;
    usability: string;
  };
  churnTrends: {
    title: string;
    churn: string;
    retention: string;
    new: string;
    months: Record<string, string>;
  };
  aiAgent: {
    recTitle: string;
    rec1: string;
    rec2: string;
    rec3: string;
    chatTitle: string;
    micAlert: string;
    sendPlaceholder: string;
    assistantName: string;
    suggestPrefix: string;
    riskLevelHigh: string;
    riskLevelMedium: string;
    riskLevelLow: string;
    initialMessage: (name: string, riskLevel: string, riskScore: number) => string;
    recommendationAction: string;
    aiResponse: (name: string) => string;
    recOptionsAlert: string;
    chatOptionsAlert: string;
    runActionAlert: (title: string) => string;
    voiceAlert: string;
  };
};

export const en: TranslationKeys = {
  sidebar: {
    home: "Home",
    analytics: "Analytics",
    users: "Users",
    campaigns: "Campaigns",
    settings: "Settings",
  },
  topbar: {
    projectLabel: "Project:",
    projectSelectorAlert: "Opening Project Selector...",
    searchPlaceholder: "Search...",
    searchAlert: "Searching for: ",
    layoutAlert: "Opening Layout Settings...",
    notificationsAlert: "Opening Notifications...",
    profileAlert: "Opening User Profile Menu...",
  },
  page: {
    title: "Churn Shield AI",
    subtitle: "Prediction Platform",
  },
  riskOverview: {
    title: "Churn Risk Overview",
    low: "Low",
    medium: "Medium",
    high: "High",
    riskWord: "Risk",
  },
  customerList: {
    title: "Interactive Customer List",
    searchPlaceholder: "Search customers...",
    filterLabel: "Filter",
    filterAlert: "Advanced Filters Modal would open here",
    colName: "Name",
    colPlan: "Plan",
    colRisk: "Risk Score",
    colStatus: "Status",
    statusAtRisk: "At Risk",
    statusNeutral: "Neutral",
    statusStable: "Stable",
    riskScore: (score: number) => `${score}% Risk`,
  },
  customerProfile: {
    title: "Detailed Customer Profile",
    joined: (date: string) => `Joined ${date.replace("Joined ", "").replace("Ingresó en ", "")}`,
    xaiTitle: "Explainable AI (XAI) Reasons",
    xaiSubtitle: "Top Churn Drivers",
    pricing: "Pricing",
    support: "Support",
    features: "Features",
    usability: "Usability",
  },
  churnTrends: {
    title: "Churn Trends (Last 6 Months)",
    churn: "Churn",
    retention: "Retention",
    new: "New",
    months: { Jan: 'Jan', Feb: 'Feb', Mar: 'Mar', Apr: 'Apr', May: 'May', Jun: 'Jun', Jul: 'Jul' }
  },
  aiAgent: {
    recTitle: "AI Recommendations",
    rec1: "Offer 20% Discount",
    rec2: "Schedule Success Call",
    rec3: "Check Billing History",
    chatTitle: "Conversational AI Chat",
    micAlert: "Voice input activated!",
    sendPlaceholder: "Type a message...",
    assistantName: "Agent",
    suggestPrefix: "Recommended action",
    riskLevelHigh: "high",
    riskLevelMedium: "medium",
    riskLevelLow: "low",
    initialMessage: (name: string, riskLevel: string, riskScore: number) => 
      `${name}'s churn risk is ${riskLevel} (${riskScore}%). \nRecommended action: Offer a 20% discount on their next renewal and proactively schedule a customer success call to address concerns.`,
    recommendationAction: "Action Button",
    aiResponse: (name: string) => 
      `I've noted that for ${name}. Would you like me to draft an email template with the proposal?`,
    recOptionsAlert: "Opening Recommendation Options...",
    chatOptionsAlert: "Opening Chat Options...",
    runActionAlert: (title: string) => `Triggering Action: ${title}`,
    voiceAlert: "Voice input activated!"
  }
};

export const es: TranslationKeys = {
  sidebar: {
    home: "Inicio",
    analytics: "Analíticas",
    users: "Usuarios",
    campaigns: "Campañas",
    settings: "Configuración",
  },
  topbar: {
    projectLabel: "Proyecto:",
    projectSelectorAlert: "Abriendo selector de proyecto...",
    searchPlaceholder: "Buscar...",
    searchAlert: "Buscando: ",
    layoutAlert: "Abriendo configuración de vista...",
    notificationsAlert: "Abriendo notificaciones...",
    profileAlert: "Abriendo menú de perfil...",
  },
  page: {
    title: "Churn Shield AI",
    subtitle: "Plataforma de Predicción",
  },
  riskOverview: {
    title: "Resumen de Riesgo de Churn",
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
    riskWord: "Riesgo",
  },
  customerList: {
    title: "Lista de Clientes",
    searchPlaceholder: "Buscar clientes...",
    filterLabel: "Filtro",
    filterAlert: "Los filtros avanzados se abrirán aquí",
    colName: "Nombre",
    colPlan: "Plan",
    colRisk: "Puntuación de Riesgo",
    colStatus: "Estado",
    statusAtRisk: "En Riesgo",
    statusNeutral: "Neutral",
    statusStable: "Estable",
    riskScore: (score: number) => `${score}% Riesgo`,
  },
  customerProfile: {
    title: "Perfil Detallado",
    joined: (date: string) => `Ingresó en ${date.replace("Joined ", "").replace("Ingresó en ", "")}`,
    xaiTitle: "Razones de IA Explicativa (XAI)",
    xaiSubtitle: "Principales Factores de Churn",
    pricing: "Precio",
    support: "Soporte",
    features: "Funciones",
    usability: "Usabilidad",
  },
  churnTrends: {
    title: "Tendencias de Churn (Últimos 6 Meses)",
    churn: "Abandono",
    retention: "Retención",
    new: "Nuevos",
    months: { Jan: 'Ene', Feb: 'Feb', Mar: 'Mar', Apr: 'Abr', May: 'May', Jun: 'Jun', Jul: 'Jul' }
  },
  aiAgent: {
    recTitle: "Recomendaciones de IA",
    rec1: "Ofrecer Descuento del 20%",
    rec2: "Llamada de Éxito del Cliente",
    rec3: "Ver Historial de Facturación",
    chatTitle: "Chat de Asistencia IA",
    micAlert: "¡Entrada de voz activada!",
    sendPlaceholder: "Escribe un mensaje...",
    assistantName: "Asistente",
    suggestPrefix: "Acción sugerida",
    riskLevelHigh: "alto",
    riskLevelMedium: "medio",
    riskLevelLow: "bajo",
    initialMessage: (name: string, riskLevel: string, riskScore: number) => 
      `El riesgo de abandono (churn) de ${name} es ${riskLevel} (${riskScore}%). \nAcción recomendada: Ofrecer un descuento del 20% en su próxima renovación y programar proactivamente una llamada de éxito del cliente para solucionar inquietudes.`,
    recommendationAction: "Ejecutar",
    aiResponse: (name: string) => 
      `He tomado nota sobre eso para ${name}. ¿Te gustaría que redacte una plantilla de correo electrónico con la propuesta?`,
    recOptionsAlert: "Abriendo opciones de recomendaciones...",
    chatOptionsAlert: "Abriendo opciones de chat...",
    runActionAlert: (title: string) => `Iniciando Acción: ${title}`,
    voiceAlert: "¡Entrada de voz activada!"
  }
};
