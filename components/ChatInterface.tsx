
import React, { useState, useRef, useEffect } from 'react';
import { Message, LocationData } from '../types';
import { askAgriAssistant } from '../services/gemini';

interface ChatInterfaceProps {
  location: LocationData | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ location }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AgriSense assistant. I can help with real-time crop prices, weather-driven planting advice, or troubleshooting pest issues. What's on your mind today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const { text, sources } = await askAgriAssistant(
        input, 
        location ? { lat: location.latitude, lng: location.longitude } : undefined
      );
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        sources,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble accessing real-time data right now. Please check your connection and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-700 text-white rounded-tr-none' 
                  : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                {msg.content}
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, idx) => (
                      <a 
                        key={idx} 
                        href={src.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[11px] bg-stone-50 hover:bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-stone-200 flex items-center gap-1 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {src.title.length > 20 ? src.title.substring(0, 17) + '...' : src.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-emerald-200' : 'text-stone-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-4 flex gap-1 shadow-sm">
              <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-stone-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about fertilizer, market prices, or weather..."
            className="flex-1 bg-stone-100 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-emerald-500 text-sm md:text-base outline-none"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-emerald-700 text-white p-3 rounded-full hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
