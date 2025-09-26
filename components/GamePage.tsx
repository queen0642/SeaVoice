import React, { useState } from 'react';
import Header from './Header';
import OceanTriviaGame from './OceanTriviaGame';
import { IconTrophy, IconWave, IconMapPin, IconLightbulb } from './ui/Icon';

interface GamePageProps {
  onGoHome: () => void;
  onNavigate: (page: 'explorer' | 'chat' | 'game') => void;
  currentPage: 'game';
}

type GameID = 'trivia' | 'deep_sea_dash' | 'argo_adventure' | 'ocean_memory';

const GamePage: React.FC<GamePageProps> = ({ onGoHome, onNavigate, currentPage }) => {
  const [language, setLanguage] = useState('en');
  const [selectedGame, setSelectedGame] = useState<GameID>('trivia');

  const games = [
    { id: 'trivia', name: 'Ocean Trivia', icon: <IconTrophy className="w-5 h-5 mr-3" /> },
    { id: 'argo_adventure', name: 'Argo Float Adventure', icon: <IconMapPin className="w-5 h-5 mr-3" />, disabled: true },
    { id: 'ocean_memory', name: 'Ocean Memory Game', icon: <IconLightbulb className="w-5 h-5 mr-3" />, disabled: true },
    { id: 'deep_sea_dash', name: 'Deep Sea Dash', icon: <IconWave className="w-5 h-5 mr-3" />, disabled: true },
  ];

  const renderSelectedGame = () => {
    switch (selectedGame) {
      case 'trivia':
        return <OceanTriviaGame language={language} />;
      case 'argo_adventure':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-3xl font-bold text-sea-foam">Coming Soon!</h2>
            <p className="text-slate-gray mt-4 max-w-md">
              "Argo Float Adventure" is a planned game where you'll guide an Argo float on its data-collecting mission, facing challenges and making discoveries along the way.
            </p>
          </div>
        );
      case 'ocean_memory':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-3xl font-bold text-sea-foam">Coming Soon!</h2>
            <p className="text-slate-gray mt-4 max-w-md">
              Test your memory with "Ocean Memory Game"! Match pairs of fascinating marine creatures and oceanographic instruments.
            </p>
          </div>
        );
      case 'deep_sea_dash':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-3xl font-bold text-sea-foam">Coming Soon!</h2>
            <p className="text-slate-gray mt-4 max-w-md">
              "Deep Sea Dash" is an upcoming adventure where you'll navigate an ARGO float through treacherous underwater canyons. Stay tuned!
            </p>
          </div>
        );
      default:
        return null;
    }
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
      <main className="flex-1 flex m-4 overflow-hidden bg-ocean-blue/70 backdrop-blur-sm rounded-lg border border-accent-cyan/20 shadow-lg">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-deep-ocean/50 border-r border-accent-cyan/20 p-4">
          <h2 className="text-lg font-semibold mb-4 text-sea-foam px-2">Game Library</h2>
          <nav>
            <ul>
              {games.map(game => (
                <li key={game.id}>
                  <button
                    onClick={() => !game.disabled && setSelectedGame(game.id as GameID)}
                    disabled={game.disabled}
                    className={`w-full flex items-center text-left px-3 py-2.5 my-1 rounded-md transition-colors ${
                      selectedGame === game.id
                        ? 'bg-accent-cyan text-deep-ocean font-semibold'
                        : 'text-sea-foam hover:bg-ocean-blue'
                    } ${game.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-current={selectedGame === game.id}
                  >
                    {game.icon}
                    <span>{game.name}</span>
                    {game.disabled && <span className="ml-auto text-xs bg-slate-gray/50 px-2 py-0.5 rounded-full">Soon</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Game Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {renderSelectedGame()}
        </div>
      </main>
    </div>
  );
};

export default GamePage;