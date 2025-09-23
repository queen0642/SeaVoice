import React from 'react';
import { IconOcean, IconSave, IconFolderOpen, IconTrash } from './ui/Icon';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  onSaveChat: () => void;
  onLoadChat: () => void;
  onClearChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, onSaveChat, onLoadChat, onClearChat }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-ocean-blue/80 backdrop-blur-sm border-b border-cyan-glow shadow-lg">
      <div className="flex items-center space-x-3">
        <IconOcean className="w-8 h-8 text-accent-cyan" />
        <h1 className="text-2xl font-bold text-sea-foam tracking-wider">Sea Voice</h1>
        <span className="text-xs font-semibold text-accent-cyan bg-accent-cyan/20 px-2 py-1 rounded-full">ARGO AI</span>
      </div>
      <div className="flex items-center space-x-2">
         <button onClick={onSaveChat} title="Save Chat" aria-label="Save current chat session" className="p-2 text-sea-foam hover:text-accent-cyan hover:bg-slate-gray/20 rounded-lg transition-colors">
            <IconSave className="w-5 h-5" />
        </button>
        <button onClick={onLoadChat} title="Load Chat" aria-label="Load saved chat session" className="p-2 text-sea-foam hover:text-accent-cyan hover:bg-slate-gray/20 rounded-lg transition-colors">
            <IconFolderOpen className="w-5 h-5" />
        </button>
        <button onClick={onClearChat} title="Clear Chat" aria-label="Clear current chat and start new session" className="p-2 text-sea-foam hover:text-red-500 hover:bg-slate-gray/20 rounded-lg transition-colors">
            <IconTrash className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-gray/50 mx-2"></div>

        <label htmlFor="language-select" className="text-sm text-slate-gray">Language:</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan block p-2"
          aria-label="Select display language"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
        </select>
      </div>
    </header>
  );
};

export default Header;