import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Plus,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Student, Diagnostic, DiagnosticType } from "../types";
import { diagnosticsApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface DiagnosticsListProps {
  onBack: () => void;
  students: Student[];
}

const diagnosticTypeOptions: { value: DiagnosticType; label: string }[] = [
  { value: "initial", label: "Diagnóstico inicial" },
  { value: "ongoing", label: "Acompanhamento" },
  { value: "final", label: "Diagnóstico final" },
];

const typeLabel = (type: DiagnosticType) => {
  const option = diagnosticTypeOptions.find((item) => item.value === type);
  return option ? option.label : type;
};

const parseScore = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return null;
  }
  return Math.max(0, Math.min(100, value));
};

export default function DiagnosticsList({ onBack, students }: DiagnosticsListProps) {
  const { currentUser } = useAuth();
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStudentId, setFilterStudentId] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDiagnostic, setEditingDiagnostic] = useState<Diagnostic | null>(null);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<Diagnostic | null>(null);
  const [formData, setFormData] = useState({
    student_id: "",
    diagnostic_type: "initial" as DiagnosticType,
    overall_score: "",
    reading_level: "",
    recommendations: "",
  });

  const studentMap = useMemo(() => {
    const map = new Map<string, Student>();
    students.forEach((student) => {
      map.set(student.id, student);
    });
    return map;
  }, [students]);

  const loadDiagnostics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await diagnosticsApi.list({
        student_id: filterStudentId !== "all" ? filterStudentId : undefined,
        diagnostic_type: filterType !== "all" ? (filterType as DiagnosticType) : undefined,
      });
      setDiagnostics(response.diagnostics);
    } catch (err) {
      console.error("Erro ao carregar diagnósticos:", err);
      setError("Não foi possível carregar os diagnósticos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiagnostics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStudentId, filterType]);

  const handleOpenCreateForm = () => {
    setEditingDiagnostic(null);
    setFormData({
      student_id: filterStudentId !== "all" ? filterStudentId : "",
      diagnostic_type: "initial",
      overall_score: "",
      reading_level: "",
      recommendations: "",
    });
    setShowForm(true);
  };

  const handleEdit = (diagnostic: Diagnostic) => {
    setEditingDiagnostic(diagnostic);
    setFormData({
      student_id: diagnostic.student_id,
      diagnostic_type: diagnostic.diagnostic_type,
      overall_score:
        diagnostic.overall_score !== undefined && diagnostic.overall_score !== null
          ? diagnostic.overall_score.toString()
          : "",
      reading_level: diagnostic.reading_level ?? "",
      recommendations: diagnostic.recommendations ?? "",
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setIsSubmitting(false);
    setEditingDiagnostic(null);
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser?.id) {
      setError("Não foi possível identificar o profissional logado.");
      return;
    }
    if (!formData.student_id) {
      setError("Selecione um aluno para registrar o diagnóstico.");
      return;
    }

    const scoreNumber =
      formData.overall_score.trim() === "" ? undefined : Number(formData.overall_score);

    const payload = {
      student_id: formData.student_id,
      conducted_by: currentUser.id,
      diagnostic_type: formData.diagnostic_type,
      overall_score: Number.isFinite(scoreNumber) ? scoreNumber : undefined,
      reading_level: formData.reading_level.trim() || undefined,
      recommendations: formData.recommendations.trim() || undefined,
    };

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingDiagnostic) {
        const updated = await diagnosticsApi.update(editingDiagnostic.id, payload);
        setDiagnostics((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await diagnosticsApi.create(payload);
        setDiagnostics((prev) => [created, ...prev]);
      }
      handleCloseForm();
    } catch (err) {
      console.error("Erro ao salvar diagnóstico:", err);
      setError("Não foi possível salvar o diagnóstico. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (diagnostic: Diagnostic) => {
    const confirmed = window.confirm("Deseja realmente remover este diagnóstico?");
    if (!confirmed) {
      return;
    }
    try {
      await diagnosticsApi.delete(diagnostic.id);
      setDiagnostics((prev) => prev.filter((item) => item.id !== diagnostic.id));
      if (selectedDiagnostic?.id === diagnostic.id) {
        setSelectedDiagnostic(null);
      }
    } catch (err) {
      console.error("Erro ao remover diagnóstico:", err);
      setError("Não foi possível remover o diagnóstico.");
    }
  };

  const filteredDiagnostics = useMemo(() => {
    return diagnostics.filter((diagnostic) => {
      const student = studentMap.get(diagnostic.student_id);
      const name = student?.name ?? "Aluno não encontrado";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [diagnostics, searchTerm, studentMap]);

  const stats = useMemo(() => {
    if (diagnostics.length === 0) {
      return { total: 0, average: 0, recentCount: 0, studentsCount: 0 };
    }
    const scores = diagnostics
      .map((item) => parseScore(item.overall_score))
      .filter((score): score is number => score !== null);
    const average = scores.length
      ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
      : 0;
    const now = Date.now();
    const thirtyDays = 1000 * 60 * 60 * 24 * 30;
    const recentCount = diagnostics.filter((item) => {
      const created = new Date(item.created_at).getTime();
      return now - created <= thirtyDays;
    }).length;
    const uniqueStudents = new Set(diagnostics.map((item) => item.student_id));
    return {
      total: diagnostics.length,
      average,
      recentCount,
      studentsCount: uniqueStudents.size,
    };
  }, [diagnostics]);

  const scoreTrend = (diagnostic: Diagnostic) => {
    if (!diagnostic.overall_score || diagnostic.overall_score === null) {
      return "stable" as const;
    }
    if (diagnostic.overall_score >= 80) {
      return "up" as const;
    }
    if (diagnostic.overall_score <= 40) {
      return "down" as const;
    }
    return "stable" as const;
  };

  const renderTrendIcon = (diagnostic: Diagnostic) => {
    const trend = scoreTrend(diagnostic);
    if (trend === "up") {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    if (trend === "down") {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const renderTrendLabel = (diagnostic: Diagnostic) => {
    const trend = scoreTrend(diagnostic);
    if (trend === "up") {
      return { text: "Melhora", color: "text-green-600" };
    }
    if (trend === "down") {
      return { text: "Queda", color: "text-red-600" };
    }
    return { text: "Estável", color: "text-gray-600" };
  };

  const renderScore = (value?: number | null) => {
    const parsed = parseScore(value);
    if (parsed === null) {
      return "—";
    }
    return `${parsed}%`;
  };

  const formStudentOptions = useMemo(() => {
    if (students.length === 0) {
      return [] as Student[];
    }
    if (filterStudentId !== "all") {
      const student = studentMap.get(filterStudentId);
      return student ? [student] : students;
    }
    return students;
  }, [students, filterStudentId, studentMap]);

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
                  Diagnósticos
                </h1>
                <p className="text-white/80 text-[12px]">
                  Gerencie avaliações pedagógicas e acompanhe a evolução dos alunos
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenCreateForm}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span className="text-[13px] font-medium">
                {editingDiagnostic ? "Editar diagnóstico" : "Novo diagnóstico"}
              </span>
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

        {showForm && (
          <Card className="p-6 border-black/12">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#2f2f2f]">
                    Aluno
                  </label>
                  <select
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleFormChange}
                    className="h-11 rounded-[10px] border border-black/20 px-3 text-[14px] outline-none focus:border-[#0056b9]"
                  >
                    <option value="">Selecione o aluno</option>
                    {formStudentOptions.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#2f2f2f]">
                    Tipo
                  </label>
                  <select
                    name="diagnostic_type"
                    value={formData.diagnostic_type}
                    onChange={handleFormChange}
                    className="h-11 rounded-[10px] border border-black/20 px-3 text-[14px] outline-none focus:border-[#0056b9]"
                  >
                    {diagnosticTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#2f2f2f]">
                    Score (%)
                  </label>
                  <input
                    name="overall_score"
                    value={formData.overall_score}
                    onChange={handleFormChange}
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    className="h-11 rounded-[10px] border border-black/20 px-3 text-[14px] outline-none focus:border-[#0056b9]"
                    placeholder="Ex.: 78"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#2f2f2f]">
                    Nível de leitura
                  </label>
                  <input
                    name="reading_level"
                    value={formData.reading_level}
                    onChange={handleFormChange}
                    className="h-11 rounded-[10px] border border-black/20 px-3 text-[14px] outline-none focus:border-[#0056b9]"
                    placeholder="Ex.: Intermediário"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold uppercase tracking-wide text-[#2f2f2f]">
                  Recomendações
                </label>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleFormChange}
                  rows={3}
                  className="rounded-[10px] border border-black/20 px-3 py-2 text-[14px] outline-none focus:border-[#0056b9] resize-none"
                  placeholder="Sugestões pedagógicas, atividades recomendadas, etc."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="h-11 px-5 rounded-[10px] border border-black/20 text-[14px] font-semibold text-black hover:bg-black/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-5 rounded-[10px] bg-[#0056b9] text-white text-[14px] font-semibold hover:bg-[#004494] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Salvando..." : editingDiagnostic ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-black/12 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700">Total</Badge>
            </div>
            <p className="text-[28px] font-bold text-blue-900">{stats.total}</p>
            <p className="text-[12px] text-blue-700">Diagnósticos cadastrados</p>
          </Card>

          <Card className="p-5 border-black/12 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <Badge className="bg-green-100 text-green-700">Média</Badge>
            </div>
            <p className="text-[28px] font-bold text-green-900">{stats.average}%</p>
            <p className="text-[12px] text-green-700">Score médio geral</p>
          </Card>

          <Card className="p-5 border-black/12 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-700">Recente</Badge>
            </div>
            <p className="text-[28px] font-bold text-purple-900">{stats.recentCount}</p>
            <p className="text-[12px] text-purple-700">Últimos 30 dias</p>
          </Card>

          <Card className="p-5 border-black/12 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="flex items-center justify-between mb-2">
              <User className="h-5 w-5 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-700">Alunos</Badge>
            </div>
            <p className="text-[28px] font-bold text-orange-900">{stats.studentsCount}</p>
            <p className="text-[12px] text-orange-700">Com diagnósticos registrados</p>
          </Card>
        </div>

        <Card className="p-4 border-black/12">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
              <input
                type="text"
                placeholder="Buscar por aluno..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full h-[44px] pl-10 pr-4 rounded-lg border border-black/20 text-[14px] focus:outline-none focus:border-[#0056b9] transition-colors"
              />
            </div>
            <Select value={filterStudentId} onValueChange={setFilterStudentId}>
              <SelectTrigger className="w-full lg:w-[220px] h-[44px] rounded-lg border-black/20">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-black/40" />
                  <SelectValue placeholder="Todos os alunos" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os alunos</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full lg:w-[220px] h-[44px] rounded-lg border-black/20">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-black/40" />
                  <SelectValue placeholder="Todos os tipos" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {diagnosticTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="space-y-3">
          {isLoading ? (
            <div className="bg-white border border-black/12 rounded-[15px] p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0056b9]" />
            </div>
          ) : filteredDiagnostics.length === 0 ? (
            <Card className="p-12 border-black/12 text-center">
              <FileText className="h-12 w-12 text-black/20 mx-auto mb-4" />
              <p className="text-[16px] font-medium text-black/60 mb-2">
                Nenhum diagnóstico encontrado
              </p>
              <p className="text-[13px] text-black/40 mb-6">
                Cadastre novos diagnósticos para acompanhar a evolução do aluno
              </p>
              <button
                onClick={handleOpenCreateForm}
                className="bg-[#0056b9] hover:bg-[#004494] text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Registrar diagnóstico
              </button>
            </Card>
          ) : (
            filteredDiagnostics.map((diagnostic) => {
              const student = studentMap.get(diagnostic.student_id);
              const trend = renderTrendLabel(diagnostic);
              return (
                <Card key={diagnostic.id} className="p-5 border-black/12 bg-white">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center">
                          <span className="text-white font-semibold text-[16px]">
                            {(student?.name ?? "?").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-[16px] font-semibold text-[#030213]">
                            {student?.name ?? "Aluno não encontrado"}
                          </h3>
                          <p className="text-[12px] text-black/50">
                            {typeLabel(diagnostic.diagnostic_type)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedDiagnostic(diagnostic)}
                          className="p-2 rounded-lg border border-black/10 hover:bg-black/5 transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4 text-[#0056b9]" />
                        </button>
                        <button
                          onClick={() => handleEdit(diagnostic)}
                          className="p-2 rounded-lg border border-black/10 hover:bg-black/5 transition-colors cursor-pointer"
                        >
                          <Edit className="h-4 w-4 text-[#0056b9]" />
                        </button>
                        <button
                          onClick={() => handleDelete(diagnostic)}
                          className="p-2 rounded-lg border border-black/10 hover:bg-[#ffe2dd] transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-[#d80000]" />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Data</p>
                        <p className="text-[14px] text-black">
                          {new Date(diagnostic.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Score</p>
                        <p className="text-[14px] text-black">{renderScore(diagnostic.overall_score)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderTrendIcon(diagnostic)}
                        <div>
                          <p className="text-[11px] uppercase font-semibold text-black/40">Tendência</p>
                          <p className={`text-[14px] font-semibold ${trend.color}`}>{trend.text}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Nível</p>
                        <p className="text-[14px] text-black">
                          {diagnostic.reading_level ?? "Não informado"}
                        </p>
                      </div>
                    </div>

                    {diagnostic.recommendations && (
                      <div className="rounded-[10px] border border-[#0056b9]/20 bg-[#0056b9]/5 p-3">
                        <p className="text-[11px] uppercase font-semibold text-[#0056b9]">Recomendações</p>
                        <p className="text-[13px] text-black leading-relaxed">
                          {diagnostic.recommendations}
                        </p>
                      </div>
                    )}

                    {selectedDiagnostic?.id === diagnostic.id && (
                      <div className="rounded-[10px] border border-black/10 bg-black/5 p-3">
                        <p className="text-[11px] uppercase font-semibold text-black/50">
                          Detalhes completos
                        </p>
                        <ul className="text-[13px] text-black leading-relaxed list-disc list-inside space-y-1 mt-2">
                          <li>ID do diagnóstico: {diagnostic.id}</li>
                          <li>Profissional responsável: {diagnostic.conducted_by}</li>
                          {diagnostic.ai_insights && diagnostic.ai_insights.length > 0 && (
                            <li>Insights IA: {diagnostic.ai_insights.length}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
