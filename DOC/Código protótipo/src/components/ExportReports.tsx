import React, { useMemo, useState } from "react";
import { ChevronLeft, Download, Mail, Calendar } from "lucide-react";
import svgPaths from "../imports/svg-ud1jof4hiy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { ReportFormat, ReportType, Student as StudentType } from "../types";
import { reportsApi } from "../services/api";

interface ExportReportsProps {
  students: StudentType[];
  selectedStudentId: string;
  onStudentChange: (studentId: string) => void;
  onBack: () => void;
  onReportCreated?: () => void;
}

const reportTypeOptions: { value: ReportType; label: string; description: string }[] = [
  {
    value: "progress",
    label: "Progresso geral do aluno",
    description: "Resumo de métricas de leitura, atividades e evolução recente",
  },
  {
    value: "diagnostic",
    label: "Relatório diagnóstico",
    description: "Compilado dos diagnósticos e recomendações do período escolhido",
  },
  {
    value: "full",
    label: "Relatório completo",
    description: "Inclui progresso, diagnósticos e insights gerados pela IA",
  },
];

const formatOptions: { value: ReportFormat; label: string; description: string }[] = [
  {
    value: "pdf",
    label: "PDF",
    description: "Ideal para impressão e compartilhamento com responsáveis",
  },
  {
    value: "csv",
    label: "CSV",
    description: "Planilha com dados brutos para análise detalhada",
  },
];

function StudentAvatar() {
  return (
    <div className="relative w-[39px] h-[39px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 81 81">
        <g>
          <path d={svgPaths.p24b65b80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.pa0f6400} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p35ddc000} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

export default function ExportReports({
  students,
  selectedStudentId,
  onStudentChange,
  onBack,
  onReportCreated,
}: ExportReportsProps) {
  const [reportType, setReportType] = useState<ReportType>("progress");
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  const handleReportCreation = async (mode: "email" | "download") => {
    if (!selectedStudent) {
      setErrorMessage("Selecione um aluno para gerar o relatório.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await reportsApi.create({
        student_id: selectedStudent.id,
        report_type: reportType,
        format,
        period_start: startDate || undefined,
        period_end: endDate || undefined,
      });

      setSuccessMessage(
        mode === "email"
          ? "Relatório gerado e enviado para revisão."
          : "Relatório registrado. Faça o download na lista de relatórios."
      );
      if (onReportCreated) {
        onReportCreated();
      }
    } catch (error) {
      console.error("Erro ao criar relatório:", error);
      setErrorMessage("Não foi possível gerar o relatório. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      <div className="bg-[#f0f0f0] sticky top-0 z-10">
        <div className="relative px-4 py-3 flex items-center">
          <button
            onClick={onBack}
            className="p-3 hover:bg-black/5 rounded-lg transition-colors -ml-3"
          >
            <ChevronLeft className="h-6 w-6 text-black" />
          </button>
          <h1 className="flex-1 text-center text-[19px] font-semibold text-black pr-12">
            Gerar relatório
          </h1>
        </div>
        <div className="h-px bg-black/30" />
      </div>

      <div className="px-4 py-6 space-y-6">
        {errorMessage && (
          <div className="bg-[#ffe2dd] border border-[#f87171] text-[#c00000] rounded-[10px] p-4 text-[13px]">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-[#d9ffc2] border border-[#4ade80] text-[#256029] rounded-[10px] p-4 text-[13px]">
            {successMessage}
          </div>
        )}

        <div>
          <h2 className="text-[20px] font-semibold text-black mb-4">Aluno</h2>
          <Select value={selectedStudentId} onValueChange={onStudentChange}>
            <SelectTrigger className="w-full bg-white rounded-[10px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] h-auto py-4 border-0">
              <div className="flex items-center gap-3">
                <StudentAvatar />
                <SelectValue>
                  <span className="text-[16px] font-semibold text-black">
                    {selectedStudent?.name || "Selecione um aluno"}
                  </span>
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-auto py-2">
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  <div className="flex items-center gap-3">
                    <StudentAvatar />
                    <span className="text-[16px] font-semibold text-black">{student.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-[20px] font-semibold text-black mb-4">Tipo de relatório</h2>
            <div className="space-y-3">
              {reportTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setReportType(option.value)}
                  className={`w-full bg-white rounded-[18px] border h-[70px] px-5 flex items-center gap-3 text-left transition-colors ${
                    reportType === option.value
                      ? "border-[#0672FF] shadow-[0_0_0_2px_rgba(6,114,255,0.2)]"
                      : "border-[#c7c7c7] hover:bg-gray-50"
                  }`}
                >
                  <div className="w-[23px] h-[23px] rounded-full border-2 border-[#0672FF] flex items-center justify-center flex-shrink-0">
                    {reportType === option.value && (
                      <div className="w-[11px] h-[11px] rounded-full bg-[#0672FF]" />
                    )}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-black">{option.label}</p>
                    <p className="text-[12px] text-black/60">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-black mb-4">Período</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#3f3f3f] mb-2">
                  Data de início
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="w-full h-[55px] px-4 pr-12 bg-white border border-[#c7c7c7] rounded-[18px] text-[14px] font-medium text-black focus:outline-none focus:border-[#0672FF]"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-[28px] w-[28px] text-[#979797] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#3f3f3f] mb-2">
                  Data de término
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="w-full h-[55px] px-4 pr-12 bg-white border border-[#c7c7c7] rounded-[18px] text-[14px] font-medium text-black focus:outline-none focus:border-[#0672FF]"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-[28px] w-[28px] text-[#979797] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[20px] font-semibold text-black mb-4">Formato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formatOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFormat(option.value)}
                className={`w-full bg-white rounded-[18px] border h-[65px] px-5 flex items-center gap-3 text-left transition-colors ${
                  format === option.value
                    ? "border-[#0672FF] shadow-[0_0_0_2px_rgba(6,114,255,0.2)]"
                    : "border-[#c7c7c7] hover:bg-gray-50"
                }`}
              >
                <div className="w-[23px] h-[23px] rounded-full border-2 border-[#0672FF] flex items-center justify-center flex-shrink-0">
                  {format === option.value && (
                    <div className="w-[11px] h-[11px] rounded-full bg-[#0672FF]" />
                  )}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-black">{option.label}</p>
                  <p className="text-[12px] text-black/60">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[20px] font-semibold text-black mb-4">Finalizar</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => handleReportCreation("email")}
              disabled={isSubmitting}
              className="flex-1 bg-white border border-[#c2c2c2] rounded-[15px] h-[74px] flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="h-[28px] w-[29px] text-[#1D8FD7]" />
              <span className="text-[15px] font-semibold text-black">
                Registrar e enviar por e-mail
              </span>
            </button>
            <button
              onClick={() => handleReportCreation("download")}
              disabled={isSubmitting}
              className="flex-1 bg-white border border-[#c2c2c2] rounded-[15px] h-[74px] flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-[30px] w-[31px] text-[#1D8FD7]" />
              <span className="text-[15px] font-semibold text-black">
                Somente registrar
              </span>
            </button>
          </div>
          <p className="text-[12px] text-black/50 mt-2">
            Após criar o relatório, você poderá acessá-lo na lista de relatórios para fazer o download ou complementar com arquivo gerado externamente.
          </p>
        </div>
      </div>
    </div>
  );
}
