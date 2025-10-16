import React, { useState } from 'react';
import { Icon } from '../ui';
import { useTimeRange } from '../../hooks/useAppContext';
import { FILTER_CONFIG } from '../../constants';

interface TimeRangeFilterProps {
  className?: string;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  className = '',
}) => {
  const [timeRange, setTimeRange] = useTimeRange();
  const [customStartDate, setCustomStartDate] = useState(
    timeRange.start.toISOString().split('T')[0]
  );
  const [customEndDate, setCustomEndDate] = useState(
    timeRange.end.toISOString().split('T')[0]
  );

  // Aplicar filtro rápido
  const applyQuickFilter = (value: number, unit: 'hour' | 'day') => {
    const now = new Date();
    const start = new Date();

    if (unit === 'hour') {
      start.setHours(now.getHours() - value);
    } else {
      start.setDate(now.getDate() - value);
    }

    setTimeRange({ start, end: now });
  };

  // Aplicar período customizado
  const applyCustomRange = () => {
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);

    // Validar datas
    if (start >= end) {
      alert('A data de início deve ser anterior à data de fim');
      return;
    }

    const daysDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff > FILTER_CONFIG.MAX_DATE_RANGE) {
      alert(`Período máximo permitido: ${FILTER_CONFIG.MAX_DATE_RANGE} dias`);
      return;
    }

    setTimeRange({ start, end });
  };

  // Navegação temporal
  const navigateTimeRange = (direction: 'previous' | 'next') => {
    const daysDiff = Math.ceil(
      (timeRange.end.getTime() - timeRange.start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const newStart = new Date(timeRange.start);
    const newEnd = new Date(timeRange.end);

    if (direction === 'previous') {
      newStart.setDate(newStart.getDate() - daysDiff);
      newEnd.setDate(newEnd.getDate() - daysDiff);
    } else {
      newStart.setDate(newStart.getDate() + daysDiff);
      newEnd.setDate(newEnd.getDate() + daysDiff);
    }

    setTimeRange({ start: newStart, end: newEnd });
  };

  // Formatar período atual
  const formatCurrentRange = () => {
    const daysDiff = Math.ceil(
      (timeRange.end.getTime() - timeRange.start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      return timeRange.start.toLocaleDateString('pt-BR');
    }

    return `${timeRange.start.toLocaleDateString('pt-BR')} - ${timeRange.end.toLocaleDateString('pt-BR')}`;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Icon name="calendar" size={20} className="text-primary-600 mr-2" />
        Filtro Temporal
      </h3>

      {/* Período atual */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">
              Período Atual
            </div>
            <div className="text-sm text-gray-600">{formatCurrentRange()}</div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateTimeRange('previous')}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Período anterior"
            >
              <Icon name="chevron-left" size={16} />
            </button>
            <button
              onClick={() => navigateTimeRange('next')}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
              title="Próximo período"
            >
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-900 mb-2">
          Filtros Rápidos
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FILTER_CONFIG.QUICK_FILTERS.map(filter => (
            <button
              key={`${filter.value}-${filter.unit}`}
              onClick={() => applyQuickFilter(filter.value, filter.unit)}
              className="btn-secondary text-xs py-2 px-3 text-center"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Período customizado */}
      <div>
        <div className="text-sm font-medium text-gray-900 mb-2">
          Período Customizado
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Data Início
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Data Fim
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>
          <button
            onClick={applyCustomRange}
            className="btn-primary w-full text-sm py-2"
          >
            <Icon name="calendar" size={16} className="mr-2" />
            Aplicar Período
          </button>
        </div>
      </div>

      {/* Informações do período */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="flex items-center mb-1">
          <Icon name="info" size={14} className="text-blue-600 mr-2" />
          <span className="text-xs font-medium text-blue-800">
            Informações do Período
          </span>
        </div>
        <div className="text-xs text-blue-700">
          <div>Período máximo: {FILTER_CONFIG.MAX_DATE_RANGE} dias</div>
          <div>Período padrão: {FILTER_CONFIG.DEFAULT_DATE_RANGE} dias</div>
        </div>
      </div>
    </div>
  );
};

export default TimeRangeFilter;
