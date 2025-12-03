import React from 'react';
import { useAppContext } from '../../contexts';
import { Icon } from '../ui/Icon';
import type { SolidDataType } from '../../types';

const SolidDataTypeSelector: React.FC = () => {
  const { state, actions } = useAppContext();

  const handleTypeChange = (type: SolidDataType) => {
    actions.setSolidDataType(type);
  };

  const options: Array<{
    value: SolidDataType;
    label: string;
    description: string;
  }> = [
    {
      value: 'transparency',
      label: 'Transparência',
      description: 'Visualizar dados de transparência da água',
    },
    {
      value: 'solidsPresent',
      label: 'Sólidos Presentes',
      description: 'Visualizar dados de sólidos presentes na água',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Icon name="filter" size={20} className="text-primary mr-2" />
        Tipo de Dado - Sólidos em Suspensão
      </h3>
      <div className="space-y-3">
        {options.map(option => (
          <label
            key={option.value}
            className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              state.solidDataType === option.value
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="solidDataType"
              value={option.value}
              checked={state.solidDataType === option.value}
              onChange={() => handleTypeChange(option.value)}
              className="mt-1 form-radio text-primary"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {option.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {option.description}
              </div>
            </div>
          </label>
        ))}
      </div>
      {state.solidDataType && (
        <div className="mt-4 p-3 bg-stroke border border-primary rounded-md">
          <div className="text-sm text-primary">
            <strong>Tipo selecionado:</strong>{' '}
            {options.find(opt => opt.value === state.solidDataType)?.label}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Agora você pode selecionar uma estação para visualizar os dados
          </div>
        </div>
      )}
    </div>
  );
};

export default SolidDataTypeSelector;
