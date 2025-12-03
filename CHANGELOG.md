# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-12-02

### 🎉 Lançamento Inicial

Primeira versão estável do OMARA Charts Dashboard com todas as funcionalidades principais implementadas.

### ✨ Adicionado

#### Funcionalidades Principais

- **Sistema de Visualização de Gráficos**: Dashboard completo para visualização de dados de monitoramento ambiental
- **Três Módulos de Monitoramento**:
  - Intrusão Salina: Visualização de níveis de salinidade (0-40 ‰)
  - Sólidos em Suspensão: Visualização de transparência (cm) e sólidos presentes (ml)
  - Inundação: Visualização de níveis medidos (m)

#### Integração com API

- Integração completa com API REST (http://localhost:3333)
- Sistema de cache inteligente para otimização de performance
- Busca de dados por estação de monitoramento
- Transformação automática de dados do MongoDB (date + hour)
- Estados de loading, erro e vazio com feedback visual

#### Interface do Usuário

- **Seletor de Módulo**: Dropdown para escolher entre os três módulos
- **Seletor de Tipo de Dado**: Para Sólidos em Suspensão, escolha entre Transparência ou Sólidos Presentes
- **Filtro de Estações**: Lista de estações filtradas por módulo selecionado
- **Gráficos Interativos**: Gráficos de linha com Chart.js
- **Layout Responsivo**: Interface adaptável para diferentes tamanhos de tela

#### Formatação de Dados

- Formatação de datas no formato: `15-JAN-2024 00:00`
- Combinação automática de `date` e `hour` do MongoDB
- Tooltips informativos nos gráficos
- Labels formatados no eixo X

#### Componentes e Arquitetura

- **Context API**: Gerenciamento de estado global com React Context
- **Hooks Customizados**: useAppContext, useApi, useChartData
- **Componentes Modulares**: Estrutura organizada por responsabilidade
- **Tipos TypeScript**: Tipagem completa para todos os dados
- **Serviços de API**: Camada de abstração para requisições HTTP
- **Sistema de Cache**: Cache local com TTL configurável

#### Design e Estilo

- **Paleta de Cores**: Cores baseadas na identidade visual da web OMARA
- **Tailwind CSS**: Estilização moderna e responsiva
- **Ícones Lucide React**: Biblioteca de ícones moderna
- **Logo OMARA**: Logo oficial no cabeçalho
- **Favicon**: Favicon criado a partir do logo

#### Qualidade de Código

- **ESLint**: Linting configurado com regras TypeScript e React
- **Prettier**: Formatação automática de código
- **Husky**: Git hooks para validação antes de commits
- **TypeScript**: Tipagem estática completa
- **Validação de Dados**: Validações nos componentes de filtro

#### Documentação

- README.md completo com instruções de uso
- CHANGELOG.md com histórico de versões
- Comentários no código explicando funcionalidades

### 🔧 Corrigido

- Loop infinito de re-renderização nos useEffect
- Chave duplicada no componente Icon
- Export do AppProvider no contexts/index.ts
- Estrutura do AppProvider e imports de tipos
- Ícone Success inexistente e ordem do @import no CSS
- Configuração TailwindCSS e problemas de importação
- Loop infinito no useEffect do ChartContainer (usando singleton apiWithCache)
- Erros de tipo TypeScript no ChartContainer

### 🔄 Refatorado

- Simplificação do título do cabeçalho
- Melhoria da formatação do código
- Organização da estrutura de pastas
- Otimização do sistema de cache
- Melhoria da performance com memoização

### 📝 Mudado

- Título simplificado de "OMARA Charts Dashboard" para "OMARA"
- Descrição atualizada para "Gráficos por Módulo e Estação"
- Unidades atualizadas com símbolos apropriados (‰, cm, ml, m)
- Layout do gráfico: título centralizado e aumentado, remoção do título do Chart.js
- Idioma do HTML alterado para pt-BR

### 🎨 Melhorias de UI/UX

- Texto da estação centralizado e aumentado no topo do gráfico
- Remoção do título duplicado do gráfico
- Exibição de ambas as unidades para Sólidos em Suspensão
- Mensagens de estado mais claras (loading, erro, vazio)
- Feedback visual melhorado nos componentes de filtro

### 🏗️ Arquitetura

- Estrutura de pastas organizada:
  - `src/components/`: Componentes React organizados por tipo
  - `src/contexts/`: Context API para estado global
  - `src/hooks/`: Hooks customizados
  - `src/services/`: Serviços de API e cache
  - `src/types/`: Definições de tipos TypeScript
  - `src/utils/`: Funções utilitárias
  - `src/constants/`: Constantes e configurações
  - `src/config/`: Configurações de ambiente

### 📦 Dependências Principais

- React 19.1.1
- TypeScript 5.9.3
- Vite 4.5.14
- Chart.js 4.5.1
- react-chartjs-2 5.3.0
- Axios 1.12.2
- Tailwind CSS 3.4.18
- Lucide React 0.546.0

---

## Formato do Changelog

- **Adicionado**: Novas funcionalidades
- **Modificado**: Mudanças em funcionalidades existentes
- **Depreciado**: Funcionalidades que serão removidas
- **Removido**: Funcionalidades removidas
- **Corrigido**: Correções de bugs
- **Segurança**: Vulnerabilidades corrigidas

[1.0.0]: https://github.com/devtucuju/omara-charts/releases/tag/v1.0.0
