import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, Play, Pause } from "lucide-react";
import svgPaths from "../imports/svg-gg4j504qmb";
import ReadingDetails from "./ReadingDetails";
import TextAnalysis from "./TextAnalysis";
import { recordingApi } from "../services/api";
import type { Recording, RecordingErrorDetail } from "../types";

interface Student {
  id: number | string;
  name: string;
  age?: number;
}

interface RecordingsListProps {
  student: Student | null;
  storyId: string;
  storyTitle: string;
  onBack: () => void;
}

function PlayIcon() {
  return (
    <svg
      className="w-[28px] h-[28px] translate-x-[-6px] translate-y-[-6px]"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 36 33"
    >
      <path
        d={svgPaths.p3008ce00}
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      className="w-[28px] h-[28px] translate-x-[-7px] translate-y-[-7px]"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 33 33"
    >
      <path d={svgPaths.p2806d900} fill="white" />
    </svg>
  );
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date: dateStr, time: timeStr };
}

interface RecordingWithState extends Recording {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioObjectUrl: string | null;
  errorsDetected: RecordingErrorDetail[];
  improvementPoints: string[];
}

function RecordingErrorsList({ errors }: { errors: RecordingErrorDetail[] }) {
  if (errors.length === 0) {
    return (
      <p className="text-[12px] text-[#2f2f2f]">
        Nenhum desvio identificado nesta leitura.
      </p>
    );
  }

  return (
    <ul className="mt-2 space-y-1">
      {errors.map((error, index) => {
        const expected = error.expected?.trim();
        const spoken = error.spoken?.trim();
        return (
          <li
            key={`${expected || "vazio"}-${spoken || "vazio"}-${index}`}
            className="text-[12px] text-[#2f2f2f] leading-4"
          >
            <span className="text-[#00449d] font-semibold mr-1">
              {index + 1}.
            </span>
            <span>
              Esperado: {expected ? `'${expected}'` : "—"} · Dito:{" "}
              {spoken ? `'${spoken}'` : "—"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function RecordingImprovementPointsList({ points }: { points: string[] }) {
  if (points.length === 0) {
    return (
      <p className="text-[12px] text-[#2f2f2f]">
        A IA ainda não sugeriu pontos de melhoria para esta leitura.
      </p>
    );
  }

  return (
    <ul className="mt-2 space-y-1">
      {points.map((point, index) => (
        <li
          key={`${index}-${point}`}
          className="text-[12px] text-[#2f2f2f] leading-4"
        >
          <span className="text-[#00449d] font-semibold mr-1">
            {index + 1}.
          </span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function AudioPlayer({
  recording,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onTimeUpdate,
}: {
  recording: Recording;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onTimeUpdate: (time: number) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isLoadedRef = useRef<string | null>(null);
  const timeUpdateHandlerRef = useRef<(() => void) | undefined>(undefined);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime && isFinite(audio.currentTime)) {
      onTimeUpdate(audio.currentTime);
    }
  }, [onTimeUpdate]);

  useEffect(() => {
    timeUpdateHandlerRef.current = handleTimeUpdate;
  }, [handleTimeUpdate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isLoadedRef.current === recording.id) return;

    let url: string | null = null;
    let cancelled = false;

    const loadAudio = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("auth_token");
        const audioUrl = recordingApi.getAudioUrl(recording.id);

        const response = await fetch(audioUrl, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar áudio: ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "audio/webm";
        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("Arquivo de áudio vazio");
        }

        if (cancelled) {
          return;
        }

        const typedBlob = new Blob([blob], { type: contentType });
        url = URL.createObjectURL(typedBlob);
        setObjectUrl(url);
        
        audio.src = url;
        audio.load();
        
        setError(null);
        isLoadedRef.current = recording.id;
      } catch (err) {
        if (!cancelled) {
          console.error("[AudioPlayer] Error loading audio:", err);
          setError(err instanceof Error ? err.message : "Erro ao carregar áudio");
          isLoadedRef.current = null;
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadAudio();

    const updateDuration = () => {
      const audio = audioRef.current;
      if (audio && audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        if (timeUpdateHandlerRef.current) {
          timeUpdateHandlerRef.current();
        }
      }
    };

    const handleError = () => {
      const audio = audioRef.current;
      if (!audio || !audio.error || !audio.src) return;
      
      const errorCode = audio.error.code;
      if (errorCode === 4) {
        return;
      }
      
      if (errorCode === 1 || errorCode === 2) {
        return;
      }
      
      console.error("Audio error:", errorCode, audio.error.message);
      setError(`Erro ao reproduzir áudio: ${audio.error.message || "Formato não suportado"}`);
    };

    const timeUpdateWrapper = () => {
      if (timeUpdateHandlerRef.current) {
        timeUpdateHandlerRef.current();
      }
    };

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("error", handleError);
    audio.addEventListener("timeupdate", timeUpdateWrapper);

    return () => {
      cancelled = true;
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("timeupdate", timeUpdateWrapper);
      if (url) {
        URL.revokeObjectURL(url);
      }
      setObjectUrl((prevUrl) => {
        if (prevUrl && prevUrl !== url) {
          URL.revokeObjectURL(prevUrl);
        }
        return null;
      });
      if (audio.src) {
        audio.pause();
        audio.src = "";
        audio.load();
      }
      if (isLoadedRef.current === recording.id) {
        isLoadedRef.current = null;
      }
    };
  }, [recording.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isLoading || isLoadedRef.current !== recording.id || !audio.src) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError" && err.name !== "NotAllowedError") {
            console.error("Error playing audio:", err);
            setError("Erro ao reproduzir áudio");
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isLoading, recording.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isLoading || isLoadedRef.current !== recording.id || !audio.src) return;

    const diff = Math.abs(audio.currentTime - currentTime);
    if (diff > 0.5) {
      audio.currentTime = currentTime;
    }
  }, [currentTime, isLoading, recording.id]);

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
        onEnded={() => {
          onTimeUpdate(0);
        }}
      />
      {error && (
        <p className="text-[10px] text-red-600 mt-1">{error}</p>
      )}
    </>
  );
}

function RecordingCard({
  recording,
  studentName,
  onTogglePlay,
  onViewMetrics,
}: {
  recording: RecordingWithState;
  studentName: string;
  onTogglePlay: () => void;
  onViewMetrics: () => void;
}) {
  const { date, time } = formatDate(recording.recorded_at);
  const progressPercentage =
    recording.duration > 0
      ? (recording.currentTime / recording.duration) * 100
      : 0;
  const accuracyScore = recording.analysis?.accuracy_score;
  const accuracyPercentage = accuracyScore !== undefined ? Math.round(accuracyScore) : null;

  return (
    <div className="bg-white rounded-[10px] p-5 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-black mb-1">
            Leitura de {studentName}
          </h3>
          <p className="text-[12px] font-medium text-[#2f2f2f]">
            Gravado em {date} às {time}
          </p>
          {accuracyPercentage !== null && (
            <p className="text-[12px] font-semibold text-[#00449d] mt-1">
              Percentual de acerto: {accuracyPercentage}%
            </p>
          )}
        </div>

        <button
          onClick={onTogglePlay}
          className="w-[48px] h-[48px] rounded-full bg-[#3c81e9] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-[#2d6fd9] transition-colors flex-shrink-0"
        >
          {recording.isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-[#d9d9d9] h-[6.646px] rounded-[10px] overflow-hidden">
          <div
            className="h-full rounded-[10px] bg-[#0f61db] transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-[12px] font-bold text-neutral-500 text-nowrap">
          {formatTime(recording.currentTime)} / {formatTime(recording.duration || recording.duration_seconds)}
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-[13px] font-semibold text-[#00449d]">
          Palavras com desvios
        </h4>
        <RecordingErrorsList errors={recording.errorsDetected} />
      </div>

      <div className="mt-4">
        <h4 className="text-[13px] font-semibold text-[#00449d]">
          Pontos de melhoria sugeridos pela IA
        </h4>
        <RecordingImprovementPointsList points={recording.improvementPoints} />
      </div>

      <button
        onClick={onViewMetrics}
        className="w-full bg-[#c3daff] rounded-[10px] h-[34.113px] flex items-center justify-center hover:bg-[#b3caef] transition-colors"
      >
        <span className="text-[14px] font-semibold text-[#00449d]">
          Ver métricas
        </span>
      </button>
    </div>
  );
}

export default function RecordingsList({
  student,
  storyId,
  storyTitle,
  onBack,
}: RecordingsListProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showTextAnalysis, setShowTextAnalysis] = useState(false);
  const [recordings, setRecordings] = useState<RecordingWithState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  useEffect(() => {
    const loadRecordings = async () => {
      if (!student || !storyId) return;

      setIsLoading(true);
      setError(null);

      try {
        const studentId =
          typeof student.id === "string" ? student.id : student.id.toString();
        const response = await recordingApi.list({
          student_id: studentId,
          story_id: storyId,
        });

        const recordingsWithState: RecordingWithState[] = response.recordings.map(
          (rec) => {
            const errorsDetected = Array.isArray(rec.analysis?.errors_detected)
              ? rec.analysis?.errors_detected ?? []
              : [];
            const improvementPointsSource = Array.isArray(
              rec.analysis?.pauses_analysis?.improvement_points
            )
              ? rec.analysis?.pauses_analysis?.improvement_points ?? []
              : [];
            const recommendationFocus = Array.isArray(
              rec.analysis?.ai_recommendations?.focus
            )
              ? rec.analysis?.ai_recommendations?.focus ?? []
              : [];
            const improvementPoints = Array.from(
              new Set([
                ...improvementPointsSource.map((item) => item.trim()).filter(Boolean),
                ...recommendationFocus.map((item) => item.trim()).filter(Boolean),
              ])
            );
            return {
              ...rec,
              isPlaying: false,
              currentTime: 0,
              duration: rec.duration_seconds,
              audioObjectUrl: null,
              errorsDetected,
              improvementPoints,
            };
          }
        );

        setRecordings(recordingsWithState);
      } catch (err) {
        console.error("Error loading recordings:", err);
        setError("Erro ao carregar gravações");
      } finally {
        setIsLoading(false);
      }
    };

    loadRecordings();
  }, [student, storyId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecordings((prev) =>
        prev.map((rec) => {
          if (rec.isPlaying && rec.currentTime < rec.duration) {
            return { ...rec, currentTime: rec.currentTime + 0.1 };
          }
          if (rec.isPlaying && rec.currentTime >= rec.duration) {
            return { ...rec, isPlaying: false, currentTime: 0 };
          }
          return rec;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setRecordings((prev) =>
          prev.map((rec) => ({ ...rec, isPlaying: false }))
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleTogglePlay = (id: string) => {
    setRecordings((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          if (!rec.isPlaying && rec.currentTime >= rec.duration) {
            return { ...rec, isPlaying: true, currentTime: 0 };
          }
          return { ...rec, isPlaying: !rec.isPlaying };
        }
        return { ...rec, isPlaying: false };
      })
    );
  };

  const handleTimeUpdate = (id: string, time: number) => {
    setRecordings((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          return { ...rec, currentTime: time };
        }
        return rec;
      })
    );
  };

  const pauseAllRecordings = () => {
    setRecordings((prev) =>
      prev.map((rec) => ({ ...rec, isPlaying: false }))
    );
  };

  const handleBackClick = () => {
    pauseAllRecordings();
    onBack();
  };

  const handleViewMetrics = (recording: RecordingWithState) => {
    pauseAllRecordings();
    setSelectedRecording(recording);
    setShowDetails(true);
  };

  if (!student) return null;

  if (showTextAnalysis && selectedRecording) {
    const studentForAnalysis = {
      id: typeof student.id === "number" ? student.id : parseInt(String(student.id), 10) || 0,
      name: student.name,
      age: student.age ?? 0,
    };
    return (
      <TextAnalysis
        student={studentForAnalysis}
        storyTitle={storyTitle}
        storySubtitle="Análise de leitura"
        storyContent={selectedRecording.transcription || ""}
        incorrectWords={[]}
        onBack={() => setShowTextAnalysis(false)}
      />
    );
  }

  if (showDetails && selectedRecording) {
    return (
      <ReadingDetails
        recordingId={selectedRecording.id}
        recording={selectedRecording}
        storyTitle={storyTitle}
        studentName={student.name}
        onBack={() => setShowDetails(false)}
        onViewTextAnalysis={() => setShowTextAnalysis(true)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      <div className="border-b border-black/30 px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleBackClick}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2 z-[60]"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-[19px] font-semibold text-black flex-1 text-center -ml-12">
          Gravações
        </h1>
      </div>

      <div className="px-6 pt-6 pb-4">
        <h2 className="text-[22px] font-semibold text-black text-center">
          {storyTitle}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0071f3]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 px-4">{error}</div>
        ) : recordings.length === 0 ? (
          <div className="text-center py-8 text-gray-500 px-4">
            Nenhuma gravação encontrada
          </div>
        ) : (
          <div className="px-4 space-y-4 max-w-md mx-auto">
            {recordings.map((recording) => (
              <div key={recording.id}>
                <RecordingCard
                  recording={recording}
                  studentName={student.name}
                  onTogglePlay={() => handleTogglePlay(recording.id)}
                  onViewMetrics={() => handleViewMetrics(recording)}
                />
                <AudioPlayer
                  recording={recording}
                  isPlaying={recording.isPlaying}
                  currentTime={recording.currentTime}
                  duration={recording.duration}
                  onTogglePlay={() => handleTogglePlay(recording.id)}
                  onTimeUpdate={(time) => handleTimeUpdate(recording.id, time)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {recordings.length > 1 && (
        <div className="border-t border-[#2A7AF2]/60 bg-[#f0f0f0] px-4 py-4 flex-shrink-0">
          <div className="max-w-md mx-auto">
            <button className="w-full bg-[#4084dd] rounded-[10px] h-[42.535px] flex items-center justify-center gap-2 hover:bg-[#3074cd] transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 20 24"
              >
                <path
                  clipRule="evenodd"
                  d={svgPaths.p2052da70}
                  fill="white"
                  fillRule="evenodd"
                />
              </svg>
              <span className="text-[14px] font-semibold text-white">
                Comparar métricas
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
