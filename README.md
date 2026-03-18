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
- `src/browser.js`: inicializacao do navegador para o Puppeteer
- `src/linkedinScraper.js`: montagem da URL e extracao das vagas
- `src/exporter.js`: geracao de Excel e PDF
- `src/logger.js`: logs padronizados

## Requisitos

- Node.js 22+
- Google Chrome ou Microsoft Edge instalado
- npm

## Instalacao

1. Clone o projeto
2. Rode `npm install`

## Execucao

- Producao: `npm start`
- Desenvolvimento: `npm run dev`
- Hot reload: `npm run run`

## Variaveis de ambiente

Todas sao opcionais.

- `HEADLESS` (padrao: `false`)
- `WAIT_BETWEEN_SEARCHES_MS` (padrao: `5000`)
- `PAGE_TIMEOUT_MS` (padrao: `10000`)
- `VIEWPORT_WIDTH` (padrao: `1280`)
- `VIEWPORT_HEIGHT` (padrao: `800`)
- `OUTPUT_FILE` (padrao: `vagas_linkedin.xlsx`)
- `PDF_FILE` (padrao: `vagas_linkedin.pdf`)
- `SEARCH_LOCATION` (padrao: `Brasil`)
- `SEARCH_GEO_ID` (padrao: `106057199`)
- `SEARCH_LANGUAGE` (padrao: `pt`)
- `JOB_TYPES` (padrao: `C,F`)  
	Valores comuns: `C` (PJ), `F` (CLT), `C,F` (ambos)
- `SEARCH_KEYWORDS` (lista separada por virgula)
- `CHROME_PATH` (caminho do executavel do navegador)

Exemplo no Windows cmd (Brasil remoto, PJ+CLT):

```bat
set SEARCH_GEO_ID=106057199&& set JOB_TYPES=C,F&& set HEADLESS=true&& npm start
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

Chrome/Edge nao encontrado:

- Instale Google Chrome ou Microsoft Edge
- Ou informe `CHROME_PATH` manualmente

Exemplo no Windows cmd:

```bat
set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe&& npm start
```

## Avisos

- Respeite os termos de uso do LinkedIn
- Use o scraper de forma etica e responsavel
- O HTML do LinkedIn pode mudar e exigir ajuste de seletores
