import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { IconSend, IconSparkles } from './ui/Icon';
import LoadingSpinner from './ui/LoadingSpinner';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  welcomeComponent?: React.ReactNode;
  showTitle?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isLoading, onSendMessage, welcomeComponent, showTitle = true }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, messages.length > 0 ? messages[messages.length-1].text : null]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 min-h-0">
      {showTitle && <h2 className="text-lg font-semibold mb-4 text-sea-foam border-b border-accent-cyan/20 pb-2">Chat</h2>}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.length === 0 && !isLoading && welcomeComponent ? (
          welcomeComponent
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-accent-teal flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-cyan-glow">
                  <IconSparkles className="w-5 h-5 text-deep-ocean" />
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-lg shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-accent-cyan text-deep-ocean rounded-br-none'
                    : 'bg-accent-teal/80 text-sea-foam rounded-bl-none'
                }`}
              >
                <p className="text-sm font-medium whitespace-pre-wrap">{msg.text || <span className="inline-flex items-center"><LoadingSpinner size="sm"/></span>}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 border-t border-accent-cyan/20 pt-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ocean data..."
            className="flex-1 p-2 bg-deep-ocean border border-accent-cyan/30 text-sea-foam rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none transition-shadow"
            disabled={isLoading}
            aria-label="Chat input for asking about ocean data"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-accent-cyan rounded-lg hover:bg-cyan-400 disabled:bg-slate-gray/50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-glow"
            aria-label="Send message"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <IconSend className="w-5 h-5 text-white" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;