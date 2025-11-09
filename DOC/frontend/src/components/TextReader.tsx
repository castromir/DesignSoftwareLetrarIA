import { ChevronLeft, Printer } from "lucide-react";
import { useState } from "react";
import svgPaths from "../imports/svg-7k5czerodv";
import { img } from "../imports/svg-a81u4";
import { transcriptionApi } from "../services/api";

interface TextReaderProps {
  textId: number;
  textTitle: string;
  textSubtitle: string;
  textContent: string;
  onBack: () => void;
}

export default function TextReader({
  textId,
  textTitle,
  textSubtitle,
  textContent,
  onBack,
}: TextReaderProps) {
  const [eyeFatigueMode, setEyeFatigueMode] = useState(false);
  const [increasedSpacing, setIncreasedSpacing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>("pt");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(
    null,
  );

  const handlePrint = () => {
    window.print();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setAudioFile(file);
    setTranscript(null);
    setTranscriptionError(null);
  };

  const handleTranscribe = async () => {
    if (!audioFile) return;
    try {
      setIsTranscribing(true);
      setTranscriptionError(null);
      const res = await transcriptionApi.transcribe(audioFile, language);
      setTranscript(res.transcript);
    } catch (err: any) {
      const message =
        err?.data?.detail ||
        err?.message ||
        "Falha ao transcrever áudio. Verifique o arquivo e tente novamente.";
      setTranscriptionError(message);
    } finally {
      setIsTranscribing(false);
    }
  };

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
          {textTitle}
        </h1>
        <button
          onClick={handlePrint}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          title="Imprimir texto"
        >
          <Printer className="h-5 w-5 text-black" />
        </button>
      </div>

      {/* Subtitle */}
      <div className="px-4 pt-2 pb-3 print:hidden">
        <p className="text-[14px] font-semibold text-[#003b80]">
          {textSubtitle}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 print:pb-0">
        {/* Transcription Panel */}
        <div className="bg-white rounded-[10px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.25)] p-5 mb-4 print:hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-semibold text-black">
              Transcrever áudio da leitura
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div>
              <label className="block text-[12px] text-[#2f2f2f] mb-1">
                Arquivo de áudio
              </label>
              <input
                type="file"
                accept="audio/*,video/webm"
                onChange={handleFileChange}
                className="block w-full text-[14px] border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="md:w-[160px]">
              <label className="block text-[12px] text-[#2f2f2f] mb-1">
                Idioma
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-[14px] border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="pt">Português (pt)</option>
                <option value="en">Inglês (en)</option>
                <option value="es">Espanhol (es)</option>
              </select>
            </div>

            <div className="md:w-[160px]">
              <button
                onClick={handleTranscribe}
                disabled={!audioFile || isTranscribing}
                className={`w-full rounded-md px-4 py-2 text-white font-semibold ${!audioFile || isTranscribing ? "bg-gray-400 cursor-not-allowed" : "bg-[#0f61db] hover:bg-[#0e56c4]"} transition-colors`}
              >
                {isTranscribing ? "Transcrevendo..." : "Transcrever"}
              </button>
            </div>
          </div>

          {transcriptionError && (
            <p className="mt-3 text-[13px] text-red-600">
              {transcriptionError}
            </p>
          )}

          {transcript && (
            <div className="mt-4">
              <h3 className="text-[14px] font-semibold text-[#003b80] mb-2">
                Transcrição
              </h3>
              <div className="border border-gray-200 rounded-md p-3 max-h-48 overflow-auto text-[14px] leading-relaxed whitespace-pre-wrap">
                {transcript}
              </div>
            </div>
          )}
        </div>
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
            {textContent.split("\n").map(
              (paragraph, idx) =>
                paragraph.trim() && (
                  <p key={idx} className="mb-4 last:mb-0">
                    {paragraph.trim()}
                  </p>
                ),
            )}
          </div>
        </div>
      </div>

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
