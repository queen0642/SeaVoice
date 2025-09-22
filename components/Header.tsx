import React from 'react';
import { IconOcean } from './ui/Icon';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-ocean-blue/80 backdrop-blur-sm border-b border-cyan-glow shadow-lg">
      <div className="flex items-center space-x-3">
        <IconOcean className="w-8 h-8 text-accent-cyan" />
        <h1 className="text-2xl font-bold text-sea-foam tracking-wider">Sea Voice</h1>
        <span className="text-xs font-semibold text-accent-cyan bg-accent-cyan/20 px-2 py-1 rounded-full">ARGO AI</span>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="language-select" className="text-sm text-slate-gray">Language:</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan block p-2"
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