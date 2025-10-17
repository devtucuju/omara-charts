import React from 'react';
import ChartContainer from './components/charts/ChartContainer';
import ModuleSelector from './components/filters/ModuleSelector';
import StationFilter from './components/filters/StationFilter';
import { Icon } from './components/ui';
import { useAppContext } from './contexts';

const App: React.FC = () => {
  const { state } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-2">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="activity" size={48} className="text-primary mr-3" />
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

        {/* Gráfico */}
        <div className="grid grid-cols-1 gap-6">
          <ChartContainer
            title={`Gráfico - ${state.selectedModule}`}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
