import { useState, useCallback } from 'react';
import type { AxiosResponse } from 'axios';

// Hook para gerenciar estado de loading e erros em requisições API
export const useApi = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (requestFn: () => Promise<AxiosResponse<T>>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await requestFn();
        setData(response.data);
        return response.data;
      } catch (err: unknown) {
        const errorMessage =
          (err as any).response?.data?.message ||
          (err as any).message ||
          'Erro desconhecido na requisição';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
};

// Hook específico para dados de gráficos
export const useChartData = <T>() => {
  const apiHook = useApi<T[]>();

  const fetchChartData = useCallback(
    async (
      requestFn: () => Promise<AxiosResponse<T[]>>,
      transformFn?: (data: T[]) => unknown
    ) => {
      const result = await apiHook.execute(requestFn);

      if (result && transformFn) {
        const transformedData = transformFn(result);
        apiHook.setData(transformedData as T[]);
        return transformedData;
      }

      return result;
    },
    [apiHook]
  );

  return {
    ...apiHook,
    fetchChartData,
  };
};

export default useApi;
