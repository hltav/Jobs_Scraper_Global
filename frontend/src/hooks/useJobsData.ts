import { useCallback, useEffect, useState } from "react";
import { fetchJobFiles, fetchJobsByFile } from "@/services/jobsService";
import type { Job, JobFile, JobsMeta } from "@/types/jobs";

const EMPTY_META: JobsMeta = { file: "", modifiedAt: null, total: 0 };

export function useJobsData() {
  const [files, setFiles] = useState<JobFile[]>([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<JobsMeta>(EMPTY_META);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async (fileName: string) => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchJobsByFile(fileName);
      setJobs(data.jobs);
      setMeta({
        file: data.file,
        modifiedAt: data.modifiedAt,
        total: data.total,
      });
      setSelectedFile(data.file || fileName || "");
    } catch (err: unknown) {
      setJobs([]);
      setMeta(EMPTY_META);
      setError(err instanceof Error ? err.message : "Erro inesperado ao carregar vagas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function initializeFiles() {
      const foundFiles = await fetchJobFiles();
      setFiles(foundFiles);
      if (foundFiles[0]?.file) {
        setSelectedFile(foundFiles[0].file);
      }
    }

    initializeFiles().catch(() => {
      setError("Nao foi possivel listar arquivos .xlsx da pasta output.");
    });
  }, []);

  useEffect(() => {
    if (selectedFile) {
      loadJobs(selectedFile);
    }
  }, [selectedFile, loadJobs]);

  return {
    files,
    selectedFile,
    setSelectedFile,
    jobs,
    meta,
    loading,
    error,
    loadJobs,
  };
}
