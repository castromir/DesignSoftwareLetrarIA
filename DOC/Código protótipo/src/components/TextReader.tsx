import { ChevronLeft, Printer } from 'lucide-react';
import { useState } from 'react';
import svgPaths from '../imports/svg-7k5czerodv';
import { img } from '../imports/svg-a81u4';

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
  onBack 
}: TextReaderProps) {
  const [eyeFatigueMode, setEyeFatigueMode] = useState(false);
  const [increasedSpacing, setIncreasedSpacing] = useState(false);

  const handlePrint = () => {
    window.print();
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
            {textContent.split('\n').map((paragraph, idx) => (
              paragraph.trim() && <p key={idx} className="mb-4 last:mb-0">{paragraph.trim()}</p>
            ))}
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
