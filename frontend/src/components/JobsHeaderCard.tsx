import {
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Logo from "../assets/logo-painel-vagas.svg";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/useTheme";

export function JobsHeaderCard() {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <>
      <div className="w-screen bg-[#004726] dark:bg-[#003318] p-6 -mx-8 flex items-end">
        <CardTitle className="text-3xl text-white">
          <img src={Logo} alt="Painel de Vagas" />
        </CardTitle>
        <CardDescription className="text-white">
          Leitura automatica dos arquivos XLSX gerados em output.
        </CardDescription>
        <div className="ml-auto self-start mr-8">
          <ThemeToggle theme={resolvedTheme} onToggle={toggleTheme} />
        </div>
      </div>
     
    </>
  );
}
