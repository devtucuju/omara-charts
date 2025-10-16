import { useState } from 'react';
import ChartContainer from './components/charts/ChartContainer';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            OMARA Charts Dashboard
          </h1>
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
            <h3 className="text-lg font-semibold mb-4">
              Status da Configuração
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">React + TypeScript</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">TailwindCSS</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">ESLint + Prettier</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">Chart.js</span>
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
