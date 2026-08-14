import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { DestinationRecommendation, ChatMessage, QuizAnswers } from '../types';

interface DestinationAiChatProps {
  destination: DestinationRecommendation;
  userAnswers: QuizAnswers;
}

const SAMPLE_QUESTIONS = [
  'Quels sont les meilleurs quartiers où loger ?',
  'Quels sont les plats typiques à ne surtout pas manquer ?',
  'Y a-t-il des coutumes locales importantes à respecter ?',
  'Quels sont les pièges à touristes à éviter ?'
];

export const DestinationAiChat: React.FC<DestinationAiChatProps> = ({ destination, userAnswers }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Bonjour voyageur des étoiles ! Je suis votre guide local pour ${destination.name} (${destination.country}). Posez-moi toutes vos questions sur les quartiers secrets, la gastronomie authentique, le budget ou les formalités pratiques pour préparer votre voyage d’exception !`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/destination-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationName: destination.name,
          country: destination.country,
          message: text,
          history: messages.slice(-4),
          userAnswers
        })
      });

      if (!res.ok) {
        throw new Error('Erreur de communication avec le serveur');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || `Pour ${destination.name}, c'est une excellente question. Les locaux recommandent toujours de privilégier les marchés de quartier le matin pour une authenticité totale.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Désolé, une petite fluctuation quantique s'est produite. Pour ${destination.name}, n'hésitez pas à consulter les conseils pratiques et l'itinéraire suggéré ci-dessus !`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#030718]/85 border border-cyan-500/25 rounded-[32px] overflow-hidden flex flex-col h-[540px] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-cyan-950/40 border-b border-cyan-500/15 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-400 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <span>Guide Stellaire {destination.name}</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            </h4>
            <p className="text-[11px] text-sky-200/50 font-light">
              Conseils locaux sur mesure propulsés par l’IA
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isAssistant ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[84%] sm:max-w-[75%] rounded-[22px] px-5 py-3.5 shadow-md ${
                  isAssistant
                    ? 'bg-[#020617]/80 border border-cyan-500/20 text-sky-100 font-light leading-relaxed'
                    : 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-medium shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>
                <div
                  className={`text-[10px] mt-1.5 text-right font-mono ${
                    isAssistant ? 'text-sky-200/40' : 'text-slate-950/70 font-semibold'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#020617]/80 border border-cyan-500/20 rounded-[22px] px-5 py-3.5 text-sky-200/60 flex items-center gap-2.5 text-xs font-light">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Le guide explore les archives stellaires...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-5 py-3 bg-black/40 border-t border-cyan-500/15 overflow-x-auto flex gap-2.5 scrollbar-none">
        {SAMPLE_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="flex-shrink-0 text-[11px] px-4 py-2 rounded-full bg-cyan-950/40 hover:bg-cyan-900/60 text-sky-200/80 hover:text-white border border-cyan-500/20 transition-all cursor-pointer font-light"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 bg-[#020617]/90 border-t border-cyan-500/20 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Posez une question sur ${destination.name}...`}
          disabled={isLoading}
          className="flex-1 bg-cyan-950/30 border border-cyan-500/30 rounded-full px-5 py-3 text-xs sm:text-sm text-white placeholder-sky-200/40 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all font-light"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.5)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
