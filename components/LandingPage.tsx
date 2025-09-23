import React from 'react';
import { IconGlobe, IconSparkles } from './ui/Icon';
import OceanGallery from './OceanGallery';
import RegionalData from './RegionalData';

interface LandingPageProps {
  onStartExplorer: () => void;
  onStartChat: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartExplorer, onStartChat }) => {
  return (
    <div className="font-sans text-sea-foam overflow-y-auto h-full">
      {/* Hero Section */}
      <header className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-ocean-blue opacity-50 z-0"></div>
        <div className="relative z-10 p-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white shadow-lg">
              Sea Voice
            </h1>
            <p className="text-xl md:text-2xl text-sea-foam max-w-3xl mx-auto mb-8 shadow-md">
              Your AI-powered conversational interface for exploring global ARGO ocean data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onStartExplorer}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-cyan text-deep-ocean font-bold rounded-lg shadow-lg shadow-cyan-glow transform transition-transform duration-300 hover:scale-105 hover:bg-cyan-400"
                >
                    <IconGlobe className="w-6 h-6" />
                    <span>Explore Data</span>
                </button>
                <button
                    onClick={onStartChat}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-teal text-white font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-teal-400"
                >
                    <IconSparkles className="w-6 h-6" />
                    <span>Start Summarizer</span>
                </button>
            </div>
        </div>
      </header>
      
      <main>
        <OceanGallery />
        <RegionalData />
      </main>

      {/* Footer */}
      <footer className="bg-deep-ocean/80 backdrop-blur-sm border-t border-accent-cyan/20 py-8">
          <div className="container mx-auto text-center text-slate-gray">
              <p>&copy; {new Date().getFullYear()} Sea Voice. All rights reserved.</p>
              <p className="text-sm mt-2">Powered by advanced AI to bring ocean data to your fingertips.</p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;