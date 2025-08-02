import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, X, MessageCircle } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

const MedicalChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GEMINI_API_KEY = 'AIzaSyBtGkKLxXBnr2ro-qGR3J2-feq5W4HKKwk';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const systemPrompt = `Você é um assistente de estudos especializado no Revalida e na prática médica brasileira. Seu papel é ajudar o usuário com revisões rápidas, esquemas, perguntas de fixação e explicações claras, sempre dentro do contexto do cronograma de estudos que ele está seguindo.

Sempre que o usuário fizer uma pergunta, responda de forma objetiva e prática, como se fosse um colega de residência experiente, mas didático. Use linguagem acessível, evite floreios, e priorize a clareza.

Você deve dominar os temas do cronograma de estudos, incluindo:
- Clínica Médica (CM)
- Cirurgia (CR) 
- Pediatria (PED)
- Ginecologia e Obstetrícia (GO)
- Medicina Preventiva e Saúde Pública (PRE)

Se o usuário não for claro, peça que ele diga o tema ou área para ajudar melhor. Seja direto, mas respeitoso. Nada de ironia ou piadas internas.

Você está integrado a uma plataforma de estudos, então pense como parte do sistema, não como um chatbot genérico. Sempre responda com foco em ajudar o usuário a se preparar para a prova do Revalida 2025.`;

  useEffect(() => {
    // Carregar histórico do localStorage
    const savedHistory = localStorage.getItem('chatbotHistory');
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      // Mensagem inicial
      const initialMessage: Message = {
        text: "👋 Olá! Sou sua IA especializada em Revalida/Enamed. Posso te ajudar com:\n\n• Resumos técnicos de qualquer tema\n• Explicações didáticas\n• Perguntas de fixação\n• Dicas de estudo por área\n\nComo posso te ajudar hoje?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialMessage]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Salvar histórico no localStorage
    if (messages.length > 0) {
      localStorage.setItem('chatbotHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      text: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt + "\n\nPergunta do usuário: " + message
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                        "Desculpe, não consegui processar sua pergunta. Tente novamente.";

      const botMessage: Message = {
        text: aiResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro na chamada da API Gemini:', error);
      const errorMessage: Message = {
        text: "Erro de conexão com a IA. Verifique sua internet e tente novamente.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const quickTopics = [
    "Resumo de Hipertensão Arterial",
    "Diabetes Mellitus principais pontos",
    "Infarto Agudo do Miocárdio tratamento",
    "Pneumonia diagnóstico",
    "Anemia ferropriva pediatria"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <Brain className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5" />
              IA Médica Revalida
            </h3>
            <p className="text-sm opacity-90">Seu assistente de estudos especializado</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}

          {/* Quick Topics (only show if no user messages yet) */}
          {messages.filter(m => m.isUser).length === 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {quickTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(topic)}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 transition-colors"
                >
                  {topic.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm px-4 py-2 flex items-center gap-2">
                <span className="text-sm">🧠 IA pensando</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta sobre medicina..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicalChatbot;