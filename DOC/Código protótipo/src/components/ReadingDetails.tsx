import { ChevronLeft, Play, Pause } from "lucide-react";
import { useState } from "react";
import svgPaths from "../imports/svg-v9zu5ssadb";

interface ReadingDetailsProps {
  storyTitle: string;
  studentName: string;
  onBack: () => void;
}

function AccuracyChart() {
  return (
    <div className="relative size-[95.983px]">
      {/* Background circle */}
      <svg
        className="absolute inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 96 96"
      >
        <path
          d={svgPaths.p355828c0}
          stroke="#D9D9D9"
          strokeWidth="7.67865"
        />
      </svg>

      {/* Progress circle */}
      <svg
        className="absolute inset-0 size-full -rotate-90"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 96 96"
      >
        <path d={svgPaths.pa61fd00} fill="#0AC900" />
      </svg>

      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-[22px] font-normal text-black">
          98%
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  value,
  label,
  variant = "default",
}: {
  value: string | number;
  label: string;
  variant?: "default" | "error";
}) {
  return (
    <div className="bg-white rounded-[15px] border border-black/12 p-[25.29px] flex flex-col items-center justify-center h-[115px]">
      <p
        className={`text-[22px] font-normal mb-3 ${variant === "error" ? "text-[#d80000]" : "text-black"}`}
      >
        {value}
      </p>
      <p className="text-[13px] font-normal text-[#5b5656] text-center">
        {label}
      </p>
    </div>
  );
}

function SmallMetricCard({
  value,
  label,
  bgColor = "bg-[#f0f0f0]",
}: {
  value: string | number;
  label: string;
  bgColor?: string;
}) {
  return (
    <div
      className={`${bgColor} rounded-[15px] p-4 flex flex-col items-center justify-center h-[86.466px]`}
    >
      <p className="text-[18px] font-normal text-black mb-2">
        {value}
      </p>
      <p className="text-[13px] font-normal text-black text-center">
        {label}
      </p>
    </div>
  );
}

function InsightBadge({
  text,
  bgColor,
  highlightColor,
}: {
  text: string;
  bgColor: string;
  highlightColor?: string;
}) {
  const parts = text.split(/([CGTR]|'ch'|'íh'|'nh)/g);

  return (
    <div
      className={`${bgColor} rounded-[10px] border border-black/5 p-[17.301px]`}
    >
      <p className="text-[12px] font-normal text-black leading-[20px]">
        {parts.map((part, index) => {
          if (
            highlightColor &&
            (part === "C" ||
              part === "G" ||
              part === "T" ||
              part === "R" ||
              part === "'ch'" ||
              part === "'íh'" ||
              part === "'nh'")
          ) {
            return (
              <span key={index} className={highlightColor}>
                {part}
              </span>
            );
          }
          return part;
        })}
      </p>
    </div>
  );
}

function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(60); // 60% progress

  return (
    <div className="bg-white rounded-[10px] border border-black/12 p-[21.296px]">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-[44px] h-[44px] rounded-full bg-[#3c81e9] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-[#2d6fd9] transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-white" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </button>

        <div className="flex-1">
          <p className="text-[13px] font-normal text-[#2f2f2f] mb-2">
            Ouvir gravação
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#d9d9d9] h-[6.643px] rounded-[10px] overflow-hidden">
              <div
                className="h-full bg-[#0f61db] rounded-[10px] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[12px] font-normal text-neutral-500 w-[30px]">
              1:45
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReadingDetails({
  storyTitle,
  studentName,
  onBack,
}: ReadingDetailsProps) {
  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-black/30 px-4 md:px-8 py-4 flex items-center gap-3 flex-shrink-0 bg-[#f0f0f0]">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-[19px] font-semibold text-black flex-1 text-center -ml-12">
          Detalhes da leitura
        </h1>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="px-5 md:px-8 max-w-6xl mx-auto pt-6">
          {/* Story Title & Student */}
          <div className="mb-6">
            <h2 className="text-[22px] font-normal text-black mb-1">
              {storyTitle}
            </h2>
            <p className="text-[13px] font-normal text-black">
              Aluno: {studentName}
            </p>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* Top Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                value="3:47"
                label="Tempo de leitura"
              />
              <MetricCard
                value="5"
                label="Erros"
                variant="error"
              />
            </div>

            {/* PPM */}
            <MetricCard
              value="132"
              label="Palavras por minuto"
            />

            {/* Accuracy Section */}
            <div className="bg-white rounded-[15px] border border-black/12 p-6">
              <h3 className="text-[18px] font-normal text-black text-center mb-6">
                Acurácia da leitura
              </h3>

              <div className="flex flex-col items-center mb-6">
                <AccuracyChart />
                <p className="text-[14px] font-normal text-black text-center mt-4">
                  de acurácia
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <SmallMetricCard value="216" label="Corretas" />
                <SmallMetricCard value="5" label="Incorretas" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <SmallMetricCard value="220" label="Total" />
                <SmallMetricCard value="57" label="PPM" />
              </div>

              <button className="w-full bg-[#3b73ed] rounded-[10px] h-[44.955px] flex items-center justify-center gap-2 hover:bg-[#2d62dc] transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d={svgPaths.p17e30400}
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.66595"
                  />
                  <path
                    d={svgPaths.pe7e8800}
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.66595"
                  />
                  <path
                    d="M8.32974 7.49677H6.6638"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.66595"
                  />
                  <path
                    d="M13.3276 10.8287H6.6638"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.66595"
                  />
                  <path
                    d="M13.3276 14.1606H6.6638"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.66595"
                  />
                </svg>
                <span className="text-[14px] font-normal text-white">
                  Consultar análise textual
                </span>
              </button>
            </div>

            {/* Insights Section */}
            <div className="bg-white rounded-[15px] border border-black/12 p-6">
              <h3 className="text-[18px] font-normal text-black text-center mb-4">
                Letras e fonemas trabalhados
              </h3>

              <div className="space-y-3">
                <InsightBadge
                  text="A criança apresenta boa articulação dos fonemas C, G e T, demonstrando consciência fonológica adequada."
                  bgColor="bg-[#d9ffc2]"
                  highlightColor="text-[#2b8700]"
                />
                <InsightBadge
                  text="No caso do fonema R, observa-se dificuldade especialmente em posição intervocálica e final de sílaba"
                  bgColor="bg-[#ffe2dd]"
                  highlightColor="text-[#c00000]"
                />
              </div>
            </div>

            {/* Audio Player */}
            <AudioPlayer />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-6">
              {/* Top Metrics */}
              <div className="col-span-4">
                <MetricCard
                  value="3:47"
                  label="Tempo de leitura"
                />
              </div>
              <div className="col-span-4">
                <MetricCard
                  value="5"
                  label="Erros"
                  variant="error"
                />
              </div>
              <div className="col-span-4">
                <MetricCard
                  value="132"
                  label="Palavras por minuto"
                />
              </div>

              {/* Accuracy Section */}
              <div className="col-span-7">
                <div className="bg-white rounded-[15px] border border-black/12 p-8 h-full">
                  <h3 className="text-[20px] font-normal text-black text-center mb-8">
                    Acurácia da leitura
                  </h3>

                  <div className="flex flex-col items-center justify-center mb-8">
                    <AccuracyChart />
                    <p className="text-[16px] font-normal text-black mt-4">
                      de acurácia
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <SmallMetricCard
                      value="216"
                      label="Corretas"
                    />
                    <SmallMetricCard
                      value="5"
                      label="Incorretas"
                    />
                    <SmallMetricCard
                      value="220"
                      label="Total"
                    />
                    <SmallMetricCard value="57" label="PPM" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-5 space-y-6">
                {/* Insights Section */}
                <div className="bg-white rounded-[15px] border border-black/12 p-6">
                  <h3 className="text-[18px] font-normal text-black text-center mb-4">
                    Letras e fonemas trabalhados
                  </h3>

                  <div className="space-y-3">
                    <InsightBadge
                      text="A criança apresenta boa articulação dos fonemas C, G e T, demonstrando consciência fonológica adequada."
                      bgColor="bg-[#d9ffc2]"
                      highlightColor="text-[#2b8700]"
                    />
                    <InsightBadge
                      text="No caso do fonema R, observa-se dificuldade especialmente em posição intervocálica e final de sílaba"
                      bgColor="bg-[#ffe2dd]"
                      highlightColor="text-[#c00000]"
                    />
                  </div>
                </div>

                {/* Audio Player */}
                <AudioPlayer />

                {/* Textual Analysis Button */}
                <button className="w-full bg-[#3b73ed] rounded-[10px] h-[50px] flex items-center justify-center gap-2 hover:bg-[#2d62dc] transition-colors cursor-pointer">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d={svgPaths.p17e30400}
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                    <path
                      d={svgPaths.pe7e8800}
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                    <path
                      d="M8.32974 7.49677H6.6638"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                    <path
                      d="M13.3276 10.8287H6.6638"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                    <path
                      d="M13.3276 14.1606H6.6638"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66595"
                    />
                  </svg>
                  <span className="text-[15px] font-normal text-white">
                    Consultar análise textual
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}