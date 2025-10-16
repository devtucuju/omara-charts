// Tipos TypeScript para a aplicação

// Tipos base para dados da API
export interface BaseData {
  _id: string;
  user: string;
  station: string;
  date: string;
  hour: string;
  createdAt: string;
  updatedAt: string;
}

// Dados de Intrusão Salina
export interface IntrusionData extends BaseData {
  satellitePassage: 'sim' | 'não';
  salinityLevel: number;
  tideSituation: 'enchente' | 'vazante' | 'preamar' | 'baixamar';
  moonPhase: 'crescente' | 'minguante' | 'nova' | 'cheia';
  waterMaterials: 'lixo' | 'óleo' | 'folhas' | 'outros';
  weatherCondition:
    | 'bom'
    | 'nublado'
    | 'chuva forte'
    | 'chuva fraca'
    | 'vento forte'
    | 'vento fraco'
    | 'frio'
    | 'calor';
  waterColor: 'clara' | 'escura' | 'normal';
  smell: 'tem cheiro' | 'sem cheiro';
}

// Dados de Sólidos em Suspensão
export interface SolidData extends BaseData {
  satellitePassage: 'sim' | 'não';
  solidsPresent: number;
  transparency: number;
  tideSituation: 'enchente' | 'vazante' | 'preamar' | 'baixamar';
  waterMaterials: 'lixo' | 'óleo' | 'folhas' | 'outros';
  waterColor: 'clara' | 'escura' | 'normal';
}

// Dados de Inundação
export interface InundationData extends BaseData {
  satellitePassage: 'sim' | 'não';
  measuredLevel: number;
  tideSituation: 'enchente' | 'vazante' | 'preamar' | 'baixamar';
  moonPhase: 'crescente' | 'minguante' | 'nova' | 'cheia';
  weatherCondition:
    | 'bom'
    | 'nublado'
    | 'chuva forte'
    | 'chuva fraca'
    | 'vento forte'
    | 'vento fraco'
    | 'frio'
    | 'calor';
}

// Dados de Estação
export interface Station {
  _id: string;
  code: string;
  category: string;
  location: string;
  geo: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
  updatedAt: string;
}

// Tipos para módulos
export type ModuleType = 'intrusion' | 'solid' | 'inundation';
export type ModuleData = IntrusionData | SolidData | InundationData;

// Tipos para gráficos
export interface ChartDataPoint {
  x: string | Date;
  y: number;
  station?: string;
  metadata?: Record<string, any>;
}

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
  fill?: boolean;
  stationId?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter';
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  options?: any;
}

// Tipos para filtros
export interface DateRange {
  start: Date;
  end: Date;
}

export interface StationFilter {
  selected: string[];
  available: Station[];
}

export interface TimeFilter {
  range: DateRange;
  quickFilter?: 'hour' | 'day' | 'week' | 'month';
}

export interface ModuleFilter {
  selected: ModuleType;
  available: ModuleType[];
}

// Tipos para estado da aplicação
export interface AppState {
  selectedModule: ModuleType;
  selectedStations: string[];
  timeRange: DateRange;
  loading: boolean;
  error: string | null;
  data: ModuleData[];
  stations: Station[];
}

// Tipos para ações
export type AppAction =
  | { type: 'SET_MODULE'; payload: ModuleType }
  | { type: 'SET_STATIONS'; payload: string[] }
  | { type: 'SET_TIME_RANGE'; payload: DateRange }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: ModuleData[] }
  | { type: 'SET_STATIONS_DATA'; payload: Station[] }
  | { type: 'RESET_STATE' };

// Tipos para contexto
export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setModule: (module: ModuleType) => void;
    setStations: (stations: string[]) => void;
    setTimeRange: (range: DateRange) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setData: (data: ModuleData[]) => void;
    setStationsData: (stations: Station[]) => void;
    resetState: () => void;
  };
}

// Tipos para hooks
export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (requestFn: () => Promise<any>) => Promise<T | null>;
  reset: () => void;
}

export interface UseChartDataReturn<T> extends UseApiReturn<T> {
  fetchChartData: (
    requestFn: () => Promise<any>,
    transformFn?: (data: T[]) => any
  ) => Promise<any>;
}

// Tipos para configuração
export interface ModuleConfig {
  id: ModuleType;
  name: string;
  description: string;
  maxValue: number;
  unit: string;
  color: string;
}

// Tipos para exportação
export interface ExportOptions {
  format: 'csv' | 'png' | 'pdf';
  filename?: string;
  includeMetadata?: boolean;
}

export default {
  // Re-exportar todos os tipos
  BaseData,
  IntrusionData,
  SolidData,
  InundationData,
  Station,
  ModuleType,
  ModuleData,
  ChartDataPoint,
  ChartDataset,
  ChartConfig,
  DateRange,
  StationFilter,
  TimeFilter,
  ModuleFilter,
  AppState,
  AppAction,
  AppContextType,
  UseApiReturn,
  UseChartDataReturn,
  ModuleConfig,
  ExportOptions,
};
