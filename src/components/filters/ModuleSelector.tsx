import React from 'react';
import { useSelectedModule } from '../../hooks/useAppContext';
import { MODULES } from '../../constants';
import { Icon } from '../ui/Icon';

const ModuleSelector: React.FC = () => {
  const [selectedModule, setSelectedModule] = useSelectedModule();

  const currentModule =
    MODULES[selectedModule.toUpperCase() as keyof typeof MODULES];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Icon name="box" size={20} className="text-primary mr-2" />
        Módulo de Monitoramento
      </h3>
      <select
        value={selectedModule}
        onChange={e =>
          setSelectedModule(
            e.target.value as 'intrusion' | 'solid' | 'inundation'
          )
        }
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {Object.entries(MODULES).map(([key, module]) => (
          <option key={key} value={module.id}>
            {module.name}
          </option>
        ))}
      </select>

      {/* Informações do módulo selecionado */}
      {currentModule && (
        <div className="mt-4 p-3 bg-stroke border border-primary rounded-md">
          <div className="text-sm">
            <div className="font-medium text-primary mb-1">
              {currentModule.name}
            </div>
            <div className="text-body">
              <strong>Unidade:</strong> {currentModule.unit}
            </div>
            {currentModule.maxValue && (
              <div className="text-body">
                <strong>Valor Máximo:</strong> {currentModule.maxValue}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleSelector;
