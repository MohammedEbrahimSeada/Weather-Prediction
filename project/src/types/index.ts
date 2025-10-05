export interface Location {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
}

export interface WeatherVariable {
  id: string;
  name: string;
  unit: string;
  icon: string;
  description: string;
}

export interface WeatherThreshold {
  variableId: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'between';
  value: number;
  value2?: number;
  label: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface QueryParameters {
  location: Location;
  dateRange: DateRange;
  selectedVariables: string[];
  thresholds: WeatherThreshold[];
  includeYears?: number[];
}

export interface WeatherDataPoint {
  date: Date;
  temperature: number;
  temperatureMin: number;
  temperatureMax: number;
  rainfall: number;
  windspeed: number;
  snowfall: number;
  dustConcentration: number;
  cloudCover: number;
}

export interface HistoricalWeatherData {
  location: Location;
  data: WeatherDataPoint[];
  source: string;
  dateRange: DateRange;
}

export interface ProbabilityResult {
  variableId: string;
  variableName: string;
  probability: number;
  threshold: WeatherThreshold;
  historicalOccurrences: number;
  totalDays: number;
  interpretation: string;
}

export interface WeatherAnalysis {
  location: Location;
  dateRange: DateRange;
  probabilities: ProbabilityResult[];
  summary: string;
  riskScore: number;
  historicalData: HistoricalWeatherData;
  generatedAt: Date;
}

export interface ExportData {
  query: QueryParameters;
  analysis: WeatherAnalysis;
  metadata: {
    exportDate: Date;
    dataSource: string;
    apiVersion: string;
    notes: string;
  };
}

export interface SavedQuery {
  id: string;
  userId?: string;
  name: string;
  parameters: QueryParameters;
  createdAt: Date;
}

export interface UserPreferences {
  userId?: string;
  defaultThresholds: WeatherThreshold[];
  favoriteLocations: Location[];
  defaultVariables: string[];
  temperatureUnit: 'celsius' | 'fahrenheit';
  distanceUnit: 'km' | 'miles';
}

export type ChartDataPoint = {
  date: string;
  value: number;
  year?: number;
  label?: string;
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
