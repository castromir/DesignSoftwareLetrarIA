import { ChevronLeft, Mic, MoreVertical, Printer } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import svgPaths from '../imports/svg-7k5czerodv';
import { img } from '../imports/svg-a81u4';
import { toast } from 'sonner@2.0.3';
import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';
import { transcriptionApi, recordingApi, aiInsightsApi } from '../services/api';
import type { Recording } from '../types';

interface Student {
  id: number | string;
  name: string;
  age?: number;
}

interface ReadingStoryProps {
  student: Student | null;
  storyTitle: string;
  storySubtitle: string;
  storyContent: string;
  storyId?: string;
  onBack: () => void;
}

export default function ReadingStory({ 
  student, 
  storyTitle, 
  storySubtitle, 
  storyContent,
  storyId,
  onBack 
}: ReadingStoryProps) {
  const [eyeFatigueMode, setEyeFatigueMode] = useState(false);
  const [increasedSpacing, setIncreasedSpacing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [transcriptions, setTranscriptions] = useState<Recording[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<number | null>(null);
  const recordingDurationRef = useRef(0);

  useEffect(() => {
    recordingDurationRef.current = recordingDuration;
  }, [recordingDuration]);

  const handlePrint = () => {
    window.print();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Detectar o melhor formato suportado
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // Usar o padrão do navegador
          }
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        if (audioChunksRef.current.length > 0) {
          const blobType = mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
          const durationSeconds = recordingDurationRef.current;
          await processRecording(audioBlob, blobType, durationSeconds);
        }
      };
      
      mediaRecorder.start(1000); // Coletar dados a cada segundo
      setIsRecording(true);
      setRecordingDuration(0);
      
      durationIntervalRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('Gravação iniciada!');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Erro ao iniciar gravação', {
        description: 'Não foi possível acessar o microfone. Verifique as permissões.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current !== null) {
        window.clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      
      toast.info('Processando gravação...');
    }
  };

  const loadRecordings = async () => {
    if (!student || !storyId) return;
    
    setIsLoadingRecordings(true);
    try {
      const studentId = typeof student.id === 'string' ? student.id : student.id.toString();
      const response = await recordingApi.list({
        student_id: studentId,
        story_id: storyId,
      });
      
      setTranscriptions(response.recordings.sort((a, b) => 
        new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
      ));
    } catch (error) {
      console.error('Error loading recordings:', error);
    } finally {
      setIsLoadingRecordings(false);
    }
  };

  useEffect(() => {
    loadRecordings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id, storyId]);

  const getAudioDuration = async (audioBlob: Blob) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) {
        return null;
      }
      const audioContext = new AudioCtor();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      await audioContext.close();
      return audioBuffer.duration;
    } catch (error) {
      console.error('Erro ao obter duração do áudio:', error);
      return null;
    }
  };

  const processRecording = async (audioBlob: Blob, mimeType: string, durationSeconds: number) => {
    setIsTranscribing(true);
    
    try {
      // Determinar extensão baseada no mimeType
      let extension = '.webm';
      if (mimeType.includes('mp4')) {
        extension = '.m4a';
      } else if (mimeType.includes('ogg')) {
        extension = '.ogg';
      } else if (mimeType.includes('wav')) {
        extension = '.wav';
      }
      
      const audioFile = new File([audioBlob], `recording${extension}`, { type: mimeType });
      
      const response = await transcriptionApi.transcribe(audioFile, 'pt');
      
      if (student && storyId) {
        try {
          const studentId = typeof student.id === 'string' ? student.id : student.id.toString();
          const durationFromAudio = await getAudioDuration(audioBlob);
          const newRecording = await recordingApi.create(
            {
              student_id: studentId,
              story_id: storyId,
              duration_seconds: durationFromAudio ?? durationSeconds,
              transcription: response.transcript,
            },
            audioFile
          );
          
          setTranscriptions(prev => [newRecording, ...prev]);

          toast.success('Gravação salva!', {
            description: 'A gravação e transcrição foram salvas com sucesso.',
          });

          // Polling para insight de IA (background task no backend)
          const insightToastId = toast.loading('Gerando insight pedagógico com IA...');
          const savedAt = Date.now();
          let found = false;
          for (let attempt = 0; attempt < 10; attempt++) {
            await new Promise(r => setTimeout(r, 3000));
            try {
              const { insights } = await aiInsightsApi.list({ student_id: studentId, limit: 5 });
              const newInsight = insights.find(
                i => new Date(i.created_at).getTime() >= savedAt - 2000
              );
              if (newInsight) {
                toast.success('Insight de IA gerado!', {
                  id: insightToastId,
                  description: newInsight.title,
                });
                found = true;
                break;
              }
            } catch { /* silencia erros de polling */ }
          }
          if (!found) toast.dismiss(insightToastId);
        } catch (error) {
          console.error('Error saving recording:', error);
          toast.error('Erro ao salvar gravação', {
            description: 'A transcrição foi gerada, mas houve erro ao salvar a gravação.',
          });
        }
      } else {
        toast.success('Transcrição concluída!', {
          description: 'A transcrição foi gerada com sucesso.',
        });
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Erro ao transcrever áudio', {
        description: 'Não foi possível processar a gravação. Tente novamente.',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleStartRecording = () => {
    if (isRecording) {
      setShowConfirmDialog(true);
    } else {
      startRecording();
    }
  };

  const handleKeepRecording = () => {
    stopRecording();
    setShowConfirmDialog(false);
  };

  const handleDeleteRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current !== null) {
        window.clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      audioChunksRef.current = [];
      setRecordingDuration(0);
    }
    setShowConfirmDialog(false);
    toast.info('Gravação descartada');
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (durationIntervalRef.current !== null) {
        window.clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col print:bg-white">
      {/* Header */}
      <div className="border-b border-black/30 px-4 py-2.5 flex items-center gap-3 flex-shrink-0 print:hidden">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2 cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-[18px] font-semibold text-black flex-1">
          {storyTitle}
        </h1>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            <MoreVertical className="h-5 w-5 text-black" />
          </button>

          {/* Options Menu */}
          {showOptions && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowOptions(false)}
              />
              <div className="absolute right-0 top-12 bg-white rounded-[10px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] w-[261px] p-4 z-20">
                <div className="space-y-4">
                  {/* Eye Fatigue Option */}
                  <label className="flex items-center gap-4 cursor-pointer">
                    <button
                      onClick={() => setEyeFatigueMode(!eyeFatigueMode)}
                      className={`flex-shrink-0 block cursor-pointer overflow-visible rounded-[6px] size-[24px] transition-colors ${
                        eyeFatigueMode ? 'bg-[#006ffd]' : 'bg-white'
                      }`}
                    >
                      <div 
                        className={`absolute border-[1.5px] border-solid inset-0 pointer-events-none rounded-[6px] ${
                          eyeFatigueMode ? 'border-[#006ffd]' : 'border-gray-300'
                        }`} 
                      />
                      {eyeFatigueMode && (
                        <div 
                          className="absolute left-1/2 overflow-clip size-[12px] top-1/2 translate-x-[-50%] translate-y-[-50%]"
                        >
                          <div 
                            className="absolute bg-white inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_4.088px] mask-size-[24px_17px]" 
                            style={{ maskImage: `url('${img}')` }} 
                          />
                        </div>
                      )}
                    </button>
                    <span className="text-[16px] font-medium text-black">Fadiga ocular</span>
                  </label>

                  {/* Increase Spacing Option */}
                  <label className="flex items-center gap-4 cursor-pointer">
                    <button
                      onClick={() => setIncreasedSpacing(!increasedSpacing)}
                      className={`flex-shrink-0 block cursor-pointer overflow-visible rounded-[6px] size-[24px] transition-colors ${
                        increasedSpacing ? 'bg-[#006ffd]' : 'bg-white'
                      }`}
                    >
                      <div 
                        className={`absolute border-[1.5px] border-solid inset-0 pointer-events-none rounded-[6px] ${
                          increasedSpacing ? 'border-[#006ffd]' : 'border-gray-300'
                        }`} 
                      />
                      {increasedSpacing && (
                        <div 
                          className="absolute left-1/2 overflow-clip size-[12px] top-1/2 translate-x-[-50%] translate-y-[-50%]"
                        >
                          <div 
                            className="absolute bg-white inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_4.088px] mask-size-[24px_17px]" 
                            style={{ maskImage: `url('${img}')` }} 
                          />
                        </div>
                      )}
                    </button>
                    <span className="text-[16px] font-medium text-black">Aumentar espaçamento</span>
                  </label>

                  {/* Divider */}
                  <div className="h-px bg-black/20" />

                  {/* Print Option */}
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-4 w-full hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors cursor-pointer"
                  >
                    <Printer className="h-6 w-6 text-black" />
                    <span className="text-[16px] font-medium text-black">Imprimir texto</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Subtitle with letters */}
      <div className="px-4 pt-2 pb-3 print:hidden">
        <p className="text-[14px] font-semibold text-[#003b80]">
          {storySubtitle}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 print:pb-0">
        <div className="bg-white rounded-[10px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.25)] p-5 print:shadow-none mb-4">
          <div 
            className={`text-[16px] font-medium text-black ${
              eyeFatigueMode ? 'bg-[#f5f0e8] text-[#2b2b2b]' : ''
            } ${
              increasedSpacing ? 'leading-[2.5]' : 'leading-[1.875]'
            }`}
            style={eyeFatigueMode ? { 
              filter: 'contrast(0.9)',
              fontFamily: 'Inter, sans-serif'
            } : {}}
          >
            {storyContent.split('\n').map((paragraph, idx) => (
              paragraph.trim() && <p key={idx} className="mb-4 last:mb-0">{paragraph.trim()}</p>
            ))}
          </div>
        </div>

        {/* Transcriptions Box */}
        {(transcriptions.length > 0 || isTranscribing) && (
          <div className="bg-[#f0f7ff] rounded-[10px] border border-[#0071f3]/20 p-5 print:hidden">
            <h3 className="text-[16px] font-semibold text-[#0071f3] mb-4">
              Transcrições da Leitura
            </h3>
            
            {isTranscribing && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#0071f3]/20">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0071f3]"></div>
                <p className="text-[14px] text-gray-600">Processando áudio e gerando transcrição...</p>
              </div>
            )}
            
            {isLoadingRecordings ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0071f3]"></div>
                <p className="text-[14px] text-gray-600">Carregando transcrições...</p>
              </div>
            ) : transcriptions.length > 0 ? (
              <div className="space-y-4">
                {transcriptions.map((recording, idx) => {
                  const date = new Date(recording.recorded_at);
                  const formattedDate = date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  
                  return (
                    <div key={recording.id} className="bg-white rounded-[8px] p-4 border border-[#0071f3]/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-medium text-gray-600">
                          {formattedDate}
                        </span>
                        <span className="text-[12px] text-gray-500">
                          {Math.floor(recording.duration_seconds / 60)}:{(recording.duration_seconds % 60).toFixed(0).padStart(2, '0')}
                        </span>
                      </div>
                      {recording.transcription && (
                        <div className="text-[14px] text-gray-800 leading-relaxed">
                          {recording.transcription.split('\n').map((paragraph, pIdx) => (
                            paragraph.trim() && <p key={pIdx} className="mb-2 last:mb-0">{paragraph.trim()}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#2A7AF2]/60 bg-[#f0f0f0] flex-shrink-0 print:hidden">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-4">
            {isRecording && (
              <div className="flex items-center gap-2 text-[14px] font-medium text-gray-700">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{formatDuration(recordingDuration)}</span>
              </div>
            )}
            <button
              onClick={handleStartRecording}
              disabled={isTranscribing}
              className={`rounded-[10px] h-[50px] px-10 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-[#0071f3] hover:bg-[#0060d3]'
              }`}
            >
              <Mic className="h-6 w-6 text-white" />
              <span className="text-[13px] font-semibold text-white">
                {isTranscribing 
                  ? 'Processando...' 
                  : isRecording 
                    ? 'Parar gravação' 
                    : 'Iniciar gravação'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <DialogPrimitive.Root open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed top-[50%] left-[50%] z-[60] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[10px] shadow-lg w-[calc(100%-2rem)] max-w-[340px] p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state-closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            aria-describedby={undefined}
          >
            <DialogPrimitive.Title className="text-[19px] font-semibold text-black mb-3 text-center">
              Deseja manter a gravação?
            </DialogPrimitive.Title>
            <p className="text-[14px] text-black/70 mb-6 text-center">
              Você pode salvar a gravação para revisar depois ou descartá-la.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleKeepRecording}
                className="w-full bg-[#0071f3] hover:bg-[#0060d3] rounded-[10px] h-[45px] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-[15px] font-semibold text-white">Manter gravação</span>
              </button>
              <button
                onClick={handleDeleteRecording}
                className="w-full bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-[10px] h-[45px] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-[15px] font-semibold text-black">Descartar</span>
              </button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Print styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 20px;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:pb-0 {
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
