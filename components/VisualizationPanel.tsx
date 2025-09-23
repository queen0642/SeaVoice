import React from 'react';
import { VisualizationData, VisualizationType } from '../types';
import ChartComponent from './ChartComponent';
import MapComponent from './MapComponent';
import MapComparisonComponent from './MapComparisonComponent';
import DensityMapComponent from './DensityMapComponent';
import TrajectoryMapComponent from './TrajectoryMapComponent';
import TableComponent from './TableComponent';
import { IconSparkles, IconGlobe } from './ui/Icon';
import LoadingSpinner from './ui/LoadingSpinner';

interface VisualizationPanelProps {
  visualization: VisualizationData;
  summary: string | null;
}

const WelcomeScreen: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <IconGlobe className="w-24 h-24 text-accent-cyan mb-6" />
    <h2 className="text-3xl font-bold mb-2 text-sea-foam">{title}</h2>
    <p className="text-slate-gray max-w-md">
      I'm Sea Voice, your AI assistant for ARGO ocean data. Ask me to visualize data from oceans around the world.
    </p>
    <div className="mt-8 text-left bg-deep-ocean/50 p-6 rounded-lg border border-accent-cyan/30 max-w-lg">
        <h3 className="text-lg font-semibold mb-3 text-accent-cyan">Example Prompts:</h3>
        <ul className="space-y-2 text-sea-foam list-disc list-inside">
            <li>"Show me a temperature profile chart in the Pacific Ocean."</li>
            <li>"Plot the trajectory for float 12345 in the Atlantic."</li>
            <li>"Show the data density for salinity sensors worldwide."</li>
            <li>"Compare float density between the North Atlantic and the South Pacific."</li>
            <li>"Give me a table of the latest float positions with timestamps."</li>
        </ul>
    </div>
  </div>
);

const LoadingScreen: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-accent-cyan">
        <LoadingSpinner size="lg" />
        <h2 className="text-2xl font-bold mt-6 text-sea-foam">{title}</h2>
        <p className="text-slate-gray mt-2">Analyzing data and preparing your visualization...</p>
    </div>
);


const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ visualization, summary }) => {
  
  const isDataVisualization = visualization.type !== VisualizationType.WELCOME &&
                                visualization.type !== VisualizationType.LOADING &&
                                !!visualization.data;


  const showSummary = summary && isDataVisualization;

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
      case VisualizationType.DENSITY_MAP:
        return <DensityMapComponent {...visualization} />;
      case VisualizationType.TRAJECTORY_MAP:
        return <TrajectoryMapComponent {...visualization} />;
      case VisualizationType.TABLE_VIEW:
        return <TableComponent {...visualization} />;
      default:
        return <WelcomeScreen title="Unsupported Visualization" />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full rounded-lg p-4">
       <div className="flex-shrink-0 mb-4 flex justify-between items-start">
            {showSummary && (
                <div className="flex-1 p-3 bg-deep-ocean/50 rounded-lg border border-accent-cyan/30">
                    <h4 className="flex items-center text-md font-semibold text-accent-cyan mb-2">
                        <IconSparkles className="w-5 h-5 mr-2" />
                        AI Analysis
                    </h4>
                    <p className="text-sm text-sea-foam whitespace-pre-wrap">{summary}</p>
                </div>
            )}
       </div>
      <div className="flex-grow min-h-0">
        {renderVisualization()}
      </div>
    </div>
  );
};

export default VisualizationPanel;