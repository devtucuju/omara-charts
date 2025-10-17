import React from 'react';
import { useSelectedModule } from '../../hooks/useAppContext';
import { MODULES } from '../../constants';
import { Icon } from '../ui/Icon';

const ModuleSelector: React.FC = () => {
  const [selectedModule, setSelectedModule] = useSelectedModule();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Icon name="box" size={20} className="text-primary-600 mr-2" />
        Módulo de Monitoramento
      </h3>
      <select
        value={selectedModule}
        onChange={e => setSelectedModule(e.target.value as any)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {Object.entries(MODULES).map(([key, module]) => (
          <option key={key} value={module.id}>
            {module.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModuleSelector;
