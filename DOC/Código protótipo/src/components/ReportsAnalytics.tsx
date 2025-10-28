import { useState } from 'react';
import { 
  ChevronLeft, 
  TrendingUp, 
  TrendingDown,
  Users, 
  BookOpen, 
  Award,
  Clock,
  Target,
  Brain,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface ReportsAnalyticsProps {
  onBack: () => void;
}

export default function ReportsAnalytics({ onBack }: ReportsAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');

  // Mock data - Performance ao longo do tempo
  const performanceData = [
    { date: '01/10', accuracy: 75, fluency: 70, comprehension: 80 },
    { date: '05/10', accuracy: 78, fluency: 72, comprehension: 82 },
    { date: '10/10', accuracy: 82, fluency: 75, comprehension: 85 },
    { date: '15/10', accuracy: 85, fluency: 78, comprehension: 88 },
    { date: '20/10', accuracy: 88, fluency: 82, comprehension: 90 },
    { date: '25/10', accuracy: 90, fluency: 85, comprehension: 92 },
  ];

  // Mock data - Distribuição de dificuldade
  const difficultyData = [
    { name: 'Fácil', value: 45, color: '#10b981' },
    { name: 'Médio', value: 35, color: '#f59e0b' },
    { name: 'Difícil', value: 20, color: '#ef4444' },
  ];

  // Mock data - Atividades por tipo
  const activityTypeData = [
    { name: 'Seg', leitura: 12, escrita: 8 },
    { name: 'Ter', leitura: 15, escrita: 10 },
    { name: 'Qua', leitura: 10, escrita: 12 },
    { name: 'Qui', leitura: 18, escrita: 9 },
    { name: 'Sex', leitura: 14, escrita: 11 },
  ];

  // Mock data - Progresso por aluno
  const studentProgressData = [
    { name: 'João', progress: 90 },
    { name: 'Maria', progress: 85 },
    { name: 'Pedro', progress: 78 },
    { name: 'Ana', progress: 92 },
    { name: 'Lucas', progress: 75 },
  ];

  // Mock data - Feedbacks da IA
  const aiFeedbacks = [
    {
      id: 1,
      type: 'success',
      student: 'João Augusto',
      message: 'Excelente evolução na leitura de palavras com sílabas complexas. Continue com atividades de nível médio.',
      metric: 'Acurácia',
      value: '+15%',
      date: '28/10/2025',
    },
    {
      id: 2,
      type: 'warning',
      student: 'Maria Clara',
      message: 'Dificuldade identificada em fonemas nasais. Recomenda-se atividades focadas em "m" e "n".',
      metric: 'Fonemas Nasais',
      value: '65%',
      date: '27/10/2025',
    },
    {
      id: 3,
      type: 'info',
      student: 'Pedro Henrique',
      message: 'Progresso constante na fluência. Está pronto para textos mais longos.',
      metric: 'Fluência',
      value: '82%',
      date: '26/10/2025',
    },
    {
      id: 4,
      type: 'success',
      student: 'Ana Júlia',
      message: 'Destaque na compreensão de textos narrativos. Considere introduzir textos argumentativos.',
      metric: 'Compreensão',
      value: '+20%',
      date: '25/10/2025',
    },
  ];

  // Mock data - Insights e Recomendações
  const insights = [
    {
      id: 1,
      icon: Target,
      title: 'Objetivo da Semana',
      description: 'Aumentar a taxa de conclusão de atividades em 10%',
      progress: 65,
      status: 'em andamento',
    },
    {
      id: 2,
      icon: Brain,
      title: 'Padrão Identificado',
      description: 'Alunos têm melhor desempenho em atividades realizadas no período da manhã',
      status: 'insight',
    },
    {
      id: 3,
      icon: Award,
      title: 'Conquista',
      description: '5 alunos atingiram 90% de acurácia este mês',
      status: 'conquista',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#155dfc] to-[#0056b9] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <div>
                <h1 className="text-white font-semibold text-[17px] leading-tight">
                  Métricas Gerais
                </h1>
                <p className="text-white/80 text-[12px]">
                  Visão ampla de desempenho, dashboards e feedbacks da IA
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Period Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
              selectedPeriod === 'week'
                ? 'bg-[#0056b9] text-white'
                : 'bg-white border border-black/12 text-black/70 hover:bg-gray-50'
            }`}
          >
            Última Semana
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
              selectedPeriod === 'month'
                ? 'bg-[#0056b9] text-white'
                : 'bg-white border border-black/12 text-black/70 hover:bg-gray-50'
            }`}
          >
            Último Mês
          </button>
          <button
            onClick={() => setSelectedPeriod('semester')}
            className={`px-4 py-2 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
              selectedPeriod === 'semester'
                ? 'bg-[#0056b9] text-white'
                : 'bg-white border border-black/12 text-black/70 hover:bg-gray-50'
            }`}
          >
            Semestre
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 border-black/12">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-blue-50 rounded-lg p-2">
                <Users className="h-5 w-5 text-[#0056b9]" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[11px]">+12%</span>
              </div>
            </div>
            <p className="text-[24px] font-semibold text-[#030213] mb-1">28</p>
            <p className="text-[12px] text-black/60">Alunos Ativos</p>
          </Card>

          <Card className="p-4 border-black/12">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-green-50 rounded-lg p-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[11px]">+8%</span>
              </div>
            </div>
            <p className="text-[24px] font-semibold text-[#030213] mb-1">87%</p>
            <p className="text-[12px] text-black/60">Taxa de Conclusão</p>
          </Card>

          <Card className="p-4 border-black/12">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-purple-50 rounded-lg p-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-3 w-3" />
                <span className="text-[11px]">-3%</span>
              </div>
            </div>
            <p className="text-[24px] font-semibold text-[#030213] mb-1">156</p>
            <p className="text-[12px] text-black/60">Atividades Realizadas</p>
          </Card>

          <Card className="p-4 border-black/12">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-orange-50 rounded-lg p-2">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[11px]">+18%</span>
              </div>
            </div>
            <p className="text-[24px] font-semibold text-[#030213] mb-1">85%</p>
            <p className="text-[12px] text-black/60">Acurácia Média</p>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Over Time */}
          <Card className="p-6 border-black/12">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-5 w-5 text-[#0056b9]" />
                <h3 className="text-[16px] font-semibold">Performance ao Longo do Tempo</h3>
              </div>
              <p className="text-[12px] text-black/60 ml-7">Média geral de desempenho dos alunos</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0056b9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0056b9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFluency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComprehension" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#0056b9" 
                  fill="url(#colorAccuracy)"
                  name="Acurácia"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="fluency" 
                  stroke="#10b981" 
                  fill="url(#colorFluency)"
                  name="Fluência"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="comprehension" 
                  stroke="#8b5cf6" 
                  fill="url(#colorComprehension)"
                  name="Compreensão"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Activity Types */}
          <Card className="p-6 border-black/12">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-[#0056b9]" />
              <h3 className="text-[16px] font-semibold">Atividades por Tipo</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="leitura" fill="#0056b9" name="Leitura" radius={[8, 8, 0, 0]} />
                <Bar dataKey="escrita" fill="#10b981" name="Escrita" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Difficulty Distribution */}
          <Card className="p-6 border-black/12">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-[#0056b9]" />
              <h3 className="text-[16px] font-semibold">Distribuição de Dificuldade</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.value}%`}
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {difficultyData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[12px] text-black/70">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Student Progress */}
          <Card className="p-6 border-black/12 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-[#0056b9]" />
              <h3 className="text-[16px] font-semibold">Progresso por Aluno</h3>
            </div>
            <div className="space-y-4">
              {studentProgressData.map((student) => (
                <div key={student.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-black/70">{student.name}</span>
                    <span className="text-[13px] font-semibold text-[#0056b9]">
                      {student.progress}%
                    </span>
                  </div>
                  <Progress value={student.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Feedbacks Section */}
        <Card className="p-6 border-black/12 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#0056b9]" />
            <h3 className="text-[16px] font-semibold">Feedbacks da IA</h3>
            <Badge variant="secondary" className="ml-auto bg-blue-50 text-[#0056b9]">
              {aiFeedbacks.length} novos
            </Badge>
          </div>
          <div className="space-y-3">
            {aiFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="border border-black/12 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-full p-2 flex-shrink-0 ${
                      feedback.type === 'success'
                        ? 'bg-green-50'
                        : feedback.type === 'warning'
                        ? 'bg-yellow-50'
                        : 'bg-blue-50'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : feedback.type === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Brain className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-[14px] font-medium text-[#030213]">
                          {feedback.student}
                        </p>
                        <p className="text-[12px] text-black/60 flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {feedback.date}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${
                          feedback.type === 'success'
                            ? 'bg-green-100 text-green-700'
                            : feedback.type === 'warning'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {feedback.metric}: {feedback.value}
                      </Badge>
                    </div>
                    <p className="text-[13px] text-black/70">{feedback.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Insights and Recommendations */}
        <Card className="p-6 border-black/12">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-[#0056b9]" />
            <h3 className="text-[16px] font-semibold">Insights e Recomendações</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.id}
                  className="border border-black/12 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 rounded-lg p-2 flex-shrink-0">
                      <Icon className="h-5 w-5 text-[#0056b9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-[#030213] mb-2">
                        {insight.title}
                      </p>
                      <p className="text-[12px] text-black/60 mb-3">
                        {insight.description}
                      </p>
                      {insight.progress !== undefined && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-black/50">Progresso</span>
                            <span className="text-[11px] font-medium text-[#0056b9]">
                              {insight.progress}%
                            </span>
                          </div>
                          <Progress value={insight.progress} className="h-1.5" />
                        </div>
                      )}
                      <Badge
                        variant="secondary"
                        className={`mt-3 text-[11px] ${
                          insight.status === 'conquista'
                            ? 'bg-green-100 text-green-700'
                            : insight.status === 'insight'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {insight.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
