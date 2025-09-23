export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export enum VisualizationType {
  PROFILE_CHART = 'profile_chart',
  MAP = 'map',
  TIME_SERIES_CHART = 'time_series_chart',
  MAP_COMPARISON = 'map_comparison',
  DENSITY_MAP = 'density_map',
  WELCOME = 'welcome',
  LOADING = 'loading',
}

export interface ProfileChartData {
  depth: number;
  value: number;
}

export interface TimeSeriesChartData {
  date: string; // e.g., "2024-01-15"
  value: number;
}

export interface MapData {
  lat: number;
  lon: number;
  id: string;
}

export interface DensityMapData {
    lat: number;
    lon: number;
    density: number; // 0 to 1
}

export interface Filters {
  dateRange: { start: string; end: string };
  sensorType: string;
}

interface ProfileChartVisualization {
  type: VisualizationType.PROFILE_CHART;
  title: string;
  data: ProfileChartData[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface TimeSeriesChartVisualization {
    type: VisualizationType.TIME_SERIES_CHART;
    title: string;
    data: TimeSeriesChartData[];
    xAxisLabel?: string;
    yAxisLabel?: string;
}

interface MapVisualization {
  type: VisualizationType.MAP;
  title: string;
  data: MapData[];
}

interface DensityMapVisualization {
    type: VisualizationType.DENSITY_MAP;
    title: string;
    data: DensityMapData[];
}

interface MapComparisonData {
    title: string;
    data: MapData[];
}

interface MapComparisonVisualization {
    type: VisualizationType.MAP_COMPARISON;
    title: string;
    data: {
        mapA: MapComparisonData;
        mapB: MapComparisonData;
    };
}

interface LoadingVisualization {
  type: VisualizationType.LOADING;
  title: string;
  data: null;
}

interface WelcomeVisualization {
  type: VisualizationType.WELCOME;
  title: string;
  data: null;
}

export type VisualizationData =
  | ProfileChartVisualization
  | MapVisualization
  | TimeSeriesChartVisualization
  | MapComparisonVisualization
  | DensityMapVisualization
  | LoadingVisualization
  | WelcomeVisualization;