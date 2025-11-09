import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Filter,
  FileText,
  Download,
  Trash2,
  RefreshCcw,
  ExternalLink,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Report, ReportFormat, ReportType, Student } from "../types";
import { reportsApi, studentsApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface ReportsAnalyticsProps {
  onBack: () => void;
}

const reportTypeLabels: Record<ReportType, string> = {
  progress: "Progresso",
  diagnostic: "Diagnóstico",
  full: "Completo",
};

const reportFormatLabels: Record<ReportFormat, string> = {
  pdf: "PDF",
  csv: "CSV",
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function ReportsAnalytics({ onBack }: ReportsAnalyticsProps) {
  const { currentUser } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [studentFilter, setStudentFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");

  const loadStudents = async () => {
    try {
      const response = await studentsApi.list(currentUser?.role === "professional" ? currentUser.id : undefined);
      setStudents(response.students);
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
    }
  };

  const loadReports = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const response = await reportsApi.list({
        student_id: studentFilter !== "all" ? studentFilter : undefined,
        report_type: typeFilter !== "all" ? (typeFilter as ReportType) : undefined,
        format: formatFilter !== "all" ? (formatFilter as ReportFormat) : undefined,
      });
      setReports(response.reports);
    } catch (err) {
      console.error("Erro ao carregar relatórios:", err);
      setError("Não foi possível carregar os relatórios.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentFilter, typeFilter, formatFilter]);

  const statistics = useMemo(() => {
    if (reports.length === 0) {
      return {
        total: 0,
        withFile: 0,
        latestDate: "—",
      };
    }
    const withFile = reports.filter((report) => Boolean(report.file_url)).length;
    const latest = reports[0]?.generated_at ?? null;
    return {
      total: reports.length,
      withFile,
      latestDate: formatDateTime(latest),
    };
  }, [reports]);

  const studentMap = useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach((student) => map.set(student.id, student));
    return map;
  }, [students]);

  const handleDelete = async (reportId: string) => {
    const confirmDelete = window.confirm("Deseja remover este relatório?");
    if (!confirmDelete) return;
    try {
      await reportsApi.delete(reportId);
      setReports((prev) => prev.filter((report) => report.id !== reportId));
    } catch (err) {
      console.error("Erro ao remover relatório:", err);
      setError("Não foi possível remover o relatório. Tente novamente.");
    }
  };

  const filteredStudents = useMemo(() => {
    if (students.length === 0) return [];
    return students.sort((a, b) => a.name.localeCompare(b.name));
  }, [students]);

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <header className="bg-gradient-to-br from-[#155dfc] to-[#0056b9] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <div>
                <h1 className="text-white font-semibold text-[17px] leading-tight">
                  Relatórios
                </h1>
                <p className="text-white/80 text-[12px]">
                  Histórico de relatórios exportados e disponibilizados aos responsáveis
                </p>
              </div>
            </div>
            <button
              onClick={() => loadReports(false)}
              disabled={isRefreshing}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-[#ffe2dd] border border-[#f87171] text-[#c00000] rounded-[10px] p-4 text-[13px]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-black/12">
            <p className="text-[11px] uppercase font-semibold text-black/50 mb-1">
              Total de relatórios
            </p>
            <p className="text-[26px] font-bold text-[#030213]">{statistics.total}</p>
            <p className="text-[12px] text-black/50">Incluindo registros sem arquivo anexado</p>
          </Card>
          <Card className="p-4 border-black/12">
            <p className="text-[11px] uppercase font-semibold text-black/50 mb-1">
              Com arquivos disponíveis
            </p>
            <p className="text-[26px] font-bold text-[#030213]">{statistics.withFile}</p>
            <p className="text-[12px] text-black/50">Relatórios com link para download</p>
          </Card>
          <Card className="p-4 border-black/12">
            <p className="text-[11px] uppercase font-semibold text-black/50 mb-1">
              Último relatório gerado
            </p>
            <p className="text-[16px] font-semibold text-[#030213]">{statistics.latestDate}</p>
            <p className="text-[12px] text-black/50">Data e hora de criação</p>
          </Card>
        </div>

        <Card className="p-4 border-black/12">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
              <Select value={studentFilter} onValueChange={setStudentFilter}>
                <SelectTrigger className="w-full h-[44px] rounded-lg border border-black/20 pl-9">
                  <SelectValue placeholder="Filtrar por aluno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os alunos</SelectItem>
                  {filteredStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[220px] h-[44px] rounded-lg border border-black/20">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="progress">Progresso</SelectItem>
                <SelectItem value="diagnostic">Diagnóstico</SelectItem>
                <SelectItem value="full">Completo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger className="w-full lg:w-[220px] h-[44px] rounded-lg border border-black/20">
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os formatos</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {isLoading ? (
          <div className="bg-white border border-black/12 rounded-[15px] p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0056b9]" />
          </div>
        ) : reports.length === 0 ? (
          <Card className="p-12 border-black/12 text-center">
            <FileText className="h-12 w-12 text-black/20 mx-auto mb-4" />
            <p className="text-[16px] font-medium text-black/60 mb-2">
              Nenhum relatório encontrado
            </p>
            <p className="text-[13px] text-black/40">
              Gere um novo relatório na opção "Exportar" na página do aluno.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => {
              const student = studentMap.get(report.student_id);
              return (
                <Card key={report.id} className="p-5 border-black/12 bg-white">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#030213]">
                          {student?.name ?? "Aluno removido"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-blue-100 text-blue-700">
                            {reportTypeLabels[report.report_type]}
                          </Badge>
                          <Badge className="bg-slate-100 text-slate-600">
                            {reportFormatLabels[report.format]}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {report.file_url && (
                          <a
                            href={report.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-black/10 hover:bg-black/5 transition-colors cursor-pointer"
                            aria-label="Abrir relatório"
                          >
                            <ExternalLink className="h-4 w-4 text-[#0056b9]" />
                          </a>
                        )}
                        {report.file_url && (
                          <a
                            href={report.file_url}
                            download
                            className="p-2 rounded-lg border border-black/10 hover:bg-black/5 transition-colors cursor-pointer"
                            aria-label="Baixar relatório"
                          >
                            <Download className="h-4 w-4 text-[#0056b9]" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 rounded-lg border border-black/10 hover:bg-[#ffe2dd] transition-colors cursor-pointer"
                          aria-label="Excluir relatório"
                        >
                          <Trash2 className="h-4 w-4 text-[#d80000]" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Período</p>
                        <p className="text-[13px] text-black">
                          {formatDate(report.period_start)} — {formatDate(report.period_end)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Gerado em</p>
                        <p className="text-[13px] text-black">{formatDateTime(report.generated_at)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Atualizado em</p>
                        <p className="text-[13px] text-black">
                          {report.updated_at ? formatDateTime(report.updated_at) : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Arquivo</p>
                        <p className="text-[13px] text-black/70 truncate">
                          {report.file_path ?? "Sem arquivo vinculado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsAnalytics;
