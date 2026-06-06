"use client";

import { MoreHorizontal, Bot, Send, Mic, Copy, Mail, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDashboard } from "@/context/DashboardContext";

type Message = { id: number; sender: 'user' | 'agent'; text: string; action?: boolean };

const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-bold text-text-bright">{part}</strong>;
    }
    return part;
  });
};

export default function AIAgentPanel() {
  const { selectedCustomer, t, lang } = useDashboard();
  
  const getInitialMessage = (): Message => {
    const isHigh = selectedCustomer.churnProbability > 70;
    const isMed = selectedCustomer.churnProbability > 40;
    const riskLevelStr = isHigh 
      ? t.aiAgent.riskLevelHigh 
      : isMed 
      ? t.aiAgent.riskLevelMedium 
      : t.aiAgent.riskLevelLow;

    const factorDescription = t.customerProfile.factors[selectedCustomer.primaryRiskFactor];
    const initialText = t.aiAgent.initialMessage(selectedCustomer.name, riskLevelStr, selectedCustomer.churnProbability);
    
    // Add additional contextual explanation from the primary risk factor
    const factorExplanation = selectedCustomer.primaryRiskFactor !== "none"
      ? `\n\n[Diagnóstico] El factor principal de riesgo es: ${factorDescription}.`
      : "";

    return {
      id: Date.now(), 
      sender: 'agent', 
      text: initialText + factorExplanation,
      action: true
    };
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [emailingMessageId, setEmailingMessageId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat when new messages are added or when typing state changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleCopyMessage = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSendEmail = (id: number, text: string) => {
    // Copy the full email draft to clipboard as a safe fallback
    navigator.clipboard.writeText(text);
    setEmailingMessageId(id);
    setTimeout(() => setEmailingMessageId(null), 3000);

    let subject = `Propuesta de Retención - Arca Continental`;
    const subjectMatch = text.match(/(?:Asunto|Subject):\s*(.+)/i);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
    }

    let body = text;
    if (subjectMatch) {
      body = text.replace(subjectMatch[0], "").trim();
    }

    // Truncate the mailto body to prevent Outlook/OS from ignoring the URL parameters if too long
    const isTruncated = body.length > 800;
    const mailtoBody = isTruncated 
      ? body.substring(0, 800) + "\n\n... [Borrador completo copiado al portapapeles. Presiona Ctrl+V para pegar]"
      : body;

    const mailtoUrl = `mailto:${selectedCustomer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;
    window.location.href = mailtoUrl;
  };

  // Reset chat messages when selected customer or translation language changes
  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, [selectedCustomer.id, t]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    const newUserMsg: Message = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const updatedMessages = [...messages, newUserMsg];
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          customer: selectedCustomer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      
      const newAiMsg: Message = { 
        id: Date.now() + 1, 
        sender: 'agent', 
        text: data.text 
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error: any) {
      console.error("Error communicating with AI:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        sender: 'agent',
        text: `Error: ${error.message || "Could not reach the AI agent."}`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* AI Recommendations */}
      <div className="bg-card border border-card-border rounded-2xl p-6 shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-red/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-semibold text-text-bright">{t.aiAgent.recTitle}</h3>
          <button 
            onClick={() => alert(t.aiAgent.recOptionsAlert)}
            className="text-text-muted hover:text-text-bright transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          {(t.aiAgent.recs[selectedCustomer.primaryRiskFactor] || t.aiAgent.recs.none).map((rec, index) => {
            const buttonColor = index === 0
              ? "bg-brand-red-muted/60 border-brand-red-border text-brand-red hover:bg-brand-red hover:text-white"
              : "bg-brand-brown-muted/60 border-brand-brown-border text-brand-brown hover:bg-brand-brown hover:text-white";
            return (
              <RecommendationItem 
                key={rec}
                number={index + 1} 
                title={rec} 
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      </div>

      {/* Conversational AI Chat */}
      <div className="bg-card border border-card-border rounded-2xl p-6 shadow-xl flex-1 flex flex-col relative overflow-hidden group transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-brown/5 via-transparent to-brand-red/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glow borders using CSS variables */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-brown-border to-brand-red-border rounded-2xl -z-10 blur-[1px]"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-semibold text-text-bright">{t.aiAgent.chatTitle}</h3>
          <button 
            onClick={() => alert(t.aiAgent.chatOptionsAlert)}
            className="text-text-muted hover:text-text-bright transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="h-[350px] flex flex-col gap-4 relative z-10 overflow-y-auto scrollbar-custom mb-4 pr-2">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.sender === 'agent' && (
                <div className="w-8 h-8 rounded-full bg-brand-red-muted border border-brand-red-border flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-brand-red" />
                </div>
              )}
              <div className={`p-4 text-sm leading-relaxed shadow-sm max-w-[85%] border group/bubble relative
                ${msg.sender === 'user' 
                  ? 'bg-brand-red-muted/80 border-brand-red-border rounded-2xl rounded-tr-sm text-text-bright' 
                  : 'bg-hover/30 border-card-border/50 rounded-2xl rounded-tl-sm text-foreground'}
              `}>
                {msg.sender === 'agent' ? (
                  msg.action ? (
                    <>
                      <span className="font-bold text-brand-red">{t.aiAgent.assistantName}:</span> {renderFormattedText(msg.text.split('\n')[0])} <br className="mb-2"/>
                      {msg.text.split('\n')[1] && <><span className="font-semibold text-text-bright">{t.aiAgent.suggestPrefix}:</span> {renderFormattedText(msg.text.split('\n')[1].replace('Acción recomendada: ', '').replace('Recommended action: ', ''))}</>}
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="whitespace-pre-wrap">
                        <span className="font-bold text-brand-red">{t.aiAgent.assistantName}:</span> {renderFormattedText(msg.text)}
                      </div>
                      
                      {/* Action buttons (Copy / Email) */}
                      <div className="flex items-center gap-2 mt-1 pt-2 border-t border-card-border/30 opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-hover hover:bg-hover-darker text-text-muted hover:text-text-bright text-xs transition-colors"
                          title="Copiar al portapapeles"
                        >
                          {copiedMessageId === msg.id ? (
                            <>
                              <Check size={12} className="text-green-500" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleSendEmail(msg.id, msg.text)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-brand-red text-white hover:bg-brand-red-hover text-xs font-semibold transition-colors"
                          title={`Enviar correo a ${selectedCustomer.email}`}
                        >
                          <Mail size={12} />
                          <span>{emailingMessageId === msg.id ? "¡Copiado y Abriendo!" : "Enviar Correo"}</span>
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  renderFormattedText(msg.text)
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-2 items-center text-text-muted ml-11 mt-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-brand-red/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-brand-red/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-brand-red/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        <div className="mt-auto relative z-10">
          <div className="relative flex items-center group/input">
            <input 
              type="text" 
              placeholder={t.aiAgent.sendPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') handleSendMessage();
              }}
              className="w-full bg-hover/40 border border-card-border rounded-full pl-10 pr-12 py-3 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all placeholder:text-text-muted/40 shadow-inner"
            />
            <button 
              onClick={() => alert(t.aiAgent.voiceAlert)}
              className="absolute left-3 text-text-muted hover:text-text-bright transition-colors"
            >
               <Mic size={18} />
            </button>
            <button 
              onClick={handleSendMessage}
              className="absolute right-2 w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white hover:bg-brand-red-hover transition-colors shadow-lg shadow-brand-red/20"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendationItem({ number, title, buttonColor }: { number: number, title: string, buttonColor: string }) {
  const { t } = useDashboard();
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <span className="text-text-muted text-sm font-medium">{number}.</span>
        <span className="text-text-bright text-sm font-medium group-hover:text-brand-red transition-colors">{title}</span>
      </div>
      <button 
        onClick={() => alert(t.aiAgent.runActionAlert(title))}
        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${buttonColor}`}
      >
        {t.aiAgent.recommendationAction}
      </button>
    </div>
  );
}
