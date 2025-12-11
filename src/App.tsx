import React from 'react';
import ChartContainer from './components/charts/ChartContainer';
import ModuleSelector from './components/filters/ModuleSelector';
import StationFilter from './components/filters/StationFilter';
import SolidDataTypeSelector from './components/filters/SolidDataTypeSelector';
import { useAppContext } from './contexts';
import logo from './assets/logo.png';

const App: React.FC = () => {
  const { state } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-2">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src={logo}
                alt="OMARA Logo"
                width={48}
                height={48}
                className="mr-3"
                loading="eager"
              />{' '}
              <h1 className="text-4xl font-bold text-gray-900">
                Observatório Popular do Mar
              </h1>
            </div>
            <p className="text-gray-600">Gráficos por Módulo e Estação</p>
          </div>
        </header>

        {/* Filtros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ModuleSelector />
          {state.selectedModule === 'solid' ? (
            <SolidDataTypeSelector />
          ) : (
            <StationFilter />
          )}
        </div>

        {/* Estações - só mostrar se não for solid ou se o tipo já foi selecionado */}
        {state.selectedModule === 'solid' && state.solidDataType && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div></div>
            <StationFilter />
          </div>
        )}

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
