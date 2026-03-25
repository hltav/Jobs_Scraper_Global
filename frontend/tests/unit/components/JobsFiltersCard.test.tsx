import { JobsFiltersCard } from "@/components/JobsFiltersCard";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("JobsFiltersCard", () => {
  it("dispara callbacks de filtro e refresh", () => {
    const setSearch = vi.fn();
    const setKeywordFilter = vi.fn();
    const setSelectedFile = vi.fn();
    const onRefresh = vi.fn();

    render(
      <JobsFiltersCard
        search=""
        setSearch={setSearch}
        keywordFilter="all"
        setKeywordFilter={setKeywordFilter}
        keywords={["React"]}
        selectedFile="vagas.xlsx"
        setSelectedFile={setSelectedFile}
        files={[{ file: "vagas.xlsx" }]}
        meta={{ file: "vagas.xlsx", modifiedAt: Date.now(), total: 1 }}
        actions={
          <button type="button" onClick={onRefresh}>
            Atualizar
          </button>
        }
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: "node" } });
    fireEvent.click(screen.getByRole("button", { name: /atualizar/i }));

    expect(setSearch).toHaveBeenCalled();
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("renderiza badge de arquivo e total de vagas", () => {
    render(
      <JobsFiltersCard
        search=""
        setSearch={vi.fn()}
        keywordFilter="all"
        setKeywordFilter={vi.fn()}
        keywords={["React"]}
        selectedFile="vagas.xlsx"
        setSelectedFile={vi.fn()}
        files={[{ file: "vagas.xlsx" }]}
        meta={{ file: "vagas.xlsx", modifiedAt: Date.now(), total: 1 }}
      />,
    );

    expect(screen.getAllByText("vagas.xlsx").length).toBeGreaterThan(0);
    expect(screen.getByText("1 vagas")).toBeInTheDocument();
  });

  it("dispara mudancas nos filtros de keyword e arquivo", () => {
    const setKeywordFilter = vi.fn();
    const setSelectedFile = vi.fn();

    render(
      <JobsFiltersCard
        search=""
        setSearch={vi.fn()}
        keywordFilter="all"
        setKeywordFilter={setKeywordFilter}
        keywords={["React"]}
        selectedFile="vagas.xlsx"
        setSelectedFile={setSelectedFile}
        files={[{ file: "vagas.xlsx" }, { file: "historico.xlsx" }]}
        meta={{ file: "vagas.xlsx", modifiedAt: Date.now(), total: 2 }}
      />,
    );

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "React" } });
    fireEvent.change(selects[1], { target: { value: "historico.xlsx" } });

    expect(setKeywordFilter).toHaveBeenCalled();
    expect(setSelectedFile).toHaveBeenCalled();
  });
});
