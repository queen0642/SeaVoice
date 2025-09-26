import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import DataExplorerPage from './components/DataExplorerPage';
import ChatOnlyPage from './components/ChatOnlyPage';
import GamePage from './components/GamePage';

type Page = 'landing' | 'explorer' | 'chat' | 'game';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleNavigate = (page: 'explorer' | 'chat' | 'game') => {
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
      case 'game':
        return (
          <GamePage
            onGoHome={() => setCurrentPage('landing')}
            onNavigate={handleNavigate}
            currentPage="game"
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage
            onStartExplorer={() => setCurrentPage('explorer')}
            onStartChat={() => setCurrentPage('chat')}
            onStartGame={() => setCurrentPage('game')}
          />
        );
    }
  };

  return <div className="App h-full">{renderPage()}</div>;
};

export default App;