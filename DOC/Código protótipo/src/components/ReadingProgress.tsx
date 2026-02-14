import { ChevronLeft, Mic, Play, Pause } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import svgPaths from '../imports/svg-ey2z87ufvs';
import { recordingApi, trailsApi } from '../services/api';
import type { Recording, TrailStory } from '../types';

interface Student {
  id: number | string;
  name: string;
  age?: number;
}

interface StoryWithRecordings {
  storyId: string;
  storyTitle: string;
  recordings: Recording[];
  lastRecordedAt: string;
  progress: number;
  progressColor: string;
}

interface ReadingProgressProps {
  student: Student | null;
  onBack: () => void;
  onViewRecordings: (story: { id: string; title: string }) => void;
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

function AudioPlayer({ recording, isPlaying, onTogglePlay }: { recording: Recording; isPlaying: boolean; onTogglePlay: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (recording.duration_seconds) {
      setDuration(recording.duration_seconds);
    }

    let objectUrl: string | null = null;

    const loadAudio = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const audioUrl = recordingApi.getAudioUrl(recording.id);

        const response = await fetch(audioUrl, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          console.error('[AudioPlayer] Error response:', response.status, errorText);
          throw new Error(`Erro ao carregar áudio: ${response.status} - ${errorText}`);
        }

        const blob = await response.blob();
        
        if (blob.size === 0) {
          throw new Error('Arquivo de áudio vazio');
        }

        objectUrl = URL.createObjectURL(blob);
        audio.src = objectUrl;
        setError(null);
      } catch (err) {
        console.error('[AudioPlayer] Error loading audio:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar áudio');
      }
    };

    loadAudio();

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    
    const handleError = () => {
      console.error('Audio error:', audio.error);
      setError('Erro ao reproduzir áudio');
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('error', handleError);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [recording.id, recording.duration_seconds]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error('Error playing audio:', err);
        setError('Erro ao reproduzir áudio');
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <button
        onClick={onTogglePlay}
        disabled={!!error}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#0071f3] hover:bg-[#0060d3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white ml-0.5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        {error ? (
          <p className="text-[10px] text-red-600">{error}</p>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 h-1 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0071f3] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-700 font-medium">
                {formatTime(currentTime)}
              </span>
              <span className="text-[11px] text-gray-500">
                / {formatTime(duration || recording.duration_seconds || 0)}
              </span>
            </div>
          </div>
        )}
      </div>
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
          }
        }}
      />
    </div>
  );
}

function StoryCard({ story, onViewRecordings }: { story: StoryWithRecordings; onViewRecordings: () => void }) {
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);

  const handleTogglePlay = (recordingId: string) => {
    if (playingRecordingId === recordingId) {
      setPlayingRecordingId(null);
    } else {
      setPlayingRecordingId(recordingId);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    });
  };

  return (
    <div className="bg-white rounded-[10px] p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="bg-[#a7d0ff] rounded-[10px] size-[42px] flex items-center justify-center flex-shrink-0">
          <MicIcon />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-black mb-1">{story.storyTitle}</h3>
          <p className="text-[12px] text-black mb-3">{formatDate(story.lastRecordedAt)}</p>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-3">
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

          {/* Audio Players */}
          {story.recordings.length > 0 && (
            <div className="space-y-2 mb-3">
              {story.recordings.slice(0, 2).map((recording) => (
                <AudioPlayer
                  key={recording.id}
                  recording={recording}
                  isPlaying={playingRecordingId === recording.id}
                  onTogglePlay={() => handleTogglePlay(recording.id)}
                />
              ))}
              {story.recordings.length > 2 && (
                <p className="text-[12px] text-gray-500 text-center">
                  +{story.recordings.length - 2} gravações
                </p>
              )}
            </div>
          )}
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
  const [stories, setStories] = useState<StoryWithRecordings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecordings = async () => {
      if (!student) return;

      setIsLoading(true);
      setError(null);

      try {
        const studentId = typeof student.id === 'string' ? student.id : student.id.toString();
        const [recordingsResponse, trailsResponse] = await Promise.all([
          recordingApi.list({ student_id: studentId }),
          trailsApi.list(),
        ]);

        const storyMap = new Map<string, TrailStory>();
        trailsResponse.trails.forEach((trail) => {
          trail.stories?.forEach((story) => {
            storyMap.set(story.id, story);
          });
        });

        const recordingsByStory = new Map<string, Recording[]>();
        
        recordingsResponse.recordings.forEach((recording) => {
          const storyId = recording.story_id;
          if (!recordingsByStory.has(storyId)) {
            recordingsByStory.set(storyId, []);
          }
          recordingsByStory.get(storyId)!.push(recording);
        });

        const storiesData: StoryWithRecordings[] = [];
        
        for (const [storyId, recordings] of recordingsByStory.entries()) {
          const sortedRecordings = recordings.sort(
            (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
          );
          
          const lastRecording = sortedRecordings[0];
          const totalRecordings = recordings.length;
          
          const story = storyMap.get(storyId);
          const storyTitle = story?.title || `História ${storyId.slice(0, 8)}...`;
          
          let progress = 0;
          let progressColor = '#dbaf0f';
          
          if (totalRecordings >= 3) {
            progress = 100;
            progressColor = '#4c8e4a';
          } else if (totalRecordings === 2) {
            progress = 75;
            progressColor = '#5e975c';
          } else {
            progress = 50;
            progressColor = '#dbaf0f';
          }

          storiesData.push({
            storyId,
            storyTitle,
            recordings: sortedRecordings,
            lastRecordedAt: lastRecording.recorded_at,
            progress,
            progressColor,
          });
        }

        storiesData.sort(
          (a, b) => new Date(b.lastRecordedAt).getTime() - new Date(a.lastRecordedAt).getTime()
        );

        setStories(storiesData);
      } catch (err) {
        console.error('Error loading recordings:', err);
        setError('Erro ao carregar gravações');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecordings();
  }, [student]);

  if (!student) return null;

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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0071f3]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : stories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma gravação encontrada
            </div>
          ) : (
            stories.map((story) => (
              <StoryCard
                key={story.storyId}
                story={story}
                onViewRecordings={() => onViewRecordings({ id: story.storyId, title: story.storyTitle })}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
