import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import DataExplorerPage from './components/DataExplorerPage';
import ChatOnlyPage from './components/ChatOnlyPage';

type Page = 'landing' | 'explorer' | 'chat';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleNavigate = (page: 'explorer' | 'chat') => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'explorer':
        return (
          <DataExplorerPage
            onGoHome={() => setCurrentPage('landing')}
            onNavigate={handleNavigate}
            currentPage="explorer"
          />
        );
      case 'chat':
        return (
          <ChatOnlyPage
            onGoHome={() => setCurrentPage('landing')}
            onNavigate={handleNavigate}
            currentPage="chat"
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage
            onStartExplorer={() => setCurrentPage('explorer')}
            onStartChat={() => setCurrentPage('chat')}
          />
        );
    }
  };

  return <div className="App h-full">{renderPage()}</div>;
};

export default App;