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
  | LoadingVisualization
  | WelcomeVisualization;
