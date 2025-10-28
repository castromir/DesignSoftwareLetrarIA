import { ChevronLeft, Play, Pause } from "lucide-react";
import { useState } from "react";
import svgPaths from "../imports/svg-gg4j504qmb";
import ReadingDetails from "./ReadingDetails";

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
}

interface RecordingsListProps {
  student: Student | null;
  storyTitle: string;
  onBack: () => void;
}

function PlayIcon() {
  return (
    <svg
      className="w-[18px] h-[18px]"
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
      className="w-[18px] h-[18px]"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 33 33"
    >
      <path d={svgPaths.p2806d900} fill="white" />
    </svg>
  );
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
          className="w-[44px] h-[44px] rounded-full bg-[#3c81e9] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-[#2d6fd9] transition-colors flex-shrink-0"
        >
          {recording.isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-[#d9d9d9] h-[6.646px] rounded-[10px] overflow-hidden">
          <div
            className="h-full rounded-[10px] bg-[#0f61db] transition-all"
            style={{ width: `${recording.progress}%` }}
          />
        </div>
        <span className="text-[12px] font-bold text-neutral-500 text-nowrap">
          {recording.duration}
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

export default function RecordingsList({
  student,
  storyTitle,
  onBack,
}: RecordingsListProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: 1,
      studentName: student?.name || "João Augusto",
      date: "20/10/2025",
      time: "10:30",
      duration: "3:47",
      progress: 0,
      isPlaying: false,
    },
    {
      id: 2,
      studentName: student?.name || "João Augusto",
      date: "20/10/2025",
      time: "17:30",
      duration: "1:45",
      progress: 56,
      isPlaying: false,
    },
  ]);

  const handleTogglePlay = (id: number) => {
    setRecordings((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? { ...rec, isPlaying: !rec.isPlaying }
          : { ...rec, isPlaying: false },
      ),
    );
  };

  if (!student) return null;

  if (showDetails) {
    return (
      <ReadingDetails
        storyTitle={storyTitle}
        studentName={student.name}
        onBack={() => setShowDetails(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-black/30 px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2"
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
              onViewMetrics={() => setShowDetails(true)}
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