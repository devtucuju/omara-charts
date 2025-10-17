/**
 * Componente de Tooltip Customizado para Gráficos
 *
 * Funcionalidades:
 * - Exibição de informações detalhadas
 * - Formatação rica com ícones e cores
 * - Informações contextuais por módulo
 * - Estatísticas comparativas
 */

import React from 'react';
import { Icon } from '../ui';
import { MODULES } from '../../constants';
import type {
  IntrusionData,
  SolidData,
  InundationData,
  ModuleType,
} from '../../types';

interface CustomTooltipProps {
  module: ModuleType;
  data: (IntrusionData | SolidData | InundationData)[];
  stationId: string;
  dataIndex: number;
  value: number;
  allValues?: { stationId: string; value: number }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  module,
  data,
  stationId,
  dataIndex,
  value,
  allValues = [],
}) => {
  // Encontrar o item de dados específico
  const stationData = data.filter(item => item.station === stationId);
  const currentItem = stationData[dataIndex];

  if (!currentItem) return null;

  const moduleConfig = MODULES[module.toUpperCase() as keyof typeof MODULES];

  // Calcular estatísticas
  const currentValues = allValues.map(v => v.value);
  const maxValue = Math.max(...currentValues);
  const minValue = Math.min(...currentValues);
  const avgValue =
    currentValues.reduce((a, b) => a + b, 0) / currentValues.length;

  // Determinar status baseado no valor
  const getValueStatus = (val: number) => {
    if (module === 'intrusion') {
      if (val >= 35)
        return {
          status: 'Crítico',
          color: 'text-red-600',
          icon: 'alert-triangle',
        };
      if (val >= 25)
        return {
          status: 'Alto',
          color: 'text-orange-600',
          icon: 'alert-circle',
        };
      if (val >= 15)
        return { status: 'Moderado', color: 'text-yellow-600', icon: 'info' };
      return {
        status: 'Normal',
        color: 'text-green-600',
        icon: 'check-circle',
      };
    }
    return { status: 'Normal', color: 'text-blue-600', icon: 'info' };
  };

  const valueStatus = getValueStatus(value);

  // Formatação de data
  const formatDate = (date: string, hour: string) => {
    const dateObj = new Date(date);
    return {
      full: dateObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: hour,
      relative: getRelativeTime(dateObj),
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return `${Math.floor(diffDays / 30)} meses atrás`;
  };

  const dateInfo = formatDate(currentItem.date, currentItem.hour);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700 max-w-sm">
      {/* Header com data e hora */}
      <div className="border-b border-gray-700 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="calendar" size={16} className="text-blue-400" />
          <span className="font-semibold text-sm">{dateInfo.full}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Icon name="clock" size={14} className="text-gray-400" />
          <span className="text-xs text-gray-300">
            {dateInfo.time} • {dateInfo.relative}
          </span>
        </div>
      </div>

      {/* Informações da estação */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="map-pin" size={16} className="text-green-400" />
          <span className="font-medium text-sm">Estação {stationId}</span>
        </div>

        {/* Valor principal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon
              name={valueStatus.icon}
              size={16}
              className={valueStatus.color}
            />
            <span className="text-sm">{moduleConfig.name}:</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">{value}</span>
            <span className="text-xs text-gray-400">{moduleConfig.unit}</span>
          </div>
        </div>

        {/* Status */}
        <div className={`mt-1 text-xs ${valueStatus.color}`}>
          Status: {valueStatus.status}
        </div>
      </div>

      {/* Informações específicas do módulo */}
      <div className="border-t border-gray-700 pt-3 mb-3">
        <div className="text-xs text-gray-300 space-y-1">
          {module === 'intrusion' && (
            <>
              <div className="flex items-center space-x-2">
                <Icon name="waves" size={12} className="text-blue-400" />
                <span>
                  Maré: {(currentItem as IntrusionData).tideSituation}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="moon" size={12} className="text-purple-400" />
                <span>Lua: {(currentItem as IntrusionData).moonPhase}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="cloud" size={12} className="text-gray-400" />
                <span>
                  Tempo: {(currentItem as IntrusionData).weatherCondition}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="droplets" size={12} className="text-cyan-400" />
                <span>Cor: {(currentItem as IntrusionData).waterColor}</span>
              </div>
            </>
          )}

          {module === 'solid' && (
            <>
              <div className="flex items-center space-x-2">
                <Icon name="eye" size={12} className="text-blue-400" />
                <span>
                  Transparência: {(currentItem as SolidData).transparency}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="waves" size={12} className="text-blue-400" />
                <span>Maré: {(currentItem as SolidData).tideSituation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="droplets" size={12} className="text-cyan-400" />
                <span>Cor: {(currentItem as SolidData).waterColor}</span>
              </div>
            </>
          )}

          {module === 'inundation' && (
            <>
              <div className="flex items-center space-x-2">
                <Icon name="waves" size={12} className="text-blue-400" />
                <span>
                  Maré: {(currentItem as InundationData).tideSituation}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="moon" size={12} className="text-purple-400" />
                <span>Lua: {(currentItem as InundationData).moonPhase}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="cloud" size={12} className="text-gray-400" />
                <span>
                  Tempo: {(currentItem as InundationData).weatherCondition}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Estatísticas comparativas */}
      {allValues.length > 1 && (
        <div className="border-t border-gray-700 pt-3">
          <div className="text-xs text-gray-300">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="bar-chart" size={12} className="text-yellow-400" />
              <span className="font-medium">
                Comparação ({allValues.length} estações)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-green-400 font-medium">{minValue}</div>
                <div className="text-xs text-gray-400">Mín</div>
              </div>
              <div>
                <div className="text-blue-400 font-medium">
                  {avgValue.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400">Média</div>
              </div>
              <div>
                <div className="text-red-400 font-medium">{maxValue}</div>
                <div className="text-xs text-gray-400">Máx</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
