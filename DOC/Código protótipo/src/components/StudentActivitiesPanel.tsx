import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import type {
  Activity,
  ActivityStatus,
  Student,
  StudentActivity,
  StudentActivityCreate,
} from "../types";
import { activitiesApi, studentActivitiesApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const statusLabels: Record<ActivityStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluída",
};

const statusBadgeStyles: Record<ActivityStatus, string> = {
  pending: "bg-orange-50 text-orange-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
};

interface StudentActivitiesPanelProps {
  student: Student;
  onBack: () => void;
}

export default function StudentActivitiesPanel({ student, onBack }: StudentActivitiesPanelProps) {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [studentActivities, setStudentActivities] = useState<StudentActivity[]>([]);
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const loadActivities = async () => {
    try {
      const response = await activitiesApi.list(currentUser?.role === "professional" ? currentUser.id : undefined);
      setActivities(response.activities);
    } catch (err) {
      console.error("Erro ao carregar atividades:", err);
    }
  };

  const loadStudentActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await studentActivitiesApi.list({
        student_id: String(student.id),
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setStudentActivities(response.student_activities);
    } catch (err) {
      console.error("Erro ao carregar atividades do aluno:", err);
      setError("Não foi possível carregar as atividades deste aluno.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [currentUser?.id]);

  useEffect(() => {
    loadStudentActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, student.id]);

  const availableActivities = useMemo(() => {
    const assignedIds = new Set(studentActivities.map((activity) => activity.activity_id));
    return activities.filter((activity) => !assignedIds.has(activity.id));
  }, [activities, studentActivities]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedActivityId) {
      setError("Selecione uma atividade para vincular ao aluno.");
      return;
    }

    const payload: StudentActivityCreate = {
      student_id: String(student.id),
      activity_id: selectedActivityId,
      notes: notes.trim() || undefined,
    };

    setIsSubmitting(true);
    setError(null);
    try {
      const created = await studentActivitiesApi.create(payload);
      setStudentActivities((prev) => [created, ...prev]);
      setSelectedActivityId("");
      setNotes("");
    } catch (err) {
      console.error("Erro ao criar atividade do aluno:", err);
      setError("Não foi possível vincular a atividade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (studentActivity: StudentActivity, status: ActivityStatus) => {
    try {
      const updated = await studentActivitiesApi.update(studentActivity.id, {
        status,
        completed_at: status === "completed" ? new Date().toISOString() : undefined,
      });
      setStudentActivities((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      console.error("Erro ao atualizar atividade do aluno:", err);
      setError("Não foi possível atualizar o status da atividade.");
    }
  };

  const handleDelete = async (studentActivity: StudentActivity) => {
    const confirmDelete = window.confirm("Deseja remover esta atividade do aluno?");
    if (!confirmDelete) return;

    try {
      await studentActivitiesApi.delete(studentActivity.id);
      setStudentActivities((prev) => prev.filter((item) => item.id !== studentActivity.id));
    } catch (err) {
      console.error("Erro ao remover atividade do aluno:", err);
      setError("Não foi possível remover a atividade. Tente novamente.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      <div className="border-b border-black/30 px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack} className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2 cursor-pointer">
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <div className="flex-1">
          <h1 className="text-[19px] font-semibold text-black">Atividades do aluno</h1>
          <p className="text-[12px] text-black/60">Gerencie atribuições, status e observações</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
        {error && (
          <div className="bg-[#ffe2dd] border border-[#f87171] text-[#c00000] rounded-[10px] p-4 text-[13px]">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="bg-white rounded-[15px] border border-black/12 p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="text-[12px] font-semibold text-black/70 block mb-2">
                Selecionar atividade
              </label>
              <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
                <SelectTrigger className="w-full h-[46px] rounded-lg border border-black/20">
                  <SelectValue placeholder="Escolha uma atividade" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {availableActivities.length === 0 ? (
                    <SelectItem value="no-options" disabled>
                      Nenhuma atividade disponível
                    </SelectItem>
                  ) : (
                    availableActivities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-[12px] font-semibold text-black/70 block mb-2">
                Observações (opcional)
              </label>
              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full h-[46px] rounded-lg border border-black/20 px-3 text-[14px]"
                placeholder="Ex.: revisar em sala"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !selectedActivityId}
              className="h-[46px] px-6 rounded-lg bg-[#0056b9] text-white text-[14px] font-semibold flex items-center gap-2 hover:bg-[#004494] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span>Vincular</span>
            </button>
          </div>
        </form>

        <div className="flex flex-col lg:flex-row gap-3 items-start">
          <Card className="p-4 border-black/12 flex-1">
            <p className="text-[11px] uppercase font-semibold text-black/50">Total de atividades</p>
            <p className="text-[26px] font-bold text-[#030213]">{studentActivities.length}</p>
          </Card>
          <Card className="p-4 border-black/12 flex-1">
            <p className="text-[11px] uppercase font-semibold text-black/50">Concluídas</p>
            <p className="text-[26px] font-bold text-[#030213]">
              {studentActivities.filter((activity) => activity.status === "completed").length}
            </p>
          </Card>
          <Card className="p-4 border-black/12 flex-1">
            <p className="text-[11px] uppercase font-semibold text-black/50">Filtrar por status</p>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ActivityStatus | "all") }>
              <SelectTrigger className="w-full h-[44px] rounded-lg border border-black/20 mt-2">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        </div>

        {isLoading ? (
          <div className="bg-white border border-black/12 rounded-[15px] p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0056b9]" />
          </div>
        ) : studentActivities.length === 0 ? (
          <Card className="p-12 border-black/12 text-center">
            <AlertCircle className="h-12 w-12 text-black/20 mx-auto mb-4" />
            <p className="text-[16px] font-medium text-black/60 mb-2">
              Nenhuma atividade vinculada
            </p>
            <p className="text-[13px] text-black/40">
              Vincule uma atividade para começar a acompanhar o progresso deste aluno.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {studentActivities.map((studentActivity) => {
              const summary = studentActivity.activity;
              return (
                <Card key={studentActivity.id} className="p-5 border-black/12 bg-white">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#030213]">
                          {summary?.title ?? "Atividade removida"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={statusBadgeStyles[studentActivity.status]}>
                            {statusLabels[studentActivity.status]}
                          </Badge>
                          {summary?.type && (
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                              {summary.type === "reading" ? "Leitura" : summary.type === "writing" ? "Escrita" : "Diagnóstico"}
                            </Badge>
                          )}
                          {summary?.difficulty && (
                            <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                              {summary.difficulty === "easy" ? "Fácil" : summary.difficulty === "medium" ? "Médio" : "Difícil"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(studentActivity)}
                        className="p-2 rounded-lg border border-black/10 hover:bg-[#ffe2dd] transition-colors cursor-pointer"
                        aria-label="Remover atividade"
                      >
                        <Trash2 className="h-4 w-4 text-[#d80000]" />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[13px] text-black/70">
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Agendada</p>
                        <p>
                          {summary?.scheduled_date ? new Date(summary.scheduled_date).toLocaleDateString("pt-BR") : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Hora</p>
                        <p>{summary?.scheduled_time ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Notas</p>
                        <p>{studentActivity.notes ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-semibold text-black/40">Conclusão</p>
                        <p>
                          {studentActivity.completed_at
                            ? new Date(studentActivity.completed_at).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                      <button
                        onClick={() => handleStatusChange(studentActivity, "in_progress")}
                        disabled={studentActivity.status === "in_progress"}
                        className="h-[40px] px-4 rounded-lg border border-[#0F61DB] text-[#0F61DB] text-[13px] font-semibold flex items-center gap-2 hover:bg-[#0F61DB]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Clock className="h-4 w-4" />
                        Em andamento
                      </button>
                      <button
                        onClick={() => handleStatusChange(studentActivity, "completed")}
                        disabled={studentActivity.status === "completed"}
                        className="h-[40px] px-4 rounded-lg bg-[#12B76A] text-white text-[13px] font-semibold flex items-center gap-2 hover:bg-[#0f9d5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Marcar como concluída
                      </button>
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
