// Constantes da aplicação
export const APP_CONFIG = {
  NAME: 'OMARA Charts Dashboard',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de Visualização de Gráficos por Módulo e Estação',
} as const;

// Configurações dos módulos
export const MODULES = {
  INTRUSION: {
    id: 'intrusion',
    name: 'Intrusão Salina',
    description: 'Monitoramento de níveis de salinidade',
    maxValue: 40,
    unit: 'Unidades de Salinidade',
    color: '#3B82F6',
  },
  SOLID: {
    id: 'solid',
    name: 'Sólidos em Suspensão',
    description: 'Monitoramento de sólidos e transparência',
    maxValue: 100,
    unit: 'mg/L',
    color: '#10B981',
  },
  INUNDATION: {
    id: 'inundation',
    name: 'Inundação',
    description: 'Monitoramento de níveis de água',
    maxValue: 500,
    unit: 'cm',
    color: '#F59E0B',
  },
} as const;

// Configurações de gráficos
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 400,
  ANIMATION_DURATION: 1000,
  RESPONSIVE: true,
  MAINTAIN_ASPECT_RATIO: false,
  BORDER_WIDTH: 2,
  POINT_RADIUS: 4,
  TENSION: 0.4,
} as const;

// Configurações de tempo
export const TIME_CONFIG = {
  UPDATE_INTERVAL: 30000, // 30 segundos
  DEBOUNCE_DELAY: 500,
  CACHE_DURATION: 300000, // 5 minutos
} as const;

// Configurações de filtros
export const FILTER_CONFIG = {
  DEFAULT_DATE_RANGE: 7, // dias
  MAX_DATE_RANGE: 365, // dias
  QUICK_FILTERS: [
    { label: 'Última hora', value: 1, unit: 'hour' },
    { label: 'Últimas 24h', value: 24, unit: 'hour' },
    { label: 'Última semana', value: 7, unit: 'day' },
    { label: 'Último mês', value: 30, unit: 'day' },
  ],
} as const;

// Configurações de exportação
export const EXPORT_CONFIG = {
  SUPPORTED_FORMATS: ['csv', 'png', 'pdf'],
  DEFAULT_FORMAT: 'csv',
  IMAGE_QUALITY: 0.9,
} as const;

export default {
  APP_CONFIG,
  MODULES,
  CHART_CONFIG,
  TIME_CONFIG,
  FILTER_CONFIG,
  EXPORT_CONFIG,
};
