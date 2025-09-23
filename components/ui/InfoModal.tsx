
import React from 'react';
import { IconX, IconSparkles } from './Icon';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any> | null;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, data }) => {
  if (!isOpen || !data) return null;

  // Format data for display
  const formattedData = Object.entries(data).map(([key, value]) => {
    let displayValue = value;
    if ((key.toLowerCase().includes('timestamp') || key.toLowerCase().includes('date')) && typeof value === 'string') {
        try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
               displayValue = date.toLocaleString();
            }
        } catch (e) {
            // ignore if not a valid date
        }
    } else if (typeof value === 'number') {
        // Only format numbers that are not integers
        if (!Number.isInteger(value)) {
            displayValue = value.toFixed(4);
        }
    }
    return { key, value: displayValue };
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-ocean-blue rounded-lg border border-accent-cyan/30 shadow-2xl shadow-cyan-glow w-full max-w-md m-4 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-accent-cyan/20">
          <h3 className="text-lg font-semibold text-accent-cyan flex items-center">
            <IconSparkles className="w-5 h-5 mr-2" /> {title}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-gray hover:bg-slate-gray/20 hover:text-sea-foam transition-colors"
            aria-label="Close"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <dl className="space-y-3">
            {formattedData.map(({ key, value }) => (
              <div key={key} className="grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-slate-gray capitalize">{key.replace(/_/g, ' ')}</dt>
                <dd className="col-span-2 text-sm text-sea-foam break-all">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InfoModal;
    