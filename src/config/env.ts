// Configurações de ambiente da aplicação
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333',

  // Environment
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,

  // Chart Configuration
  chartUpdateInterval:
    Number(import.meta.env.VITE_CHART_UPDATE_INTERVAL) || 30000,

  // Feature Flags
  enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',

  // API Endpoints
  endpoints: {
    intrusion: '/intrusion',
    solid: '/solid',
    inundation: '/inundation',
    stations: '/station',
  },
} as const;

export default config;
