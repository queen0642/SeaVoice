import React from 'react';
import { IconFilter, IconCalendar, IconGlobe, IconRuler, IconId } from './ui/Icon';
import { Filters } from '../types';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    onFilterChange({
      ...filters,
      dateRange: { ...filters.dateRange, [field]: e.target.value },
    });
  };

   const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'min' | 'max') => {
    onFilterChange({
      ...filters,
      depthRange: { ...filters.depthRange, [field]: e.target.value },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 border-b border-accent-cyan/20 flex-shrink-0">
      <h2 className="flex items-center text-lg font-semibold mb-3 text-sea-foam">
        <IconFilter className="w-5 h-5 mr-2" />
        Data Filters
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="region" className="text-sm font-medium text-slate-gray flex items-center mb-1">
            <IconGlobe className="w-4 h-4 mr-2" />
            Region
          </label>
           <select
            id="region"
            name="region"
            value={filters.region}
            onChange={handleInputChange}
            className="w-full p-2 bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none"
            aria-label="Filter data by geographic region"
          >
            <option value="all">All Oceans</option>
            <option value="Pacific Ocean">Pacific Ocean</option>
            <option value="Atlantic Ocean">Atlantic Ocean</option>
            <option value="Indian Ocean">Indian Ocean</option>
            <option value="Southern Ocean">Southern Ocean</option>
            <option value="Arctic Ocean">Arctic Ocean</option>
            <option value="Mediterranean Sea">Mediterranean Sea</option>
            <option value="Caribbean Sea">Caribbean Sea</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-gray flex items-center mb-1">
            <IconCalendar className="w-4 h-4 mr-2" />
            Date Range
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              aria-label="Start date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateChange(e, 'start')}
              className="w-full p-2 bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none"
            />
            <span className="text-slate-gray">-</span>
            <input
              type="date"
              aria-label="End date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateChange(e, 'end')}
              className="w-full p-2 bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none"
            />
          </div>
        </div>
         <div>
          <label className="text-sm font-medium text-slate-gray flex items-center mb-1">
            <IconRuler className="w-4 h-4 mr-2" />
            Depth Range (m)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              aria-label="Minimum depth in meters"
              value={filters.depthRange.min}
              onChange={(e) => handleDepthChange(e, 'min')}
              className="w-full p-2 bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none"
            />
            <span className="text-slate-gray">-</span>
            <input
              type="number"
              placeholder="Max"
              aria-label="Maximum depth in meters"
              value={filters.depthRange.max}
              onChange={(e) => handleDepthChange(e, 'max')}
              className="w-full p-2 bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="sensorType" className="text-sm font-medium text-slate-gray block mb-1">
            Sensor Type
          </label>
          <select
            id="sensorType"
            name="sensorType"
            value={filters.sensorType}
            onChange={handleInputChange}
            className="w-full p-2 bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none"
            aria-label="Filter data by sensor type"
          >
            <option value="all">All</option>
            <option value="temperature">Temperature</option>
            <option value="salinity">Salinity</option>
            <option value="oxygen">Oxygen</option>
            <option value="chlorophyll">Chlorophyll</option>
            <option value="nitrate">Nitrate</option>
            <option value="ph">pH</option>
          </select>
        </div>
         <div>
          <label htmlFor="floatId" className="text-sm font-medium text-slate-gray flex items-center mb-1">
            <IconId className="w-4 h-4 mr-2" />
            Float ID
          </label>
           <input
              id="floatId"
              name="floatId"
              type="text"
              placeholder="e.g., 12345"
              aria-label="Specific ARGO float ID"
              value={filters.floatId}
              onChange={handleInputChange}
              className="w-full p-2 bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none"
            />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;