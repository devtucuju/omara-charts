import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          OMARA Charts Dashboard
        </h1>
        <div className="card max-w-md">
          <button
            onClick={() => setCount(count => count + 1)}
            className="btn-primary w-full mb-4"
          >
            Count is {count}
          </button>
          <p className="text-gray-600">TailwindCSS está funcionando! 🎉</p>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Sistema de Visualização de Gráficos por Módulo e Estação
        </p>
      </div>
    </div>
  );
}

export default App;
