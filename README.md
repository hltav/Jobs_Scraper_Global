# 🚀 LinkedIn Jobs Scraper Brasil

Um bot automatizado para buscar e extrair vagas de emprego do LinkedIn focado no mercado brasileiro de tecnologia.

## 📋 Descrição

Este projeto utiliza web scraping para automatizar a busca de vagas de emprego no LinkedIn, extraindo informações relevantes e exportando os dados para uma planilha Excel. Focado em vagas de tecnologia no Brasil, incluindo modalidades remotas, presenciais e híbridas.

## ✨ Funcionalidades

- 🔍 **Busca automatizada** de vagas no LinkedIn
- 🇧🇷 **Filtro exclusivo** para vagas no Brasil
- 📊 **Exportação para Excel** com formatação organizada
- 🏷️ **Múltiplas palavras-chave** de tecnologia
- 🖥️ **Interface visual** opcional (navegador visível)
- ⏱️ **Controle de tempo** para evitar bloqueios

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Puppeteer** - Automação do navegador
- **XLSX** - Manipulação de planilhas Excel
- **ES Modules** - Sintaxe moderna do JavaScript

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos de instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd vagas-full
```

2. **Instale as dependências:**
```bash
npm install
```

## 🚀 Como Usar

### Execução básica

```bash
node index.js
```

### Personalização

Você pode modificar as palavras-chave no arquivo `index.js`:

```javascript
const palavrasChave = [
  "NodeJS",
  "JavaScript Full Stack",
  "Java Pleno",
  "ReactJS",
  // Adicione suas próprias palavras-chave aqui
];
```

### Modo headless

Para executar sem abrir o navegador visualmente, altere no código:

```javascript
const navegador = await puppeteer.launch({ headless: true });
```

## 📊 Dados Extraídos

O script coleta as seguintes informações de cada vaga:

| Campo | Descrição |
|-------|-----------|
| **palavra** | Palavra-chave utilizada na busca |
| **titulo** | Título da vaga |
| **empresa** | Nome da empresa |
| **local** | Localização da vaga |
| **link** | URL da vaga no LinkedIn |

## 📁 Estrutura do Projeto

```
vagas-full/
├── index.js           # Script principal
├── package.json       # Configurações do projeto
├── README.md          # Documentação
└── vagas_linkedin.xlsx # Arquivo Excel gerado (após execução)
```

## ⚙️ Configurações

### Palavras-chave padrão

O projeto vem configurado com as seguintes tecnologias:

- NodeJS
- JavaScript Full Stack
- Suporte
- Sustentação
- Mulesoft Java
- Java Pleno
- Java Senior
- JavaScript Senior
- ReactJS
- React Native
- Angular
- VueJS
- Spring Boot

### Filtros aplicados

- 🌍 **Localização:** Brasil
- 🌐 **Idioma:** Português
- 💼 **Modalidade:** Todas (remoto, presencial, híbrido)

## 🔧 Personalização Avançada

### Modificar tempo de espera

```javascript
await new Promise(resolve => setTimeout(resolve, 5000)); // 5 segundos
```

### Alterar viewport do navegador

```javascript
await pagina.setViewport({ width: 1920, height: 1080 });
```

### Adicionar novos filtros

Você pode adicionar filtros adicionais na URL:

```javascript
const filtros = "&location=Brasil&lang=pt&f_E=2"; // f_E=2 para nível júnior
```

## 📈 Exemplo de Saída

```
🔍 Buscando vagas para: NodeJS
✅ 45 vagas encontradas para NodeJS
🔍 Buscando vagas para: ReactJS
✅ 38 vagas encontradas para ReactJS
📂 Vagas salvas em vagas_linkedin.xlsx
```

## ⚠️ Avisos Importantes

- **Uso Responsável:** Respeite os termos de uso do LinkedIn
- **Rate Limiting:** O script inclui delays para evitar bloqueios
- **Dados Públicos:** Apenas extrai informações públicas
- **Fins Educacionais:** Use com responsabilidade e ética

## 🐛 Resolução de Problemas

### Erro "pagina.waitForTimeout is not a function"
- ✅ **Resolvido:** O projeto usa `setTimeout` nativo para compatibilidade

### Nenhuma vaga encontrada
- Verifique sua conexão com a internet
- Confirme se o LinkedIn não está bloqueando o acesso
- Tente executar com `headless: false` para debugar

### Seletores CSS não funcionam
- O LinkedIn pode ter mudado a estrutura da página
- Os seletores foram atualizados para a versão 2024/2025

## 📄 Licença

Este projeto está sob a licença ISC.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Commitar suas mudanças
4. Fazer push para a branch
5. Abrir um Pull Request

## 📞 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
