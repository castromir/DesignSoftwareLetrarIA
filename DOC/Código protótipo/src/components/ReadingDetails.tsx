import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Play, Pause } from "lucide-react";
import svgPaths from "../imports/svg-v9zu5ssadb";
import { recordingApi } from "../services/api";
import type { Recording, RecordingMetrics, RecordingInsight } from "../types";

interface ReadingDetailsProps {
  storyTitle: string;
  studentName: string;
  recordingId: string;
  recording?: Recording;
  onBack: () => void;
  onViewTextAnalysis?: () => void;
}

const formatDuration = (seconds?: number | null) => {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) {
    return "–";
  }
  const totalSeconds = Math.max(0, Math.round(seconds));
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const formatNumber = (value?: number | null, decimals = 0) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "–";
  }
  return value.toFixed(decimals).replace(".", ",");
};

const priorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-[#ffe2dd] border-[#f87171]";
    case "medium":
      return "bg-[#fff4d6] border-[#facc15]";
    case "low":
    default:
      return "bg-[#d9ffc2] border-[#4ade80]";
  }
};

const typeLabel = (type: string) => {
  switch (type) {
    case "attention_needed":
      return "Atenção necessária";
    case "progress":
      return "Progresso";
    case "suggestion":
      return "Sugestão";
    default:
      return type;
  }
};

function AccuracyChart({ percentage }: { percentage?: number | null }) {
  const value =
    percentage === undefined || percentage === null || Number.isNaN(percentage)
      ? "–"
      : `${Math.round(percentage)}%`;

  return (
    <div className="relative size-[95.983px]">
      <svg
        className="absolute inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 96 96"
      >
        <path d={svgPaths.p355828c0} stroke="#D9D9D9" strokeWidth="7.67865" />
      </svg>

      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r="36"
          stroke="#0AC900"
          strokeWidth="8"
          strokeDasharray="226.2"
          strokeDashoffset={
            percentage === undefined || percentage === null
              ? 226.2
              : 226.2 * (1 - Math.max(0, Math.min(percentage, 100)) / 100)
          }
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-[22px] font-normal text-black">{value}</p>
      </div>
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[200px] bg-[#1e1e1e] text-white text-[11px] leading-[1.5] rounded-[8px] px-3 py-2 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e1e1e]" />
    </div>
  );
}

function MetricCard({
  value,
  label,
  variant = "default",
  tooltip,
}: {
  value: string | number;
  label: string;
  variant?: "default" | "error";
  tooltip?: string;
}) {
  return (
    <div className="group relative bg-white rounded-[15px] border border-black/12 p-[25.29px] flex flex-col items-center justify-center h-[115px] cursor-default">
      {tooltip && <Tooltip text={tooltip} />}
      <p
        className={`text-[22px] font-normal mb-3 ${
          variant === "error" ? "text-[#d80000]" : "text-black"
        }`}
      >
        {value}
      </p>
      <p className="text-[13px] font-normal text-[#5b5656] text-center">
        {label}
      </p>
    </div>
  );
}

function SmallMetricCard({
  value,
  label,
  bgColor = "bg-[#f0f0f0]",
  tooltip,
}: {
  value: string | number;
  label: string;
  bgColor?: string;
  tooltip?: string;
}) {
  return (
    <div
      className={`group relative ${bgColor} rounded-[15px] p-4 flex flex-col items-center justify-center h-[86.466px] cursor-default`}
    >
      {tooltip && <Tooltip text={tooltip} />}
      <p className="text-[18px] font-normal text-black mb-2">{value}</p>
      <p className="text-[13px] font-normal text-black text-center">{label}</p>
    </div>
  );
}

function InsightBadge({ insight }: { insight: RecordingInsight }) {
  return (
    <div className={`${priorityColor(insight.priority)} rounded-[10px] border p-[17.301px]`}>
      <p className="text-[12px] font-semibold text-black mb-1">
        {typeLabel(insight.type)}
      </p>
      <p className="text-[12px] font-normal text-black leading-[20px] mb-2">
        {insight.title}
      </p>
      <p className="text-[12px] font-normal text-black leading-[20px]">
        {insight.description}
      </p>
    </div>
  );
}

function AudioPlayer({
  recordingId,
  durationSeconds,
}: {
  recordingId: string;
  durationSeconds?: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds ?? 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    let canceled = false;

    audio.addEventListener("canplay", () => {
      if (!canceled) setIsReady(true);
    });
    audio.addEventListener("timeupdate", () => {
      if (!canceled) setCurrentTime(audio.currentTime);
    });
    audio.addEventListener("loadedmetadata", () => {
      if (!canceled && !Number.isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    });
    audio.addEventListener("ended", () => {
      if (!canceled) {
        setIsPlaying(false);
        setCurrentTime(0);
        audio.currentTime = 0;
      }
    });
    audio.addEventListener("error", () => {
      if (!canceled) setError("Erro ao reproduzir o áudio.");
    });

    const load = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(recordingApi.getAudioUrl(recordingId), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status} ao carregar áudio`);
        }

        const blob = await response.blob();
        if (blob.size === 0) throw new Error("Arquivo de áudio vazio");
        if (canceled) return;

        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        audio.src = url;
        audio.load();
      } catch (err) {
        if (!canceled) {
          setError(err instanceof Error ? err.message : "Erro ao carregar áudio");
        }
      }
    };

    load();

    return () => {
      canceled = true;
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [recordingId]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("[AudioPlayer] play error:", err);
        setError("Não foi possível reproduzir o áudio.");
      }
    }
  };

  return (
    <div className="bg-white rounded-[10px] border border-black/12 p-[21.296px]">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={!isReady || !!error}
          className="w-[44px] h-[44px] rounded-full bg-[#3c81e9] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-[#2d6fd9] transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-white" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </button>

        <div className="flex-1">
          <p className="text-[13px] font-normal text-[#2f2f2f] mb-2">
            {!isReady && !error ? "Carregando áudio…" : "Ouvir gravação"}
          </p>
          {error ? (
            <p className="text-[12px] text-red-600">{error}</p>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#d9d9d9] h-[6.643px] rounded-[10px] overflow-hidden">
                <div
                  className="h-full bg-[#0f61db] rounded-[10px] transition-all"
                  style={{
                    width:
                      duration > 0
                        ? `${Math.min(100, (currentTime / duration) * 100)}%`
                        : "0%",
                  }}
                />
              </div>
              <p className="text-[12px] font-normal text-neutral-500 w-[60px] text-right">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReadingDetails({
  storyTitle,
  studentName,
  recordingId,
  recording,
  onBack,
  onViewTextAnalysis,
}: ReadingDetailsProps) {
  const [metrics, setMetrics] = useState<RecordingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await recordingApi.getMetrics(recordingId);
        if (active) {
          setMetrics(data);
        }
      } catch (err) {
        console.error("Erro ao carregar métricas da gravação:", err);
        if (active) {
          setError("Não foi possível carregar as métricas da leitura.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchMetrics();
    return () => {
      active = false;
    };
  }, [recordingId]);

  const durationSeconds = metrics?.duration_seconds ?? recording?.duration_seconds ?? 0;

  const topMetrics = useMemo(
    () => [
      {
        label: "Tempo de leitura",
        value: formatDuration(durationSeconds),
        variant: "default" as const,
        tooltip: "Duração total da gravação da leitura.",
      },
      {
        label: "Acertos",
        value:
          metrics && metrics.correct_words_count !== undefined
            ? `${metrics.correct_words_count}${
                metrics.total_words ? ` / ${metrics.total_words}` : ""
              }`
            : "–",
        variant: "default" as const,
        tooltip: "Palavras lidas corretamente sobre o total de palavras do texto de referência.",
      },
      {
        label: "Erros",
        value: metrics ? metrics.errors_count : "–",
        variant:
          metrics && metrics.errors_count > 0
            ? ("error" as const)
            : ("default" as const),
        tooltip: "Palavras lidas incorretamente: substituições, omissões ou inserções em relação ao texto original.",
      },
    ],
    [durationSeconds, metrics]
  );

  const secondaryMetrics = useMemo(
    () => [
      {
        label: "Acurácia (%)",
        value: formatNumber(metrics?.accuracy_percentage, 0),
        tooltip: "Palavras corretas ÷ total de palavras do texto × 100. ≥90% = segura | 80–89% = boa | 60–79% = em desenvolvimento | <60% = dificuldade.",
      },
      {
        label: "Score geral",
        value: formatNumber(metrics?.overall_score, 0),
        tooltip: "Média entre acurácia, fluência e prosódia (0–100).",
      },
      {
        label: "Fluência (%)",
        value: formatNumber(metrics?.fluency_score, 0),
        tooltip: "PPM ÷ 120 × 100. Usa 120 palavras/min como referência de fluência plena.",
      },
      {
        label: "Prosódia",
        value: formatNumber(metrics?.prosody_score, 0),
        tooltip: "Pontuação 0–100 gerada pela IA com base na expressividade, ritmo, pausas e entonação. 80–100 = expressiva | 60–79 = regular | 40–59 = inconsistente | 0–39 = monótona.",
      },
      {
        label: "PPM",
        value: formatNumber(metrics?.words_per_minute, 0),
        tooltip: "Palavras Corretas Por Minuto (WCPM) = palavras acertadas ÷ minutos de gravação. Mede a automaticidade da leitura.",
      },
    ],
    [metrics]
  );

  const insights = metrics?.insights ?? [];
  const improvementPoints = metrics?.improvement_points ?? [];

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      <div className="border-b border-black/30 px-4 md:px-8 py-4 flex items-center gap-3 flex-shrink-0 bg-[#f0f0f0]">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2 z-[60]"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-[19px] font-semibold text-black flex-1 text-center -ml-12">
          Detalhes da leitura
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 relative">
        <div className="px-5 md:px-8 max-w-6xl mx-auto pt-6">
          <div className="mb-6">
            <h2 className="text-[22px] font-normal text-black mb-1">
              {storyTitle}
            </h2>
            <p className="text-[13px] font-normal text-black">
              Aluno: {studentName}
            </p>
          </div>

          <div className="lg:hidden space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {topMetrics.slice(0, 2).map((metric) => (
                <MetricCard
                  key={metric.label}
                  value={metric.value}
                  label={metric.label}
                  variant={metric.variant}
                  tooltip={metric.tooltip}
                />
              ))}
            </div>
            <MetricCard
              value={topMetrics[2].value}
              label={topMetrics[2].label}
              variant={topMetrics[2].variant}
              tooltip={topMetrics[2].tooltip}
            />

            <div className="bg-white rounded-[15px] border border-black/12 p-6">
              <h3 className="text-[18px] font-normal text-black text-center mb-6">
                Acurácia da leitura
              </h3>

              <div className="flex flex-col items-center mb-6">
                <AccuracyChart percentage={metrics?.accuracy_percentage} />
                <p className="text-[14px] font-normal text-black text-center mt-4">
                  Percentual de acurácia
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {secondaryMetrics.map((metric) => (
                  <SmallMetricCard
                    key={metric.label}
                    value={metric.value}
                    label={metric.label}
                    tooltip={metric.tooltip}
                  />
                ))}
              </div>

              {onViewTextAnalysis && (
                <button
                  onClick={onViewTextAnalysis}
                  className="w-full bg-[#3b73ed] rounded-[10px] h-[44.955px] flex items-center justify-center gap-2 hover:bg-[#2d62dc] transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                    <path
                      d={svgPaths.p17e30400}
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                    <path
                      d={svgPaths.pe7e8800}
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                    <path
                      d="M8.32974 7.49677H6.6638"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                    <path
                      d="M13.3276 10.8287H6.6638"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                    <path
                      d="M13.3276 14.1606H6.6638"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                  </svg>
                  <span className="text-[14px] font-normal text-white">
                    Consultar análise textual
                  </span>
                </button>
              )}
            </div>

            <div className="bg-white rounded-[15px] border border-black/12 p-6">
              <h3 className="text-[18px] font-normal text-black text-center mb-4">
                Insights da IA
              </h3>

              {insights.length === 0 ? (
                <p className="text-[12px] text-[#5b5656]">
                  Nenhum insight disponível para esta leitura.
                </p>
              ) : (
                <div className="space-y-3">
                  {insights.map((insight) => (
                    <InsightBadge key={insight.id} insight={insight} />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-[15px] border border-black/12 p-6">
              <h3 className="text-[18px] font-normal text-black text-center mb-4">
                Pontos de melhoria
              </h3>
              {improvementPoints.length === 0 ? (
                <p className="text-[12px] text-[#5b5656]">
                  Nenhum ponto crítico identificado.
                </p>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-[12px] text-black">
                  {improvementPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>

            <AudioPlayer
              recordingId={recordingId}
              durationSeconds={durationSeconds}
            />
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <MetricCard
                  value={topMetrics[0].value}
                  label={topMetrics[0].label}
                  variant={topMetrics[0].variant}
                  tooltip={topMetrics[0].tooltip}
                />
              </div>
              <div className="col-span-4">
                <MetricCard
                  value={topMetrics[1].value}
                  label={topMetrics[1].label}
                  variant={topMetrics[1].variant}
                  tooltip={topMetrics[1].tooltip}
                />
              </div>
              <div className="col-span-4">
                <MetricCard
                  value={topMetrics[2].value}
                  label={topMetrics[2].label}
                  variant={topMetrics[2].variant}
                  tooltip={topMetrics[2].tooltip}
                />
              </div>

              <div className="col-span-7">
                <div className="bg-white rounded-[15px] border border-black/12 p-8 h-full">
                  <h3 className="text-[20px] font-normal text-black text-center mb-8">
                    Acurácia da leitura
                  </h3>

                  <div className="flex flex-col items-center justify-center mb-8">
                    <AccuracyChart percentage={metrics?.accuracy_percentage} />
                    <p className="text-[16px] font-normal text-black mt-4">
                      Percentual de acurácia
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {secondaryMetrics.map((metric) => (
                      <SmallMetricCard
                        key={metric.label}
                        value={metric.value}
                        label={metric.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-5 space-y-6">
                <div className="bg-white rounded-[15px] border border-black/12 p-6">
                  <h3 className="text-[18px] font-normal text-black text-center mb-4">
                    Insights da IA
                  </h3>

                  {insights.length === 0 ? (
                    <p className="text-[12px] text-[#5b5656]">
                      Nenhum insight disponível para esta leitura.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {insights.map((insight) => (
                        <InsightBadge key={insight.id} insight={insight} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-[15px] border border-black/12 p-6">
                  <h3 className="text-[18px] font-normal text-black text-center mb-4">
                    Pontos de melhoria
                  </h3>
                  {improvementPoints.length === 0 ? (
                    <p className="text-[12px] text-[#5b5656]">
                      Nenhum ponto crítico identificado.
                    </p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-[12px] text-black">
                      {improvementPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <AudioPlayer
                  recordingId={recordingId}
                  durationSeconds={durationSeconds}
                />

                {onViewTextAnalysis && (
                  <button
                    onClick={onViewTextAnalysis}
                    className="w-full bg-[#3b73ed] rounded-[10px] h-[50px] flex items-center justify-center gap-2 hover:bg-[#2d62dc] transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                      <path
                        d={svgPaths.p17e30400}
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66595"
                      />
                      <path
                        d={svgPaths.pe7e8800}
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66595"
                      />
                      <path
                        d="M8.32974 7.49677H6.6638"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66595"
                      />
                      <path
                        d="M13.3276 10.8287H6.6638"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66595"
                      />
                      <path
                        d="M13.3276 14.1606H6.6638"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.66595"
                      />
                    </svg>
                    <span className="text-[15px] font-normal text-white">
                      Consultar análise textual
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-[#f0f0f0]/70 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0071f3]" />
          </div>
        )}

        {error && (
          <div className="px-5 md:px-8 max-w-6xl mx-auto pt-6">
            <div className="bg-white border border-red-200 text-red-700 rounded-[10px] p-4">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
