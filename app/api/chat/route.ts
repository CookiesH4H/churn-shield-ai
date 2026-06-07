import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  let messages: any[] = [];
  let customer: any = null;
  try {
    const body = await req.json();
    messages = body.messages || [];
    customer = body.customer;
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    if (!customer) {
      return NextResponse.json(
        { error: "Customer context is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in the environment." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format details for the system prompt based on the new Customer schema
    const customerDetails = `
- Name: ${customer.name} (${customer.email || "No email"})
- Customer ID: ${customer.id}
- Plan Tier: ${customer.planTier} (${customer.billingCycle} billing)
- Monthly Recurring Revenue (MRR): $${customer.mrr}
- Signup Date: ${customer.signupDate}
- Churn Probability: ${customer.churnProbability}%
- Risk Level: ${customer.riskLevel}
- Primary Risk Factor: ${customer.primaryRiskFactor}
- Inactivity: ${customer.daysInactive} days inactive (Last login: ${customer.lastLogin})
- Sessions (Last 30 days): ${customer.sessionsLast30d}
- Core Feature Usage: ${customer.coreFeatureUsage}%
- Weekly Time Spent: ${customer.timeSpentWeekly} mins
- Payment Failures: ${customer.paymentFailures}
- Open Support Tickets: ${customer.openTickets}
- NPS Score: ${customer.npsScore}/10
`;

    const systemInstruction = `You are Churn Shield AI, an expert customer retention assistant and platform guide for Arca Continental (a major Coca-Cola bottler).
Your job is to:
1. Advise customer success representatives on how to retain the customer currently under review.
2. Answer questions about the Churn Shield AI platform itself.
3. If the user greets you with a simple greeting (e.g., "hola", "hello", "hi"), greet them back warmly, introduce yourself, and ask how you can help today. Do NOT dump detailed customer diagnostics, risk statistics, or emails immediately unless they ask you to analyze the customer or draft an email.

Here is the profile of the customer currently selected/under review:
${customerDetails}

About the Churn Shield AI Platform:
- Purpose: A predictive dashboard built with Next.js, TypeScript, TailwindCSS, and Recharts to manage and reduce customer churn risk.
- Key Components on the Dashboard:
  - Sidebar: Left navigation bar between Home, Analytics, Users, Campaigns, and Settings. It is resizable and collapsible.
  - TopBar: Includes a project selector ("Arca Continental"), search bar, notifications, and language selector (Spanish/English).
  - Churn Risk Overview: A donut/pie chart showing the breakdown of customers by risk level (Low, Medium, High, Critical).
  - Interactive Customer List: Real-time search/filter table. Clicking a customer updates the entire dashboard with their profile and recommendations.
  - Detailed Customer Profile: Displays key metrics of the customer (Inactivity days, Feature usage, Weekly time, MRR, Billing cycle, Payment failures, Open tickets, NPS score, Primary Risk Factor).
  - Churn Trends: Area chart showing the last 6 months of Churn, Retention, and New customers.
  - AI Agent Panel (this chat panel): Offers automatic recommendations based on the customer's primary risk factor, and this live chat powered by Gemini.

When answering, be helpful, professional, and provide clear, actionable advice. If the user asks about the platform, explain its features clearly.
Provide your response in the same language as the conversation (e.g., Spanish if the user writes in Spanish, English if in English).
Keep your answers concise and directly related to the customer or the platform.`;

    // Map message history to Gemini SDK format
    // Filter out messages that might not have standard sender roles
    const contents = messages
      .filter((msg: any) => msg.sender === "user" || msg.sender === "agent")
      .map((msg: any) => {
        return {
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        };
      });

    // Determine thinking budget dynamically based on task type to optimize latency/tokens
    const lastUserMessage = messages[messages.length - 1]?.text || "";
    const queryLower = lastUserMessage.toLowerCase();
    
    // Simple tasks like drafting emails, greetings, or basic extraction don't require thinking
    const isSimpleTask = queryLower.includes("correo") || 
                         queryLower.includes("email") || 
                         queryLower.includes("mail") ||
                         queryLower.includes("redact") || 
                         queryLower.includes("escribir") ||
                         queryLower.includes("hola") ||
                         queryLower.includes("buenos") ||
                         queryLower.includes("saludos") ||
                         queryLower.includes("gracias");

    const thinkingConfig = isSimpleTask 
      ? { thinkingBudget: 0 } 
      : undefined; // Omit to use model's default thinking for reasoning

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        ...(thinkingConfig ? { thinkingConfig } : {})
      }
    });

    const replyText = response.text || "No response received from Gemini.";
    return NextResponse.json({ text: replyText });
  } catch (error: any) {
    console.warn("Gemini API Error/Quota exceeded. Serving high-fidelity fallback response:", error.message || error);
    
    const userMessage = messages[messages.length - 1]?.text || "";
    const fallbackText = getFallbackAIResponse(userMessage, customer);
    
    return NextResponse.json({ 
      text: fallbackText + "\n\n*(Nota: Esta respuesta fue generada por el motor de respaldo local debido a que la API Key de Gemini superó su cuota gratuita de solicitudes diarias)*"
    });
  }
}

function getFallbackAIResponse(userQuery: string, customer: any): string {
  const query = userQuery.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡]/g, "");
  
  // Clean greeting check
  const isGreeting = /^(hola|hello|hi|buenos\s+dias|buenos\s+días|buenas\s+tardes|buenas\s+noches|saludos|que\s+tal|qué\s+tal)$/i.test(query);
  if (isGreeting) {
    return `¡Hola! Soy tu asistente de retención Churn Shield AI para Arca Continental. Estoy aquí para ayudarte a analizar la retención de clientes o a redactar correos para evitar el abandono. ¿En qué te puedo ayudar hoy?`;
  }
  
  if (query.includes("correo") || query.includes("email") || query.includes("redact") || query.includes("escrib")) {
    return `Claro, aquí tienes una propuesta de correo electrónico redactada para **${customer.name}** para evitar que se vaya:

**Asunto: Tu suscripción de Arca Continental - Beneficio de Retención**

Estimado/a contacto en **${customer.name}**,

Es un placer saludarte. Hemos estado revisando nuestras cuentas de socios clave y valoramos mucho la relación comercial que hemos construido juntos en Arca Continental.

Notamos que recientemente han tenido algunas dificultades con ${
      customer.primaryRiskFactor === "payment_failures" 
        ? "los pagos recurrentes en su pasarela" 
        : customer.primaryRiskFactor === "low_usage" 
        ? "el uso de las funciones principales de nuestra plataforma" 
        : customer.primaryRiskFactor === "support_tickets" 
        ? "algunos tickets de soporte técnico que tomaron más tiempo del esperado"
        : "el nivel de actividad en su cuenta"
    }. Queremos asegurarnos de que tengan la mejor experiencia posible con nuestros productos.

Para apoyarlos, queremos ofrecerles un **descuento exclusivo del 20% en su próxima renovación anual** de su plan ${customer.planTier}. Adicionalmente, me gustaría agendar una llamada directa de 15 minutos esta semana para resolver cualquier inquietud técnica o de soporte que tengan activa.

Por favor, avísenos si les parece bien la propuesta o si prefieren agendar la llamada directamente.

Atentamente,
**Equipo de Éxito del Cliente de Arca Continental**`;
  }

  if (query.includes("estrategia") || query.includes("hacer") || query.includes("evitar") || query.includes("retener") || query.includes("suger")) {
    return `Para retener a **${customer.name}** (quien presenta un riesgo **${customer.riskLevel === "high" || customer.riskLevel === "alto" ? "Alto" : customer.riskLevel === "medium" || customer.riskLevel === "medio" ? "Medio" : "Bajo"}** de churn con un **${customer.churnProbability}%**), sugiero realizar las siguientes acciones prioritarias:

1. **Atacar el factor principal (${customer.primaryRiskFactor === "payment_failures" ? "Fallos de Pago" : customer.primaryRiskFactor === "low_usage" ? "Bajo Uso" : "Tickets de Soporte"}):** 
   ${
     customer.primaryRiskFactor === "payment_failures" 
       ? "Enviar un enlace seguro para actualizar sus datos de tarjeta de crédito y coordinar con el equipo de facturación para reprogramar los cobros fallidos."
       : customer.primaryRiskFactor === "low_usage" 
       ? "Agendar una demo personalizada con sus usuarios para presentarles las funciones de valor y acelerar su adopción de la plataforma."
       : "Asignar un especialista de soporte de nivel senior para cerrar todos los tickets pendientes en menos de 24 horas y llamarle para pedir una disculpa formal."
   }
2. **Ofrecer Incentivo Económico:** Otorgar el descuento del 20% propuesto en su renovación del plan ${customer.planTier} ($${customer.mrr}/mes).
3. **Agendar Llamada Directa:** Iniciar un contacto proactivo de acompañamiento comercial.`;
  }

  return `¡Hola! Soy tu asistente de retención Churn Shield AI. He analizado el caso de **${customer.name}** (Probabilidad de Churn: **${customer.churnProbability}%**, Factor principal: **${customer.primaryRiskFactor === "low_usage" ? "Bajo Uso" : customer.primaryRiskFactor === "payment_failures" ? "Fallos de Facturación" : "Tickets y Soporte"}**). 

¿Te gustaría que te redacte una propuesta de correo electrónico comercial para enviársela directamente a su correo (${customer.email || "contacto@empresa.com"})?`;
}
