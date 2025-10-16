/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, AppContextType } from '../types';

// Estado inicial da aplicação
const initialState: AppState = {
  selectedModule: 'intrusion',
  selectedStations: [],
  timeRange: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
    end: new Date(),
  },
  loading: false,
  error: null,
  data: [],
  stations: [],
};

// Reducer para gerenciar o estado
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_MODULE':
      return {
        ...state,
        selectedModule: action.payload,
        // Limpar dados quando mudar módulo
        data: [],
        error: null,
      };

    case 'SET_STATIONS':
      return {
        ...state,
        selectedStations: action.payload,
        // Limpar dados quando mudar estações
        data: [],
        error: null,
      };

    case 'SET_TIME_RANGE':
      return {
        ...state,
        timeRange: action.payload,
        // Limpar dados quando mudar período
        data: [],
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };

    case 'SET_STATIONS_DATA':
      return {
        ...state,
        stations: action.payload,
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
};

// Criar contexto
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider do contexto
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Ações helper para facilitar uso
  const actions = {
    setModule: (module: ModuleType) => {
      dispatch({ type: 'SET_MODULE', payload: module });
    },

    setStations: (stations: string[]) => {
      dispatch({ type: 'SET_STATIONS', payload: stations });
    },

    setTimeRange: (range: DateRange) => {
      dispatch({ type: 'SET_TIME_RANGE', payload: range });
    },

    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    },

    setError: (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },

    setData: (data: ModuleData[]) => {
      dispatch({ type: 'SET_DATA', payload: data });
    },

    setStationsData: (stations: Station[]) => {
      dispatch({ type: 'SET_STATIONS_DATA', payload: stations });
    },

    resetState: () => {
      dispatch({ type: 'RESET_STATE' });
    },
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    actions,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
