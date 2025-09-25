import React, { useState } from 'react';
import Header from './Header';
import FilterPanel from './FilterPanel';
import ChatPanel from './ChatPanel';
import VisualizationPanel from './VisualizationPanel';
import ToolsPanel from './ToolsPanel';
import { Filters, Message, VisualizationData, VisualizationType } from '../types';
import { sendMessageStream } from '../services/geminiService';

const EXPLORER_HISTORY_KEY = 'seaVoiceExplorerHistory';

// Helper to convert array of objects to CSV
const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            headers.map(fieldName => 
                typeof row[fieldName] === 'object' && row[fieldName] !== null 
                ? JSON.stringify(row[fieldName]) 
                : JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
            ).join(',')
        )
    ];
    return csvRows.join('\r\n');
};

const getInitialVisualization = (): VisualizationData => ({
    type: VisualizationType.WELCOME,
    title: 'Welcome to Sea Voice',
    data: null
});

const getInitialFilters = (): Filters => ({
    dateRange: { start: '', end: '' },
    sensorType: 'all',
    region: 'all',
    depthRange: { min: '', max: '' },
    floatId: '',
});

interface DataExplorerPageProps {
  onGoHome: () => void;
  onNavigate: (page: 'explorer' | 'chat') => void;
  currentPage: 'explorer';
}

const DataExplorerPage: React.FC<DataExplorerPageProps> = ({ onGoHome, onNavigate, currentPage }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<Filters>(getInitialFilters());
    const [visualization, setVisualization] = useState<VisualizationData>(getInitialVisualization());
    const [summary, setSummary] = useState<string | null>(null);
    const [language, setLanguage] = useState('en');

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;

        const newUserMessage: Message = { id: Date.now().toString(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);
        setSummary(null);
        setVisualization({ type: VisualizationType.LOADING, title: "Processing your request...", data: null });

        let fullTextResponse = '';
        let jsonBlock = '';
        let inJsonBlock = false;
        
        const aiMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);

        try {
            const stream = sendMessageStream(messageText, messages, language, filters, 'ocean_expert');

            for await (const chunk of stream) {
                fullTextResponse += chunk;
                setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {...msg, text: fullTextResponse.split('```json')[0]} : msg));

                if (fullTextResponse.includes('```json')) {
                    if (!inJsonBlock) {
                        inJsonBlock = true;
                        const summaryText = fullTextResponse.split('```json')[0].trim();
                        setSummary(summaryText);
                    }
                    jsonBlock = fullTextResponse.substring(fullTextResponse.indexOf('```json') + 7);
                    if (jsonBlock.includes('```')) {
                        jsonBlock = jsonBlock.split('```')[0];
                        try {
                            const parsedJson = JSON.parse(jsonBlock);
                            setVisualization(parsedJson as VisualizationData);
                        } catch (e) {
                            console.error("Failed to parse JSON:", e, "JSON content:", jsonBlock);
                        }
                    }
                }
            }

            if (inJsonBlock) {
                 if (jsonBlock.endsWith('```')) {
                    jsonBlock = jsonBlock.slice(0, -3);
                }
                try {
                    const parsedJson = JSON.parse(jsonBlock);
                    setVisualization(parsedJson as VisualizationData);
                } catch (e) {
                    console.error("Final JSON parse failed:", e, "JSON content:", jsonBlock);
                    setVisualization({ type: VisualizationType.WELCOME, title: "Error: Could not render visualization.", data: null });
                }
            } else {
                setSummary(null);
                setVisualization({ type: VisualizationType.WELCOME, title: "Conversational Response", data: null });
            }

        } catch (error) {
            console.error(error);
            const errorMessage = "Sorry, I encountered an error. Please try again.";
            setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {...msg, text: errorMessage } : msg));
            setVisualization({ type: VisualizationType.WELCOME, title: "Error", data: null });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveSession = () => {
      const stateToSave = { messages, filters, visualization, summary, language };
      try {
        localStorage.setItem(EXPLORER_HISTORY_KEY, JSON.stringify(stateToSave));
        alert('Explorer session saved!');
      } catch (error) {
        console.error("Failed to save session:", error);
        alert('Could not save session.');
      }
    };

    const handleLoadSession = () => {
      const savedStateJSON = localStorage.getItem(EXPLORER_HISTORY_KEY);
      if (savedStateJSON) {
        try {
          const savedState = JSON.parse(savedStateJSON);
          setMessages(savedState.messages || []);
          setFilters(savedState.filters || getInitialFilters());
          setVisualization(savedState.visualization || getInitialVisualization());
          setSummary(savedState.summary || null);
          setLanguage(savedState.language || 'en');
          alert('Explorer session loaded!');
        } catch (error) {
          console.error("Failed to load session:", error);
          alert('Could not load session.');
        }
      } else {
        alert('No saved session found.');
      }
    };

    const handleClearSession = () => {
        if (window.confirm('Are you sure you want to clear this session? This will reset filters, chat, and visualizations.')) {
            setMessages([]);
            setFilters(getInitialFilters());
            setVisualization(getInitialVisualization());
            setSummary(null);
        }
    };

    const handleClearVisualization = () => {
        setVisualization(getInitialVisualization());
        setSummary(null);
    }

    const handleExportData = (format: 'csv' | 'json') => {
        if (!visualization.data || visualization.type === VisualizationType.WELCOME || visualization.type === VisualizationType.LOADING) {
            alert("No data available to export.");
            return;
        }

        let dataToConvert: any[] = [];
        switch(visualization.type) {
            case VisualizationType.MAP_COMPARISON:
                dataToConvert = [
                    ...visualization.data.mapA.data.map(d => ({...d, source: visualization.data.mapA.title})),
                    ...visualization.data.mapB.data.map(d => ({...d, source: visualization.data.mapB.title}))
                ];
                break;
            case VisualizationType.TRAJECTORY_MAP:
                dataToConvert = visualization.data.flatMap(traj => 
                    traj.path.map(p => ({ float_id: traj.id, lat: p.lat, lon: p.lon, timestamp: p.timestamp }))
                );
                break;
            default:
                dataToConvert = visualization.data as any[];
        }
        
        if (dataToConvert.length === 0) {
            alert("No data available to export.");
            return;
        };

        const filename = `${visualization.title.replace(/[\s/]/g, '_')}.${format}`;
        let blob: Blob;

        if (format === 'csv') {
            const csvData = convertToCSV(dataToConvert);
            blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        } else {
            const jsonData = JSON.stringify(dataToConvert, null, 2);
            blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
        }

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col min-h-screen text-sea-foam font-sans">
            <Header
                language={language}
                setLanguage={setLanguage}
                onGoHome={onGoHome}
                onNavigate={onNavigate}
                currentPage={currentPage}
            />
            <div className="flex flex-1 min-h-0">
                <aside className="w-1/4 max-w-xs flex-shrink-0 bg-ocean-blue/70 flex flex-col border-r border-accent-cyan/20">
                    <FilterPanel filters={filters} onFilterChange={setFilters} />
                    <ToolsPanel 
                        onSaveSession={handleSaveSession}
                        onLoadSession={handleLoadSession}
                        onClearSession={handleClearSession}
                        onClearVisualization={handleClearVisualization}
                        onExport={handleExportData}
                        isVizExportable={!!visualization.data}
                    />
                    <div className="flex-1 min-h-0">
                      <ChatPanel 
                        messages={messages} 
                        isLoading={isLoading} 
                        onSendMessage={handleSendMessage} 
                        activeFilters={filters} 
                      />
                    </div>
                </aside>
                <main className="flex-1 min-w-0">
                    <VisualizationPanel visualization={visualization} summary={summary} />
                </main>
            </div>
        </div>
    );
};

export default DataExplorerPage;