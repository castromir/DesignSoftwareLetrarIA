import { ChevronLeft, Play, Pause } from "lucide-react";
import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-gg4j504qmb";
import ReadingDetails from "./ReadingDetails";
import TextAnalysis from "./TextAnalysis";

interface Student {
  id: number;
  name: string;
  age: number;
}

interface Recording {
  id: number;
  studentName: string;
  date: string;
  time: string;
  duration: string;
  progress: number;
  isPlaying: boolean;
  timeRemaining: number; // in seconds
  totalDuration: number; // in seconds
}

interface RecordingsListProps {
  student: Student | null;
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

// Helper function to format seconds as MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function RecordingCard({
  recording,
  onTogglePlay,
  onViewMetrics,
}: {
  recording: Recording;
  onTogglePlay: () => void;
  onViewMetrics: () => void;
}) {
  // Calculate progress percentage
  const progressPercentage = recording.totalDuration > 0
    ? ((recording.totalDuration - recording.timeRemaining) / recording.totalDuration) * 100
    : 0;

  return (
    <div className="bg-white rounded-[10px] p-5 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-black mb-1">
            Leitura de {recording.studentName}
          </h3>
          <p className="text-[12px] font-medium text-[#2f2f2f]">
            Gravado em {recording.date} às {recording.time}
          </p>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className="w-[48px] h-[48px] rounded-full bg-[#3c81e9] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-[#2d6fd9] transition-colors flex-shrink-0 text-[16px]"
        >
          {recording.isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-[#d9d9d9] h-[6.646px] rounded-[10px] overflow-hidden">
          <div
            className="h-full rounded-[10px] bg-[#0f61db] transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-[12px] font-bold text-neutral-500 text-nowrap">
          {formatTime(recording.timeRemaining)}
        </span>
      </div>

      {/* Ver métricas button */}
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

// Helper function to convert MM:SS to seconds
function timeToSeconds(timeStr: string): number {
  const [mins, secs] = timeStr.split(":").map(Number);
  return mins * 60 + secs;
}

export default function RecordingsList({
  student,
  storyTitle,
  onBack,
}: RecordingsListProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showTextAnalysis, setShowTextAnalysis] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: 1,
      studentName: student?.name || "João Augusto",
      date: "20/10/2025",
      time: "10:30",
      duration: "3:47",
      progress: 0,
      isPlaying: false,
      timeRemaining: timeToSeconds("3:47"),
      totalDuration: timeToSeconds("3:47"),
    },
    {
      id: 2,
      studentName: student?.name || "João Augusto",
      date: "20/10/2025",
      time: "17:30",
      duration: "1:45",
      progress: 56,
      isPlaying: false,
      timeRemaining: timeToSeconds("1:45"),
      totalDuration: timeToSeconds("1:45"),
    },
  ]);

  // Timer effect for playing recordings
  useEffect(() => {
    const interval = setInterval(() => {
      setRecordings((prev) =>
        prev.map((rec) => {
          if (rec.isPlaying && rec.timeRemaining > 0) {
            const newTimeRemaining = rec.timeRemaining - 1;
            // Auto-pause when reaching 0
            if (newTimeRemaining === 0) {
              return { ...rec, timeRemaining: 0, isPlaying: false };
            }
            return { ...rec, timeRemaining: newTimeRemaining };
          }
          return rec;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Pause all recordings when user leaves the page
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

  const handleTogglePlay = (id: number) => {
    setRecordings((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          // If paused at 0, reset to full duration when playing again
          if (!rec.isPlaying && rec.timeRemaining === 0) {
            return { ...rec, isPlaying: true, timeRemaining: rec.totalDuration };
          }
          return { ...rec, isPlaying: !rec.isPlaying };
        }
        // Pause other recordings
        return { ...rec, isPlaying: false };
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

  const handleViewMetrics = () => {
    pauseAllRecordings();
    setShowDetails(true);
  };

  if (!student) return null;

  // Sample story content and incorrect words for simulation
  const storyContent = `O rato roeu a ropa do rei de roma. Era um rato muito esperto que vivia no castelo real. Todos os dias ele procurava por pedaços de queijo e pão. O rei ficava muito bravo com o rato, mas nunca conseguia pegá-lo.
  
O pequeno roedor sabia exatamente onde se esconder. Nas paredes do palácio havia muitos buracos secretos. Quando os guardas tentavam capturá-lo, ele rapidamente desaparecia.
  
Um dia, o rei decidiu fazer as pazes com o ratinho. Percebeu que a criatura só queria sobreviver. Desde então, deixou migalhas de comida em um canto da cozinha. O rato agradecido nunca mais roeu as roupas reais.`;

  const incorrectWords = ["ropa", "roeu", "roedor", "rapidamente"];

  if (showTextAnalysis) {
    return (
      <TextAnalysis
        student={student}
        storyTitle={storyTitle}
        storySubtitle="Letras trabalhadas: R"
        storyContent={storyContent}
        incorrectWords={incorrectWords}
        onBack={() => setShowTextAnalysis(false)}
      />
    );
  }

  if (showDetails) {
    return (
      <ReadingDetails
        storyTitle={storyTitle}
        studentName={student.name}
        onBack={() => setShowDetails(false)}
        onViewTextAnalysis={() => setShowTextAnalysis(true)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      {/* Header */}
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

      {/* Story Title */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-[22px] font-semibold text-black text-center">
          {storyTitle}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Recordings List */}
        <div className="px-4 space-y-4 max-w-md mx-auto">
          {recordings.map((recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
              onTogglePlay={() => handleTogglePlay(recording.id)}
              onViewMetrics={handleViewMetrics}
            />
          ))}
        </div>
      </div>

      {/* Footer with Compare Button */}
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
    </div>
  );
}