"use client";

import { MoreHorizontal, Bot, Send, Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";

type Message = { id: number; sender: 'user' | 'agent'; text: string; action?: boolean };

export default function AIAgentPanel() {
  const { selectedCustomer } = useDashboard();
  
  const getInitialMessage = (): Message => ({
    id: Date.now(), 
    sender: 'agent', 
    text: `El riesgo de abandono (churn) de ${selectedCustomer.name} es ${selectedCustomer.risk > 70 ? 'alto' : selectedCustomer.risk > 40 ? 'medio' : 'bajo'} (${selectedCustomer.risk}%). \nAcción recomendada: Ofrecer un descuento del 20% en su próxima renovación y programar proactivamente una llamada de éxito del cliente para solucionar inquietudes.`,
    action: true
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Reset chat messages when selected customer changes
  useEffect(() => {
    setMessages([getInitialMessage()]);
  }, [selectedCustomer.id]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const newAiMsg: Message = { 
        id: Date.now() + 1, 
        sender: 'agent', 
        text: `He tomado nota sobre eso para ${selectedCustomer.name}. ¿Te gustaría que redacte una plantilla de correo electrónico con la propuesta?` 
      };
      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* AI Recommendations */}
      <div className="bg-card border border-card-border rounded-2xl p-6 shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-red/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-semibold text-text-bright">Recomendaciones de IA</h3>
          <button 
            onClick={() => alert("Abriendo opciones de recomendaciones...")}
            className="text-text-muted hover:text-text-bright transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          <RecommendationItem 
            number={1} 
            title="Ofrecer Descuento del 20%" 
            buttonColor="bg-brand-red-muted/60 border-brand-red-border text-brand-red hover:bg-brand-red hover:text-white"
          />
          <RecommendationItem 
            number={2} 
            title="Llamada de Éxito del Cliente" 
            buttonColor="bg-brand-brown-muted/60 border-brand-brown-border text-brand-brown hover:bg-brand-brown hover:text-white"
          />
          <RecommendationItem 
            number={3} 
            title="Ver Historial de Facturación" 
            buttonColor="bg-brand-brown-muted/60 border-brand-brown-border text-brand-brown hover:bg-brand-brown hover:text-white"
          />
        </div>
      </div>

      {/* Conversational AI Chat */}
      <div className="bg-card border border-card-border rounded-2xl p-6 shadow-xl flex-1 flex flex-col relative overflow-hidden group transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-brown/5 via-transparent to-brand-red/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glow borders using CSS variables */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-brown-border to-brand-red-border rounded-2xl -z-10 blur-[1px]"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-semibold text-text-bright">Chat de Asistencia IA</h3>
          <button 
            onClick={() => alert("Abriendo opciones de chat...")}
            className="text-text-muted hover:text-text-bright transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4 relative z-10 overflow-y-auto mb-4 pr-2 max-h-[350px]">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.sender === 'agent' && (
                <div className="w-8 h-8 rounded-full bg-brand-red-muted border border-brand-red-border flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-brand-red" />
                </div>
              )}
              <div className={`bg-hover/30 border border-card-border/50 p-4 text-sm leading-relaxed shadow-sm max-w-[85%]
                ${msg.sender === 'user' ? 'rounded-2xl rounded-tr-sm text-text-bright' : 'rounded-2xl rounded-tl-sm text-foreground'}
              `}>
                {msg.sender === 'agent' ? (
                  <>
                    <span className="font-bold text-brand-red">Asistente:</span> {msg.text.split('\n')[0]} <br className="mb-2"/>
                    {msg.text.split('\n')[1] && <><span className="font-semibold text-text-bright">Acción sugerida:</span> {msg.text.split('\n')[1].replace('Acción recomendada: ', '').replace('Recommended action: ', '')}</>}
                  </>
                ) : (
                  msg.text
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
        </div>

        <div className="mt-auto relative z-10">
          <div className="relative flex items-center group/input">
            <input 
              type="text" 
              placeholder="Escribe un mensaje..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') handleSendMessage();
              }}
              className="w-full bg-hover/40 border border-card-border rounded-full pl-10 pr-12 py-3 text-sm text-text-bright focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all placeholder:text-text-muted/40 shadow-inner"
            />
            <button 
              onClick={() => alert("¡Entrada de voz activada!")}
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
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <span className="text-text-muted text-sm font-medium">{number}.</span>
        <span className="text-text-bright text-sm font-medium group-hover:text-brand-red transition-colors">{title}</span>
      </div>
      <button 
        onClick={() => alert(`Iniciando Acción: ${title}`)}
        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${buttonColor}`}
      >
        Ejecutar
      </button>
    </div>
  );
}
