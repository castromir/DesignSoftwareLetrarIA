import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import svgPaths from '../imports/svg-p7j9lqrllg';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Student {
  id: number;
  name: string;
  age: number;
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

function OverviewCard() {
  return (
    <div className="bg-gradient-to-br from-[#4084dd] to-[#2d6fd9] rounded-[10px] p-6 md:p-8 h-full shadow-lg">
      <h3 className="text-[20px] md:text-[24px] font-semibold text-white text-center mb-6 md:mb-8">Visão geral</h3>
      <div className="grid grid-cols-2 gap-6 md:gap-8">
        <div className="text-center">
          <div className="bg-white/20 rounded-[10px] p-4 md:p-6 backdrop-blur-sm">
            <p className="text-[13px] md:text-[14px] text-white/90 mb-3">Gravações totais</p>
            <p className="text-[32px] md:text-[48px] font-bold text-white leading-none">48</p>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-white/20 rounded-[10px] p-4 md:p-6 backdrop-blur-sm">
            <p className="text-[13px] md:text-[14px] text-white/90 mb-3">Cards completados</p>
            <p className="text-[32px] md:text-[48px] font-bold text-white leading-none">32</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PPMCard() {
  // Dados do gráfico - variações de PPM ao longo das semanas
  const chartData = [
    { week: 'Sem 1', day: 1, ppm: 85 },
    { week: 'Sem 1', day: 2, ppm: 95 },
    { week: 'Sem 1', day: 3, ppm: 125 },
    { week: 'Sem 1', day: 4, ppm: 145 },
    { week: 'Sem 1', day: 5, ppm: 135 },
    { week: 'Sem 1', day: 6, ppm: 115 },
    { week: 'Sem 1', day: 7, ppm: 105 },
    { week: 'Sem 2', day: 8, ppm: 95 },
    { week: 'Sem 2', day: 9, ppm: 110 },
    { week: 'Sem 2', day: 10, ppm: 130 },
    { week: 'Sem 2', day: 11, ppm: 135 },
    { week: 'Sem 2', day: 12, ppm: 125 },
    { week: 'Sem 2', day: 13, ppm: 115 },
    { week: 'Sem 2', day: 14, ppm: 105 },
    { week: 'Sem 3', day: 15, ppm: 100 },
    { week: 'Sem 3', day: 16, ppm: 115 },
    { week: 'Sem 3', day: 17, ppm: 125 },
    { week: 'Sem 3', day: 18, ppm: 135 },
    { week: 'Sem 3', day: 19, ppm: 130 },
    { week: 'Sem 3', day: 20, ppm: 115 },
    { week: 'Sem 3', day: 21, ppm: 95 },
    { week: 'Sem 4', day: 22, ppm: 85 },
    { week: 'Sem 4', day: 23, ppm: 105 },
    { week: 'Sem 4', day: 24, ppm: 145 },
    { week: 'Sem 4', day: 25, ppm: 155 },
    { week: 'Sem 4', day: 26, ppm: 140 },
    { week: 'Sem 4', day: 27, ppm: 130 },
    { week: 'Sem 4', day: 28, ppm: 125 },
  ];

  return (
    <div className="bg-white rounded-[10px] border border-black/12 p-6 md:p-8 h-full shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-0">
          <h3 className="text-[32px] md:text-[48px] font-bold text-[#4084dd] leading-none">122</h3>
          <div>
            <span className="text-[18px] md:text-[22px] font-semibold text-black block">PPM</span>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendIcon />
              <span className="text-[13px] md:text-[14px] font-bold text-[#4fc549]">+10%</span>
            </div>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[14px] md:text-[15px] text-black/70">Média recomendada</p>
          <p className="text-[16px] md:text-[18px] font-semibold text-black">120 - 150 PPM</p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-[180px] md:h-[240px] mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData}
            margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4084dd" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4084dd" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="day" 
              hide={true}
              domain={[1, 28]}
            />
            <YAxis 
              hide={true}
              domain={[60, 180]}
            />
            <Area 
              type="monotone" 
              dataKey="ppm" 
              stroke="#4084dd" 
              strokeWidth={3}
              fill="url(#colorPpm)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Week Labels */}
      <div className="flex justify-between text-[14px] md:text-[15px] text-black/70 font-medium px-2 mt-2">
        <span>Sem 1</span>
        <span>Sem 2</span>
        <span>Sem 3</span>
        <span>Sem 4</span>
      </div>
    </div>
  );
}

interface AttentionPointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

function AttentionPoint({ icon, title, description, bgColor }: AttentionPointProps) {
  return (
    <div className={`${bgColor} rounded-[12px] p-5 md:p-6 h-full flex flex-col border border-black/5 hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">{icon}</div>
        <h4 className="text-[15px] md:text-[16px] font-bold text-black leading-tight">{title}</h4>
      </div>
      <p className="text-[13px] md:text-[14px] font-medium text-black/80 mb-4 flex-1 leading-relaxed">
        {description}
      </p>
      <button className="text-[13px] md:text-[14px] font-semibold text-[#008bc7] hover:text-[#006a9f] hover:underline text-left transition-colors">
        Ver atividades recomendadas →
      </button>
    </div>
  );
}

function AttentionPointsCard() {
  return (
    <div className="bg-white rounded-[10px] border border-black/12 p-6 md:p-8 shadow-sm">
      <h3 className="text-[20px] md:text-[24px] font-semibold text-black mb-6">Pontos de atenção</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AttentionPoint
          icon={<WarningIcon />}
          title="Dificuldade com dígrafos"
          description="O aluno apresenta dificuldade em pronunciar palavras com 'ch', íh', 'nh."
          bgColor="bg-[#fef6e9]"
        />
        
        <AttentionPoint
          icon={<ErrorIcon />}
          title="Pausas longas"
          description="Foram identificadas muitas pausas durante a leitura."
          bgColor="bg-[#fef3ef]"
        />
        
        <AttentionPoint
          icon={<InfoIcon />}
          title="Precisão média"
          description="O aluno demonstra uma precisão média na leitura, com alguns erros ocasionais."
          bgColor="bg-[#e5f5ff]"
        />
      </div>
    </div>
  );
}

export default function StudentTracking({ student, onBack }: StudentTrackingProps) {
  const [selectedMonth, setSelectedMonth] = useState('Outubro');

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-black/30 px-4 md:px-8 py-3 flex items-center gap-3 flex-shrink-0 bg-[#f0f0f0]">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-[19px] md:text-[22px] font-semibold text-black flex-1 text-center -ml-12">
          Rastreamento
        </h1>
      </div>

      {/* Student Info */}
      <div className="border-b border-black/30 px-6 md:px-8 py-4 md:py-6 bg-[#f0f0f0]">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 max-w-6xl mx-auto">
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

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <OverviewCard />
            <div className="mb-4" />
            <PPMCard />
            <div className="mb-4" />
            <AttentionPointsCard />
          </div>
          
          {/* Desktop Grid Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6">
            {/* Visão Geral - Destaque à esquerda */}
            <div className="lg:col-span-4">
              <OverviewCard />
            </div>
            
            {/* PPM Card - Maior à direita */}
            <div className="lg:col-span-8">
              <PPMCard />
            </div>
            
            {/* Pontos de Atenção - Full width abaixo */}
            <div className="lg:col-span-12">
              <AttentionPointsCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
