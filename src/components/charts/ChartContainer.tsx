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

  // Dados de exemplo baseados no módulo selecionado
  const getSampleData = () => {
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    let data: number[];
    let color: string;

    switch (state.selectedModule) {
      case 'intrusion':
        data = [25, 30, 28, 35, 32, 29];
        color = 'rgb(59, 130, 246)'; // Azul
        break;
      case 'solid':
        data = [45, 52, 48, 55, 50, 47];
        color = 'rgb(16, 185, 129)'; // Verde
        break;
      case 'inundation':
        data = [12, 15, 18, 14, 16, 13];
        color = 'rgb(245, 158, 11)'; // Amarelo
        break;
      default:
        data = [65, 59, 80, 81, 56, 55];
        color = 'rgb(75, 192, 192)';
    }

    return { labels, data, color };
  };

  const { labels, data, color } = getSampleData();

  const chartData = {
    labels,
    datasets: [
      {
        label: moduleConfig?.name || 'Dados',
        data,
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
        text: title || `${moduleConfig?.name || 'Gráfico'} - Dados de Exemplo`,
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
          text: 'Período',
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
          {state.selectedStations.length} estação(ões) selecionada(s)
        </div>
      </div>
      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="text-sm text-gray-600">
          <strong>Nota:</strong> Este é um gráfico de exemplo. Os dados reais
          serão carregados quando a API estiver conectada.
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
