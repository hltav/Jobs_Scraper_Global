import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, FileSpreadsheet, RefreshCcw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatDate(timestamp) {
  if (!timestamp) {
    return "-";
  }
  return new Date(timestamp).toLocaleString("pt-BR");
}

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [search, setSearch] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ file: "", modifiedAt: null, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const keywords = useMemo(() => {
    const values = Array.from(new Set(jobs.map((job) => String(job.palavra || "").trim()).filter(Boolean)));
    return values.sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const byKeyword = keywordFilter === "all" || String(job.palavra || "") === keywordFilter;
      if (!byKeyword) {
        return false;
      }

      if (!term) {
        return true;
      }

      const text = [job.titulo, job.empresa, job.local, job.link, job.palavra]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");

      return text.includes(term);
    });
  }, [jobs, search, keywordFilter]);

  async function loadFiles() {
    const response = await fetch("/api/jobs/files");
    const payload = await response.json();
    const foundFiles = Array.isArray(payload.files) ? payload.files : [];
    setFiles(foundFiles);
    if (!selectedFile && foundFiles[0]?.file) {
      setSelectedFile(foundFiles[0].file);
    }
  }

  async function loadJobs(fileName) {
    setLoading(true);
    setError("");
    try {
      const suffix = fileName ? `?file=${encodeURIComponent(fileName)}` : "";
      const response = await fetch(`/api/jobs${suffix}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Falha ao carregar vagas.");
      }

      setJobs(Array.isArray(payload.jobs) ? payload.jobs : []);
      setMeta({
        file: payload.file || "",
        modifiedAt: payload.modifiedAt || null,
        total: Number(payload.total || 0),
      });
      setSelectedFile(payload.file || fileName || "");
    } catch (err) {
      setJobs([]);
      setMeta({ file: "", modifiedAt: null, total: 0 });
      setError(err.message || "Erro inesperado ao carregar vagas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiles().catch(() => {
      setError("Nao foi possivel listar arquivos .xlsx da pasta output.");
    });
  }, []);

  useEffect(() => {
    if (selectedFile) {
      loadJobs(selectedFile);
    }
  }, [selectedFile]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 md:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(236,195,117,0.35),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(92,151,191,0.28),transparent_35%),radial-gradient(circle_at_50%_95%,rgba(201,120,99,0.22),transparent_40%)]" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="border-white/30 bg-card/85 backdrop-blur">
          <CardHeader className="gap-4 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-3xl">Painel de Vagas</CardTitle>
              <CardDescription>
                Leitura automatica dos arquivos XLSX gerados em output.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-xs">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                {meta.file || "Sem arquivo"}
              </Badge>
              <Badge className="gap-1 text-xs">
                <BriefcaseBusiness className="h-3.5 w-3.5" />
                {meta.total} vagas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder="Buscar por titulo, empresa, local ou link"
              />
            </div>

            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={keywordFilter}
              onChange={(event) => setKeywordFilter(event.target.value)}
            >
              <option value="all">Todas as palavras-chave</option>
              {keywords.map((keyword) => (
                <option key={keyword} value={keyword}>
                  {keyword}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={selectedFile}
                onChange={(event) => setSelectedFile(event.target.value)}
              >
                {files.map((file) => (
                  <option key={file.file} value={file.file}>
                    {file.file}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={() => loadJobs(selectedFile)} disabled={loading}>
                <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/30 bg-card/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Vagas Encontradas</CardTitle>
            <CardDescription>
              Atualizado em {formatDate(meta.modifiedAt)}. Mostrando {filteredJobs.length} de {jobs.length} vagas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-md border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-900">{error}</div>
            ) : null}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Palavra-chave</TableHead>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job, index) => (
                  <TableRow key={`${job.link || index}-${index}`}>
                    <TableCell>{job.palavra || "-"}</TableCell>
                    <TableCell className="font-medium">{job.titulo || "-"}</TableCell>
                    <TableCell>{job.empresa || "-"}</TableCell>
                    <TableCell>{job.local || "-"}</TableCell>
                    <TableCell>
                      {job.link ? (
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          Abrir vaga
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      Nenhuma vaga encontrada com os filtros atuais.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default App;
