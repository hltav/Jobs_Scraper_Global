import { JobsHeaderCard } from "@/components/JobsHeaderCard";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({ resolvedTheme: "light", toggleTheme: vi.fn() }),
}));

describe("JobsHeaderCard", () => {
  it("renderiza logo acessivel e descricao", () => {
    render(<JobsHeaderCard />);

    expect(screen.getByAltText("Painel de Vagas")).toBeInTheDocument();
    expect(screen.getByText("Leitura automatica dos arquivos XLSX gerados em output.")).toBeInTheDocument();
  });

  it("renderiza o botao de alternar tema", () => {
    render(<JobsHeaderCard />);

    expect(screen.getByRole("button", { name: "Ativar tema escuro" })).toBeInTheDocument();
  });
});
