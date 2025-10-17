import React from 'react';
import ChartContainer from './components/charts/ChartContainer';
import ModuleSelector from './components/filters/ModuleSelector';
import StationFilter from './components/filters/StationFilter';
import { Icon, ApiStatus } from './components/ui';
import { useAppContext } from './contexts';

const App: React.FC = () => {
  const { state } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon
                name="activity"
                size={48}
                className="text-primary-600 mr-3"
              />
              <h1 className="text-4xl font-bold text-gray-900">
                OMARA Charts Dashboard
              </h1>
            </div>
            <p className="text-gray-600">
              Sistema de Visualização de Gráficos por Módulo e Estação
            </p>
          </div>
        </header>

        {/* Filtros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ModuleSelector />
          <StationFilter />
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icon name="info" size={20} className="text-primary-600 mr-2" />
            Estado da Aplicação
          </h3>

          {/* Status da API */}
          <div className="mb-4">
            <ApiStatus />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Módulo:</span>{' '}
              {state.selectedModule}
            </div>
            <div>
              <span className="font-medium">Estações:</span>{' '}
              {state.selectedStations.length}
            </div>
            <div>
              <span className="font-medium">Dados:</span> {state.data.length}
            </div>
            <div>
              <span className="font-medium">Loading:</span>{' '}
              {state.loading ? 'Sim' : 'Não'}
            </div>
          </div>
          {state.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <Icon name="error" size={16} className="text-red-600 mr-2" />
                <span className="text-red-800 text-sm">{state.error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Gráfico */}
        <div className="grid grid-cols-1 gap-6">
          <ChartContainer
            title={`Gráfico - ${state.selectedModule}`}
            className="w-full"
          />
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <Icon name="info" size={20} className="text-blue-600 mr-2" />
            Informações do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>API Base URL:</strong> http://localhost:3333
            </div>
            <div>
              <strong>Módulos Disponíveis:</strong> 3 (Intrusão, Sólidos,
              Inundação)
            </div>
            <div>
              <strong>Estações:</strong> {state.stations.length} carregadas
            </div>
            <div>
              <strong>Status:</strong>{' '}
              {state.loading ? 'Carregando...' : 'Pronto'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
