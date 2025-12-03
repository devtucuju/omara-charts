import type { ModuleType } from '../types';

interface ModuleConfig {
  id: ModuleType;
  name: string;
  unit: string | { transparency: string; solidsPresent: string };
  maxValue?: number;
}

export const MODULES: Record<string, ModuleConfig> = {
  INTRUSION: {
    id: 'intrusion',
    name: 'Intrusão Salina',
    unit: 'Nível de Salinidade ‰',
    maxValue: 40,
  },
  SOLID: {
    id: 'solid',
    name: 'Sólidos em Suspensão',
    unit: {
      transparency: 'Transparência cm',
      solidsPresent: 'Sólidos Presentes ml',
    },
  },
  INUNDATION: {
    id: 'inundation',
    name: 'Inundação',
    unit: 'Nível Medido m',
  },
};

export const FILTER_CONFIG = {
  MAX_DATE_RANGE: 365, // dias
  DEFAULT_DATE_RANGE: 7, // dias
  QUICK_FILTERS: [
    { label: 'Última Hora', value: 1, unit: 'hour' },
    { label: 'Últimas 6 Horas', value: 6, unit: 'hour' },
    { label: 'Último Dia', value: 1, unit: 'day' },
    { label: 'Últimos 7 Dias', value: 7, unit: 'day' },
    { label: 'Últimos 30 Dias', value: 30, unit: 'day' },
  ],
};
