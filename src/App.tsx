import { useState } from 'react';
import ChartContainer from './components/charts/ChartContainer';
import { Icon } from './components/ui';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <button
              onClick={() => setCount(count => count + 1)}
              className="btn-primary w-full mb-4"
            >
              Count is {count}
            </button>
            <p className="text-gray-600">TailwindCSS está funcionando! 🎉</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Icon name="info" size={20} className="text-primary-600 mr-2" />
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
                <span className="text-sm">ESLint + Prettier</span>
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
                <span className="text-sm">Axios</span>
              </div>
              <div className="flex items-center">
                <Icon
                  name="success"
                  size={16}
                  className="text-green-500 mr-2"
                />
                <span className="text-sm">Lucide Icons</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <ChartContainer
            title="Gráfico de Teste - Chart.js Configurado"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
