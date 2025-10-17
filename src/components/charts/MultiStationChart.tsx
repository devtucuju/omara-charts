import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Icon } from '../ui';
import InteractiveLegend from './InteractiveLegend';
import {
  useSelectedModule,
  useSelectedStations,
  useTimeRange,
  useAppData,
} from '../../hooks/useAppContext';
import { apiWithCache } from '../../services/apiWithCache';
import { MODULES } from '../../constants';
import type { IntrusionData, SolidData, InundationData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MultiStationChartProps {
  className?: string;
}

const MultiStationChart: React.FC<MultiStationChartProps> = ({
  className = '',
}) => {
  const [selectedModule] = useSelectedModule();
  const [selectedStations] = useSelectedStations();
  const [timeRange] = useTimeRange();
  const [data, setData] = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [legendVisibility, setLegendVisibility] = useState<boolean[]>([]);
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    hitRate: 0,
  });

  // Funções para controlar visibilidade da legenda
  const toggleLegendVisibility = (index: number) => {
    const newVisibility = [...legendVisibility];
    newVisibility[index] = !newVisibility[index];
    setLegendVisibility(newVisibility);
  };

  const toggleAllLegend = (visible: boolean) => {
    setLegendVisibility(legendVisibility.map(() => visible));
  };

  // Cores para diferentes estações
  const stationColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#14B8A6', // Teal
    '#A78BFA', // Violet
  ];

  // Carregar dados quando filtros mudarem
  useEffect(() => {
    const loadChartData = async () => {
      if (selectedStations.length === 0) {
        setData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // const startDate = timeRange.start.toISOString().split('T')[0]; // Para uso futuro
        // const endDate = timeRange.end.toISOString().split('T')[0]; // Para uso futuro

        let allData: (IntrusionData | SolidData | InundationData)[] = [];

        // Carregar dados para cada estação selecionada usando cache
        for (const stationId of selectedStations) {
          let result;

          switch (selectedModule) {
            case 'intrusion':
              result = await apiWithCache.getIntrusionData(stationId);
              break;
            case 'solid':
              result = await apiWithCache.getSolidData(stationId);
              break;
            case 'inundation':
              result = await apiWithCache.getInundationData(stationId);
              break;
            default:
              continue;
          }

          if (result.data) {
            allData = [...allData, ...result.data];

            // Atualizar estatísticas de cache
            if (result.fromCache) {
              setCacheStats(prev => ({
                ...prev,
                hits: prev.hits + 1,
                hitRate: (prev.hits + 1) / (prev.hits + prev.misses + 1),
              }));
            } else {
              setCacheStats(prev => ({
                ...prev,
                misses: prev.misses + 1,
                hitRate: prev.hits / (prev.hits + prev.misses + 1),
              }));
            }
          }
        }

        setData(allData);
      } catch (err: unknown) {
        setError('Erro ao carregar dados dos gráficos');
        console.error('Error loading chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [selectedModule, selectedStations, timeRange, setData]);

  // Processar dados para o gráfico
  const processChartData = () => {
    if (data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Agrupar dados por estação
    const stationGroups = data.reduce(
      (groups, item) => {
        const stationId = item.station;
        if (!groups[stationId]) {
          groups[stationId] = [];
        }
        groups[stationId].push(item);
        return groups;
      },
      {} as Record<string, typeof data>
    );

    // Inicializar visibilidade se necessário
    if (legendVisibility.length !== Object.keys(stationGroups).length) {
      setLegendVisibility(Object.keys(stationGroups).map(() => true));
    }

    // Criar datasets para cada estação
    const datasets = Object.entries(stationGroups).map(
      ([stationId, stationData], index) => {
        const color = stationColors[index % stationColors.length];
        const isVisible = legendVisibility[index] !== false;

        // Ordenar por data
        stationData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Extrair valores baseado no módulo
        const values = stationData.map(item => {
          switch (selectedModule) {
            case 'intrusion':
              return (item as IntrusionData).salinityLevel;
            case 'solid':
              return (item as SolidData).solidsPresent;
            case 'inundation':
              return (item as InundationData).measuredLevel;
            default:
              return 0;
          }
        });

        // const labels = stationData.map(item => {
        //   const date = new Date(item.date);
        //   return `${date.toLocaleDateString('pt-BR')} ${item.hour}`;
        // }); // Para uso futuro

        return {
          label: `Estação ${stationId}`,
          data: values,
          borderColor: color,
          backgroundColor: `${color}20`,
          tension: 0.4,
          fill: false,
          pointRadius: isVisible ? 3 : 0,
          pointHoverRadius: 6,
          stationId,
          hidden: !isVisible,
        };
      }
    );

    // Usar labels da primeira estação (assumindo que todas têm as mesmas datas)
    const firstStation = Object.values(stationGroups)[0];
    const labels = firstStation
      ? firstStation.map(item => {
          const date = new Date(item.date);
          return `${date.toLocaleDateString('pt-BR')} ${item.hour}`;
        })
      : [];

    return {
      labels,
      datasets,
    };
  };

  // Configurações do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        onClick: (e: unknown, legendItem: unknown, legend: unknown) => {
          const index = (legendItem as any).datasetIndex;
          const chart = (legend as any).chart;

          if (chart.isDatasetVisible(index)) {
            chart.hide(index);
          } else {
            chart.show(index);
          }
        },
      },
      title: {
        display: true,
        text: `${MODULES[selectedModule.toUpperCase() as keyof typeof MODULES].name} - Múltiplas Estações`,
      },
      tooltip: {
        callbacks: {
          title: (context: unknown) => {
            return `Data: ${(context as any)[0].label}`;
          },
          label: (context: unknown) => {
            const dataset = (context as any).dataset;
            const value = (context as any).parsed.y;
            const module =
              MODULES[selectedModule.toUpperCase() as keyof typeof MODULES];
            return `${dataset.label}: ${value} ${module.unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Data e Hora',
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        title: {
          display: true,
          text: MODULES[selectedModule.toUpperCase() as keyof typeof MODULES]
            .unit,
        },
        max: MODULES[selectedModule.toUpperCase() as keyof typeof MODULES]
          .maxValue,
      },
    },
  };

  const chartData = processChartData();

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <Icon
              name="refresh"
              size={32}
              className="animate-spin text-primary-600 mx-auto mb-4"
            />
            <p className="text-gray-600">Carregando dados dos gráficos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <Icon
              name="error"
              size={32}
              className="text-red-500 mx-auto mb-4"
            />
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedStations.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <Icon
              name="info"
              size={32}
              className="text-gray-400 mx-auto mb-4"
            />
            <p className="text-gray-600">
              Selecione pelo menos uma estação para visualizar os gráficos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Gráfico de Múltiplas Estações
          </h3>
          <p className="text-sm text-gray-600">
            {selectedStations.length} estação(ões) selecionada(s)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="trending-up" size={20} className="text-primary-600" />
            <span className="text-sm text-gray-600">
              {chartData.datasets.length} linha(s)
            </span>
          </div>

          {/* Indicador de Cache */}
          <div className="flex items-center space-x-2">
            <Icon
              name="database"
              size={16}
              className={`${cacheStats.hitRate > 0.5 ? 'text-green-500' : 'text-gray-400'}`}
            />
            <span className="text-xs text-gray-500">
              Cache: {Math.round(cacheStats.hitRate * 100)}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Legenda Interativa */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <InteractiveLegend
          items={chartData.datasets.map(dataset => ({
            label: dataset.label,
            color: dataset.borderColor as string,
            visible: !dataset.hidden,
            stationId: dataset.stationId,
          }))}
          onToggleVisibility={toggleLegendVisibility}
          onToggleAll={toggleAllLegend}
          className="border-0 shadow-none p-0"
        />
      </div>
    </div>
  );
};

export default MultiStationChart;
