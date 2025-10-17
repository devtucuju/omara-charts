import React, { useState, useEffect } from 'react';
import { Icon } from '../ui';
import { useSelectedStations, useStations } from '../../hooks/useAppContext';
import { api } from '../../services/api';

interface StationFilterProps {
  className?: string;
}

const StationFilter: React.FC<StationFilterProps> = ({ className = '' }) => {
  const [stations, setStations] = useStations();
  const [selectedStations, setSelectedStations] = useSelectedStations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // const [showDropdown, setShowDropdown] = useState(false); // Para uso futuro

  // Carregar estações na inicialização
  useEffect(() => {
    const loadStations = async () => {
      if (stations.length > 0) return; // Já carregadas

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
  }, [stations.length]);

  // Filtrar estações baseado no termo de busca
  const filteredStations = stations.filter(
    station =>
      station.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle seleção de estação
  const toggleStation = (stationId: string) => {
    const newSelection = selectedStations.includes(stationId)
      ? selectedStations.filter(id => id !== stationId)
      : [...selectedStations, stationId];

    setSelectedStations(newSelection);
  };

  // Selecionar todas as estações
  const selectAllStations = () => {
    setSelectedStations(stations.map(station => station._id));
  };

  // Limpar seleção
  const clearSelection = () => {
    setSelectedStations([]);
  };

  // Selecionar estações por categoria
  const selectByCategory = (category: string) => {
    const categoryStations = stations
      .filter(station => station.category === category)
      .map(station => station._id);

    const newSelection = [
      ...new Set([...selectedStations, ...categoryStations]),
    ];
    setSelectedStations(newSelection);
  };

  // Obter categorias únicas
  const categories = [...new Set(stations.map(station => station.category))];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="filter" size={20} className="text-primary-600 mr-2" />
          Seleção de Estações
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={selectAllStations}
            className="btn-secondary text-xs px-2 py-1"
            disabled={loading}
          >
            Todas
          </button>
          <button
            onClick={clearSelection}
            className="btn-secondary text-xs px-2 py-1"
            disabled={loading}
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Contador de estações selecionadas */}
      <div className="mb-3">
        <span className="text-sm text-gray-600">
          {selectedStations.length} de {stations.length} estações selecionadas
        </span>
      </div>

      {/* Busca */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="search" size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar estações..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Filtros por categoria */}
      {categories.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => selectByCategory(category)}
                className="btn-secondary text-xs px-2 py-1"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lista de estações */}
      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
        {loading && (
          <div className="p-4 text-center text-gray-500">
            <Icon
              name="refresh"
              size={20}
              className="animate-spin mx-auto mb-2"
            />
            Carregando estações...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-600">
            <Icon name="error" size={20} className="mx-auto mb-2" />
            {error}
          </div>
        )}

        {!loading && !error && filteredStations.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Nenhuma estação encontrada
          </div>
        )}

        {!loading &&
          !error &&
          filteredStations.map(station => (
            <div
              key={station._id}
              className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleStation(station._id)}
            >
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  checked={selectedStations.includes(station._id)}
                  onChange={() => toggleStation(station._id)}
                  className="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">
                    {station.code}
                  </div>
                  <div className="text-xs text-gray-500">
                    {station.location} • {station.category}
                  </div>
                </div>
              </div>
              <Icon
                name={
                  selectedStations.includes(station._id) ? 'success' : 'info'
                }
                size={16}
                className={`ml-2 ${
                  selectedStations.includes(station._id)
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`}
              />
            </div>
          ))}
      </div>

      {/* Estações selecionadas (resumo) */}
      {selectedStations.length > 0 && (
        <div className="mt-4 p-3 bg-primary-50 rounded-md">
          <div className="text-sm font-medium text-primary-800 mb-2">
            Estações Selecionadas:
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedStations.map(stationId => {
              const station = stations.find(s => s._id === stationId);
              return station ? (
                <span
                  key={stationId}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
                >
                  {station.code}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleStation(stationId);
                    }}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <Icon name="close" size={12} />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StationFilter;
