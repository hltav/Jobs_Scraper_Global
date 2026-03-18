const DEFAULT_KEYWORDS = [
  "UX Designer",
  "UI Designer",
  "UX UI Designer",
  "Product Designer",
  "UX Researcher",
  "Product Manager",
  "Product Owner",
  "PO Remoto",
  "Product Manager Remoto",
  "Gerente de Produto",
  "Analista de UX",
  "Analista de UI",
  "Analista de UX UI",
  "Analista de Produto",
  "Analista de UX Remoto",
  "Analista de UI Remoto",
  "Analista de UX UI Remoto",
  "Analista de Produto Remoto",
  "Frontend Developer",
  "Desenvolvedor Frontend",
  "Desenvolvedor Front-end",
  "Engenheiro Frontend",
  "Engenheiro Front-end",
  "Frontend Developer Remoto",
  "Desenvolvedor Frontend Remoto",
  "Desenvolvedor Front-end Remoto",
  "Engenheiro Frontend Remoto",
  "Engenheiro Front-end Remoto",
  "Backend Developer",
  "Desenvolvedor Backend",
  "Desenvolvedor Back-end",
  "Engenheiro Backend",
  "Engenheiro Back-end",
  "Backend Developer Remoto",
  "Desenvolvedor Backend Remoto",
  "Node.js Developer Remoto",
  "Desenvolvedor Back-end Remoto",
  "Engenheiro Backend Remoto",
  "Engenheiro Back-end Remoto",
  "nodejs Developer",
  "Desenvolvedor Node.js",
  "Desenvolvedor Node",
  "MuleSoft Developer",
  "Desenvolvedor MuleSoft",
  "MuleSoft Developer Remoto",
  "Desenvolvedor MuleSoft Remoto",
  "Java Developer",
  "Desenvolvedor Java",
  "Engenheiro Java",
  "Java Developer Remoto",
  "Desenvolvedor Java Remoto",
  "Engenheiro Java Remoto"
];

function parseBoolean(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "n", "off"].includes(normalized)) {
    return false;
  }
  return fallback;
}

function parseNumber(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseKeywords(value) {
  if (!value) {
    return DEFAULT_KEYWORDS;
  }

  const keywords = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return keywords.length > 0 ? keywords : DEFAULT_KEYWORDS;
}

export function getConfig() {
  return {
    headless: parseBoolean(process.env.HEADLESS, false),
    waitBetweenSearchesMs: parseNumber(process.env.WAIT_BETWEEN_SEARCHES_MS, 5000),
    pageTimeoutMs: parseNumber(process.env.PAGE_TIMEOUT_MS, 10000),
    viewport: {
      width: parseNumber(process.env.VIEWPORT_WIDTH, 1280),
      height: parseNumber(process.env.VIEWPORT_HEIGHT, 800)
    },
    outputFile: process.env.OUTPUT_FILE || "vagas_linkedin.xlsx",
    pdfFile: process.env.PDF_FILE || "vagas_linkedin.pdf",
    searchLocation: process.env.SEARCH_LOCATION || "Brasil",
    searchGeoId: process.env.SEARCH_GEO_ID || "106057199",
    searchLanguage: process.env.SEARCH_LANGUAGE || "pt",
    remoteOnly: parseBoolean(process.env.REMOTE_ONLY, true),
    jobTypes: process.env.JOB_TYPES || "C,F",
    keywords: parseKeywords(process.env.SEARCH_KEYWORDS)
  };
}
