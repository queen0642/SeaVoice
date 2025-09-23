import React, { useState } from 'react';
import { IconSave, IconLoad, IconTrash, IconDownload, IconFileJson, IconX } from './ui/Icon';

interface ToolsPanelProps {
  onSaveSession: () => void;
  onLoadSession: () => void;
  onClearSession: () => void;
  onClearVisualization: () => void;
  onExport: (format: 'csv' | 'json') => void;
  isVizExportable: boolean;
}

const ToolButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode; }> = ({ onClick, title, children }) => (
    <button
        onClick={onClick}
        title={title}
        className="p-2 rounded-md bg-ocean-blue hover:bg-accent-cyan/20 text-sea-foam hover:text-accent-cyan transition-colors"
        aria-label={title}
    >
        {children}
    </button>
);

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  onSaveSession,
  onLoadSession,
  onClearSession,
  onClearVisualization,
  onExport,
  isVizExportable
}) => {
    const [isExportOpen, setIsExportOpen] = useState(false);

    const handleExport = (format: 'csv' | 'json') => {
        onExport(format);
        setIsExportOpen(false);
    };

    return (
        <div className="p-4 border-b border-accent-cyan/20 flex-shrink-0">
            <h2 className="text-base font-semibold mb-3 text-sea-foam">Tools</h2>
            <div className="grid grid-cols-4 gap-2">
                <ToolButton onClick={onSaveSession} title="Save Session">
                    <IconSave className="w-5 h-5" />
                </ToolButton>
                <ToolButton onClick={onLoadSession} title="Load Session">
                    <IconLoad className="w-5 h-5" />
                </ToolButton>
                 <ToolButton onClick={onClearVisualization} title="Clear Visualization">
                    <IconX className="w-5 h-5" />
                </ToolButton>
                <ToolButton onClick={onClearSession} title="Clear Session">
                    <IconTrash className="w-5 h-5" />
                </ToolButton>
               
                <div className="relative col-span-4">
                    <button
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        disabled={!isVizExportable}
                        className="w-full mt-2 flex items-center justify-center p-2 text-sm font-semibold bg-accent-teal text-white rounded-md hover:bg-teal-400 transition-colors disabled:bg-slate-gray/50 disabled:cursor-not-allowed"
                    >
                        <IconDownload className="w-4 h-4 mr-2" />
                        Export Data
                    </button>
                    {isExportOpen && (
                        <div className="absolute bottom-full mb-2 w-full bg-deep-ocean border border-accent-cyan/30 rounded-md shadow-lg z-10">
                            <button
                                onClick={() => handleExport('csv')}
                                className="w-full text-left px-4 py-2 text-sm text-sea-foam hover:bg-ocean-blue flex items-center"
                            >
                                <span className="font-mono text-xs bg-accent-cyan/20 text-accent-cyan rounded px-1 py-0.5 mr-2">CSV</span>
                                As Comma-Separated
                            </button>
                            <button
                                onClick={() => handleExport('json')}
                                className="w-full text-left px-4 py-2 text-sm text-sea-foam hover:bg-ocean-blue flex items-center"
                            >
                                <IconFileJson className="w-4 h-4 mr-2 text-accent-cyan" />
                                As JSON
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolsPanel;