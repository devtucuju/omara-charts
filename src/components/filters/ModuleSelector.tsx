import React from 'react';
import { Icon } from '../ui';
import { useSelectedModule } from '../../hooks/useAppContext';
import { MODULES } from '../../constants';

interface ModuleSelectorProps {
  className?: string;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ className = '' }) => {
  const [selectedModule, setSelectedModule] = useSelectedModule();

  const modules = [
    {
      id: 'intrusion' as const,
      ...MODULES.INTRUSION,
      icon: 'intrusion' as const,
    },
    {
      id: 'solid' as const,
      ...MODULES.SOLID,
      icon: 'solid' as const,
    },
    {
      id: 'inundation' as const,
      ...MODULES.INUNDATION,
      icon: 'inundation' as const,
    },
  ];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Icon name="settings" size={20} className="text-primary-600 mr-2" />
        Seleção de Módulo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modules.map(module => (
          <button
            key={module.id}
            onClick={() => setSelectedModule(module.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedModule === module.id
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center mb-2">
              <div
                className="p-2 rounded-lg mr-3"
                style={{
                  backgroundColor:
                    selectedModule === module.id ? module.color : '#f3f4f6',
                }}
              >
                <Icon
                  name={module.icon}
                  size={24}
                  className={
                    selectedModule === module.id
                      ? 'text-white'
                      : 'text-gray-600'
                  }
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900">
                  {module.name}
                </h4>
              </div>
              {selectedModule === module.id && (
                <Icon name="success" size={20} className="text-primary-600" />
              )}
            </div>

            <p className="text-xs text-gray-600 mb-2">{module.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Máx: {module.maxValue} {module.unit}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100">
                {module.unit}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Informações do módulo selecionado */}
      {selectedModule && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center mb-2">
            <Icon name="info" size={16} className="text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">
              Módulo Selecionado
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <div className="font-medium">
              {
                MODULES[selectedModule.toUpperCase() as keyof typeof MODULES]
                  .name
              }
            </div>
            <div>
              {
                MODULES[selectedModule.toUpperCase() as keyof typeof MODULES]
                  .description
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleSelector;
