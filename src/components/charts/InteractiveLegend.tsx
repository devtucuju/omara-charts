import React from 'react';
import { Icon } from '../ui';

interface LegendItem {
  label: string;
  color: string;
  visible: boolean;
  stationId?: string;
}

interface InteractiveLegendProps {
  items: LegendItem[];
  onToggleVisibility: (index: number) => void;
  onToggleAll: (visible: boolean) => void;
  className?: string;
}

const InteractiveLegend: React.FC<InteractiveLegendProps> = ({
  items,
  onToggleVisibility,
  onToggleAll,
  className = '',
}) => {
  const visibleCount = items.filter(item => item.visible).length;
  const allVisible = visibleCount === items.length;
  const noneVisible = visibleCount === 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="eye" size={20} className="text-primary-600 mr-2" />
          Legenda Interativa
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleAll(true)}
            disabled={allVisible}
            className={`btn-secondary text-xs px-2 py-1 ${
              allVisible ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Mostrar todas"
          >
            <Icon name="eye" size={14} className="mr-1" />
            Todas
          </button>
          <button
            onClick={() => onToggleAll(false)}
            disabled={noneVisible}
            className={`btn-secondary text-xs px-2 py-1 ${
              noneVisible ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Ocultar todas"
          >
            <Icon name="eye-off" size={14} className="mr-1" />
            Nenhuma
          </button>
        </div>
      </div>

      {/* Contador */}
      <div className="mb-3 text-sm text-gray-600">
        {visibleCount} de {items.length} estações visíveis
      </div>

      {/* Lista de itens da legenda */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.stationId || index}
            className={`flex items-center p-2 rounded-md transition-colors ${
              item.visible ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
            }`}
          >
            <button
              onClick={() => onToggleVisibility(index)}
              className="flex items-center flex-1 hover:bg-gray-200 rounded p-1 transition-colors"
            >
              {/* Indicador de cor */}
              <div
                className="w-4 h-4 rounded-full mr-3 border border-gray-300"
                style={{ backgroundColor: item.color }}
              />

              {/* Label */}
              <span
                className={`text-sm font-medium flex-1 text-left ${
                  item.visible ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>

              {/* Ícone de visibilidade */}
              <Icon
                name={item.visible ? 'eye' : 'eye-off'}
                size={16}
                className={`ml-2 ${
                  item.visible ? 'text-gray-600' : 'text-gray-400'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Informações adicionais */}
      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div className="flex items-center mb-1">
              <Icon name="info" size={12} className="mr-1" />
              <span>Dica:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 ml-3">
              <li>Clique em uma estação para mostrar/ocultar</li>
              <li>Use "Todas" ou "Nenhuma" para controle rápido</li>
              <li>Estações ocultas aparecem escuras na legenda</li>
            </ul>
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {items.length === 0 && (
        <div className="text-center py-8">
          <Icon name="info" size={32} className="text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Nenhuma estação selecionada</p>
          <p className="text-gray-400 text-xs mt-1">
            Selecione estações para ver a legenda
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveLegend;
