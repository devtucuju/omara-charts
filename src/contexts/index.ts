// Context exports
export { AppProvider } from './AppContext';
export {
  useAppContext,
  useSelectedModule,
  useSelectedStations,
  useTimeRange,
  useAppData,
  useStations,
  useLoading,
  useError,
} from '../hooks/useAppContext';

// Re-export everything for convenience
export { AppProvider as default } from './AppContext';
