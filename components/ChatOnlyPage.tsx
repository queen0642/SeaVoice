import React, { useState } from 'react';
import Header from './Header';
import ChatPanel from './ChatPanel';
import { Message, Filters } from '../types';
import { sendMessageStream } from '../services/geminiService';
// FIX: Import icons for tool buttons
import { IconSparkles, IconSave, IconLoad, IconTrash } from './ui/Icon';

interface ChatOnlyPageProps {
  onGoHome: () => void;
  onNavigate: (page: 'explorer' | 'chat') => void;
  currentPage: 'chat';
}

const CHAT_HISTORY_KEY = 'seaVoiceChatOnlyHistory';

const ChatOnlyPage: React.FC<ChatOnlyPageProps> = ({ onGoHome, onNavigate, currentPage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const newUserMessage: Message = { id: Date.now().toString(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    let aiResponseText = '';
    const aiMessageId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);

    try {
      // FIX: Added missing properties 'depthRange' and 'floatId' to satisfy the Filters type.
      const emptyFilters: Filters = {
        dateRange: { start: '', end: '' },
        sensorType: 'all',
        region: 'all',
        depthRange: { min: '', max: '' },
        floatId: '',
      };
      const stream = sendMessageStream(messageText, messages, language, emptyFilters, 'summarizer');
      
      for await (const chunk of stream) {
        aiResponseText += chunk;
        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
        ));
      }

    } catch (error) {
      console.error(error);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: errorMessage } : msg));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChat = () => {
    const stateToSave = { messages, language, persona: 'summarizer' };
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(stateToSave));
      alert('Chat history saved!');
    } catch (error) {
      console.error("Failed to save chat:", error);
      alert('Could not save chat history.');
    }
  };

  const handleLoadChat = () => {
    const savedStateJSON = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        setMessages(savedState.messages || []);
        setLanguage(savedState.language || 'en');
        alert('Chat history loaded!');
      } catch (error) {
        console.error("Failed to load chat:", error);
        alert('Could not load chat history.');
      }
    } else {
      alert('No saved chat history found.');
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this chat?')) {
      setMessages([]);
    }
  };
  
  const welcomeContent = (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <IconSparkles className="w-24 h-24 text-accent-cyan mb-6" />
        <h2 className="text-3xl font-bold mb-2 text-sea-foam">AI Summarizer</h2>
        <p className="text-slate-gray max-w-xl mb-8">
          Paste any text or ask about a topic, and I will provide a concise summary. This tool is perfect for understanding long articles, research papers, or complex subjects quickly.
        </p>
        <div className="text-left bg-deep-ocean/50 p-6 rounded-lg border border-accent-cyan/30 max-w-lg">
            <h3 className="text-lg font-semibold mb-3 text-accent-cyan">How to use:</h3>
            <ul className="space-y-2 text-sea-foam list-disc list-inside text-sm">
                <li>"Summarize the key findings of the latest IPCC report on ocean warming."</li>
                <li>"Give me a summary of this article: [paste article text here]"</li>
                <li>"Explain the concept of ocean acidification in a few paragraphs."</li>
            </ul>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen text-sea-foam font-sans">
      <Header
        language={language}
        setLanguage={setLanguage}
        // FIX: Removed props that don't exist on Header component.
        onGoHome={onGoHome}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />
      <main className="flex-1 flex flex-col m-4 overflow-hidden bg-ocean-blue/70 backdrop-blur-sm rounded-lg border border-accent-cyan/20 shadow-lg">
         {/* FIX: Added tool buttons for chat actions directly within this component. */}
         <div className="flex-shrink-0 p-2 border-b border-accent-cyan/20 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-sea-foam px-2">Summarizer Chat</h2>
            <div className="flex items-center space-x-1">
                <button onClick={handleSaveChat} title="Save Chat" className="p-2 rounded-md text-sea-foam hover:bg-slate-gray/20 transition-colors" aria-label="Save chat session">
                    <IconSave className="w-5 h-5" />
                </button>
                <button onClick={handleLoadChat} title="Load Chat" className="p-2 rounded-md text-sea-foam hover:bg-slate-gray/20 transition-colors" aria-label="Load chat session">
                    <IconLoad className="w-5 h-5" />
                </button>
                <button onClick={handleClearChat} title="Clear Chat" className="p-2 rounded-md text-sea-foam hover:bg-slate-gray/20 transition-colors" aria-label="Clear chat session">
                    <IconTrash className="w-5 h-5" />
                </button>
            </div>
         </div>
         <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            welcomeComponent={welcomeContent}
            showTitle={false}
        />
      </main>
    </div>
  );
};

export default ChatOnlyPage;