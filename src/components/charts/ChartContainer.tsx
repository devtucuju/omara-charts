import React, { useEffect, useState } from 'react';
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
import { formatDateTimeChart, formatDateTimeChartFromParts } from '../../utils';
import apiWithCache from '../../services/apiWithCache';
import type { IntrusionData, SolidData, InundationData } from '../../types';
import { Icon } from '../ui/Icon';

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

// Função para transformar dados da API em dados do gráfico (fora do componente para evitar recriações)
const transformApiDataToChart = (
  apiData: IntrusionData[] | SolidData[] | InundationData[],
  module: 'intrusion' | 'solid' | 'inundation',
  solidType?: 'transparency' | 'solidsPresent'
) => {
  if (apiData.length === 0) {
    return { labels: [], data: [], color: 'rgb(156, 163, 175)' };
  }

  // Ordenar por data e hora
  const sortedData = [...apiData].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.hour.localeCompare(b.hour);
  });

  // Criar labels e dados
  const labels: string[] = [];
  const data: number[] = [];
  let color = 'rgb(156, 163, 175)';

  sortedData.forEach(item => {
    // Formatar data e hora combinadas
    const formattedDateTime = formatDateTimeChartFromParts(
      item.date,
      item.hour
    );
    labels.push(formattedDateTime);

    // Extrair o valor baseado no módulo
    switch (module) {
      case 'intrusion':
        data.push((item as IntrusionData).salinityLevel);
        color = '#065f46'; // Primary (verde escuro)
        break;
      case 'solid':
        if (solidType === 'transparency') {
          data.push((item as SolidData).transparency);
        } else {
          data.push((item as SolidData).solidsPresent);
        }
        color = '#80CAEE'; // Secondary (azul claro)
        break;
      case 'inundation':
        data.push((item as InundationData).measuredLevel);
        color = '#FFA70B'; // Warning (laranja)
        break;
    }
  });

  return { labels, data, color };
};

const ChartContainer: React.FC<ChartContainerProps> = ({ className = '' }) => {
  const { state } = useAppContext();
  const moduleConfig =
    MODULES[state.selectedModule.toUpperCase() as keyof typeof MODULES];

  const [chartDataState, setChartDataState] = useState<{
    labels: string[];
    data: number[];
    color: string;
  }>({ labels: [], data: [], color: 'rgb(156, 163, 175)' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obter valores estáveis para as dependências
  const selectedStationId =
    state.selectedStations.length > 0 ? state.selectedStations[0] : null;
  const selectedModule = state.selectedModule;
  const solidDataType = state.solidDataType;

  // Buscar dados da API quando estação ou módulo mudar
  useEffect(() => {
    const fetchData = async () => {
      // Se não há estação selecionada ou (para solid) tipo não selecionado, limpar dados
      if (
        !selectedStationId ||
        (selectedModule === 'solid' && !solidDataType)
      ) {
        setChartDataState({
          labels: [],
          data: [],
          color: 'rgb(156, 163, 175)',
        });
        setError(null);
        return;
      }

      const stationId = selectedStationId;
      setLoading(true);
      setError(null);

      try {
        let apiData: IntrusionData[] | SolidData[] | InundationData[];

        switch (selectedModule) {
          case 'intrusion': {
            const intrusionResult = await apiWithCache.getIntrusionData(
              stationId,
              undefined,
              undefined,
              {}
            );
            apiData = intrusionResult.data;
            break;
          }
          case 'solid': {
            const solidResult = await apiWithCache.getSolidData(
              stationId,
              undefined,
              undefined,
              {}
            );
            apiData = solidResult.data;
            break;
          }
          case 'inundation': {
            const inundationResult = await apiWithCache.getInundationData(
              stationId,
              undefined,
              undefined,
              {}
            );
            apiData = inundationResult.data;
            break;
          }
          default:
            apiData = [];
        }

        const chartData = transformApiDataToChart(
          apiData,
          selectedModule,
          solidDataType
        );
        setChartDataState(chartData);
      } catch (err: unknown) {
        console.error('Erro ao buscar dados da API:', err);
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar dados da API'
        );
        setChartDataState({
          labels: [],
          data: [],
          color: 'rgb(156, 163, 175)',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStationId, selectedModule, solidDataType]);

  const { labels, data, color } = chartDataState;
  const stationId =
    state.selectedStations.length > 0 ? state.selectedStations[0] : null;

  // Determinar a unidade e label corretos
  let unit: string = 'Valor';
  let chartLabel = stationId
    ? `${moduleConfig?.name} - ${stationId}`
    : 'Selecione uma estação';

  if (state.selectedModule === 'solid' && state.solidDataType) {
    if (state.solidDataType === 'transparency') {
      unit = 'Transparência cm';
      chartLabel = stationId
        ? `Transparência - ${stationId}`
        : 'Selecione uma estação';
    } else {
      unit = 'Sólidos Presentes ml';
      chartLabel = stationId
        ? `Sólidos Presentes - ${stationId}`
        : 'Selecione uma estação';
    }
  } else {
    // Para outros módulos, garantir que unit seja string
    const moduleUnit = moduleConfig?.unit;
    unit = typeof moduleUnit === 'string' ? moduleUnit : 'Valor';
  }

  const chartData = {
    labels: labels as string[],
    datasets: [
      {
        label: chartLabel,
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
        display: false, // Remover título do gráfico
      },
      tooltip: {
        callbacks: {
          title: (context: Array<{ label?: string }>) => {
            // Se o label já está formatado, retornar como está
            if (context[0]?.label) {
              return context[0].label;
            }
            // Caso contrário, tentar formatar
            const label = context[0]?.label || '';
            try {
              const date = new Date(label);
              if (!isNaN(date.getTime())) {
                return formatDateTimeChart(date);
              }
            } catch {
              // Se não conseguir parsear, retornar o label original
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: unit,
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
      {/* Título centralizado e aumentado */}
      <div className="text-center mb-6">
        {state.selectedStations.length > 0 ? (
          <h2 className="text-2xl font-bold text-primary">
            Estação: {state.selectedStations[0]}
          </h2>
        ) : (
          <h2 className="text-xl font-semibold text-gray-500">
            Nenhuma estação selecionada
          </h2>
        )}
      </div>

      {state.selectedStations.length === 0 ||
      (state.selectedModule === 'solid' && !state.solidDataType) ? (
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
              {state.selectedModule === 'solid' && !state.solidDataType
                ? 'Selecione o tipo de dado (Transparência ou Sólidos Presentes)'
                : 'Selecione uma estação para visualizar os dados'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {state.selectedModule === 'solid' && !state.solidDataType
                ? 'Escolha o tipo de dado no filtro acima'
                : 'Escolha uma estação no filtro acima para gerar o gráfico'}
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
          <div className="text-center">
            <Icon
              name="refresh"
              className="animate-spin text-primary mx-auto mb-2"
              size={48}
            />
            <p className="text-gray-600 font-medium">Carregando dados...</p>
            <p className="text-gray-500 text-sm mt-1">
              Buscando dados da estação {stationId}
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
          <div className="text-center">
            <Icon
              name="error"
              className="text-red-500 mx-auto mb-2"
              size={48}
            />
            <p className="text-red-600 font-medium">Erro ao carregar dados</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <p className="text-gray-500 text-xs mt-2">
              Verifique se a API está rodando em http://localhost:3333
            </p>
          </div>
        </div>
      ) : labels.length === 0 ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
          <div className="text-center">
            <Icon
              name="info"
              className="text-gray-400 mx-auto mb-2"
              size={48}
            />
            <p className="text-gray-600 font-medium">Nenhum dado encontrado</p>
            <p className="text-gray-500 text-sm mt-1">
              Não há dados disponíveis para a estação {stationId}
            </p>
          </div>
        </div>
      ) : (
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default ChartContainer;
