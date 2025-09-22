import React from 'react';
import { VisualizationData, VisualizationType } from '../types';
import ChartComponent from './ChartComponent';
import MapComponent from './MapComponent';
import MapComparisonComponent from './MapComparisonComponent';
import { IconSparkles, IconWave } from './ui/Icon';
import LoadingSpinner from './ui/LoadingSpinner';

interface VisualizationPanelProps {
  visualization: VisualizationData;
  summary: string | null;
}

const WelcomeScreen: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <IconWave className="w-24 h-24 text-accent-orange mb-6" />
    <h2 className="text-3xl font-bold mb-2 text-lavender">{title}</h2>
    <p className="text-lilac max-w-md">
      I'm Sea Voice, your AI assistant for ARGO ocean data. Ask me to visualize data from the Indian Ocean.
    </p>
    <div className="mt-8 text-left bg-night-sky/50 p-6 rounded-lg border border-accent-cyan/30 max-w-lg">
        <h3 className="text-lg font-semibold mb-3 text-accent-cyan">Example Prompts:</h3>
        <ul className="space-y-2 text-lavender list-disc list-inside">
            <li>"Show me a temperature profile chart in the Indian Ocean."</li>
            <li>"Plot ARGO float locations in the Bay of Bengal."</li>
            <li>"Compare float density between the Arabian Sea and the Bay of Bengal."</li>
            <li>"Generate a time series of sea surface temperature near Sri Lanka."</li>
        </ul>
    </div>
  </div>
);

const LoadingScreen: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-accent-orange">
        <LoadingSpinner size="lg" />
        <h2 className="text-2xl font-bold mt-6 text-lavender">{title}</h2>
        <p className="text-lilac mt-2">Analyzing data and preparing your visualization...</p>
    </div>
);


const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ visualization, summary }) => {
  
  const showSummary = summary && (
    visualization.type === VisualizationType.PROFILE_CHART ||
    visualization.type === VisualizationType.TIME_SERIES_CHART ||
    visualization.type === VisualizationType.MAP ||
    visualization.type === VisualizationType.MAP_COMPARISON
  );

  const renderVisualization = () => {
    switch (visualization.type) {
      case VisualizationType.WELCOME:
        return <WelcomeScreen title={visualization.title} />;
      case VisualizationType.LOADING:
        return <LoadingScreen title={visualization.title} />;
      case VisualizationType.PROFILE_CHART:
      case VisualizationType.TIME_SERIES_CHART:
        return <ChartComponent {...visualization} />;
      case VisualizationType.MAP:
        return <MapComponent {...visualization} />;
      case VisualizationType.MAP_COMPARISON:
        return <MapComparisonComponent {...visualization} />;
      default:
        return <WelcomeScreen title="Unsupported Visualization" />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full rounded-lg p-4">
      {showSummary && (
        <div className="flex-shrink-0 mb-4 p-3 bg-night-sky/50 rounded-lg border border-accent-cyan/30">
          <h4 className="flex items-center text-md font-semibold text-accent-cyan mb-2">
            <IconSparkles className="w-5 h-5 mr-2" />
            AI Analysis
          </h4>
          <p className="text-sm text-lavender whitespace-pre-wrap">{summary}</p>
        </div>
      )}
      <div className="flex-grow min-h-0">
        {renderVisualization()}
      </div>
    </div>
  );
};

export default VisualizationPanel;
