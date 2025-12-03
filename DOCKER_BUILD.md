# Guia de Build Docker

## Remover e Recriar Imagem Docker em Produção

### 1. Parar o container (se estiver rodando)

```bash
docker compose down charts
```

### 2. Remover a imagem antiga

```bash
# Remover apenas a imagem do serviço charts
docker rmi <nome-da-imagem-charts>

# OU remover todas as imagens não utilizadas
docker image prune -a

# OU remover imagem específica por ID
docker rmi $(docker images | grep charts | awk '{print $3}')
```

### 3. Limpar cache do build (opcional, mas recomendado)

```bash
docker builder prune
```

### 4. Reconstruir a imagem

```bash
# Reconstruir sem cache (força rebuild completo)
docker compose build --no-cache charts

# OU reconstruir normalmente
docker compose build charts
```

### 5. Subir o container

```bash
docker compose up -d charts
```

## Comandos Úteis

### Ver logs do build

```bash
docker compose build charts 2>&1 | tee build.log
```

### Verificar se a imagem foi criada

```bash
docker images | grep charts
```

### Verificar tamanho da imagem

```bash
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep charts
```

### Debug: Entrar no container

```bash
docker compose run --rm charts sh
```

## Variáveis de Ambiente

### Em Produção (Docker)

O `base` será `/charts/` por padrão (definido no `vite.config.ts`).

### Em Desenvolvimento Local

Para usar `/` em desenvolvimento local, crie um arquivo `.env.local`:

```bash
VITE_BASE_URL=/
```

Ou execute:

```bash
VITE_BASE_URL=/ npm run dev
```

## Troubleshooting

### Erro: "Maximum update depth exceeded"

- Limpar cache: `rm -rf node_modules/.tmp`
- Reinstalar dependências: `rm -rf node_modules && npm install`

### Erro: "TS1117: An object literal cannot have multiple properties"

- Verificar se há propriedades duplicadas nos arquivos TypeScript
- Limpar cache do TypeScript: `rm -rf node_modules/.tmp/tsconfig.*.tsbuildinfo`

### Build lento

- Usar cache do Docker: `docker compose build charts` (sem `--no-cache`)
- Verificar se `.dockerignore` está configurado corretamente
