import { ChevronLeft, Mic, MoreVertical, Printer } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import svgPaths from "../imports/svg-7k5czerodv";
import { img } from "../imports/svg-a81u4";
import { toast } from "sonner";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { Student } from "../types";
import { transcriptionApi, recordingsApi } from "../services/api";

interface ReadingStoryProps {
  student: Student | null;
  storyId: string;
  storyTitle: string;
  storySubtitle: string;
  storyContent: string;
  onBack: () => void;
}

export default function ReadingStory({
  student,
  storyId,
  storyTitle,
  storySubtitle,
  storyContent,
  onBack,
}: ReadingStoryProps) {
  const [eyeFatigueMode, setEyeFatigueMode] = useState(false);
  const [increasedSpacing, setIncreasedSpacing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);

  // Estado para transcrição em tempo real
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [wordStatuses, setWordStatuses] = useState<
    Record<number, "correct" | "incorrect" | "pending">
  >({});

  // Normalizar texto para comparação
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^\w\s]/g, "") // Remove pontuação
      .trim();
  };

  // Dividir conteúdo em palavras
  const contentWords = storyContent
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  // Comparar transcrição com texto original
  useEffect(() => {
    if (!isRecording) return;

    const spokenWords = normalizeText(finalTranscript + " " + interimTranscript)
      .split(/\s+/)
      .filter((w) => w.length > 0);

    const newStatuses: Record<number, "correct" | "incorrect" | "pending"> = {};

    contentWords.forEach((word, index) => {
      const normalizedWord = normalizeText(word);

      if (index < spokenWords.length) {
        const spokenWord = spokenWords[index];

        // Verificar se é igual ou similar (Levenshtein simplificado)
        if (spokenWord === normalizedWord) {
          newStatuses[index] = "correct";
        } else if (isSimilar(spokenWord, normalizedWord)) {
          newStatuses[index] = "correct"; // Aceitar palavras similares
        } else {
          newStatuses[index] = "incorrect";
        }
      } else {
        newStatuses[index] = "pending";
      }
    });

    setWordStatuses(newStatuses);
  }, [finalTranscript, interimTranscript, isRecording]);

  // Função para verificar similaridade (Levenshtein simplificado)
  const isSimilar = (a: string, b: string): boolean => {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 2) return false;

    // Se uma palavra contém a outra (ex: "casa" vs "casas")
    if (a.includes(b) || b.includes(a)) return true;

    // Calcular distância de edição simples
    let matches = 0;
    const minLen = Math.min(a.length, b.length);
    for (let i = 0; i < minLen; i++) {
      if (a[i] === b[i]) matches++;
    }
    return matches / minLen > 0.7; // 70% de similaridade
  };

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track: any) => track.stop());
      }
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleStartRecording = async () => {
    if (isRecording) {
      // Se está gravando, parar e mostrar popup de confirmação
      stopRecording();
      stopSpeechRecognition();
      setShowConfirmDialog(true);
    } else {
      // Validar dados essenciais antes de iniciar
      if (!student || !student.id) {
        toast.error("Erro: Informações do estudante não disponíveis");
        return;
      }

      if (!storyId) {
        toast.error("Erro: ID da história não disponível");
        return;
      }

      // Iniciar gravação
      try {
        // Verificar se o navegador suporta getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          toast.error(
            "Seu navegador não suporta gravação de áudio. Tente usar Chrome ou Edge.",
          );
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          },
        });

        // Verificar se MediaRecorder é suportado
        if (!window.MediaRecorder) {
          toast.error("Gravação de áudio não suportada neste navegador");
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        // Tentar usar webm com opus, fallback para outros formatos
        let mimeType = "audio/webm;codecs=opus";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/webm";
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            console.warn("WebM não suportado, usando formato padrão");
            mimeType = "";
          }
        }

        const options = mimeType ? { mimeType } : {};
        const mediaRecorder = new MediaRecorder(stream, options);

        audioChunksRef.current = [];
        recordingStartTimeRef.current = Date.now();

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onerror = (event: any) => {
          console.error("Erro no MediaRecorder:", event);
          toast.error("Erro durante a gravação");
          stopRecording();
          stopSpeechRecognition();
          setIsRecording(false);
        };

        mediaRecorder.start(1000); // Coletar dados a cada 1 segundo
        mediaRecorderRef.current = mediaRecorder;

        // Iniciar reconhecimento de voz em tempo real
        startSpeechRecognition();

        // Resetar estados
        setFinalTranscript("");
        setInterimTranscript("");
        setWordStatuses({});

        setIsRecording(true);
        toast.success("Gravação iniciada! Comece a ler o texto.");
      } catch (error: any) {
        console.error("Erro ao iniciar gravação:", error);

        let errorMessage = "Erro ao acessar o microfone";
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          errorMessage =
            "Permissão de microfone negada. Ative nas configurações do navegador.";
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          errorMessage =
            "Nenhum microfone encontrado. Conecte um microfone e tente novamente.";
        } else if (
          error.name === "NotReadableError" ||
          error.name === "TrackStartError"
        ) {
          errorMessage = "Microfone já está em uso por outro aplicativo.";
        } else if (error.name === "OverconstrainedError") {
          errorMessage =
            "Configurações de áudio não suportadas pelo seu microfone.";
        }

        toast.error(errorMessage);
      }
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn(
        "[ReadingStory] Web Speech API não suportada neste navegador. Usando apenas Whisper.",
      );
      toast.info(
        "Reconhecimento em tempo real não disponível. A transcrição será feita ao final.",
        { duration: 4000 },
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "pt-BR";
      recognition.maxAlternatives = 1;

      // Contador de erros consecutivos
      let consecutiveErrors = 0;
      const maxConsecutiveErrors = 3;

      recognition.onstart = () => {
        console.log("[ReadingStory] Reconhecimento de voz iniciado");
        consecutiveErrors = 0;
      };

      recognition.onresult = (event: any) => {
        try {
          let interim = "";
          let final = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript + " ";
            } else {
              interim += transcript;
            }
          }

          if (final) {
            setFinalTranscript((prev) => prev + final);
            console.log(`[ReadingStory] Texto reconhecido: "${final.trim()}"`);
          }
          setInterimTranscript(interim);

          // Reset contador de erros em sucesso
          consecutiveErrors = 0;
        } catch (error) {
          console.error("[ReadingStory] Erro ao processar resultado:", error);
        }
      };

      recognition.onerror = (event: any) => {
        console.error(
          `[ReadingStory] Erro no reconhecimento de voz: ${event.error}`,
        );

        // Erros que podem ser ignorados
        const ignorableErrors = ["no-speech", "audio-capture", "aborted"];

        if (ignorableErrors.includes(event.error)) {
          console.log(
            `[ReadingStory] Erro ignorável: ${event.error}, continuando...`,
          );
          return;
        }

        // Erros críticos
        const criticalErrors = ["not-allowed", "service-not-allowed"];
        if (criticalErrors.includes(event.error)) {
          console.error(
            `[ReadingStory] Erro crítico de reconhecimento: ${event.error}`,
          );
          toast.warning(
            "Reconhecimento de voz bloqueado. Usando apenas Whisper ao final.",
            { duration: 3000 },
          );
          stopSpeechRecognition();
          return;
        }

        // Incrementar contador de erros
        consecutiveErrors++;
        if (consecutiveErrors >= maxConsecutiveErrors) {
          console.error(
            `[ReadingStory] Muitos erros consecutivos (${consecutiveErrors}), desabilitando reconhecimento em tempo real`,
          );
          toast.info(
            "Reconhecimento em tempo real com problemas. Usando Whisper ao final.",
            { duration: 3000 },
          );
          stopSpeechRecognition();
        }
      };

      recognition.onend = () => {
        console.log("[ReadingStory] Reconhecimento de voz encerrado");

        // Se ainda está gravando e não houve muitos erros, reiniciar
        // Usar ref para verificar estado atualizado e evitar race condition
        if (
          recognitionRef.current &&
          consecutiveErrors < maxConsecutiveErrors
        ) {
          try {
            console.log(
              "[ReadingStory] Reiniciando reconhecimento automaticamente",
            );
            setTimeout(() => {
              // Verificar novamente se ainda temos a referência (não foi limpa)
              if (recognitionRef.current) {
                try {
                  recognition.start();
                } catch (startError) {
                  console.error(
                    "[ReadingStory] Erro ao reiniciar reconhecimento:",
                    startError,
                  );
                  consecutiveErrors++;
                }
              }
            }, 100);
          } catch (e) {
            console.error(
              "[ReadingStory] Erro ao configurar reinício do reconhecimento:",
              e,
            );
            consecutiveErrors++;
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      console.log(
        "[ReadingStory] Reconhecimento de voz configurado e iniciado",
      );
    } catch (error) {
      console.error(
        "[ReadingStory] Erro ao inicializar reconhecimento:",
        error,
      );
      toast.info(
        "Não foi possível iniciar reconhecimento em tempo real. Usando Whisper ao final.",
        { duration: 3000 },
      );
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        // Remover event listeners antes de parar para evitar reinício automático
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
        recognitionRef.current = null;
        console.log("[ReadingStory] Reconhecimento de voz parado e limpo");
      } catch (error) {
        console.error("[ReadingStory] Erro ao parar reconhecimento:", error);
        // Garantir que a referência seja limpa mesmo em caso de erro
        recognitionRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
        // Limpar stream e tracks
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream
            .getTracks()
            .forEach((track) => track.stop());
        }
        // Limpar event listeners
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.onerror = null;
        console.log("[ReadingStory] Gravação parada e recursos liberados");
      } catch (error) {
        console.error("[ReadingStory] Erro ao parar gravação:", error);
      }
    }
  };

  const handleKeepRecording = async () => {
    // Validações essenciais
    if (!student || !student.id) {
      toast.error("Erro: Informações do estudante não disponíveis");
      setShowConfirmDialog(false);
      setIsRecording(false);
      return;
    }

    if (!storyId) {
      toast.error("Erro: ID da história não disponível");
      setShowConfirmDialog(false);
      setIsRecording(false);
      return;
    }

    if (audioChunksRef.current.length === 0) {
      toast.error("Erro: Nenhum áudio foi gravado");
      setShowConfirmDialog(false);
      setIsRecording(false);
      return;
    }

    setIsSaving(true);

    try {
      // Criar blob do áudio
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      // Validar tamanho mínimo do áudio (1KB)
      if (audioBlob.size < 1024) {
        toast.error("Gravação muito curta ou vazia. Tente gravar novamente.");
        setShowConfirmDialog(false);
        setIsRecording(false);
        return;
      }

      // Validar tamanho máximo (50MB)
      const maxSize = 50 * 1024 * 1024;
      if (audioBlob.size > maxSize) {
        toast.error("Gravação muito longa. Tamanho máximo: 50MB");
        setShowConfirmDialog(false);
        setIsRecording(false);
        return;
      }

      console.log(
        `[ReadingStory] Áudio gravado: ${(audioBlob.size / 1024).toFixed(2)}KB`,
      );

      const audioFile = new File([audioBlob], `recording_${Date.now()}.webm`, {
        type: "audio/webm",
      });

      // Calcular duração em segundos
      const durationSeconds =
        (Date.now() - recordingStartTimeRef.current) / 1000;

      // Validar duração mínima (pelo menos 1 segundo)
      if (durationSeconds < 1) {
        toast.error("Gravação muito curta. Grave por pelo menos 1 segundo.");
        setShowConfirmDialog(false);
        setIsRecording(false);
        return;
      }

      console.log(
        `[ReadingStory] Duração da gravação: ${durationSeconds.toFixed(2)}s`,
      );

      // Usar a transcrição em tempo real se disponível, senão usar API
      let transcriptText = finalTranscript.trim();

      if (!transcriptText || transcriptText.length < 5) {
        // Se transcrição em tempo real falhou ou é muito curta, usar API Whisper
        try {
          toast.info("Transcrevendo áudio com Whisper...", { duration: 3000 });

          // Timeout de 60 segundos para transcrição
          const transcriptionPromise = transcriptionApi.transcribe(
            audioFile,
            "pt",
            true, // save_to_disk: salvar arquivo .txt
          );
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Timeout na transcrição")),
              60000,
            ),
          );

          const transcriptionResult = (await Promise.race([
            transcriptionPromise,
            timeoutPromise,
          ])) as any;

          transcriptText = (transcriptionResult.transcript || "").trim();

          // Logar se arquivo foi salvo
          if (transcriptionResult.saved_file_path) {
            console.log(
              `[ReadingStory] Transcrição salva em: ${transcriptionResult.saved_file_path}`,
            );
          }

          if (!transcriptText || transcriptText.trim().length === 0) {
            console.warn("[ReadingStory] Transcrição resultou em texto vazio");
            toast.warning(
              "Não foi possível transcrever o áudio. A gravação será salva sem transcrição.",
            );
            transcriptText = "";
          }
        } catch (transcriptionError: any) {
          console.error("Erro ao transcrever:", transcriptionError);

          if (transcriptionError.message === "Timeout na transcrição") {
            toast.warning(
              "Transcrição demorou muito. Salvando gravação sem transcrição.",
              { duration: 4000 },
            );
          } else {
            toast.warning(
              "Erro ao transcrever áudio. Salvando gravação sem transcrição.",
              { duration: 4000 },
            );
          }

          // Manter o texto vazio para salvar sem transcrição
          transcriptText = "";
        }
      } else {
        console.log(
          `[ReadingStory] Usando transcrição em tempo real: ${transcriptText.length} caracteres`,
        );
      }

      // Salvar gravação com transcrição
      toast.info("Salvando gravação...", { duration: 2000 });

      await recordingsApi.create({
        student_id: student.id,
        story_id: storyId,
        duration_seconds: Math.round(durationSeconds * 100) / 100, // Arredondar para 2 casas decimais
        transcription: transcriptText || undefined,
        audio: audioFile,
      });

      setIsRecording(false);
      setShowConfirmDialog(false);
      toast.success("Gravação salva com sucesso!", {
        description:
          "A gravação e transcrição foram salvas e estão disponíveis para visualização.",
        duration: 4000,
      });

      // Limpar dados
      audioChunksRef.current = [];
      setFinalTranscript("");
      setInterimTranscript("");
      setWordStatuses({});
    } catch (error: any) {
      console.error("Erro ao salvar gravação:", error);

      let errorMessage = "Erro ao salvar gravação";

      if (error?.status === 400) {
        errorMessage =
          error?.data?.detail || "Dados inválidos. Verifique a gravação.";
      } else if (error?.status === 401 || error?.status === 403) {
        errorMessage =
          "Sem permissão para salvar gravação. Faça login novamente.";
      } else if (error?.status === 500) {
        errorMessage = "Erro no servidor. Tente novamente mais tarde.";
      } else if (error?.status === 0 || error?.message?.includes("CORS")) {
        errorMessage = "Erro de conexão com o servidor. Verifique sua conexão.";
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardRecording = () => {
    // Limpar recursos de gravação
    stopRecording();
    stopSpeechRecognition();

    // Limpar estado
    setIsRecording(false);
    setShowConfirmDialog(false);
    setIsSaving(false);

    // Limpar dados da gravação
    audioChunksRef.current = [];
    setFinalTranscript("");
    setInterimTranscript("");
    setWordStatuses({});
    recordingStartTimeRef.current = 0;

    console.log("[ReadingStory] Gravação descartada e recursos liberados");
    toast.info("Gravação descartada", { duration: 2000 });
  };

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
                        eyeFatigueMode ? "bg-[#006ffd]" : "bg-white"
                      }`}
                    >
                      <div
                        className={`absolute border-[1.5px] border-solid inset-0 pointer-events-none rounded-[6px] ${
                          eyeFatigueMode
                            ? "border-[#006ffd]"
                            : "border-gray-300"
                        }`}
                      />
                      {eyeFatigueMode && (
                        <div className="absolute left-1/2 overflow-clip size-[12px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                          <div
                            className="absolute bg-white inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_4.088px] mask-size-[24px_17px]"
                            style={{ maskImage: `url('${img}')` }}
                          />
                        </div>
                      )}
                    </button>
                    <span className="text-[16px] font-medium text-black">
                      Fadiga ocular
                    </span>
                  </label>

                  {/* Increase Spacing Option */}
                  <label className="flex items-center gap-4 cursor-pointer">
                    <button
                      onClick={() => setIncreasedSpacing(!increasedSpacing)}
                      className={`flex-shrink-0 block cursor-pointer overflow-visible rounded-[6px] size-[24px] transition-colors ${
                        increasedSpacing ? "bg-[#006ffd]" : "bg-white"
                      }`}
                    >
                      <div
                        className={`absolute border-[1.5px] border-solid inset-0 pointer-events-none rounded-[6px] ${
                          increasedSpacing
                            ? "border-[#006ffd]"
                            : "border-gray-300"
                        }`}
                      />
                      {increasedSpacing && (
                        <div className="absolute left-1/2 overflow-clip size-[12px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                          <div
                            className="absolute bg-white inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_4.088px] mask-size-[24px_17px]"
                            style={{ maskImage: `url('${img}')` }}
                          />
                        </div>
                      )}
                    </button>
                    <span className="text-[16px] font-medium text-black">
                      Aumentar espaçamento
                    </span>
                  </label>

                  {/* Divider */}
                  <div className="h-px bg-black/20" />

                  {/* Print Option */}
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-4 w-full hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors cursor-pointer"
                  >
                    <Printer className="h-6 w-6 text-black" />
                    <span className="text-[16px] font-medium text-black">
                      Imprimir texto
                    </span>
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
        <div className="bg-white rounded-[10px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.25)] p-5 print:shadow-none">
          <div
            className={`text-[16px] font-medium text-black ${
              eyeFatigueMode ? "bg-[#f5f0e8] text-[#2b2b2b]" : ""
            } ${increasedSpacing ? "leading-[2.5]" : "leading-[1.875]"}`}
            style={
              eyeFatigueMode
                ? {
                    filter: "contrast(0.9)",
                    fontFamily: "Inter, sans-serif",
                  }
                : {}
            }
          >
            {isRecording ? (
              // Modo de leitura com feedback visual
              <div className="space-y-2">
                {storyContent.split(/\s+/).map((word, idx) => {
                  const status = wordStatuses[idx] || "pending";
                  let className =
                    "inline-block mr-1 transition-all duration-300";

                  if (status === "correct") {
                    className += " opacity-100 text-green-700 font-semibold";
                  } else if (status === "incorrect") {
                    className += " opacity-100 text-red-600 font-semibold";
                  } else {
                    className += " opacity-40";
                  }

                  return (
                    <span key={idx} className={className}>
                      {word}
                    </span>
                  );
                })}
              </div>
            ) : (
              // Modo normal de leitura
              storyContent.split("\n").map(
                (paragraph, idx) =>
                  paragraph.trim() && (
                    <p key={idx} className="mb-4 last:mb-0">
                      {paragraph.trim()}
                    </p>
                  ),
              )
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#2A7AF2]/60 bg-[#f0f0f0] flex-shrink-0 print:hidden">
        <div className="flex items-center justify-center py-4">
          <button
            onClick={handleStartRecording}
            className={`rounded-[10px] h-[50px] px-10 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#0071f3] hover:bg-[#0060d3]"
            }`}
          >
            <Mic className="h-6 w-6 text-white" />
            <span className="text-[13px] font-semibold text-white">
              {isRecording ? "Parar gravação" : "Iniciar gravação"}
            </span>
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <DialogPrimitive.Root
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
      >
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
                disabled={isSaving}
                className="w-full bg-[#0071f3] hover:bg-[#0060d3] rounded-[10px] h-[45px] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-[15px] font-semibold text-white">
                  {isSaving ? "Salvando..." : "Manter gravação"}
                </span>
              </button>
              <button
                onClick={handleDiscardRecording}
                disabled={isSaving}
                className="w-full bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-[10px] h-[45px] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-[15px] font-semibold text-black">
                  Descartar
                </span>
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
