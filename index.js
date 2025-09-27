import puppeteer from "puppeteer";
import XLSX from "xlsx";

async function buscarVagas() {
  const navegador = await puppeteer.launch({ headless: false })
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: 1280, height: 800 });
  const urlBase = "https://www.linkedin.com/jobs/search/?keywords=";
  const filtros = "&location=Brasil&lang=pt"; 


  const palavrasChave = [
    "NodeJS",
    "JavaScript Full Stack",
    "Suporte",
    "Sustentação",
    "Mulesoft Java",
    "Java Pleno",
    "Java Senior",
    "JavaScript Senior",
    "ReactJS",
    "React Native",
    "Angular",
    "VueJS",
    "Spring Boot",
  ];

  let resultados = [];

  for (let palavra of palavrasChave) {
    console.log(`🔍 Buscando vagas para: ${palavra}`);

    const url = `${urlBase}${encodeURIComponent(palavra)}${filtros}`;
    await pagina.goto(url, { waitUntil: "networkidle2" });

    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
      await pagina.waitForSelector(".job-search-card", { timeout: 10000 });
    } catch (error) {
      console.log(`⚠️  Elementos de vaga não encontrados para ${palavra}`);
    }
    const vagas = await pagina.$$eval(".job-search-card", (itens) =>
      itens.map((vaga) => {
        const titulo = vaga.querySelector("h3.base-search-card__title")?.innerText?.trim() || 
                      vaga.querySelector("a[data-tracking-control-name='public_jobs_jserp-result_search-card']")?.innerText?.trim() || "";
        const empresa = vaga.querySelector("h4.base-search-card__subtitle")?.innerText?.trim() || 
                       vaga.querySelector("a[data-tracking-control-name='public_jobs_jserp-result_job-search-card-subtitle']")?.innerText?.trim() || "";
        const local = vaga.querySelector("span.job-search-card__location")?.innerText?.trim() || "";
        const link = vaga.querySelector("h3.base-search-card__title a")?.href || 
                    vaga.querySelector("a[data-tracking-control-name='public_jobs_jserp-result_search-card']")?.href || "";

        return { titulo, empresa, local, link };
      })
    ).catch(() => []);

    resultados.push(
      ...vagas.map((v) => ({
        palavra,
        ...v,
      }))
    );

    console.log(`✅ ${vagas.length} vagas encontradas para ${palavra}`);
  }

  await navegador.close();

  // Cria planilha Excel
  const planilha = XLSX.utils.json_to_sheet(resultados);
  const livro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(livro, planilha, "Vagas");
  XLSX.writeFile(livro, "vagas_linkedin.xlsx");

  console.log("📂 Vagas salvas em vagas_linkedin.xlsx");
}

buscarVagas();
