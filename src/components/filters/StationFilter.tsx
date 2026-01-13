import React, { useState, useEffect } from 'react';
import {
  useSelectedStations,
  useStations,
  useSelectedModule,
  useAppContext,
} from '../../hooks/useAppContext';
import { api } from '../../services/api';
import apiWithCache from '../../services/apiWithCache';
import { Icon } from '../ui/Icon';
import type { Station } from '../../types';

const StationFilter: React.FC = () => {
  const { state } = useAppContext();
  const [stations, setStations] = useStations();
  const [selectedStations, setSelectedStations] = useSelectedStations();
  const [selectedModule] = useSelectedModule();
  const [loading, setLoading] = useState(false);
  const [loadingStationsWithData, setLoadingStationsWithData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stationsWithData, setStationsWithData] = useState<Set<string>>(
    new Set()
  );

  // Se for módulo solid, só mostrar estações se o tipo de dado foi selecionado
  const shouldShowStations =
    selectedModule !== 'solid' || state.solidDataType !== undefined;

  // Carregar estações na inicialização
  useEffect(() => {
    const loadStations = async () => {
      if (stations.length > 0) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.stations.getAll();
        setStations(response.data);
      } catch (err: unknown) {
        setError('Erro ao carregar estações');
        console.error('Error loading stations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [stations.length, setStations]);

  // Para módulo de inundação, buscar dados e identificar estações que têm dados
  useEffect(() => {
    const loadStationsWithData = async () => {
      if (selectedModule !== 'inundation' || stations.length === 0) {
        setStationsWithData(new Set());
        return;
      }

      setLoadingStationsWithData(true);
      setError(null);

      try {
        // Buscar todos os dados de inundação (sem filtro de estação)
        const result = await apiWithCache.getInundationData(
          undefined,
          undefined,
          undefined,
          { forceRefresh: true }
        );

        // Extrair códigos únicos de estações que têm dados
        const stationCodes = new Set<string>();
        result.data.forEach((item: { station: string }) => {
          if (item.station) {
            stationCodes.add(item.station);
          }
        });

        setStationsWithData(stationCodes);
      } catch (err: unknown) {
        console.error('Erro ao buscar estações com dados de inundação:', err);
        // Em caso de erro, não filtrar (mostrar todas)
        setStationsWithData(new Set());
      } finally {
        setLoadingStationsWithData(false);
      }
    };

    loadStationsWithData();
  }, [selectedModule, stations.length]);

  const handleStationChange = (stationId: string) => {
    // Permitir apenas uma estação selecionada por vez
    const newSelection = selectedStations.includes(stationId)
      ? []
      : [stationId];
    setSelectedStations(newSelection);
  };

  if (loading || loadingStationsWithData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center h-40">
        <Icon
          name="refresh"
          className="animate-spin text-primary-500"
          size={24}
        />
        <span className="ml-2 text-gray-600">
          {loadingStationsWithData
            ? 'Carregando estações com dados...'
            : 'Carregando estações...'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center h-40 text-red-600">
        <Icon name="error" className="mr-2" size={20} />
        <span>{error}</span>
      </div>
    );
  }

  // Se for módulo solid e ainda não selecionou o tipo de dado, não mostrar
  if (!shouldShowStations) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center h-40">
        <div className="text-center">
          <Icon name="info" className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-sm text-gray-500">
            Selecione primeiro o tipo de dado (Transparência ou Sólidos
            Presentes)
          </p>
        </div>
      </div>
    );
  }

  // Filtrar estações por módulo selecionado
  let filteredStations = stations.filter((station: Station) => {
    // Mapear módulos para categorias de estações
    const moduleCategoryMap: Record<string, string[]> = {
      intrusion: ['intrusion', 'salinity', 'water'],
      solid: ['solid', 'suspension', 'water'],
      inundation: ['inundation', 'flood', 'water'],
    };

    const allowedCategories = moduleCategoryMap[selectedModule] || [];
    return allowedCategories.some(category =>
      station.category.toLowerCase().includes(category.toLowerCase())
    );
  });

  // Para módulo de inundação, filtrar apenas estações que têm dados
  if (selectedModule === 'inundation' && stationsWithData.size > 0) {
    filteredStations = filteredStations.filter((station: Station) =>
      stationsWithData.has(station.code)
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Icon name="map-pin" size={20} className="text-primary mr-2" />
        Estações de Monitoramento
      </h3>
      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
        {filteredStations.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            Nenhuma estação disponível para este módulo.
          </p>
        )}
        {filteredStations.map((station: Station) => (
          <label
            key={station.code}
            className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded-sm px-2"
          >
            <input
              type="radio"
              name="station"
              className="form-radio text-primary"
              checked={selectedStations.includes(station.code)}
              onChange={() => handleStationChange(station.code)}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {station.location}
              </div>
              <div className="text-xs text-gray-500">
                Código: {station.code}
              </div>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-600">
        {selectedStations.length > 0 ? (
          <span className="text-success font-medium">
            Estação selecionada: {selectedStations[0]}
          </span>
        ) : (
          <span className="text-body">Nenhuma estação selecionada</span>
        )}
      </div>
    </div>
  );
};

export default StationFilter;
