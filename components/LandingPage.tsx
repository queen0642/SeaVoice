import React from 'react';
import { IconOcean, IconChatBubble, IconChartBar, IconDatabase, IconWaves, IconGlobe } from './ui/Icon';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col h-screen text-sea-foam font-sans overflow-hidden relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex items-center justify-between p-4 bg-ocean-blue/20 backdrop-blur-sm rounded-xl border border-accent-cyan/10">
          <div className="flex items-center space-x-3">
            <IconOcean className="w-10 h-10 text-accent-cyan" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider">
                <span className="text-sea-foam">Sea</span>
                <span className="text-accent-cyan">Voice</span>
              </h1>
              <p className="text-xs text-slate-gray">AI-Powered ARGO Ocean Data Discovery</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-slate-gray font-medium">
            <a href="#" onClick={(e) => { e.preventDefault(); onStart(); }} className="flex items-center space-x-2 hover:text-accent-cyan transition-colors">
              <IconChatBubble className="w-5 h-5" />
              <span>Chat</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onStart(); }} className="flex items-center space-x-2 hover:text-accent-cyan transition-colors">
              <IconChartBar className="w-5 h-5" />
              <span>Visualize</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onStart(); }} className="flex items-center space-x-2 hover:text-accent-cyan transition-colors">
              <IconDatabase className="w-5 h-5" />
              <span>Data</span>
            </a>
          </nav>
          <button
            onClick={onStart}
            className="bg-accent-cyan text-deep-ocean font-bold py-2 px-6 rounded-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-glow"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center text-center p-4">
        <div className="z-0 relative max-w-4xl">
           <IconWaves className="absolute -left-24 -top-8 w-20 h-20 text-accent-cyan/50 transform -rotate-12" />
           <IconGlobe className="absolute -right-24 top-0 w-20 h-20 text-accent-cyan/50 transform rotate-12" />
          
          <h2 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-sea-foam to-accent-cyan bg-clip-text text-transparent mb-4">
            Sea Voice
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-sea-foam mb-2">
            AI-Powered Conversational Interface for
          </h3>
          <h3 className="text-2xl md:text-3xl font-semibold text-accent-cyan mb-6">
            ARGO Ocean Data Discovery and Visualization
          </h3>
          <p className="max-w-2xl mx-auto text-slate-gray mb-10">
            Explore the depths of ocean science through natural conversations. Discover patterns, visualize trends, and unlock insights from the world's largest ocean observation network.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={onStart}
              className="flex items-center space-x-2 bg-accent-cyan text-deep-ocean font-bold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-glow"
            >
              <IconChartBar className="w-5 h-5" />
              <span>Start Exploring</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              className="bg-transparent border-2 border-slate-gray text-slate-gray font-bold py-3 px-8 rounded-lg hover:bg-slate-gray/20 hover:text-sea-foam hover:border-sea-foam transition-colors duration-300"
            >
              View Demo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
