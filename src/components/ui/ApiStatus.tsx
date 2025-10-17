import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { api } from '../../services/api';

interface ApiStatusProps {
  className?: string;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>(
    'checking'
  );
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    setStatus('checking');
    try {
      // Tentar fazer uma requisição simples para verificar se a API está respondendo
      await api.stations.getAll();
      setStatus('connected');
    } catch {
      setStatus('error');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkApiStatus();
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: 'refresh' as const,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'Verificando conexão...',
        };
      case 'connected':
        return {
          icon: 'success' as const,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'API Conectada',
        };
      case 'error':
        return {
          icon: 'error' as const,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'Erro de Conexão',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`${className}`}>
      <div
        className={`p-3 rounded-md border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon
              name={statusInfo.icon}
              size={16}
              className={`${statusInfo.color} mr-2 ${
                status === 'checking' ? 'animate-spin' : ''
              }`}
            />
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          <button
            onClick={checkApiStatus}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            disabled={status === 'checking'}
          >
            {status === 'checking' ? 'Verificando...' : 'Verificar'}
          </button>
        </div>
        {lastCheck && (
          <div className="mt-1 text-xs text-gray-500">
            Última verificação: {lastCheck.toLocaleTimeString('pt-BR')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiStatus;
