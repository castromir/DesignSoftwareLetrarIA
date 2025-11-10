import React, { useEffect, useMemo, useState } from "react";
import { aiInsightsApi } from "../services/api";
import type { AIInsight, InsightPriority, InsightType } from "../types";
import { useAuth } from "../contexts/AuthContext";

interface AiInsightsPanelProps {
  studentId: string;
}

const insightTypeOptions: { value: InsightType; label: string }[] = [
  { value: "attention_needed", label: "Atenção necessária" },
  { value: "progress", label: "Progresso" },
  { value: "suggestion", label: "Sugestão" },
];

const badgeColors: Record<InsightPriority, string> = {
  low: "bg-[#d9ffc2] text-[#2b8700]",
  medium: "bg-[#fff4d6] text-[#8a6d1d]",
  high: "bg-[#ffe2dd] text-[#c00000]",
};

const containerBorderColors: Record<InsightPriority, string> = {
  low: "border-[#4ade80]",
  medium: "border-[#facc15]",
  high: "border-[#f87171]",
};

const typeLabels: Record<InsightType, string> = {
  attention_needed: "Atenção necessária",
  progress: "Progresso",
  suggestion: "Sugestão",
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({ studentId }) => {
  const { currentUser } = useAuth();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const professionalId = useMemo(() => currentUser?.id ?? null, [currentUser]);

  const loadInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiInsightsApi.list({
        student_id: studentId,
        professional_id: professionalId ?? undefined,
      });
      setInsights(response.insights);
    } catch (err) {
      console.error("Erro ao carregar insights:", err);
      setError("Não foi possível carregar os insights neste momento.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      loadInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, professionalId]);

  const handleToggleRead = async (insight: AIInsight) => {
    try {
      const updated = await aiInsightsApi.update(insight.id, {
        is_read: !insight.is_read,
      });
      setInsights((prev) =>
        prev.map((item) => (item.id === insight.id ? updated : item))
      );
    } catch (err) {
      console.error("Erro ao atualizar insight:", err);
      setError("Não foi possível atualizar o insight.");
    }
  };

  return (
    <div className="bg-white rounded-[15px] border border-black/12 p-6">
      <h3 className="text-[18px] font-normal text-black text-center mb-4">
        Insights da IA
      </h3>
      <p className="text-[12px] text-[#5b5656] text-center mb-6">
        Os insights abaixo são gerados automaticamente pela IA logo após cada gravação analisada.
      </p>

      {error && (
        <div className="bg-[#ffe2dd] border border-[#f87171] text-[#c00000] rounded-[10px] p-3 mb-4 text-[12px]">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b73ed]" />
        </div>
      ) : insights.length === 0 ? (
        <p className="text-[12px] text-[#5b5656]">
          Nenhum insight registrado para este aluno.
        </p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-[12px] border ${containerBorderColors[insight.priority]} bg-white p-4`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`text-[11px] font-semibold px-2 py-1 rounded-full ${badgeColors[insight.priority]}`}
                >
                  {typeLabels[insight.insight_type]}
                </span>
                <span className="text-[11px] text-[#5b5656]">
                  {formatDate(insight.created_at)}
                </span>
                <button
                  onClick={() => handleToggleRead(insight)}
                  className={`ml-auto text-[11px] font-semibold px-2 py-1 rounded-full ${
                    insight.is_read
                      ? "bg-[#d1fae5] text-[#065f46]"
                      : "bg-[#e0e7ff] text-[#3730a3]"
                  }`}
                >
                  {insight.is_read ? "Lido" : "Novo"}
                </button>
              </div>
              <h4 className="text-[14px] font-semibold text-black mb-1">
                {insight.title}
              </h4>
              <p className="text-[12px] text-[#2f2f2f] leading-relaxed">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiInsightsPanel;

