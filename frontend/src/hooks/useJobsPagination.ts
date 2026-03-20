import { useMemo, useState } from "react";
import type { Job } from "@/types/jobs";

interface UseJobsPaginationParams {
  filteredJobs: Job[];
  initialPageSize?: number;
}

export function useJobsPagination({
  filteredJobs,
  initialPageSize = 25,
}: UseJobsPaginationParams) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  }, [filteredJobs.length, pageSize]);

  const currentPage = Math.min(page, totalPages);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  function setCurrentPage(value: number | ((previous: number) => number)) {
    setPage((previous) => {
      const next = typeof value === "function" ? value(previous) : value;
      return Math.max(1, next);
    });
  }

  function resetPagination() {
    setPage(1);
  }

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    resetPagination,
    totalPages,
    paginatedJobs,
  };
}
