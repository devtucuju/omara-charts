import React, { useState, useEffect } from 'react';
import {
  useSelectedStations,
  useStations,
  useSelectedModule,
} from '../../hooks/useAppContext';
import { api } from '../../services/api';
import { Icon } from '../ui/Icon';
import type { Station } from '../../types';

const StationFilter: React.FC = () => {
  const [stations, setStations] = useStations();
  const [selectedStations, setSelectedStations] = useSelectedStations();
  const [selectedModule] = useSelectedModule();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleStationChange = (stationId: string) => {
    // Permitir apenas uma estação selecionada por vez
    const newSelection = selectedStations.includes(stationId)
      ? []
      : [stationId];
    setSelectedStations(newSelection);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center h-40">
        <Icon
          name="refresh"
          className="animate-spin text-primary-500"
          size={24}
        />
        <span className="ml-2 text-gray-600">Carregando estações...</span>
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

  // Filtrar estações por módulo selecionado
  const filteredStations = stations.filter((station: Station) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Icon name="map-pin" size={20} className="text-primary-600 mr-2" />
        Estações de Monitoramento - {selectedModule}
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
              className="form-radio text-primary-600"
              checked={selectedStations.includes(station.code)}
              onChange={() => handleStationChange(station.code)}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {station.location}
              </div>
              <div className="text-xs text-gray-500">
                Código: {station.code} | Categoria: {station.category}
              </div>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-600">
        {selectedStations.length > 0 ? (
          <span className="text-green-600 font-medium">
            Estação selecionada: {selectedStations[0]}
          </span>
        ) : (
          <span className="text-gray-500">Nenhuma estação selecionada</span>
        )}
      </div>
    </div>
  );
};

export default StationFilter;
