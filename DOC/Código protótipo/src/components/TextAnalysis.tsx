import { ChevronLeft, MoreVertical, Printer, Volume2 } from 'lucide-react';
import { useRef, useState } from 'react';
import svgPaths from '../imports/svg-7k5czerodv';
import { img } from '../imports/svg-a81u4';
import { toast } from 'sonner@2.0.3';

interface Student {
  id: number | string;
  name: string;
  age?: number;
}

interface ErrorDetail {
  expected: string;
  spoken: string;
}

interface TextAnalysisProps {
  student: Student | null;
  storyTitle: string;
  storySubtitle: string;
  storyContent: string; // Texto original de referência
  errorDetails?: ErrorDetail[]; // Pares {expected, spoken} do backend
  onBack: () => void;
  audioUrl?: string; // URL do áudio da gravação
}

export default function TextAnalysis({
  student,
  storyTitle,
  storySubtitle,
  storyContent,
  errorDetails = [],
  onBack,
  audioUrl
}: TextAnalysisProps) {
  const [eyeFatigueMode, setEyeFatigueMode] = useState(false);
  const [increasedSpacing, setIncreasedSpacing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handlePlayRecording = () => {
    if (!audioUrl) {
      toast.error('Áudio não disponível para esta gravação');
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => toast.error('Erro ao reproduzir o áudio'));
      setIsPlaying(true);
    }
  };

  // Constrói set de palavras incorretas (expected com erro)
  const incorrectWordSet = new Set(
    errorDetails
      .filter(e => e.expected && e.spoken !== e.expected)
      .map(e => e.expected.toLowerCase())
  );
  const hasMask = errorDetails.length > 0;

  // Renderiza o texto original com máscara verde (correto) / vermelho (incorreto)
  const renderTextWithMask = (text: string) => {
    // Tokeniza mantendo pontuação e espaços separados das palavras
    const tokens = text.split(/(\b[A-Za-zÀ-ÖØ-öø-ÿ']+\b)/);

    return tokens.map((token, index) => {
      const isWord = /^[A-Za-zÀ-ÖØ-öø-ÿ']+$/.test(token);
      if (!isWord) return <span key={index}>{token}</span>;

      if (!hasMask) return <span key={index}>{token}</span>;

      const isIncorrect = incorrectWordSet.has(token.toLowerCase());
      return (
        <span
          key={index}
          title={isIncorrect ? (() => {
            const err = errorDetails.find(
              e => e.expected.toLowerCase() === token.toLowerCase()
            );
            return err?.spoken ? `Lido como: "${err.spoken}"` : 'Palavra omitida';
          })() : undefined}
          className="inline rounded-[3px] px-[1px] cursor-default"
          style={{
            backgroundColor: isIncorrect
              ? 'rgba(239, 68, 68, 0.35)'
              : 'rgba(34, 197, 94, 0.30)',
          }}
        >
          {token}
        </span>
      );
    });
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

      {/* Subtitle + Legenda */}
      <div className="px-4 pt-2 pb-3 print:hidden">
        <p className="text-[14px] font-semibold text-[#003b80] mb-2">
          {storySubtitle}
        </p>
        {hasMask && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-4 h-4 rounded-[3px]"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.40)' }}
              />
              <span className="text-[12px] text-black/60">Palavra correta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-4 h-4 rounded-[3px]"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.45)' }}
              />
              <span className="text-[12px] text-black/60">Palavra incorreta</span>
            </div>
            <span className="text-[11px] text-black/40">
              Passe o cursor sobre a palavra em vermelho para ver o que foi lido
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 print:pb-0">
        <div className="bg-white rounded-[10px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.25)] p-5 print:shadow-none">
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
              paragraph.trim() && (
                <p key={idx} className="mb-4 last:mb-0">
                  {renderTextWithMask(paragraph.trim())}
                </p>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#2A7AF2]/60 bg-[#f0f0f0] flex-shrink-0 print:hidden">
        <div className="flex items-center justify-center py-4">
          <button
            onClick={handlePlayRecording}
            className={`rounded-[10px] h-[50px] px-10 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isPlaying 
                ? 'bg-[#0060d3] hover:bg-[#0050b3]' 
                : 'bg-[#0071f3] hover:bg-[#0060d3]'
            }`}
          >
            <Volume2 className="h-6 w-6 text-white" />
            <span className="text-[13px] font-semibold text-white">
              {isPlaying ? 'Pausar gravação' : 'Ouvir gravação'}
            </span>
          </button>
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
