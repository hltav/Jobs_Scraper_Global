# Vagas LinkedIn Brasil (Remoto)

Bot de automacao para buscar vagas no LinkedIn com foco em Brasil remoto e exportar os resultados em Excel e PDF.

## Comportamento atual

- Escopo geografico: Brasil (geoId padrao `106057199`)
- Modalidade: remoto apenas (`f_WT=2`)
- Tipos de contrato padrao: PJ e CLT (`f_JT=C,F`)
- Exportacao em dois formatos: `.xlsx` e `.pdf`
- Deduplicacao por link (ou por titulo + empresa + local quando o link nao existe)

## Estrutura do projeto

- `index.js`: entrypoint e tratamento de falhas
- `src/app.js`: fluxo principal (coleta e exportacao)
- `src/config.js`: leitura das variaveis de ambiente
- `src/linkedinScraper.js`: coleta HTTP, paginacao e extracao das vagas
- `src/exporter.js`: geracao de Excel e PDF
- `src/logger.js`: logs padronizados

## Requisitos

- Node.js 22+
- npm

## Instalacao

1. Clone o projeto
2. Rode `npm install`

## Execucao

- Producao: `npm start`
- Desenvolvimento: `npm run dev`
- Hot reload: `npm run run`

## Fluxo de branches (obrigatorio)

Este repositorio usa o seguinte fluxo:

- `master`: codigo estavel (base principal)
- `develop`: branch de integracao
- `feature/*`: branch temporaria de trabalho

Regra principal para evitar confusao:

- A `feature` sempre nasce da `master`
- Ao finalizar, a `feature` deve abrir PR para `develop`
- `master` nao deve receber trabalho direto de feature no dia a dia

### Passo a passo

1. Atualize sua `master` local com o remoto
2. Crie sua `feature` a partir da `master`
3. Trabalhe localmente e faca commits na `feature`
4. Publique a `feature` no remoto
5. Abra Pull Request com destino em `develop`

Exemplo:

```bash
git checkout master
git pull origin master

git checkout -b feature/nome-da-feature

# faz alteracoes...
git add .
git commit -m "feat: descreve a feature"

git push -u origin feature/nome-da-feature
```

No GitHub, abra o PR assim:

- `base`: `develop`
- `compare`: `feature/nome-da-feature`

### Importante

- Nao use `develop` como base para criar `feature` neste projeto
- Nao aponte PR de `feature` direto para `master`
- `master` deve ser atualizada a partir de `develop` apenas no momento de release

## Variaveis de ambiente

Todas sao opcionais.

- `WAIT_BETWEEN_SEARCHES_MS` (padrao: `5000`)
- `PAGE_TIMEOUT_MS` (padrao: `10000`)
- `MAX_PAGES_PER_KEYWORD` (padrao: `5`)
- `OUTPUT_FILE` (padrao: `vagas_linkedin.xlsx`)
- `PDF_FILE` (padrao: `vagas_linkedin.pdf`)
- `SEARCH_LOCATION` (padrao: `Brasil`)
- `SEARCH_GEO_ID` (padrao: `106057199`)
- `SEARCH_LANGUAGE` (padrao: `pt`)
- `JOB_TYPES` (padrao: `C,F`)  
  Valores comuns: `C` (PJ), `F` (CLT), `C,F` (ambos)
- `TIME_FILTER` (padrao: `r604800`)  
  Valores comuns: `r86400` (24h), `r604800` (7 dias), `r2592000` (30 dias)
- `SEARCH_KEYWORDS` (lista separada por virgula)

Exemplo no Windows cmd (Brasil remoto, PJ+CLT):

```bat
set SEARCH_GEO_ID=106057199&& set JOB_TYPES=C,F&& set MAX_PAGES_PER_KEYWORD=5&& npm start
```

Exemplo com palavras-chave personalizadas:

```bat
set SEARCH_KEYWORDS=UX Designer,UI Designer,Product Manager,Product Owner&& npm start
```

## Saida

Arquivos gerados por padrao:

- `vagas_linkedin.xlsx`
- `vagas_linkedin.pdf`

Colunas exportadas:

- `palavra`
- `titulo`
- `empresa`
- `local`
- `link`

No PDF, os links sao normalizados para uma versao curta do LinkedIn quando possivel, reduzindo risco de truncamento.

## Troubleshooting

Poucas ou nenhuma vaga retornada:

- Aumente `MAX_PAGES_PER_KEYWORD`
- Aumente `WAIT_BETWEEN_SEARCHES_MS` para reduzir bloqueios temporarios
- Reduza a quantidade de keywords por execucao

## Avisos

- Respeite os termos de uso do LinkedIn
- Use o scraper de forma etica e responsavel
- O HTML do LinkedIn pode mudar e exigir ajuste de seletores
