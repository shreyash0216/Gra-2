import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return; // Don't send empty messages

    // 1. Add the user's message to the UI immediately
    const newUserMessage = { text: userInput, sender: 'user' as const };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput(""); // Clear the input box

    try {
      setIsLoading(true);
      // 2. Call your AWS Backend
      const aiReply = await getGeminiResponse(userInput);

      // 3. Add the AI's response to the UI
      setMessages(prev => [...prev, { text: aiReply, sender: 'ai' as const }]);
    } catch (err) {
      // 4. Handle errors (like if the backend is down)
      console.error(err);
      setMessages(prev => [...prev, { 
        text: "The AI agent is currently offline. Check your AWS App Runner status.", 
        sender: 'ai' as const 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-navy-900 rounded-3xl border border-parchment-200 dark:border-slate-800 shadow-xl">
      {/* Header */}
      <div className="bg-parchment-100 dark:bg-navy-800 px-6 py-4 border-b border-parchment-200 dark:border-slate-800 rounded-t-3xl">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-navy-900 dark:text-white">Agricultural Advisor</h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
            <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
            <p>Start a conversation with your agricultural advisor</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-parchment-100 dark:bg-slate-800 text-navy-900 dark:text-white rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-parchment-100 dark:bg-slate-800 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-parchment-200 dark:border-slate-800 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about crop recommendations, weather, or farming..."
            className="flex-1 px-4 py-3 border border-parchment-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-navy-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;