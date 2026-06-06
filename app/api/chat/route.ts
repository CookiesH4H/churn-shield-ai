import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { messages, customer } = await req.json();

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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const replyText = response.text || "No response received from Gemini.";
    return NextResponse.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
