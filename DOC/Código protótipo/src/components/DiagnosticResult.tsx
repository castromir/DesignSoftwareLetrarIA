import { useState } from 'react';
import jsPDF from 'jspdf';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Target,
  Brain,
  Sparkles,
  Award,
  BookOpen,
  Eye,
  Clock,
  BarChart3,
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface DiagnosticResultProps {
  student: Student;
  onBack: () => void;
  diagnosticData: any;
}

export default function DiagnosticResult({
  student,
  onBack,
  diagnosticData,
}: DiagnosticResultProps) {
  // Mock data baseado nas respostas do diagnóstico
  const overallScore = 78; // Calculado a partir das respostas

  // Função para exportar relatório compacto em PDF
  const handleExportReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Configurar cores
    const primaryColor: [number, number, number] = [0, 86, 185];
    const secondaryColor: [number, number, number] = [21, 93, 252];
    const greenColor: [number, number, number] = [34, 197, 94];
    const orangeColor: [number, number, number] = [249, 115, 22];

    // Cabeçalho com gradiente simulado
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Relatório de Diagnóstico', margin, 20);
    
    // Subtítulo
    doc.setFontSize(12);
    doc.text('Avaliação Pedagógica Completa', margin, 30);
    
    // Data
    doc.setFontSize(9);
    doc.text('Data: 28 de Outubro, 2025', margin, 38);

    yPosition = 55;

    // Informações do Aluno
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Informações do Aluno', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.text(`Nome: ${student.name}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`Idade: ${student.age} anos`, margin + 5, yPosition);
    yPosition += 12;

    // Pontuação Geral - Destaque
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(margin, yPosition - 5, pageWidth - 2 * margin, 28, 3, 3, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Pontuação Geral', margin + 5, yPosition + 5);
    
    doc.setFontSize(32);
    doc.text(`${overallScore}`, pageWidth - margin - 40, yPosition + 5);
    doc.setFontSize(14);
    doc.text('/100', pageWidth - margin - 15, yPosition + 5);
    
    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94);
    doc.text('Bom Desempenho', margin + 5, yPosition + 15);
    
    yPosition += 35;

    // Resumo da Avaliação
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo da Avaliação', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    const resumoText = 'O aluno demonstra um desempenho acima da média na maioria das habilidades avaliadas, com destaque especial para compreensão de texto e identificação de fonemas. Recomenda-se atenção ao desenvolvimento de vocabulário e expressividade.';
    const resumoLines = doc.splitTextToSize(resumoText, pageWidth - 2 * margin - 10);
    doc.text(resumoLines, margin + 5, yPosition);
    yPosition += resumoLines.length * 5 + 10;

    // Pontos Fortes
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Pontos Fortes', margin, yPosition);
    yPosition += 8;

    strengths.slice(0, 2).forEach((strength, index) => {
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, yPosition - 3, pageWidth - 2 * margin, 18, 2, 2, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
      doc.text(`• ${strength.title}`, margin + 5, yPosition + 3);
      
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(strength.description, pageWidth - 2 * margin - 35);
      doc.text(descLines, margin + 8, yPosition + 9);
      
      doc.setFontSize(10);
      doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
      doc.text(`${strength.score}%`, pageWidth - margin - 20, yPosition + 3);
      
      yPosition += 22;
    });

    yPosition += 5;

    // Áreas de Melhoria
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Áreas de Melhoria', margin, yPosition);
    yPosition += 8;

    weaknesses.slice(0, 2).forEach((weakness, index) => {
      doc.setFillColor(255, 247, 237);
      doc.roundedRect(margin, yPosition - 3, pageWidth - 2 * margin, 18, 2, 2, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
      doc.text(`• ${weakness.title}`, margin + 5, yPosition + 3);
      
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(weakness.description, pageWidth - 2 * margin - 35);
      doc.text(descLines, margin + 8, yPosition + 9);
      
      doc.setFontSize(10);
      doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
      doc.text(`${weakness.score}%`, pageWidth - margin - 20, yPosition + 3);
      
      yPosition += 22;
    });

    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    } else {
      yPosition += 5;
    }

    // Recomendações Prioritárias
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Recomendações Prioritárias', margin, yPosition);
    yPosition += 8;

    const priorityRecs = aiRecommendations.filter(rec => rec.priority === 'alta').slice(0, 2);
    priorityRecs.forEach((rec, index) => {
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, yPosition - 3, pageWidth - 2 * margin, 16, 2, 2, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(220, 38, 38);
      doc.text(`${index + 1}. ${rec.title}`, margin + 5, yPosition + 3);
      
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      const recLines = doc.splitTextToSize(rec.description, pageWidth - 2 * margin - 10);
      doc.text(recLines, margin + 8, yPosition + 9);
      
      yPosition += 20;
    });

    // Habilidades Avaliadas
    yPosition += 5;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Habilidades Avaliadas', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    skillsData.forEach((skill, index) => {
      doc.setTextColor(60, 60, 60);
      doc.text(`${skill.skill}:`, margin + 5, yPosition);
      doc.text(`${skill.value}%`, margin + 60, yPosition);
      
      // Barra de progresso
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(margin + 75, yPosition - 3, 80, 4);
      
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin + 75, yPosition - 3, (80 * skill.value) / 100, 4, 'F');
      
      yPosition += 8;
    });

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Gerado automaticamente pela plataforma LetrarIA', margin, pageHeight - 10);
    doc.text(`Página 1 de 1`, pageWidth - margin - 20, pageHeight - 10);

    // Salvar PDF
    doc.save(`Relatorio_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Dados para gráfico radar de habilidades
  const skillsData = [
    { skill: 'Fonemas', value: 85, fullMark: 100 },
    { skill: 'Compreensão', value: 90, fullMark: 100 },
    { skill: 'Vocabulário', value: 65, fullMark: 100 },
    { skill: 'Atenção', value: 75, fullMark: 100 },
    { skill: 'Fluência', value: 80, fullMark: 100 },
    { skill: 'Expressividade', value: 70, fullMark: 100 },
  ];

  // Progresso ao longo do tempo
  const progressData = [
    { mes: 'Set', score: 65 },
    { mes: 'Out', score: 72 },
    { mes: 'Nov', score: 78 },
  ];

  // Pontos fortes e fracos
  const strengths = [
    {
      title: 'Compreensão de Texto',
      description: 'Excelente capacidade de entender o sentido geral e detalhes.',
      score: 90,
    },
    {
      title: 'Identificação de Fonemas',
      description: 'Boa pronúncia e identificação de fonemas.',
      score: 85,
    },
  ];

  const weaknesses = [
    {
      title: 'Vocabulário',
      description: 'Apresenta vocabulário limitado para a faixa etária.',
      score: 65,
      recommendation: 'Atividades de enriquecimento vocabular são recomendadas.',
    },
    {
      title: 'Expressividade',
      description: 'Dificuldade em ler com entonação adequada.',
      score: 70,
      recommendation: 'Praticar leitura em voz alta com ênfase na expressão.',
    },
  ];

  // Recomendações da IA
  const aiRecommendations = [
    {
      id: 1,
      type: 'atividade',
      title: 'Atividades de Vocabulário',
      description: 'Jogos de palavras e leitura de textos diversos para expandir vocabulário.',
      priority: 'alta',
    },
    {
      id: 2,
      type: 'exercicio',
      title: 'Leitura Expressiva',
      description: 'Exercícios de leitura dramatizada e com variação de entonação.',
      priority: 'média',
    },
    {
      id: 3,
      type: 'acompanhamento',
      title: 'Reforço em Atenção',
      description: 'Acompanhar progressão da capacidade de concentração durante leituras.',
      priority: 'média',
    },
  ];

  // Comparação com a turma
  const classComparison = [
    { categoria: 'Leitura', aluno: 78, turma: 75 },
    { categoria: 'Escrita', aluno: 72, turma: 70 },
    { categoria: 'Compreensão', aluno: 90, turma: 78 },
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
                  Relatório de Diagnóstico
                </h1>
                <p className="text-white/80 text-[12px]">{student.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overall Score Card - Redesigned */}
        <Card className="border-black/12 mb-6 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-[#155dfc] to-[#0056b9] p-6 pb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-white" />
              <h2 className="text-white font-semibold text-[18px]">Avaliação Geral</h2>
            </div>
            <p className="text-white/80 text-[13px]">
              Baseado nas respostas do diagnóstico pedagógico
            </p>
          </div>

          {/* Score Section */}
          <div className="p-6 bg-white">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Score */}
              <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-[#0056b9]/20">
                <p className="text-[12px] text-black/60 uppercase tracking-wide mb-2">
                  Pontuação
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[56px] leading-none font-bold bg-gradient-to-br from-[#155dfc] to-[#0056b9] bg-clip-text text-transparent">
                    {overallScore}
                  </span>
                  <span className="text-[20px] text-black/50 font-semibold">/100</span>
                </div>
                <Badge className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-1">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Bom Desempenho
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                {/* Evolution */}
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-green-100 rounded-lg p-2">
                      <TrendingUp className="h-5 w-5 text-green-700" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      Positivo
                    </Badge>
                  </div>
                  <p className="text-[12px] text-black/60 mb-1">
                    Evolução no último mês
                  </p>
                  <p className="text-[32px] font-bold text-green-700">+6%</p>
                </div>

                {/* Average Score */}
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <Target className="h-5 w-5 text-blue-700" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                      Meta
                    </Badge>
                  </div>
                  <p className="text-[12px] text-black/60 mb-1">
                    Média da turma
                  </p>
                  <p className="text-[32px] font-bold text-blue-700">75%</p>
                </div>

                {/* Evaluation Date */}
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-purple-100 rounded-lg p-2">
                      <Clock className="h-5 w-5 text-purple-700" />
                    </div>
                  </div>
                  <p className="text-[12px] text-black/60 mb-1">
                    Data da avaliação
                  </p>
                  <p className="text-[16px] font-semibold text-purple-900">
                    28 de Outubro, 2025
                  </p>
                </div>

                {/* Skills Evaluated */}
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-orange-100 rounded-lg p-2">
                      <Brain className="h-5 w-5 text-orange-700" />
                    </div>
                  </div>
                  <p className="text-[12px] text-black/60 mb-1">
                    Habilidades avaliadas
                  </p>
                  <p className="text-[32px] font-bold text-orange-700">6</p>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="bg-white rounded-full p-2 shadow-sm">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#030213] mb-1">
                    Resumo da Avaliação
                  </p>
                  <p className="text-[12px] text-black/70 leading-relaxed">
                    O aluno demonstra um <span className="font-semibold text-green-700">desempenho acima da média</span> na maioria das habilidades avaliadas, 
                    com destaque especial para <span className="font-semibold">compreensão de texto</span> e <span className="font-semibold">identificação de fonemas</span>. 
                    Recomenda-se atenção ao desenvolvimento de <span className="font-semibold text-orange-700">vocabulário</span> e <span className="font-semibold text-orange-700">expressividade</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Skills Radar Chart */}
          <Card className="border-black/12 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-5">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-[16px]">Mapa de Habilidades</h3>
              </div>
              <p className="text-white/80 text-[11px] mt-1 ml-10">
                Análise detalhada por competência
              </p>
            </div>
            <div className="p-6 bg-white">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Radar
                    name={student.name}
                    dataKey="value"
                    stroke="#0056b9"
                    fill="#0056b9"
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Progress Over Time */}
          <Card className="border-black/12 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-[16px]">Progresso ao Longo do Tempo</h3>
              </div>
              <p className="text-white/80 text-[11px] mt-1 ml-10">
                Evolução nos últimos 3 meses
              </p>
            </div>
            <div className="p-6 bg-white">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0056b9"
                    strokeWidth={3}
                    dot={{ fill: '#0056b9', r: 5 }}
                    name="Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <Card className="border-black/12 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-5">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-[16px]">Pontos Fortes</h3>
                <Badge className="ml-auto bg-white/20 text-white border-white/30">
                  {strengths.length}
                </Badge>
              </div>
            </div>
            <div className="p-5 space-y-3 bg-white">
              {strengths.map((strength, index) => (
                <div
                  key={index}
                  className="relative border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="absolute top-3 right-3">
                    <div className="bg-green-500 rounded-full p-1.5 shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <div className="pr-10">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[14px] font-semibold text-green-900">
                        {strength.title}
                      </p>
                    </div>
                    <p className="text-[12px] text-green-800 mb-3">{strength.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-green-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-bold text-green-700 min-w-[40px] text-right">
                        {strength.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Weaknesses */}
          <Card className="border-black/12 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-[16px]">Áreas de Melhoria</h3>
                <Badge className="ml-auto bg-white/20 text-white border-white/30">
                  {weaknesses.length}
                </Badge>
              </div>
            </div>
            <div className="p-5 space-y-3 bg-white">
              {weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="relative border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="absolute top-3 right-3">
                    <div className="bg-orange-500 rounded-full p-1.5 shadow-sm">
                      <AlertCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <div className="pr-10">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[14px] font-semibold text-orange-900">
                        {weakness.title}
                      </p>
                    </div>
                    <p className="text-[12px] text-orange-800 mb-3">
                      {weakness.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-orange-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all"
                          style={{ width: `${weakness.score}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-bold text-orange-700 min-w-[40px] text-right">
                        {weakness.score}%
                      </span>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg border border-orange-200">
                      <Brain className="h-4 w-4 text-orange-700 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-orange-900 font-medium leading-relaxed">
                        <span className="text-orange-700 font-semibold">Recomendação:</span> {weakness.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Class Comparison */}
        <Card className="border-black/12 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-5">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-white font-semibold text-[16px]">Comparação com a Turma</h3>
            </div>
            <p className="text-white/80 text-[11px] mt-1 ml-10">
              Desempenho comparado à média geral
            </p>
          </div>
          <div className="p-6 bg-white">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={classComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="categoria" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="aluno" fill="#0056b9" name={student.name} radius={[8, 8, 0, 0]} />
                <Bar dataKey="turma" fill="#94a3b8" name="Média da Turma" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-black/12 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 p-5">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-white font-semibold text-[16px]">Recomendações da IA</h3>
              <Badge className="ml-auto bg-white/20 text-white border-white/30">
                {aiRecommendations.length} sugestões
              </Badge>
            </div>
            <p className="text-white/80 text-[11px] mt-1 ml-10">
              Plano de ação personalizado
            </p>
          </div>
          <div className="p-6 bg-white">
            <div className="space-y-4">
              {aiRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`relative border-2 rounded-xl p-5 transition-all hover:shadow-lg ${
                    rec.priority === 'alta'
                      ? 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50'
                      : rec.priority === 'média'
                      ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50'
                      : 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-xl p-3 flex-shrink-0 shadow-sm ${
                        rec.priority === 'alta'
                          ? 'bg-gradient-to-br from-red-500 to-pink-500'
                          : rec.priority === 'média'
                          ? 'bg-gradient-to-br from-yellow-500 to-amber-500'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                      }`}
                    >
                      {rec.type === 'atividade' ? (
                        <Target className="h-5 w-5 text-white" />
                      ) : rec.type === 'exercicio' ? (
                        <BookOpen className="h-5 w-5 text-white" />
                      ) : (
                        <Eye className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-[15px] font-semibold text-[#030213]">
                          {rec.title}
                        </p>
                        <Badge
                          className={`${
                            rec.priority === 'alta'
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : rec.priority === 'média'
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          } font-semibold`}
                        >
                          {rec.priority === 'alta' ? '🔥 Alta' : rec.priority === 'média' ? '⚡ Média' : '📌 Baixa'}
                        </Badge>
                      </div>
                      <p className="text-[13px] text-black/80 leading-relaxed">{rec.description}</p>
                      
                      {/* Type badge */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          rec.priority === 'alta'
                            ? 'bg-red-200 text-red-800'
                            : rec.priority === 'média'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                        }`}>
                          {rec.type === 'atividade' ? '📚 Atividade' : rec.type === 'exercicio' ? '✏️ Exercício' : '👁️ Acompanhamento'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mt-6 mb-6">
          <button onClick={handleExportReport} className="h-[56px] bg-white border-2 border-[#0056b9] text-[#0056b9] rounded-[12px] font-semibold hover:bg-blue-50 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group">
            <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Exportar Relatório</span>
          </button>
          <button className="h-[56px] bg-gradient-to-r from-[#0056b9] to-[#155dfc] text-white rounded-[12px] font-semibold hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2 group">
            <Target className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Criar Plano de Ação</span>
          </button>
        </div>
      </div>
    </div>
  );
}
