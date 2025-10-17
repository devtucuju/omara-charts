/**
 * Componente para exibir estatísticas de cache
 */

import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { apiWithCache } from '../../services/apiWithCache';

interface CacheStatsProps {
  className?: string;
}

const CacheStats: React.FC<CacheStatsProps> = ({ className = '' }) => {
  const [stats, setStats] = useState({
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
    lastCleanup: 0,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Atualizar estatísticas periodicamente
  useEffect(() => {
    const updateStats = () => {
      const currentStats = apiWithCache.getCacheStats();
      setStats(currentStats);
    };

    // Atualizar imediatamente
    updateStats();

    // Atualizar a cada 5 segundos
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatLastCleanup = () => {
    if (stats.lastCleanup === 0) return 'Nunca';

    const now = Date.now();
    const diff = now - stats.lastCleanup;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Agora';
    if (minutes === 1) return '1 minuto atrás';
    return `${minutes} minutos atrás`;
  };

  const getHitRateColor = () => {
    if (stats.hitRate >= 0.7) return 'text-green-600';
    if (stats.hitRate >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHitRateIcon = () => {
    if (stats.hitRate >= 0.7) return 'success';
    if (stats.hitRate >= 0.4) return 'info';
    return 'alertCircle';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Icon name="database" size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Estatísticas de Cache
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${getHitRateColor()}`}>
            <Icon name={getHitRateIcon()} size={16} />
            <span className="text-sm font-medium">
              {Math.round(stats.hitRate * 100)}%
            </span>
          </div>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            className="text-gray-400"
          />
        </div>
      </div>

      {/* Resumo rápido */}
      <div className="mt-3 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {stats.hits}
          </div>
          <div className="text-xs text-gray-500">Cache Hits</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600">
            {stats.misses}
          </div>
          <div className="text-xs text-gray-500">Cache Misses</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {stats.size}
          </div>
          <div className="text-xs text-gray-500">Entradas</div>
        </div>
      </div>

      {/* Detalhes expandidos */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa de Acerto:</span>
              <span className={`text-sm font-medium ${getHitRateColor()}`}>
                {Math.round(stats.hitRate * 100)}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Última Limpeza:</span>
              <span className="text-sm text-gray-900">
                {formatLastCleanup()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Total de Requisições:
              </span>
              <span className="text-sm text-gray-900">
                {stats.hits + stats.misses}
              </span>
            </div>

            {/* Ações */}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => apiWithCache.clearAllCache()}
                className="flex-1 btn-secondary text-xs py-2"
              >
                <Icon name="trash-2" size={14} className="mr-1" />
                Limpar Cache
              </button>
              <button
                onClick={() => {
                  const debugInfo = apiWithCache.getCacheDebugInfo();
                  console.log('Cache Debug Info:', debugInfo);
                }}
                className="flex-1 btn-secondary text-xs py-2"
              >
                <Icon name="info" size={14} className="mr-1" />
                Debug
              </button>
            </div>

            {/* Barra de progresso da taxa de acerto */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Taxa de Acerto</span>
                <span>{Math.round(stats.hitRate * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stats.hitRate >= 0.7
                      ? 'bg-green-500'
                      : stats.hitRate >= 0.4
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${stats.hitRate * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheStats;
