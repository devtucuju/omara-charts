import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppContext } from '../../contexts';
import { MODULES } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartContainerProps {
  title?: string;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  className = '',
}) => {
  const { state } = useAppContext();
  const moduleConfig =
    MODULES[state.selectedModule.toUpperCase() as keyof typeof MODULES];

  // Dados de exemplo baseados na estação selecionada
  const getSampleData = () => {
    // Se não há estação selecionada, mostrar mensagem
    if (state.selectedStations.length === 0) {
      return { labels: [], data: [], color: 'rgb(156, 163, 175)' };
    }

    const stationId = state.selectedStations[0];
    const labels = [
      '2024-01-15 08:00',
      '2024-01-15 12:00',
      '2024-01-15 16:00',
      '2024-01-15 20:00',
      '2024-01-16 08:00',
      '2024-01-16 12:00',
    ];

    let data: number[];
    let color: string;

    switch (state.selectedModule) {
      case 'intrusion':
        // Nível de Salinidade (0-40)
        data = [25, 30, 28, 35, 32, 29];
        color = '#065f46'; // Primary (verde escuro)
        break;
      case 'solid':
        // Sólidos em Suspensão
        data = [45, 52, 48, 55, 50, 47];
        color = '#80CAEE'; // Secondary (azul claro)
        break;
      case 'inundation':
        // Nível Medido
        data = [12, 15, 18, 14, 16, 13];
        color = '#FFA70B'; // Warning (laranja)
        break;
      default:
        data = [65, 59, 80, 81, 56, 55];
        color = '#10B981'; // Meta-3 (verde)
    }

    return { labels, data, color, stationId };
  };

  const { labels, data, color, stationId } = getSampleData();

  const chartData = {
    labels: labels as string[],
    datasets: [
      {
        label: stationId
          ? `${moduleConfig?.name} - ${stationId}`
          : 'Selecione uma estação',
        data: data as number[],
        borderColor: color,
        backgroundColor: `${color}20`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: stationId
          ? `${moduleConfig?.name} - Estação ${stationId}`
          : 'Selecione uma estação para visualizar os dados',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: moduleConfig?.unit || 'Valor',
        },
        max: moduleConfig?.maxValue || undefined,
      },
      x: {
        title: {
          display: true,
          text: 'Data e Hora',
        },
        ticks: {
          maxTicksLimit: 6,
        },
      },
    },
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {title || `${moduleConfig?.name || 'Gráfico'}`}
        </h2>
        <div className="text-sm text-gray-500">
          {state.selectedStations.length > 0 ? (
            <span className="text-success font-medium">
              Estação: {state.selectedStations[0]}
            </span>
          ) : (
            <span className="text-body">Nenhuma estação selecionada</span>
          )}
        </div>
      </div>

      {state.selectedStations.length === 0 ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              Selecione uma estação para visualizar os dados
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Escolha uma estação no filtro acima para gerar o gráfico
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="mt-4 p-3 bg-stroke rounded-md">
            <div className="text-sm text-primary">
              <strong>Dados de Exemplo:</strong> Este gráfico mostra dados
              simulados para a estação {state.selectedStations[0]}. Os dados
              reais serão carregados quando a API estiver conectada.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartContainer;
