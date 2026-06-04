"use client";

import { MoreHorizontal, Bot, Send, Mic } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";

type Message = { id: number; sender: 'user' | 'agent'; text: string; action?: boolean };

export default function AIAgentPanel() {
  const { selectedCustomer } = useDashboard();
  
  const initialMessages: Message[] = [
    { 
      id: 1, 
      sender: 'agent', 
      text: `${selectedCustomer.name}'s churn risk is ${selectedCustomer.risk > 70 ? 'high' : selectedCustomer.risk > 40 ? 'medium' : 'low'} (${selectedCustomer.risk}%). \nRecommended action: Offer a 20% discount on his next renewal and proactively schedule a 1-on-1 customer success call to discuss billing issues.`,
      action: true
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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
        text: `I've noted that for ${selectedCustomer.name}. Would you like me to draft an email template with the discount offer?` 
      };
      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // Rest of the component is the same, but iterating over `messages`
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* AI Recommendations */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
          <button 
            onClick={() => alert("Opening Recommendation Options...")}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          <RecommendationItem 
            number={1} 
            title="Offer 20% Discount" 
            buttonColor="bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
          />
          <RecommendationItem 
            number={2} 
            title="Schedule Success Call" 
            buttonColor="bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-white"
          />
          <RecommendationItem 
            number={3} 
            title="Check Billing History" 
            buttonColor="bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-white"
          />
        </div>
      </div>

      {/* Conversational AI Chat */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-yellow-500/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glow borders using pseudo elements */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500/30 to-yellow-500/30 rounded-2xl -z-10 blur-[1px]"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-semibold text-white">Conversational AI Chat</h3>
          <button 
            onClick={() => alert("Opening Chat Options...")}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4 relative z-10 overflow-y-auto mb-4 pr-2">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.sender === 'agent' && (
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-yellow-400" />
                </div>
              )}
              <div className={`bg-slate-800/50 border border-slate-700/50 p-4 text-sm leading-relaxed shadow-sm max-w-[85%]
                ${msg.sender === 'user' ? 'rounded-2xl rounded-tr-sm text-slate-200' : 'rounded-2xl rounded-tl-sm text-slate-300'}
              `}>
                {msg.sender === 'agent' ? (
                  <>
                    <span className="font-semibold text-yellow-300">Agent:</span> {msg.text.split('\n')[0]} <br className="mb-2"/>
                    {msg.text.split('\n')[1] && <><span className="font-semibold text-white">Recommended action:</span> {msg.text.split('\n')[1].replace('Recommended action: ', '')}</>}
                  </>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-2 items-center text-slate-500 ml-11 mt-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto relative z-10">
          <div className="relative flex items-center group/input">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') handleSendMessage();
              }}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-full pl-10 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder:text-slate-500 shadow-inner"
            />
            <button 
              onClick={() => alert("Voice input activated!")}
              className="absolute left-3 text-slate-500 hover:text-slate-300 transition-colors"
            >
               <Mic size={18} />
            </button>
            <button 
              onClick={handleSendMessage}
              className="absolute right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black hover:bg-yellow-600 transition-colors shadow-lg shadow-yellow-500/20"
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
        <span className="text-slate-500 text-sm font-medium">{number}.</span>
        <span className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors">{title}</span>
      </div>
      <button 
        onClick={() => alert(`Triggering Action: ${title}`)}
        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${buttonColor}`}
      >
        Action Button
      </button>
    </div>
  );
}
