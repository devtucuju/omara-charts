import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import config from '../config/env';

// Interface para configuração da API
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Configuração padrão
const defaultConfig: ApiConfig = {
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Criar instância do Axios
const apiClient: AxiosInstance = axios.create(defaultConfig);

// Interceptor para requisições
apiClient.interceptors.request.use(
  config => {
    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log da requisição (apenas em desenvolvimento)
    if (config.url) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config
      );
    }

    return config;
  },
  error => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log da resposta (apenas em desenvolvimento)
    if (config.isDev) {
      console.log(
        `[API Response] ${response.status} ${response.config.url}`,
        response.data
      );
    }

    return response;
  },
  error => {
    // Tratamento de erros global
    if (error.response) {
      // Erro de resposta do servidor
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Não autorizado - redirecionar para login
          localStorage.removeItem('auth_token');
          console.warn('[API] Token expirado ou inválido');
          break;
        case 403:
          // Acesso negado
          console.error('[API] Acesso negado');
          break;
        case 404:
          // Recurso não encontrado
          console.error('[API] Recurso não encontrado');
          break;
        case 500:
          // Erro interno do servidor
          console.error('[API] Erro interno do servidor');
          break;
        default:
          console.error(`[API Error] ${status}:`, data);
      }
    } else if (error.request) {
      // Erro de rede
      console.error('[API Network Error]', error.request);
    } else {
      // Outros erros
      console.error('[API Error]', error.message);
    }

    return Promise.reject(error);
  }
);

// Funções de API específicas para os módulos
export const api = {
  // Intrusão Salina
  intrusion: {
    getAll: () => apiClient.get(config.endpoints.intrusion),
    getByStation: (stationId: string) =>
      apiClient.get(`${config.endpoints.intrusion}?station=${stationId}`),
    getByDateRange: (startDate: string, endDate: string) =>
      apiClient.get(
        `${config.endpoints.intrusion}?startDate=${startDate}&endDate=${endDate}`
      ),
  },

  // Sólidos em Suspensão
  solid: {
    getAll: () => apiClient.get(config.endpoints.solid),
    getByStation: (stationId: string) =>
      apiClient.get(`${config.endpoints.solid}?station=${stationId}`),
    getByDateRange: (startDate: string, endDate: string) =>
      apiClient.get(
        `${config.endpoints.solid}?startDate=${startDate}&endDate=${endDate}`
      ),
  },

  // Inundação
  inundation: {
    getAll: () => apiClient.get(config.endpoints.inundation),
    getByStation: (stationId: string) =>
      apiClient.get(`${config.endpoints.inundation}?station=${stationId}`),
    getByDateRange: (startDate: string, endDate: string) =>
      apiClient.get(
        `${config.endpoints.inundation}?startDate=${startDate}&endDate=${endDate}`
      ),
  },

  // Estações
  stations: {
    getAll: () => apiClient.get(config.endpoints.stations),
    getById: (id: string) =>
      apiClient.get(`${config.endpoints.stations}/${id}`),
  },
};

// Hook personalizado para fazer requisições com loading
export const useApiRequest = () => {
  const makeRequest = async <T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<T> => {
    const response = await requestFn();
    return response.data;
  };

  return { makeRequest };
};

export default apiClient;
