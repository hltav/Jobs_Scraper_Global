import { useMemo, useState } from "react";
import type { Job } from "@/types/jobs";

export function useJobsFiltering(jobs: Job[]) {
  const [search, setSearch] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("all");

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

  return {
    search,
    setSearch,
    keywordFilter,
    setKeywordFilter,
    keywords,
    filteredJobs,
  };
}
