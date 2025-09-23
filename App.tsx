import React, { useState } from 'react';
import Header from './components/Header';
import ChatPanel from './components/ChatPanel';
import VisualizationPanel from './components/VisualizationPanel';
import FilterPanel from './components/FilterPanel';
import { Message, VisualizationData, VisualizationType, Filters } from './types';
import { sendMessageStream } from './services/geminiService';

const CHAT_HISTORY_KEY = 'seaVoiceChatHistory';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visualization, setVisualization] = useState<VisualizationData>({
    type: VisualizationType.WELCOME,
    title: 'Welcome to Sea Voice',
    data: null,
  });
  const [summary, setSummary] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: '', end: '' },
    sensorType: 'all',
    region: 'all',
  });

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const newUserMessage: Message = { id: Date.now().toString(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setVisualization({ type: VisualizationType.LOADING, title: 'Processing your request...', data: null });
    setSummary(null);

    let aiResponseText = '';
    const aiMessageId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);

    try {
      const stream = sendMessageStream(messageText, messages, language, filters);
      for await (const chunk of stream) {
        aiResponseText += chunk;
        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
        ));
      }

      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const match = aiResponseText.match(jsonRegex);

      if (match && match[1]) {
        try {
          const jsonObj = JSON.parse(match[1]);
          const textOnly = aiResponseText.replace(jsonRegex, '').trim();
          
          setVisualization(jsonObj as VisualizationData);
          setSummary(textOnly);
          
          setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: "Here is the visualization and summary you requested." } : msg));

        } catch (e) {
          console.error("Failed to parse JSON from AI response:", e);
          setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: "Sorry, I had trouble creating the visualization." } : msg));
          setVisualization({ type: VisualizationType.WELCOME, title: 'Error processing data', data: null });
        }
      } else {
        setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg));
        if (messages.length === 1) {
             setVisualization({ type: VisualizationType.WELCOME, title: 'Welcome to Sea Voice', data: null });
        }
      }

    } catch (error) {
      console.error(error);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, text: errorMessage } : msg));
      setVisualization({ type: VisualizationType.WELCOME, title: 'An error occurred', data: null });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChat = () => {
    const stateToSave = {
      messages,
      visualization,
      summary,
      filters,
      language,
    };
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(stateToSave));
      alert('Chat history saved successfully!');
    } catch (error) {
      console.error("Failed to save chat history:", error);
      alert('Could not save chat history. Local storage might be full.');
    }
  };

  const handleLoadChat = () => {
    const savedStateJSON = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.messages && savedState.visualization && savedState.filters && savedState.language) {
          setMessages(savedState.messages);
          setVisualization(savedState.visualization);
          setSummary(savedState.summary || null);
          setFilters(savedState.filters);
          setLanguage(savedState.language);
          alert('Chat history loaded successfully!');
        } else {
          alert('Saved data is incomplete or invalid.');
        }
      } catch (error) {
        console.error("Failed to parse chat history:", error);
        alert('Could not load chat history. The data may be corrupted.');
        localStorage.removeItem(CHAT_HISTORY_KEY);
      }
    } else {
      alert('No saved chat history found.');
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to start a new chat? This will clear all current messages and visualizations.')) {
      setMessages([]);
      setVisualization({
        type: VisualizationType.WELCOME,
        title: 'Welcome to Sea Voice',
        data: null,
      });
      setSummary(null);
      setFilters({
        dateRange: { start: '', end: '' },
        sensorType: 'all',
        region: 'all',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-deep-ocean text-sea-foam font-sans">
      <Header
        language={language}
        setLanguage={setLanguage}
        onSaveChat={handleSaveChat}
        onLoadChat={handleLoadChat}
        onClearChat={handleClearChat}
      />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col h-full bg-ocean-blue/70 backdrop-blur-sm rounded-lg border border-accent-cyan/20 shadow-lg overflow-hidden">
          <VisualizationPanel visualization={visualization} summary={summary} />
        </div>
        <div className="lg:col-span-1 flex flex-col h-full bg-ocean-blue/70 backdrop-blur-sm rounded-lg border border-accent-cyan/20 shadow-lg overflow-hidden">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
