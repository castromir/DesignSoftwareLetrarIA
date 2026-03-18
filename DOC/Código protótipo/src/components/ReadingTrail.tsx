import { ChevronLeft, Plus } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import svgPaths from "../imports/svg-zrbw3wzc3o";
import ReadingStory from "./ReadingStory";
import CreateTrailModal from "./CreateTrailModal";
import { cn } from "./ui/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { useTrails } from "../hooks/useTrails";
import type { TrailStory, Trail } from "../types";

interface Student {
  id: number | string;
  name: string;
  age?: number;
}

interface ReadingTrailProps {
  student: Student | null;
  onBack: () => void;
  onViewRecordings?: (story: Story) => void;
}

interface Story {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  content: string;
  status: "completed" | "pending";
}

function BookIcon() {
  return (
    <div className="relative w-[31px] h-[31px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 31 31"
      >
        <circle cx="15.5" cy="15.5" fill="#1CA8F3" r="15.5" />
        <path d={svgPaths.p2705c880} fill="white" />
      </svg>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="9" fill="none" viewBox="0 0 16 9">
      <path d={svgPaths.p154e44f0} fill="black" />
    </svg>
  );
}

interface StoryCardProps {
  story: Story;
  position: "left" | "center" | "right";
  onStart?: () => void;
  onViewRecordings?: (story: Story) => void;
}

function StoryCard({
  story,
  position,
  onStart,
  onViewRecordings,
}: StoryCardProps) {
  const isCompleted = story.status === "completed";

  return (
    <div
      className="relative w-full max-w-[331px] mx-auto h-full flex flex-col"
    >
      {/* Card */}
      <div className="bg-white rounded-[10px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col h-full">
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-[19px] font-semibold text-black">
              {story.title}
            </h3>
            <BookIcon />
          </div>
          <p className="text-[14px] font-medium text-black mb-4 line-clamp-2 flex-1">
            {story.description}
          </p>
        </div>

        {/* Action buttons or status */}
        {isCompleted ? (
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={onStart}
              className="flex-1 bg-[#9dc3ff] rounded-[10px] h-[37px] flex items-center justify-center font-semibold text-[14px] text-[#141414] hover:bg-[#8db3ef] transition-colors"
            >
              Refazer
            </button>
            <button 
              onClick={() => onViewRecordings?.(story)}
              className="flex-1 bg-[#ffbdbb] rounded-[10px] h-[37px] flex items-center justify-center font-semibold text-[14px] text-black hover:bg-[#ffadab] transition-colors">
              Ver gravações
            </button>
          </div>
        ) : (
          <button
            onClick={onStart}
            className="w-full bg-[#9fe9f5] h-[37px] flex items-center justify-center font-semibold text-[15px] text-black hover:bg-[#8fd9e5] transition-colors"
          >
            Iniciar
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReadingTrail({
  student,
  onBack,
  onViewRecordings,
}: ReadingTrailProps) {
  const [selectedStory, setSelectedStory] =
    useState<Story | null>(null);
  const [showCreateTrail, setShowCreateTrail] = useState(false);
  const [filterRead, setFilterRead] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const [completedStoryIds, setCompletedStoryIds] = useState<Set<string>>(new Set());
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  const { trails, isLoading, error, fetchTrails } = useTrails();
  const [selectedTrailData, setSelectedTrailData] = useState<Trail | null>(null);

  useEffect(() => {
    const loadTrails = async () => {
      try {
        // Reset fallback flag when student changes
        setHasTriedFallback(false);

        // Fetch all trails available to the professional (own + default)
        const params: any = {};
        if (student?.age) {
          params.age_range_min = student.age;
          params.age_range_max = student.age;
        }

        await fetchTrails(params);
      } catch (error) {
        console.error("Error loading trails:", error);
      }
    };
    
    loadTrails();
  }, [student?.age, fetchTrails]);

  useEffect(() => {
    if (!isLoading && trails.length === 0 && !error && !hasTriedFallback) {
      setHasTriedFallback(true);
      fetchTrails();
    }
  }, [isLoading, trails.length, error, hasTriedFallback, fetchTrails]);

  useEffect(() => {
    if (trails.length > 0) {
      if (!selectedTrailId) {
        const defaultTrail = trails.find(t => t.is_default) || trails[0];
        if (defaultTrail) {
          setSelectedTrailId(defaultTrail.id);
          setSelectedTrailData(defaultTrail);
        }
      } else {
        const trail = trails.find(t => t.id === selectedTrailId);
        if (trail) {
          if (!selectedTrailData || 
              selectedTrailData.id !== trail.id ||
              selectedTrailData.stories.length !== trail.stories.length) {
            setSelectedTrailData(trail);
          }
        }
      }
    }
  }, [trails, selectedTrailId, selectedTrailData]);

  const stories: Story[] = useMemo(() => {
    if (!selectedTrailData) {
      return [];
    }
    
    if (!selectedTrailData.stories || selectedTrailData.stories.length === 0) {
      return [];
    }
    
    return selectedTrailData.stories
      .sort((a, b) => a.order_position - b.order_position)
      .map((story: TrailStory) => {
        const description = story.content.length > 100 
          ? story.content.substring(0, 100) + "..." 
          : story.content;
        
        const lettersFocus = story.letters_focus && story.letters_focus.length > 0
          ? story.letters_focus.join(", ")
          : "";
        
        const subtitle = lettersFocus 
          ? `Letras trabalhadas: ${lettersFocus}`
          : story.subtitle || "";

        return {
          id: story.id,
          title: story.title,
          description,
          subtitle,
          content: story.content,
          status: completedStoryIds.has(story.id) ? "completed" : "pending",
        };
      });
  }, [selectedTrailData, completedStoryIds]);

  if (!student) return null;

  const handleStartStory = (story: Story) => {
    setSelectedStory(story);
  };

  const handleBackFromStory = () => {
    setSelectedStory(null);
  };

  // Sort stories based on filters
  const sortedStories = [...stories].sort((a, b) => {
    // If both filters are active or none are active, keep original order
    if ((filterRead && filterUnread) || (!filterRead && !filterUnread)) {
      return 0;
    }

    // If only "read" filter is active
    if (filterRead && !filterUnread) {
      if (a.status === "completed" && b.status === "pending") return -1;
      if (a.status === "pending" && b.status === "completed") return 1;
      return 0;
    }

    // If only "unread" filter is active
    if (filterUnread && !filterRead) {
      if (a.status === "pending" && b.status === "completed") return -1;
      if (a.status === "completed" && b.status === "pending") return 1;
      return 0;
    }

    return 0;
  });

  // Show Create Trail
  if (showCreateTrail) {
    return (
      <CreateTrailModal
        student={student}
        onBack={() => setShowCreateTrail(false)}
        onCreated={(newTrailId) => {
          setShowCreateTrail(false);
          if (newTrailId) {
            setSelectedTrailId(newTrailId);
          }
          fetchTrails();
        }}
      />
    );
  }

  // Show Reading Story
  if (selectedStory) {
    return (
      <ReadingStory
        student={student}
        storyTitle={selectedStory.title}
        storySubtitle={selectedStory.subtitle}
        storyContent={selectedStory.content}
        storyId={selectedStory.id}
        onBack={handleBackFromStory}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-black/30 px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2 cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-[19px] font-semibold text-black flex-1">
          Trilha de leitura - {student.name}
        </h1>
        <button
          onClick={() => setShowCreateTrail(true)}
          className="flex items-center gap-1 text-[13px] font-semibold text-[#1CA8F3] hover:text-[#0e90d9] transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" />
          Nova trilha
        </button>
      </div>

      {/* Trail Selector */}
      {trails.length > 1 && (
        <div className="border-b border-black/10 bg-white px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
          {trails.map((trail) => (
            <button
              key={trail.id}
              onClick={() => {
                setSelectedTrailId(trail.id);
                setSelectedTrailData(trail);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors whitespace-nowrap ${
                selectedTrailId === trail.id
                  ? "bg-[#1CA8F3] text-white"
                  : "bg-[#f0f0f0] text-black/70 hover:bg-[#e0e0e0]"
              }`}
            >
              {trail.title}
            </button>
          ))}
        </div>
      )}

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Section Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[20px] font-semibold text-black">
              Histórias
            </h2>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 text-[14px] font-medium text-black hover:bg-gray-200 rounded-lg px-3 py-1 transition-colors">
                  Filtros
                  <FilterIcon />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-4">
                  <h3 className="font-semibold text-black">Filtrar por:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-read"
                        checked={filterRead}
                        onCheckedChange={(checked: boolean | string) => {
                          setFilterRead(!!checked);
                          if (checked) setFilterUnread(false);
                        }}
                      />
                      <label
                        htmlFor="filter-read"
                        className="text-[14px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Textos já lidos
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-unread"
                        checked={filterUnread}
                        onCheckedChange={(checked) => {
                          setFilterUnread(checked as boolean);
                          if (checked) setFilterRead(false);
                        }}
                      />
                      <label
                        htmlFor="filter-unread"
                        className="text-[14px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Textos não lidos
                      </label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="h-px bg-black/30" />
        </div>

        {/* Stories Timeline */}
        {isLoading ? (
          <div className="px-4 flex items-center justify-center py-12">
            <p className="text-[16px] text-gray-600">Carregando trilha...</p>
          </div>
        ) : error ? (
          <div className="px-4 flex items-center justify-center py-12">
            <p className="text-[16px] text-red-600">Erro ao carregar trilha: {error}</p>
          </div>
        ) : !selectedTrailData ? (
          <div className="px-4 flex items-center justify-center py-12">
            <p className="text-[16px] text-gray-600">Nenhuma trilha disponível</p>
          </div>
        ) : sortedStories.length === 0 ? (
          <div className="px-4 flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-[16px] text-gray-600">Nenhuma história disponível nesta trilha</p>
              {selectedTrailData && (
                <p className="text-[14px] text-gray-500 mt-2">
                  Trilha: {selectedTrailData.title} ({selectedTrailData.stories?.length || 0} histórias)
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-x-[9px] gap-y-10 max-w-6xl mx-auto">
            {sortedStories.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                position={
                  index === 1
                    ? "center"
                    : index === 0
                      ? "left"
                      : "right"
                }
                onStart={() => handleStartStory(story)}
                onViewRecordings={onViewRecordings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}