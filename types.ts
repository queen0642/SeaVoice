export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface Filters {
  dateRange: {
    start: string;
    end: string;
  };
  sensorType: string;
  region: string;
  depthRange: {
    min: string;
    max: string;
  };
  floatId: string;
}

export type Persona = 'ocean_expert' | 'summarizer' | 'conversational_expert' | 'game_master';

export enum VisualizationType {
  WELCOME = 'welcome',
  LOADING = 'loading',
  PROFILE_CHART = 'profile_chart',
  TIME_SERIES_CHART = 'time_series_chart',
  MAP = 'map',
  MAP_COMPARISON = 'map_comparison',
  DENSITY_MAP = 'density_map',
  TRAJECTORY_MAP = 'trajectory_map',
  TABLE_VIEW = 'table_view',
}

export interface ProfileChartData {
  depth: number;
  value: number;
}

export interface TimeSeriesChartData {
  date: string;
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
    density: number;
}

export interface TrajectoryPoint {
  lat: number;
  lon: number;
  timestamp: string;
}

export interface Trajectory {
  id: string;
  path: TrajectoryPoint[];
}

export type TableData = Record<string, any>[];

interface WelcomeData {
  type: VisualizationType.WELCOME;
  title: string;
  data: null;
}

interface LoadingData {
  type: VisualizationType.LOADING;
  title: string;
  data: null;
}

interface ProfileChart {
  type: VisualizationType.PROFILE_CHART;
  title: string;
  data: ProfileChartData[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface TimeSeriesChart {
  type: VisualizationType.TIME_SERIES_CHART;
  title: string;
  data: TimeSeriesChartData[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface Map {
    type: VisualizationType.MAP;
    title: string;
    data: MapData[];
}

interface MapComparisonData {
  title: string;
  data: MapData[];
}

interface MapComparison {
    type: VisualizationType.MAP_COMPARISON;
    title: string;
    data: {
        mapA: MapComparisonData;
        mapB: MapComparisonData;
    };
}

interface DensityMap {
    type: VisualizationType.DENSITY_MAP;
    title: string;
    data: DensityMapData[];
}

interface TrajectoryMap {
    type: VisualizationType.TRAJECTORY_MAP;
    title: string;
    data: Trajectory[];
}

interface TableView {
    type: VisualizationType.TABLE_VIEW;
    title: string;
    data: TableData;
}

export type VisualizationData =
  | WelcomeData
  | LoadingData
  | ProfileChart
  | TimeSeriesChart
  | Map
  | MapComparison
  | DensityMap
  | TrajectoryMap
  | TableView;