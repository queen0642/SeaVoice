import React from 'react';
import { IconFilter, IconCalendar } from './ui/Icon';
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

  const handleSensorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sensorType: e.target.value });
  };

  return (
    <div className="p-4 border-b border-accent-cyan/20 flex-shrink-0">
      <h2 className="flex items-center text-lg font-semibold mb-3 text-sea-foam">
        <IconFilter className="w-5 h-5 mr-2" />
        Data Filters
      </h2>
      <div className="space-y-4">
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
          <label htmlFor="sensor-type" className="text-sm font-medium text-slate-gray block mb-1">
            Sensor Type
          </label>
          <select
            id="sensor-type"
            value={filters.sensorType}
            onChange={handleSensorChange}
            className="w-full p-2 bg-deep-ocean border border-accent-cyan/30 text-sea-foam text-sm rounded-lg focus:ring-2 focus:ring-accent-cyan focus:outline-none"
          >
            <option value="all">All</option>
            <option value="temperature">Temperature</option>
            <option value="salinity">Salinity</option>
            <option value="oxygen">Oxygen</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;