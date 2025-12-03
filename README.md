# OMARA Charts Dashboard

Sistema de visualização de gráficos para monitoramento ambiental por módulo e estação.

## 📋 Sobre o Projeto

O OMARA Charts Dashboard é uma aplicação web moderna desenvolvida em React + TypeScript que permite visualizar dados de monitoramento ambiental através de gráficos interativos. O sistema suporta três módulos de monitoramento: Intrusão Salina, Sólidos em Suspensão e Inundação.

## ✨ Funcionalidades

### Módulos de Monitoramento

- **Intrusão Salina**: Visualização de níveis de salinidade (0-40 ‰)
- **Sólidos em Suspensão**:
  - Transparência (cm)
  - Sólidos Presentes (ml)
- **Inundação**: Visualização de níveis medidos (m)

### Características Principais

- 📊 Gráficos interativos com Chart.js
- 🔄 Integração com API REST (MongoDB)
- 💾 Sistema de cache inteligente
- 📱 Interface responsiva
- 🎨 Design moderno com Tailwind CSS
- ⚡ Performance otimizada
- 🔍 Filtros por módulo e estação
- 📅 Formatação de datas: `15-JAN-2024 00:00`

## 🚀 Tecnologias

- **React 19.1.1** - Biblioteca UI
- **TypeScript 5.9.3** - Tipagem estática
- **Vite 4.5.14** - Build tool
- **Chart.js 4.5.1** - Gráficos
- **Tailwind CSS 3.4.18** - Estilização
- **Axios 1.12.2** - Cliente HTTP
- **Lucide React 0.546.0** - Ícones

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- API backend rodando em http://localhost:3333

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/devtucuju/omara-charts.git
cd omara-charts
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):

```bash
# Criar arquivo .env se necessário
VITE_API_BASE_URL=http://localhost:3333
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Acesse no navegador:

```
http://localhost:5173
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── charts/         # Componentes de gráficos
│   ├── filters/        # Componentes de filtros
│   ├── layout/         # Componentes de layout
│   └── ui/             # Componentes de UI reutilizáveis
├── contexts/           # Context API
├── hooks/              # Hooks customizados
├── services/           # Serviços de API e cache
├── types/              # Definições TypeScript
├── utils/              # Funções utilitárias
├── constants/          # Constantes
└── config/             # Configurações
```

## 🎯 Como Usar

### Visualizar Dados

1. **Selecione um Módulo**: Escolha entre Intrusão Salina, Sólidos em Suspensão ou Inundação
2. **Para Sólidos em Suspensão**: Escolha o tipo de dado (Transparência ou Sólidos Presentes)
3. **Selecione uma Estação**: Escolha a estação de monitoramento desejada
4. **Visualize o Gráfico**: Os dados serão carregados automaticamente da API

### Formato dos Dados

Os dados são formatados automaticamente:

- **Data e Hora**: `15-JAN-2024 00:00`
- **Valores**: Extraídos automaticamente baseado no módulo selecionado

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Cria build de produção

# Qualidade de Código
npm run lint             # Executa ESLint
npm run lint:fix         # Corrige erros do ESLint
npm run format           # Formata código com Prettier
npm run format:check     # Verifica formatação

# Preview
npm run preview          # Preview do build de produção
```

## 🌐 API

A aplicação consome uma API REST que deve estar rodando em `http://localhost:3333`.

### Endpoints Utilizados

- `GET /intrusion?station={stationId}` - Dados de intrusão salina
- `GET /solid?station={stationId}` - Dados de sólidos em suspensão
- `GET /inundation?station={stationId}` - Dados de inundação
- `GET /station` - Lista de estações

### Formato dos Dados

Os dados devem seguir a estrutura do MongoDB:

```json
{
  "_id": "ObjectId",
  "user": "ObjectId",
  "station": "IS-04",
  "date": "2025-06-17T00:00:00.000Z",
  "hour": "16:00"
  // ... campos específicos do módulo
}
```

## 🎨 Personalização

### Cores

As cores podem ser personalizadas no arquivo `tailwind.config.js`:

```js
colors: {
  primary: '#065f46',
  secondary: '#80CAEE',
  // ...
}
```

### Configuração da API

Edite `src/config/env.ts` ou use variáveis de ambiente:

```env
VITE_API_BASE_URL=http://localhost:3333
```

## 📝 Licença

Este projeto é privado e de uso interno.

## 👥 Contribuidores

- Equipe OMARA

## 📞 Suporte

Para questões ou problemas, abra uma issue no repositório.

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024
