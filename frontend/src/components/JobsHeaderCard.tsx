import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobsMeta } from "@/types/jobs";
import { BriefcaseBusiness, FileSpreadsheet } from "lucide-react";
import type { ReactNode } from "react";
import Logo from "../assets/logo-painel-vagas.svg";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/useTheme";

interface JobsHeaderCardProps {
  meta: JobsMeta;
  actions?: ReactNode;
}

export function JobsHeaderCard({ meta, actions }: JobsHeaderCardProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <>
      <div className="w-screen bg-[#004726] dark:bg-[#003318] p-6 -mx-8 flex items-end">
        <CardTitle className="text-3xl text-white">
          <img src={Logo} />
        </CardTitle>
        <CardDescription className="text-white">
          Leitura automatica dos arquivos XLSX gerados em output.
        </CardDescription>
        <div className="ml-auto self-start mr-8">
          <ThemeToggle theme={resolvedTheme} onToggle={toggleTheme} />
        </div>
      </div>
      <Card className="border-border/70 bg-card/85 backdrop-blur dark:bg-card/95">
        <CardHeader className="gap-4 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {actions}
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
      </Card>
    </>
  );
}
