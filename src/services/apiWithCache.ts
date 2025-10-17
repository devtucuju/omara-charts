/**
 * Serviço de API com Cache Integrado
 *
 * Funcionalidades:
 * - Cache automático de requisições
 * - Invalidação inteligente de cache
 * - Fallback para API quando cache expira
 * - Estatísticas de performance
 */

import { AxiosResponse } from 'axios';
import { api } from './api';
import { dataCache } from './cache';
import { IntrusionData, SolidData, InundationData, Station } from '../types';

interface CacheOptions {
  ttl?: number; // Time to live em milissegundos
  forceRefresh?: boolean; // Forçar refresh ignorando cache
}

interface ApiWithCacheResult<T> {
  data: T;
  fromCache: boolean;
  timestamp: number;
}

/**
 * Classe para gerenciar requisições com cache
 */
class ApiWithCache {
  /**
   * Obter dados de intrusão com cache
   */
  async getIntrusionData(
    stationId?: string,
    startDate?: string,
    endDate?: string,
    options: CacheOptions = {}
  ): Promise<ApiWithCacheResult<IntrusionData[]>> {
    const { ttl = 5 * 60 * 1000, forceRefresh = false } = options;

    // Verificar cache primeiro (se não forçar refresh)
    if (!forceRefresh) {
      const cachedData = dataCache.get<IntrusionData[]>(
        'intrusion',
        stationId,
        startDate,
        endDate
      );

      if (cachedData) {
        return {
          data: cachedData,
          fromCache: true,
          timestamp: Date.now(),
        };
      }
    }

    // Fazer requisição para API
    let response: AxiosResponse<IntrusionData[]>;

    if (stationId) {
      response = await api.intrusion.getByStation(stationId);
    } else if (startDate && endDate) {
      response = await api.intrusion.getByDateRange(startDate, endDate);
    } else {
      response = await api.intrusion.getAll();
    }

    const data = response.data;

    // Armazenar no cache
    dataCache.set(data, 'intrusion', stationId, startDate, endDate, ttl);

    return {
      data,
      fromCache: false,
      timestamp: Date.now(),
    };
  }

  /**
   * Obter dados de sólidos com cache
   */
  async getSolidData(
    stationId?: string,
    startDate?: string,
    endDate?: string,
    options: CacheOptions = {}
  ): Promise<ApiWithCacheResult<SolidData[]>> {
    const { ttl = 5 * 60 * 1000, forceRefresh = false } = options;

    // Verificar cache primeiro
    if (!forceRefresh) {
      const cachedData = dataCache.get<SolidData[]>(
        'solid',
        stationId,
        startDate,
        endDate
      );

      if (cachedData) {
        return {
          data: cachedData,
          fromCache: true,
          timestamp: Date.now(),
        };
      }
    }

    // Fazer requisição para API
    let response: AxiosResponse<SolidData[]>;

    if (stationId) {
      response = await api.solid.getByStation(stationId);
    } else if (startDate && endDate) {
      response = await api.solid.getByDateRange(startDate, endDate);
    } else {
      response = await api.solid.getAll();
    }

    const data = response.data;

    // Armazenar no cache
    dataCache.set(data, 'solid', stationId, startDate, endDate, ttl);

    return {
      data,
      fromCache: false,
      timestamp: Date.now(),
    };
  }

  /**
   * Obter dados de inundação com cache
   */
  async getInundationData(
    stationId?: string,
    startDate?: string,
    endDate?: string,
    options: CacheOptions = {}
  ): Promise<ApiWithCacheResult<InundationData[]>> {
    const { ttl = 5 * 60 * 1000, forceRefresh = false } = options;

    // Verificar cache primeiro
    if (!forceRefresh) {
      const cachedData = dataCache.get<InundationData[]>(
        'inundation',
        stationId,
        startDate,
        endDate
      );

      if (cachedData) {
        return {
          data: cachedData,
          fromCache: true,
          timestamp: Date.now(),
        };
      }
    }

    // Fazer requisição para API
    let response: AxiosResponse<InundationData[]>;

    if (stationId) {
      response = await api.inundation.getByStation(stationId);
    } else if (startDate && endDate) {
      response = await api.inundation.getByDateRange(startDate, endDate);
    } else {
      response = await api.inundation.getAll();
    }

    const data = response.data;

    // Armazenar no cache
    dataCache.set(data, 'inundation', stationId, startDate, endDate, ttl);

    return {
      data,
      fromCache: false,
      timestamp: Date.now(),
    };
  }

  /**
   * Obter estações com cache
   */
  async getStations(
    options: CacheOptions = {}
  ): Promise<ApiWithCacheResult<Station[]>> {
    const { ttl = 30 * 60 * 1000, forceRefresh = false } = options; // 30 minutos para estações

    // Verificar cache primeiro
    if (!forceRefresh) {
      const cachedData = dataCache.get<Station[]>('stations');

      if (cachedData) {
        return {
          data: cachedData,
          fromCache: true,
          timestamp: Date.now(),
        };
      }
    }

    // Fazer requisição para API
    const response = await api.stations.getAll();
    const data = response.data;

    // Armazenar no cache
    dataCache.set(data, 'stations', undefined, undefined, undefined, ttl);

    return {
      data,
      fromCache: false,
      timestamp: Date.now(),
    };
  }

  /**
   * Invalidar cache de um módulo específico
   */
  invalidateModuleCache(
    module: 'intrusion' | 'solid' | 'inundation' | 'stations'
  ): void {
    dataCache.invalidateModule(module);
    console.log(`[API Cache] Cache do módulo '${module}' invalidado`);
  }

  /**
   * Invalidar cache de uma estação específica
   */
  invalidateStationCache(
    module: 'intrusion' | 'solid' | 'inundation',
    stationId: string
  ): void {
    dataCache.invalidate(module, stationId);
    console.log(
      `[API Cache] Cache da estação '${stationId}' no módulo '${module}' invalidado`
    );
  }

  /**
   * Limpar todo o cache
   */
  clearAllCache(): void {
    dataCache.clear();
    console.log('[API Cache] Todo o cache foi limpo');
  }

  /**
   * Obter estatísticas de cache
   */
  getCacheStats() {
    return dataCache.getStats();
  }

  /**
   * Obter informações de debug do cache
   */
  getCacheDebugInfo() {
    return dataCache.getDebugInfo();
  }
}

// Instância singleton
export const apiWithCache = new ApiWithCache();

// Hook para usar a API com cache em componentes React
export const useApiWithCache = () => {
  const getIntrusionData = (
    stationId?: string,
    startDate?: string,
    endDate?: string,
    options?: CacheOptions
  ) => apiWithCache.getIntrusionData(stationId, startDate, endDate, options);

  const getSolidData = (
    stationId?: string,
    startDate?: string,
    endDate?: string,
    options?: CacheOptions
  ) => apiWithCache.getSolidData(stationId, startDate, endDate, options);

  const getInundationData = (
    stationId?: string,
    startDate?: string,
    endDate?: string,
    options?: CacheOptions
  ) => apiWithCache.getInundationData(stationId, startDate, endDate, options);

  const getStations = (options?: CacheOptions) =>
    apiWithCache.getStations(options);

  const invalidateModuleCache = (
    module: 'intrusion' | 'solid' | 'inundation' | 'stations'
  ) => apiWithCache.invalidateModuleCache(module);

  const invalidateStationCache = (
    module: 'intrusion' | 'solid' | 'inundation',
    stationId: string
  ) => apiWithCache.invalidateStationCache(module, stationId);

  const clearAllCache = () => apiWithCache.clearAllCache();

  const getCacheStats = () => apiWithCache.getCacheStats();

  const getCacheDebugInfo = () => apiWithCache.getCacheDebugInfo();

  return {
    getIntrusionData,
    getSolidData,
    getInundationData,
    getStations,
    invalidateModuleCache,
    invalidateStationCache,
    clearAllCache,
    getCacheStats,
    getCacheDebugInfo,
  };
};

export default apiWithCache;
