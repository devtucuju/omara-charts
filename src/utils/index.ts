// Utilitários gerais da aplicação

/**
 * Formata uma data para exibição
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formata uma data e hora para exibição
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formata uma data e hora no formato: 15-JAN-2024 00:00
 */
export const formatDateTimeChart = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Mapeamento de meses para abreviações em maiúsculas
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

/**
 * Combina date e hour (formato do MongoDB) e formata no formato: 15-JAN-2024 00:00
 * @param date - Data no formato ISO string ou Date
 * @param hour - Hora no formato "HH:MM" ou "HH:MM:SS"
 */
export const formatDateTimeChartFromParts = (
  date: Date | string,
  hour: string
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Extrair horas e minutos da string hour (formato "HH:MM" ou "HH:MM:SS")
  const [hours, minutes] = hour.split(':').map(Number);

  // Criar nova data com a hora especificada
  const dateTime = new Date(dateObj);
  dateTime.setHours(hours || 0, minutes || 0, 0, 0);

  return formatDateTimeChart(dateTime);
};

/**
 * Formata um número com separadores de milhares
 */
export const formatNumber = (value: number, decimals = 2): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Debounce function para otimizar requisições
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function para limitar frequência de execução
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Gera um ID único
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Valida se uma data é válida
 */
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Calcula a diferença em dias entre duas datas
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Converte bytes para formato legível
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Classe para gerenciar cache local
 */
export class LocalCache {
  private static instance: LocalCache;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> =
    new Map();

  static getInstance(): LocalCache {
    if (!LocalCache.instance) {
      LocalCache.instance = new LocalCache();
    }
    return LocalCache.instance;
  }

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

export default {
  formatDate,
  formatDateTime,
  formatDateTimeChart,
  formatDateTimeChartFromParts,
  formatNumber,
  debounce,
  throttle,
  generateId,
  isValidDate,
  getDaysDifference,
  formatBytes,
  LocalCache,
};
