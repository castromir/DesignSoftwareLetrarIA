import { ChevronLeft, Mic, MoreVertical, Printer } from 'lucide-react';
import { useState } from 'react';
import svgPaths from '../imports/svg-7k5czerodv';
import { img } from '../imports/svg-a81u4';
import { toast } from 'sonner@2.0.3';
import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface ReadingStoryProps {
  student: Student | null;
  storyTitle: string;
  storySubtitle: string;
  storyContent: string;
  onBack: () => void;
}

export default function ReadingStory({ 
  student, 
  storyTitle, 
  storySubtitle, 
  storyContent,
  onBack 
}: ReadingStoryProps) {
  const [eyeFatigueMode, setEyeFatigueMode] = useState(false);
  const [increasedSpacing, setIncreasedSpacing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleStartRecording = () => {
    if (isRecording) {
      // Se está gravando, mostrar popup de confirmação
      setShowConfirmDialog(true);
    } else {
      // Iniciar gravação
      setIsRecording(true);
      toast.success('Gravação iniciada!');
    }
  };

  const handleKeepRecording = () => {
    setIsRecording(false);
    setShowConfirmDialog(false);
    toast.success('Gravação salva com sucesso!', {
      description: 'A gravação foi salva e está disponível para visualização.',
    });
  };

  const handleDeleteRecording = () => {
    setIsRecording(false);
    setShowConfirmDialog(false);
    toast.info('Gravação descartada');
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
      </div>

      {/* Footer */}
      <div className="border-t border-[#2A7AF2]/60 bg-[#f0f0f0] flex-shrink-0 print:hidden">
        <div className="flex items-center justify-center py-4">
          <button
            onClick={handleStartRecording}
            className={`rounded-[10px] h-[50px] px-10 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-[#0071f3] hover:bg-[#0060d3]'
            }`}
          >
            <Mic className="h-6 w-6 text-white" />
            <span className="text-[13px] font-semibold text-white">
              {isRecording ? 'Parar gravação' : 'Iniciar gravação'}
            </span>
          </button>
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
