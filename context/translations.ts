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
    lastLogin: string;
    daysInactive: string;
    sessions: string;
    usage: string;
    weeklyTime: string;
    failures: string;
    billing: string;
    tickets: string;
    nps: string;
    predictionTitle: string;
    factorLabel: string;
    probLabel: string;
    factors: {
      low_usage: string;
      payment_failures: string;
      support_tickets: string;
      none: string;
    };
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
    recs: Record<"low_usage" | "payment_failures" | "support_tickets" | "none", string[]>;
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
  usersTab: {
    title: string;
    subtitle: string;
    registerBtn: string;
    colId: string;
    colChannel: string;
    colJoined: string;
    filterAllChannels: string;
    filterAllRisks: string;
    modalTitle: string;
    labelName: string;
    labelEmail: string;
    labelChannel: string;
    labelDate: string;
    placeholderName: string;
    placeholderEmail: string;
    btnSubmit: string;
    btnCancel: string;
    successToast: string;
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
    lastLogin: "Last Login",
    daysInactive: "Days Inactive",
    sessions: "Sessions (Last 30d)",
    usage: "Core Feature Usage",
    weeklyTime: "Weekly Time Spent",
    failures: "Payment Failures",
    billing: "Billing Cycle",
    tickets: "Open Tickets",
    nps: "NPS Score",
    predictionTitle: "AI Churn Diagnostics",
    factorLabel: "Primary Risk Factor",
    probLabel: "Churn Probability",
    factors: {
      low_usage: "Low usage of core feature",
      payment_failures: "Recurring payment failures",
      support_tickets: "Unresolved support tickets & low NPS",
      none: "No active risk factors identified"
    }
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
    recs: {
      low_usage: ["Schedule Core Demo", "Send Feature Tutorial", "Offer Support Outreach"],
      payment_failures: ["Retry Payment Gateway", "Send Update Card Link", "Contact Billing Team"],
      support_tickets: ["Escalate Open Tickets", "Schedule Exec Call", "Offer 20% Churn Discount"],
      none: ["Upsell to Premium Plan", "Ask for Review", "Send Loyalty Gift"]
    },
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
  },
  usersTab: {
    title: "Customer Supervision",
    subtitle: "Arca Continental Operators Panel",
    registerBtn: "Register Customer",
    colId: "ID",
    colChannel: "Channel",
    colJoined: "Registration Date",
    filterAllChannels: "All Channels",
    filterAllRisks: "All Risks",
    modalTitle: "Register New Customer",
    labelName: "Company / Contact Name",
    labelEmail: "Contact Email",
    labelChannel: "Distribution Channel",
    labelDate: "Registration Date",
    placeholderName: "e.g., Tienda El Callejón or Juan Pérez",
    placeholderEmail: "e.g., contacto@tienda.com",
    btnSubmit: "Register",
    btnCancel: "Cancel",
    successToast: "Customer registered successfully!"
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
    lastLogin: "Último Inicio de Sesión",
    daysInactive: "Días Inactivos",
    sessions: "Sesiones (Últimos 30 días)",
    usage: "Uso de Función Principal",
    weeklyTime: "Tiempo Semanal",
    failures: "Fallos de Pago",
    billing: "Ciclo de Facturación",
    tickets: "Tickets Abiertos",
    nps: "Puntuación NPS",
    predictionTitle: "Diagnóstico de Churn IA",
    factorLabel: "Factor de Riesgo Principal",
    probLabel: "Probabilidad de Churn",
    factors: {
      low_usage: "Bajo uso de la función principal",
      payment_failures: "Fallos recurrentes de pago",
      support_tickets: "Tickets de soporte sin resolver y bajo NPS",
      none: "Sin factores de riesgo activos"
    }
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
    recs: {
      low_usage: ["Agendar Demo de Función", "Enviar Tutorial de Uso", "Ofrecer Asistencia de Configuración"],
      payment_failures: ["Reintentar Pasarela", "Enviar Enlace de Tarjeta", "Contactar Facturación"],
      support_tickets: ["Escalar Tickets de Soporte", "Agendar Llamada Directa", "Ofrecer 20% de Descuento"],
      none: ["Ofrecer Plan Superior", "Pedir Reseña / NPS", "Enviar Detalle de Fidelización"]
    },
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
  },
  usersTab: {
    title: "Supervisión de Clientes",
    subtitle: "Panel de Operadores Arca Continental",
    registerBtn: "Registrar Cliente",
    colId: "ID",
    colChannel: "Canal",
    colJoined: "Fecha de Registro",
    filterAllChannels: "Todos los Canales",
    filterAllRisks: "Todos los Riesgos",
    modalTitle: "Registrar Nuevo Cliente",
    labelName: "Nombre de la Empresa / Contacto",
    labelEmail: "Correo de Contacto",
    labelChannel: "Canal de Distribución",
    labelDate: "Fecha de Registro",
    placeholderName: "Ej: Tienda El Callejón o Juan Pérez",
    placeholderEmail: "Ej: contacto@tienda.com",
    btnSubmit: "Registrar",
    btnCancel: "Cancelar",
    successToast: "¡Cliente registrado con éxito!"
  }
};
