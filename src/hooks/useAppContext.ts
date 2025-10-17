import { useContext } from 'react';
import type {
  AppContextType,
  ModuleType,
  ModuleData,
  Station,
  DateRange,
} from '../types';
import { AppContext } from '../contexts/AppContext';

// Hook para usar o contexto
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Hooks específicos para partes do estado
export const useSelectedModule = (): [
  ModuleType,
  (module: ModuleType) => void,
] => {
  const { state, actions } = useAppContext();
  return [state.selectedModule, actions.setModule];
};

export const useSelectedStations = (): [
  string[],
  (stations: string[]) => void,
] => {
  const { state, actions } = useAppContext();
  return [state.selectedStations, actions.setStations];
};

export const useTimeRange = (): [DateRange, (range: DateRange) => void] => {
  const { state, actions } = useAppContext();
  return [state.timeRange, actions.setTimeRange];
};

export const useAppData = (): [ModuleData[], (data: ModuleData[]) => void] => {
  const { state, actions } = useAppContext();
  return [state.data, actions.setData];
};

export const useStations = (): [Station[], (stations: Station[]) => void] => {
  const { state, actions } = useAppContext();
  return [state.stations, actions.setStationsData];
};

export const useLoading = (): [boolean, (loading: boolean) => void] => {
  const { state, actions } = useAppContext();
  return [state.loading, actions.setLoading];
};

export const useError = (): [string | null, (error: string | null) => void] => {
  const { state, actions } = useAppContext();
  return [state.error, actions.setError];
};
