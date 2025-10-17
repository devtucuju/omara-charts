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
import zoomPlugin from 'chartjs-plugin-zoom';
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
  Filler,
  zoomPlugin
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
  const [chartRef, setChartRef] = useState<ChartJS | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showTrendLines, setShowTrendLines] = useState(false);

  // Funções para controlar visibilidade da legenda
  const toggleLegendVisibility = (index: number) => {
    const newVisibility = [...legendVisibility];
    newVisibility[index] = !newVisibility[index];
    setLegendVisibility(newVisibility);
  };

  const toggleAllLegend = (visible: boolean) => {
    setLegendVisibility(legendVisibility.map(() => visible));
  };

  // Funções para controlar zoom e pan
  const resetZoom = () => {
    if (chartRef) {
      chartRef.resetZoom();
      setIsZoomed(false);
    }
  };

  const zoomIn = () => {
    if (chartRef) {
      chartRef.zoom(1.2);
      setIsZoomed(true);
    }
  };

  const zoomOut = () => {
    if (chartRef) {
      chartRef.zoom(0.8);
      setIsZoomed(true);
    }
  };

  const onChartRef = (chart: ChartJS | null) => {
    setChartRef(chart);
  };

  // Função para calcular linha de tendência linear
  const calculateTrendLine = (values: number[]) => {
    const n = values.length;
    if (n < 2) return values;

    // Calcular regressão linear simples
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Gerar pontos da linha de tendência
    return Array.from({ length: n }, (_, i) => slope * i + intercept);
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
    const datasets = Object.entries(stationGroups)
      .map(([stationId, stationData], index) => {
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

        // Calcular linha de tendência se habilitada
        const trendValues = showTrendLines ? calculateTrendLine(values) : [];

        const baseDataset = {
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

        // Adicionar linha de tendência se habilitada
        if (showTrendLines && trendValues.length > 0) {
          return [
            baseDataset,
            {
              label: `Tendência ${stationId}`,
              data: trendValues,
              borderColor: color,
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0,
              fill: false,
              pointRadius: 0,
              pointHoverRadius: 0,
              stationId: `${stationId}_trend`,
              hidden: !isVisible,
            },
          ];
        }

        return baseDataset;
      })
      .flat();

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
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        callbacks: {
          title: (context: unknown) => {
            const ctx = context as any;
            const dataIndex = ctx[0].dataIndex;
            const dataset = ctx[0].dataset;
            const stationId = dataset.stationId;

            // Encontrar o item de dados correspondente
            const stationGroups = data.reduce(
              (groups, item) => {
                const id = item.station;
                if (!groups[id]) groups[id] = [];
                groups[id].push(item);
                return groups;
              },
              {} as Record<string, typeof data>
            );

            const stationData = stationGroups[stationId];
            if (stationData && stationData[dataIndex]) {
              const item = stationData[dataIndex];
              const date = new Date(item.date);
              const formattedDate = date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              return `${formattedDate} - ${item.hour}`;
            }

            return `Data: ${ctx[0].label}`;
          },
          label: (context: unknown) => {
            const ctx = context as any;
            const dataset = ctx.dataset;
            const value = ctx.parsed.y;
            const stationId = dataset.stationId;
            const module =
              MODULES[selectedModule.toUpperCase() as keyof typeof MODULES];

            // Informações adicionais baseadas no módulo
            let additionalInfo = '';
            const dataIndex = ctx.dataIndex;

            // Encontrar dados adicionais da estação
            const stationGroups = data.reduce(
              (groups, item) => {
                const id = item.station;
                if (!groups[id]) groups[id] = [];
                groups[id].push(item);
                return groups;
              },
              {} as Record<string, typeof data>
            );

            const stationData = stationGroups[stationId];
            if (stationData && stationData[dataIndex]) {
              const item = stationData[dataIndex];

              switch (selectedModule) {
                case 'intrusion': {
                  const intrusionItem = item as IntrusionData;
                  additionalInfo = `\n• Maré: ${intrusionItem.tideSituation}\n• Fase da Lua: ${intrusionItem.moonPhase}\n• Condição: ${intrusionItem.weatherCondition}`;
                  break;
                }
                case 'solid': {
                  const solidItem = item as SolidData;
                  additionalInfo = `\n• Transparência: ${solidItem.transparency}\n• Maré: ${solidItem.tideSituation}\n• Cor da Água: ${solidItem.waterColor}`;
                  break;
                }
                case 'inundation': {
                  const inundationItem = item as InundationData;
                  additionalInfo = `\n• Maré: ${inundationItem.tideSituation}\n• Fase da Lua: ${inundationItem.moonPhase}\n• Condição: ${inundationItem.weatherCondition}`;
                  break;
                }
              }
            }

            // Calcular estatísticas comparativas
            const currentValues = context.map((c: any) => c.parsed.y);
            const maxValue = Math.max(...currentValues);
            const minValue = Math.min(...currentValues);
            const avgValue =
              currentValues.reduce((a: number, b: number) => a + b, 0) /
              currentValues.length;

            // Determinar posição relativa
            let positionInfo = '';
            if (context.length > 1) {
              if (value === maxValue) positionInfo = ' 🔥 (Máximo)';
              else if (value === minValue) positionInfo = ' ❄️ (Mínimo)';
              else if (value > avgValue) positionInfo = ' ⬆️ (Acima da média)';
              else positionInfo = ' ⬇️ (Abaixo da média)';
            }

            return [
              `📍 Estação ${stationId}${positionInfo}`,
              `📊 Valor: ${value} ${module.unit}`,
              additionalInfo,
              context.length > 1
                ? `📈 Média: ${avgValue.toFixed(1)} | Faixa: ${minValue}-${maxValue}`
                : '',
            ];
          },
          footer: (context: unknown) => {
            const ctx = context as unknown as any[];
            if (ctx.length > 1) {
              return `\n📈 ${ctx.length} estações ativas`;
            }
            return '';
          },
        },
      },
      zoom: {
        limits: {
          x: { min: 0, max: 100 },
          y: { min: 0, max: 100 },
        },
        pan: {
          enabled: true,
          mode: 'x' as const,
          modifierKey: 'ctrl',
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: 'ctrl',
          },
          pinch: {
            enabled: true,
          },
          mode: 'x' as const,
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
    onZoom: () => {
      setIsZoomed(true);
    },
    onPan: () => {
      setIsZoomed(true);
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

          {/* Controles de Zoom e Tendência */}
          <div className="flex items-center space-x-1">
            <button
              onClick={zoomIn}
              className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Zoom In (Ctrl + Scroll)"
            >
              <Icon name="zoom-in" size={16} />
            </button>
            <button
              onClick={zoomOut}
              className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Zoom Out (Ctrl + Scroll)"
            >
              <Icon name="zoom-out" size={16} />
            </button>
            <button
              onClick={resetZoom}
              disabled={!isZoomed}
              className={`p-1 rounded border border-gray-300 transition-colors ${
                isZoomed
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title="Reset Zoom"
            >
              <Icon name="maximize" size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button
              onClick={() => setShowTrendLines(!showTrendLines)}
              className={`p-1 rounded border transition-colors ${
                showTrendLines
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:bg-gray-100 text-gray-700'
              }`}
              title="Alternar Linhas de Tendência"
            >
              <Icon name="trending-up" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="h-80">
        <Line ref={onChartRef} data={chartData} options={chartOptions} />
      </div>

      {/* Instruções de Interação */}
      <div className="mt-3 space-y-2">
        <div className="p-2 bg-blue-50 rounded-md">
          <div className="flex items-center text-xs text-blue-700">
            <Icon name="info" size={14} className="mr-2" />
            <span>
              <strong>Zoom:</strong> Ctrl + Scroll | <strong>Pan:</strong> Ctrl
              + Arrastar |<strong> Reset:</strong> Botão Maximizar
            </span>
          </div>
        </div>

        <div className="p-2 bg-green-50 rounded-md">
          <div className="flex items-center text-xs text-green-700">
            <Icon name="mouse-pointer" size={14} className="mr-2" />
            <span>
              <strong>Tooltips Detalhados:</strong> Passe o mouse sobre os
              pontos para ver informações completas
            </span>
          </div>
        </div>

        <div className="p-2 bg-purple-50 rounded-md">
          <div className="flex items-center text-xs text-purple-700">
            <Icon name="trending-up" size={14} className="mr-2" />
            <span>
              <strong>Linhas de Tendência:</strong> Clique no botão de tendência
              para mostrar/ocultar análise de tendência
            </span>
          </div>
        </div>
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
