/**
 * Sistema de Cache para Dados da API
 *
 * Funcionalidades:
 * - Cache em memória com TTL (Time To Live)
 * - Invalidação automática por tempo
 * - Invalidação manual por chave
 * - Limpeza automática de dados expirados
 * - Estatísticas de cache (hit/miss)
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  lastCleanup: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    lastCleanup: Date.now(),
  };

  // Configurações padrão
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly CLEANUP_INTERVAL = 60 * 1000; // 1 minuto
  private readonly MAX_CACHE_SIZE = 100; // Máximo de entradas

  constructor() {
    // Limpeza automática periódica
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  /**
   * Gerar chave de cache baseada nos parâmetros
   */
  private generateKey(
    module: string,
    station?: string,
    startDate?: string,
    endDate?: string
  ): string {
    const parts = [module];
    if (station) parts.push(`station:${station}`);
    if (startDate) parts.push(`start:${startDate}`);
    if (endDate) parts.push(`end:${endDate}`);
    return parts.join('|');
  }

  /**
   * Verificar se uma entrada está expirada
   */
  private isExpired(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Limpar entradas expiradas
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    this.stats.size = this.cache.size;
    this.stats.lastCleanup = now;

    if (cleaned > 0) {
      console.log(`[Cache] Limpeza automática: ${cleaned} entradas removidas`);
    }
  }

  /**
   * Obter dados do cache
   */
  get<T>(
    module: string,
    station?: string,
    startDate?: string,
    endDate?: string
  ): T | null {
    const key = this.generateKey(module, station, startDate, endDate);
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.size = this.cache.size;
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  /**
   * Armazenar dados no cache
   */
  set<T>(
    data: T,
    module: string,
    station?: string,
    startDate?: string,
    endDate?: string,
    ttl?: number
  ): void {
    const key = this.generateKey(module, station, startDate, endDate);

    // Limitar tamanho do cache
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanup();

      // Se ainda estiver cheio, remover a entrada mais antiga
      if (this.cache.size >= this.MAX_CACHE_SIZE) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    };

    this.cache.set(key, entry);
    this.stats.size = this.cache.size;

    console.log(`[Cache] Dados armazenados: ${key}`);
  }

  /**
   * Invalidar cache por chave
   */
  invalidate(
    module: string,
    station?: string,
    startDate?: string,
    endDate?: string
  ): void {
    const key = this.generateKey(module, station, startDate, endDate);
    const deleted = this.cache.delete(key);

    if (deleted) {
      this.stats.size = this.cache.size;
      console.log(`[Cache] Entrada invalidada: ${key}`);
    }
  }

  /**
   * Invalidar todo o cache de um módulo
   */
  invalidateModule(module: string): void {
    let deleted = 0;

    for (const key of this.cache.keys()) {
      if (key.startsWith(module)) {
        this.cache.delete(key);
        deleted++;
      }
    }

    this.stats.size = this.cache.size;
    console.log(`[Cache] Módulo invalidado: ${module} (${deleted} entradas)`);
  }

  /**
   * Limpar todo o cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.stats.size = 0;
    console.log(`[Cache] Cache limpo: ${size} entradas removidas`);
  }

  /**
   * Obter estatísticas do cache
   */
  getStats(): CacheStats & { hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    };
  }

  /**
   * Obter informações de debug
   */
  getDebugInfo(): Record<string, unknown> {
    const entries: Record<string, unknown> = {};

    for (const [key, entry] of this.cache.entries()) {
      entries[key] = {
        timestamp: new Date(entry.timestamp).toISOString(),
        ttl: entry.ttl,
        expired: this.isExpired(entry),
        dataSize: JSON.stringify(entry.data).length,
      };
    }

    return {
      stats: this.getStats(),
      entries,
      config: {
        defaultTTL: this.DEFAULT_TTL,
        maxSize: this.MAX_CACHE_SIZE,
        cleanupInterval: this.CLEANUP_INTERVAL,
      },
    };
  }
}

// Instância singleton do cache
export const dataCache = new DataCache();

// Hook para usar o cache em componentes React
export const useCache = () => {
  const get = <T>(
    module: string,
    station?: string,
    startDate?: string,
    endDate?: string
  ): T | null => {
    return dataCache.get<T>(module, station, startDate, endDate);
  };

  const set = <T>(
    data: T,
    module: string,
    station?: string,
    startDate?: string,
    endDate?: string,
    ttl?: number
  ): void => {
    dataCache.set(data, module, station, startDate, endDate, ttl);
  };

  const invalidate = (
    module: string,
    station?: string,
    startDate?: string,
    endDate?: string
  ): void => {
    dataCache.invalidate(module, station, startDate, endDate);
  };

  const invalidateModule = (module: string): void => {
    dataCache.invalidateModule(module);
  };

  const clear = (): void => {
    dataCache.clear();
  };

  const getStats = () => {
    return dataCache.getStats();
  };

  const getDebugInfo = () => {
    return dataCache.getDebugInfo();
  };

  return {
    get,
    set,
    invalidate,
    invalidateModule,
    clear,
    getStats,
    getDebugInfo,
  };
};

export default dataCache;
