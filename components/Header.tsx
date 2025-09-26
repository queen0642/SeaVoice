import React from 'react';
import { IconGlobe } from './ui/Icon';

interface HeaderProps {
    language: string;
    setLanguage: (lang: string) => void;
    onGoHome: () => void;
    onNavigate?: (page: 'explorer' | 'chat' | 'game') => void;
    currentPage?: 'explorer' | 'chat' | 'game';
}

const Header: React.FC<HeaderProps> = ({
    language,
    setLanguage,
    onGoHome,
    onNavigate,
    currentPage
}) => {

    return (
        <header className="flex-shrink-0 bg-deep-ocean/80 backdrop-blur-sm border-b border-accent-cyan/20 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoHome}>
                    <IconGlobe className="w-6 h-6 text-accent-cyan" />
                    <h1 className="text-xl font-bold text-sea-foam tracking-wider">Sea Voice</h1>
                </div>

                <div className="flex items-center space-x-4">
                     {onNavigate && currentPage && (
                        <nav className="hidden md:flex items-center space-x-2">
                            <button
                                onClick={() => onNavigate('explorer')}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                                    currentPage === 'explorer'
                                    ? 'bg-accent-cyan text-deep-ocean'
                                    : 'text-sea-foam hover:bg-ocean-blue'
                                }`}
                                aria-current={currentPage === 'explorer' ? 'page' : undefined}
                            >
                                Data Explorer
                            </button>
                            <button
                                onClick={() => onNavigate('chat')}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                                    currentPage === 'chat'
                                    ? 'bg-accent-cyan text-deep-ocean'
                                    : 'text-sea-foam hover:bg-ocean-blue'
                                }`}
                                aria-current={currentPage === 'chat' ? 'page' : undefined}
                            >
                                Summarizer
                            </button>
                             <button
                                onClick={() => onNavigate('game')}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                                    currentPage === 'game'
                                    ? 'bg-accent-cyan text-deep-ocean'
                                    : 'text-sea-foam hover:bg-ocean-blue'
                                }`}
                                aria-current={currentPage === 'game' ? 'page' : undefined}
                            >
                                Games
                            </button>
                        </nav>
                    )}
                    <div>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none p-2"
                            aria-label="Select language"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="hi">हिन्दी</option>
                            <option value="ja">日本語</option>
                            <option value="zh">中文</option>
                            <option value="ru">Русский</option>
                            <option value="pt">Português</option>
                            <option value="ar">العربية</option>
                            <option value="it">Italiano</option>
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
