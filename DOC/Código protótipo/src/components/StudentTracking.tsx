import { ChevronLeft, Loader2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import svgPaths from '../imports/svg-p7j9lqrllg';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { studentsApi } from '../services/api';
import type { StudentTrackingResponse, StudentAttentionPoint } from '../types';

interface Student {
  id: number | string;
  name: string;
  age?: number;
}

interface StudentTrackingProps {
  student: Student | null;
  onBack: () => void;
}

function StudentAvatar() {
  return (
    <div className="w-16 h-16 md:w-20 md:h-20">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g>
          <path d={svgPaths.p1b47d580} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p36845100} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p16146600} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg className="w-6 h-6" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
      <path d={svgPaths.p349df780} fill="#F5A623" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-6 h-6" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
      <path d={svgPaths.p399ee200} fill="#F88962" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-6 h-6" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
      <path d={svgPaths.p3cccb600} fill="#256CAD" />
      <path d={svgPaths.p29908bb0} fill="#256CAD" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg className="w-3 h-2" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 12 7">
      <path d={svgPaths.p23b5f32} fill="#4FC549" />
    </svg>
  );
}

const formatNumber = (value?: number | null, decimals = 0) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "–";
  }
  return value.toFixed(decimals).replace(".", ",");
};

const attentionBackgroundMap: Record<StudentAttentionPoint["severity"], string> = {
  info: "bg-[#e5f5ff]",
  warning: "bg-[#fef6e9]",
  error: "bg-[#fef3ef]",
  success: "bg-[#e6f7ed]",
};

const attentionIconMap: Record<StudentAttentionPoint["severity"], React.ReactNode> = {
  info: <InfoIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
  success: <TrendIcon />,
};

function MonthSelector({ selectedMonth, onSelectMonth }: { selectedMonth: string; onSelectMonth: (month: string) => void }) {
  const months = ['Agosto', 'Setembro', 'Outubro'];
  
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="bg-[#bed8ea] rounded-[15px] p-1 flex gap-1">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => onSelectMonth(month)}
            className={`px-4 py-1.5 rounded-[15px] text-[12px] font-semibold transition-colors ${
              selectedMonth === month
                ? 'bg-[#378bc8] text-white border border-white/50'
                : 'text-[#322a2a] hover:bg-white/30'
            }`}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}

function OverviewCard({
  metrics,
  isLoading,
}: {
  metrics: StudentTrackingResponse | null;
  isLoading: boolean;
}) {
  const totalRecordings = metrics?.total_recordings ?? 0;
  const completedActivities = metrics?.completed_activities ?? 0;
  const averageAccuracy = metrics?.average_accuracy;
  const averageWpm = metrics?.average_wpm;
  const accuracyDisplay = averageAccuracy === undefined || averageAccuracy === null ? "–" : `${formatNumber(averageAccuracy, 1)}%`;
  const averageWpmDisplay = formatNumber(averageWpm, 1);

  return (
    <div className="bg-gradient-to-br from-[#4084dd] to-[#2d6fd9] rounded-[10px] p-6 md:p-8 h-full shadow-lg text-white">
      <h3 className="text-[20px] md:text-[24px] font-semibold text-center mb-6 md:mb-8">
        Visão geral
      </h3>
      <div className="grid grid-cols-2 gap-6 md:gap-8">
        <div className="text-center">
          <div className="bg-white/20 rounded-[10px] p-4 md:p-6 backdrop-blur-sm">
            <p className="text-[13px] md:text-[14px] text-white/90 mb-3">Gravações totais</p>
            <p className="text-[32px] md:text-[48px] font-bold leading-none">
              {isLoading ? "–" : totalRecordings}
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white/20 rounded-[10px] p-4 md:p-6 backdrop-blur-sm">
            <p className="text-[13px] md:text-[14px] text-white/90 mb-3">Atividades concluídas</p>
            <p className="text-[32px] md:text-[48px] font-bold leading-none">
              {isLoading ? "–" : completedActivities}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4">
        <div className="bg-white/15 rounded-[10px] px-4 py-3 flex items-center justify-between">
          <span className="text-[13px] md:text-[14px] text-white/90">Acurácia média</span>
          <span className="text-[18px] md:text-[20px] font-semibold">
            {isLoading ? "–" : accuracyDisplay}
          </span>
        </div>
        <div className="bg-white/15 rounded-[10px] px-4 py-3 flex items-center justify-between">
          <span className="text-[13px] md:text-[14px] text-white/90">PPM médio</span>
          <span className="text-[18px] md:text-[20px] font-semibold">
            {isLoading ? "–" : averageWpmDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}

function PPMCard({
  history,
  currentPPM,
  ppmChangePercentage,
  averageWpm,
  isLoading,
}: {
  history: StudentTrackingResponse["ppm_history"];
  currentPPM?: number;
  ppmChangePercentage?: number;
  averageWpm?: number;
  isLoading: boolean;
}) {
  const chartData = useMemo(() => {
    if (!history || history.length === 0) {
      return [] as Array<{ index: number; ppm: number; label: string }>;
    }
    return [...history]
      .sort(
        (a, b) =>
          new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
      )
      .map((item, index) => ({
        index: index + 1,
        ppm: item.words_per_minute ?? 0,
        label: new Date(item.recorded_at).toLocaleDateString("pt-BR"),
      }));
  }, [history]);

  const changeValue = ppmChangePercentage ?? null;
  const changeLabel =
    changeValue === null
      ? "–"
      : `${changeValue > 0 ? "+" : changeValue < 0 ? "-" : ""}${Math.abs(changeValue).toFixed(1).replace(".", ",")}%`;
  const changeClass =
    changeValue === null || changeValue >= 0 ? "text-[#4fc549]" : "text-[#d94841]";

  return (
    <div className="bg-white rounded-[10px] border border-black/12 p-6 md:p-8 h-full shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <div>
            <h3 className="text-[32px] md:text-[48px] font-bold text-[#4084dd] leading-none">
              {isLoading ? "–" : formatNumber(currentPPM, 0)}
            </h3>
            <span className="text-[18px] md:text-[22px] font-semibold text-black block">PPM atual</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendIcon />
            <span className={`text-[13px] md:text-[14px] font-bold ${changeClass}`}>
              {changeLabel}
            </span>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[14px] md:text-[15px] text-black/70">PPM médio</p>
          <p className="text-[16px] md:text-[18px] font-semibold text-black">
            {isLoading ? "–" : formatNumber(averageWpm, 1)}
          </p>
          <p className="text-[12px] md:text-[13px] text-black/50 mt-1">Faixa recomendada: 120 - 150 PPM</p>
        </div>
      </div>

      <div className="h-[180px] md:h-[240px] mb-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#4084dd]" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[13px] text-black/50">Sem leituras suficientes para exibir o gráfico.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4084dd" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4084dd" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="index"
                tickFormatter={(value) => {
                  const item = chartData[value - 1];
                  return item ? item.label : String(value);
                }}
                minTickGap={24}
                tick={{ fontSize: 12, fill: "#555" }}
              />
              <YAxis
                hide
                domain={[(dataMin: number) => dataMin - 10, (dataMax: number) => dataMax + 10]}
              />
              <Area
                type="monotone"
                dataKey="ppm"
                stroke="#4084dd"
                strokeWidth={3}
                fill="url(#colorPpm)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function AttentionPointCard({ point }: { point: StudentAttentionPoint }) {
  const bgColor = attentionBackgroundMap[point.severity] ?? "bg-[#e5f5ff]";
  const icon = attentionIconMap[point.severity] ?? <InfoIcon />;

  return (
    <div className={`${bgColor} rounded-[12px] p-5 md:p-6 h-full flex flex-col border border-black/5 hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">{icon}</div>
        <h4 className="text-[15px] md:text-[16px] font-bold text-black leading-tight">{point.title}</h4>
      </div>
      <p className="text-[13px] md:text-[14px] font-medium text-black/80 leading-relaxed flex-1">
        {point.description}
      </p>
    </div>
  );
}

function AttentionPointsCard({
  points,
  isLoading,
}: {
  points: StudentAttentionPoint[];
  isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-[10px] border border-black/12 p-6 md:p-8 shadow-sm">
      <h3 className="text-[20px] md:text-[24px] font-semibold text-black mb-6">Pontos de atenção</h3>
      {isLoading ? (
        <div className="py-10 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#4084dd]" />
        </div>
      ) : points.length === 0 ? (
        <p className="text-[13px] md:text-[14px] text-black/60">
          Nenhum ponto de atenção identificado nas leituras recentes.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {points.map((point, index) => (
            <AttentionPointCard key={`${point.title}-${index}`} point={point} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudentTracking({ student, onBack }: StudentTrackingProps) {
  const [selectedMonth, setSelectedMonth] = useState('Outubro');
  const [tracking, setTracking] = useState<StudentTrackingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!student) return;
    const studentId = typeof student.id === 'string' ? student.id : student.id.toString();

    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await studentsApi.getTracking(studentId);
        if (isMounted) {
          setTracking(response);
        }
      } catch (err) {
        console.error('Erro ao carregar métricas do aluno:', err);
        if (isMounted) {
          setError('Não foi possível carregar o rastreamento deste aluno.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [student?.id]);

  if (!student) return null;

  const history = tracking?.ppm_history ?? [];
  const attentionPoints = tracking?.attention_points ?? [];

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Header */}
      <div className="border-b border-black/30 px-4 md:px-8 py-3 flex items-center gap-3 bg-[#f0f0f0]">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2 z-[60]"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-[19px] md:text-[22px] font-semibold text-black flex-1 text-center -ml-12">
          Rastreamento
        </h1>
      </div>

      {/* Student Info */}
      <div className="border-b border-black/30 px-4 md:px-6 py-2 md:py-3 bg-[#f0f0f0]">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 max-w-6xl mx-auto">
          <StudentAvatar />
          <div className="text-center md:text-left">
            <h2 className="text-[16px] md:text-[18px] font-semibold text-black">{student.name}</h2>
            <p className="text-[13px] md:text-[14px] text-black">{student.age} anos</p>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="pt-6 bg-[#f0f0f0]">
        <MonthSelector selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
      </div>

      {/* Content */}
      <div className="pb-6 bg-[#f0f0f0]">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          {error && (
            <div className="bg-[#ffe2dd] border border-[#f87171] text-[#c00000] rounded-[10px] p-4 text-[13px] mb-4">
              {error}
            </div>
          )}
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <OverviewCard metrics={tracking} isLoading={isLoading} />
            <div className="mb-4" />
            <PPMCard
              history={history}
              currentPPM={tracking?.current_ppm}
              ppmChangePercentage={tracking?.ppm_change_percentage}
              averageWpm={tracking?.average_wpm}
              isLoading={isLoading}
            />
            <div className="mb-4" />
            <AttentionPointsCard points={attentionPoints} isLoading={isLoading} />
          </div>
          
          {/* Desktop Grid Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6">
            {/* Visão Geral - Destaque à esquerda */}
            <div className="lg:col-span-4">
              <OverviewCard metrics={tracking} isLoading={isLoading} />
            </div>
            
            {/* PPM Card - Maior à direita */}
            <div className="lg:col-span-8">
              <PPMCard
                history={history}
                currentPPM={tracking?.current_ppm}
                ppmChangePercentage={tracking?.ppm_change_percentage}
                averageWpm={tracking?.average_wpm}
                isLoading={isLoading}
              />
            </div>
            
            {/* Pontos de Atenção - Full width abaixo */}
            <div className="lg:col-span-12">
              <AttentionPointsCard points={attentionPoints} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
