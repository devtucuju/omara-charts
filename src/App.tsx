import { useState } from 'react';
import ChartContainer from './components/charts/ChartContainer';
import { Icon } from './components/ui';
import {
  ModuleSelector,
  StationFilter,
  TimeRangeFilter,
} from './components/filters';
import { AppProvider, useAppContext } from './contexts';

// Componente interno que usa o contexto
const AppContent: React.FC = () => {
  const [count, setCount] = useState(0);
  const { state } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Icon name="activity" size={48} className="text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              OMARA Charts Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Sistema de Visualização de Gráficos por Módulo e Estação
          </p>
        </div>

        {/* Componentes de Filtro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ModuleSelector />
          <StationFilter />
          <TimeRangeFilter />
        </div>

        {/* Status e Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Icon name="info" size={20} className="text-primary-600 mr-2" />
              Estado do Contexto
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Módulo:</span>{' '}
                {state.selectedModule}
              </div>
              <div>
                <span className="font-medium">Estações:</span>{' '}
                {state.selectedStations.length} selecionadas
              </div>
              <div>
                <span className="font-medium">Período:</span>{' '}
                {state.timeRange.start.toLocaleDateString()} -{' '}
                {state.timeRange.end.toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Dados:</span> {state.data.length}{' '}
                registros
              </div>
              <div>
                <span className="font-medium">Loading:</span>{' '}
                {state.loading ? 'Sim' : 'Não'}
              </div>
              {state.error && (
                <div className="text-red-600">
                  <span className="font-medium">Erro:</span> {state.error}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Icon name="success" size={20} className="text-green-600 mr-2" />
              Status da Configuração
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Icon
                  name="success"
                  size={16}
                  className="text-green-500 mr-2"
                />
                <span className="text-sm">React + TypeScript</span>
              </div>
              <div className="flex items-center">
                <Icon
                  name="success"
                  size={16}
                  className="text-green-500 mr-2"
                />
                <span className="text-sm">TailwindCSS</span>
              </div>
              <div className="flex items-center">
                <Icon
                  name="success"
                  size={16}
                  className="text-green-500 mr-2"
                />
                <span className="text-sm">Chart.js</span>
              </div>
              <div className="flex items-center">
                <Icon
                  name="success"
                  size={16}
                  className="text-green-500 mr-2"
                />
                <span className="text-sm">Componentes de Filtro</span>
              </div>
              <div className="flex items-center">
                <Icon
                  name="success"
                  size={16}
                  className="text-green-500 mr-2"
                />
                <span className="text-sm">Seleção Múltipla</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Teste */}
        <div className="mb-8">
          <ChartContainer
            title="Gráfico de Teste - Chart.js Configurado"
            className="w-full"
          />
        </div>

        {/* Teste de Funcionalidade */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icon name="activity" size={20} className="text-primary-600 mr-2" />
            Teste de Funcionalidade
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCount(count => count + 1)}
              className="btn-primary"
            >
              Count is {count}
            </button>
            <p className="text-gray-600">
              Componentes de filtro funcionando! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal com Provider
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
