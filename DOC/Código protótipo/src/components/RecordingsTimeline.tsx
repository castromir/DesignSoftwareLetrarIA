import { ChevronLeft, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { recordingApi } from "../services/api";
import type { RecordingTimelineEntry } from "../types";

interface Student {
  id: number | string;
  name: string;
  age?: number;
}

interface RecordingsTimelineProps {
  student: Student | null;
  storyId: string;
  storyTitle: string;
  onBack: () => void;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.round(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const formatNum = (value?: number | null, decimals = 0) => {
  if (value === undefined || value === null || Number.isNaN(value)) return "–";
  return value.toFixed(decimals).replace(".", ",");
};

const insightColors: Record<string, { bg: string; border: string; badge: string }> = {
  progress: { bg: "bg-[#d9ffc2]", border: "border-[#4ade80]", badge: "bg-[#4ade80]" },
  attention_needed: { bg: "bg-[#ffe2dd]", border: "border-[#f87171]", badge: "bg-[#f87171]" },
  suggestion: { bg: "bg-[#fff4d6]", border: "border-[#facc15]", badge: "bg-[#facc15]" },
};

const insightLabel: Record<string, string> = {
  progress: "Progresso",
  attention_needed: "Atenção necessária",
  suggestion: "Sugestão",
};

function InsightCard({ insight }: { insight: NonNullable<RecordingTimelineEntry["insight"]> }) {
  const [expanded, setExpanded] = useState(false);
  const colors = insightColors[insight.type] ?? insightColors.suggestion;

  return (
    <div className={`mt-3 rounded-[10px] border ${colors.border} ${colors.bg} p-3`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full flex-shrink-0 ${colors.badge}`}>
            {insightLabel[insight.type] ?? insight.type}
          </span>
          <span className="text-[13px] font-semibold text-black truncate">{insight.title}</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-black/50 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-black/50 flex-shrink-0" />
        )}
      </button>
      {expanded && (
        <p className="mt-2 text-[12px] text-black/80 leading-relaxed whitespace-pre-line">
          {insight.description.replace(/\\n\\n/g, "\n\n")}
        </p>
      )}
    </div>
  );
}

function TimelineCard({
  entry,
  index,
  isLast,
}: {
  entry: RecordingTimelineEntry;
  index: number;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      {/* Linha vertical + círculo */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#4084dd] flex items-center justify-center text-white text-[12px] font-bold shadow-md">
          {index + 1}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-[#4084dd]/30 mt-1 min-h-[24px]" />}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-[12px] border border-black/10 p-4 shadow-sm mb-6">
        <p className="text-[12px] text-black/50 mb-2">{formatDateTime(entry.recorded_at)}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-1">
          <div className="bg-[#f0f6ff] rounded-[8px] p-2 text-center">
            <p className="text-[10px] text-black/50 uppercase tracking-wide">PPM</p>
            <p className="text-[18px] font-bold text-[#4084dd]">{formatNum(entry.words_per_minute, 0)}</p>
          </div>
          <div className="bg-[#f0fff4] rounded-[8px] p-2 text-center">
            <p className="text-[10px] text-black/50 uppercase tracking-wide">Acurácia</p>
            <p className="text-[18px] font-bold text-[#22c55e]">{formatNum(entry.accuracy_percentage, 0)}%</p>
          </div>
          <div className="bg-[#fffbeb] rounded-[8px] p-2 text-center">
            <p className="text-[10px] text-black/50 uppercase tracking-wide">Prosódia</p>
            <p className="text-[18px] font-bold text-[#f59e0b]">{formatNum(entry.prosody_score, 0)}</p>
          </div>
          <div className="bg-[#f5f0ff] rounded-[8px] p-2 text-center">
            <p className="text-[10px] text-black/50 uppercase tracking-wide">Duração</p>
            <p className="text-[18px] font-bold text-[#8b5cf6]">{formatDuration(entry.duration_seconds)}</p>
          </div>
        </div>

        {entry.errors_count > 0 && (
          <p className="text-[12px] text-red-500 mt-2">
            {entry.errors_count} {entry.errors_count === 1 ? "desvio identificado" : "desvios identificados"}
          </p>
        )}

        {entry.insight && <InsightCard insight={entry.insight} />}
      </div>
    </div>
  );
}

export default function RecordingsTimeline({
  student,
  storyId,
  storyTitle,
  onBack,
}: RecordingsTimelineProps) {
  const [entries, setEntries] = useState<RecordingTimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!student || !storyId) return;
    let active = true;
    setIsLoading(true);
    setError(null);

    recordingApi
      .getTimeline(storyId, String(student.id))
      .then((data) => { if (active) setEntries(data); })
      .catch(() => { if (active) setError("Não foi possível carregar a linha do tempo."); })
      .finally(() => { if (active) setIsLoading(false); });

    return () => { active = false; };
  }, [student, storyId]);

  const chartDataPPM = useMemo(
    () =>
      entries.map((e, i) => ({
        index: i + 1,
        ppm: e.words_per_minute ?? 0,
        label: formatDate(e.recorded_at),
      })),
    [entries]
  );

  const chartDataAccuracy = useMemo(
    () =>
      entries.map((e, i) => ({
        index: i + 1,
        accuracy: e.accuracy_percentage ?? 0,
        label: formatDate(e.recorded_at),
      })),
    [entries]
  );

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-black/30 px-4 py-4 flex items-center gap-3 flex-shrink-0 bg-[#f0f0f0]">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <div className="flex-1">
          <h1 className="text-[17px] font-semibold text-black leading-tight">
            Linha do tempo
          </h1>
          <p className="text-[12px] text-black/50">
            {storyTitle} · {student?.name}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#4084dd]" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[15px] text-red-600">{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[15px] text-black/50">Nenhuma gravação encontrada.</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 pt-6">
            {/* Gráficos */}
            {entries.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* PPM Chart */}
                <div className="bg-white rounded-[12px] border border-black/10 p-4 shadow-sm">
                  <p className="text-[13px] font-semibold text-black mb-3">
                    PPM por leitura
                  </p>
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartDataPPM}
                        margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPPM" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4084dd" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4084dd" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                          dataKey="index"
                          tickFormatter={(v) => chartDataPPM[v - 1]?.label ?? String(v)}
                          tick={{ fontSize: 10, fill: "#888" }}
                          minTickGap={20}
                        />
                        <YAxis hide domain={["auto", "auto"]} />
                        <Tooltip
                          formatter={(value: number) => [`${value.toFixed(0)} PPM`, "PPM"]}
                          labelFormatter={(label) => chartDataPPM[Number(label) - 1]?.label ?? `Leitura ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="ppm"
                          stroke="#4084dd"
                          strokeWidth={2.5}
                          fill="url(#colorPPM)"
                          animationDuration={600}
                          dot={{ r: 3, fill: "#4084dd" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Accuracy Chart */}
                <div className="bg-white rounded-[12px] border border-black/10 p-4 shadow-sm">
                  <p className="text-[13px] font-semibold text-black mb-3">
                    Acurácia por leitura (%)
                  </p>
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartDataAccuracy}
                        margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                          dataKey="index"
                          tickFormatter={(v) => chartDataAccuracy[v - 1]?.label ?? String(v)}
                          tick={{ fontSize: 10, fill: "#888" }}
                          minTickGap={20}
                        />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                          formatter={(value: number) => [`${value.toFixed(0)}%`, "Acurácia"]}
                          labelFormatter={(label) => chartDataAccuracy[Number(label) - 1]?.label ?? `Leitura ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="accuracy"
                          stroke="#22c55e"
                          strokeWidth={2.5}
                          fill="url(#colorAcc)"
                          animationDuration={600}
                          dot={{ r: 3, fill: "#22c55e" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <h2 className="text-[16px] font-semibold text-black mb-4">
              {entries.length} {entries.length === 1 ? "leitura registrada" : "leituras registradas"}
            </h2>
            <div>
              {entries.map((entry, i) => (
                <TimelineCard
                  key={entry.recording_id}
                  entry={entry}
                  index={i}
                  isLast={i === entries.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
