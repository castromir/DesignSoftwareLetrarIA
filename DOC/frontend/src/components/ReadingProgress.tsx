import { ChevronLeft, Mic } from 'lucide-react';
import svgPaths from '../imports/svg-ey2z87ufvs';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface Story {
  id: number;
  title: string;
  date: string;
  progress: number;
  progressColor: string;
}

interface ReadingProgressProps {
  student: Student | null;
  onBack: () => void;
  onViewRecordings: (story: Story) => void;
}

function MicIcon() {
  return (
    <svg className="w-[26px] h-[26px]" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 27 27">
      <path d={svgPaths.p33cabd80} fill="#1D7EEB" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <div className="w-[20.118px] h-[19px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 19">
        <path d={svgPaths.p2f1f4b00} fill="#616161" />
      </svg>
    </div>
  );
}

function StoryCard({ story, onViewRecordings }: { story: Story; onViewRecordings: () => void }) {
  return (
    <div className="bg-white rounded-[10px] p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="bg-[#a7d0ff] rounded-[10px] size-[42px] flex items-center justify-center flex-shrink-0">
          <MicIcon />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-black mb-1">{story.title}</h3>
          <p className="text-[12px] text-black mb-3">{story.date}</p>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 bg-[#d9d9d9] h-[8px] rounded-[10px] overflow-hidden">
              <div
                className="h-full rounded-[10px] transition-all"
                style={{
                  width: `${story.progress}%`,
                  backgroundColor: story.progressColor,
                }}
              />
            </div>
            <span className="text-[12px] font-bold text-nowrap" style={{ color: story.progressColor }}>
              {story.progress}%
            </span>
          </div>
        </div>

        {/* Ver gravações button */}
        <button
          onClick={onViewRecordings}
          className="flex items-center gap-2 text-[14px] font-light text-black hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors flex-shrink-0"
        >
          <span>Ver gravações</span>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

export default function ReadingProgress({ student, onBack, onViewRecordings }: ReadingProgressProps) {
  if (!student) return null;

  const stories: Story[] = [
    {
      id: 1,
      title: 'O rato roeu...',
      date: '15 de setembro',
      progress: 57,
      progressColor: '#dbaf0f',
    },
    {
      id: 2,
      title: 'A tartaruga e o...',
      date: '14 de setembro',
      progress: 82,
      progressColor: '#5e975c',
    },
    {
      id: 3,
      title: 'O rio da cidade',
      date: '13 de setembro',
      progress: 89,
      progressColor: '#4c8e4a',
    },
  ];

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-black/30 px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2 z-[60]"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-[19px] font-semibold text-black flex-1 text-center -ml-12">
          Progresso de leitura
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Section Title */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-[20px] font-semibold text-black">Histórias lidas recentemente</h2>
        </div>

        {/* Stories List */}
        <div className="px-4 space-y-3 max-w-md mx-auto">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} onViewRecordings={() => onViewRecordings(story)} />
          ))}
        </div>
      </div>
    </div>
  );
}
