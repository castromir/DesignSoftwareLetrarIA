import { useState } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  FileText, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  Eye,
  User,
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import StudentDiagnostic from './StudentDiagnostic';
import DiagnosticResult from './DiagnosticResult';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface DiagnosticRecord {
  id: number;
  studentId: number;
  studentName: string;
  studentAge: number;
  date: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  status: 'completed' | 'pending';
}

interface DiagnosticsListProps {
  onBack: () => void;
  students: Student[];
}

export default function DiagnosticsList({ onBack, students }: DiagnosticsListProps) {
  const [showNewDiagnostic, setShowNewDiagnostic] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showStudentSelector, setShowStudentSelector] = useState(false);

  // Mock data de diagnósticos
  const diagnostics: DiagnosticRecord[] = [
    {
      id: 1,
      studentId: 2,
      studentName: 'João Augusto',
      studentAge: 8,
      date: '2025-10-28',
      score: 78,
      trend: 'up',
      status: 'completed',
    },
    {
      id: 2,
      studentId: 1,
      studentName: 'Ana Clara',
      studentAge: 7,
      date: '2025-10-25',
      score: 85,
      trend: 'up',
      status: 'completed',
    },
    {
      id: 3,
      studentId: 3,
      studentName: 'Beatriz Lima',
      studentAge: 9,
      date: '2025-10-20',
      score: 72,
      trend: 'stable',
      status: 'completed',
    },
    {
      id: 4,
      studentId: 4,
      studentName: 'Carlos Silva',
      studentAge: 8,
      date: '2025-10-15',
      score: 65,
      trend: 'down',
      status: 'completed',
    },
  ];

  const filteredDiagnostics = diagnostics.filter((diag) => {
    const matchesSearch = diag.studentName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || diag.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDiagnostic = (diagnostic: DiagnosticRecord) => {
    setSelectedDiagnostic(diagnostic);
    setSelectedStudent({
      id: diagnostic.studentId,
      name: diagnostic.studentName,
      age: diagnostic.studentAge,
    });
    setShowResult(true);
  };

  const handleNewDiagnostic = () => {
    setShowStudentSelector(true);
  };

  const handleSelectStudent = (studentId: string) => {
    const student = students.find((s) => s.id === parseInt(studentId));
    if (student) {
      setSelectedStudent(student);
      setShowStudentSelector(false);
      setShowNewDiagnostic(true);
    }
  };

  const handleBackFromDiagnostic = () => {
    setShowNewDiagnostic(false);
    setSelectedStudent(null);
  };

  const handleBackFromResult = () => {
    setShowResult(false);
    setSelectedDiagnostic(null);
    setSelectedStudent(null);
  };

  // Show student selector
  if (showStudentSelector) {
    return (
      <div className="min-h-screen bg-[#f0f0f0]">
        <header className="bg-gradient-to-br from-[#155dfc] to-[#0056b9] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowStudentSelector(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <div>
                  <h1 className="text-white font-semibold text-[17px] leading-tight">
                    Selecionar Aluno
                  </h1>
                  <p className="text-white/80 text-[12px]">
                    Escolha o aluno para realizar o diagnóstico
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-6">
          <Card className="p-6 border-black/12">
            <div className="space-y-4">
              <div>
                <label className="text-[14px] font-medium text-black mb-2 block">
                  Selecione o aluno
                </label>
                <Select onValueChange={handleSelectStudent}>
                  <SelectTrigger className="w-full h-[50px] rounded-[10px] border-black/20">
                    <SelectValue placeholder="Escolha um aluno..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[#0056b9]" />
                          <span>{student.name}</span>
                          <span className="text-black/50 text-[12px]">
                            ({student.age} anos)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show new diagnostic form
  if (showNewDiagnostic && selectedStudent) {
    return (
      <StudentDiagnostic 
        student={selectedStudent} 
        onBack={handleBackFromDiagnostic} 
      />
    );
  }

  // Show diagnostic result
  if (showResult && selectedStudent && selectedDiagnostic) {
    return (
      <DiagnosticResult
        student={selectedStudent}
        onBack={handleBackFromResult}
        diagnosticData={selectedDiagnostic}
      />
    );
  }

  // Main list view
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
                  Diagnósticos
                </h1>
                <p className="text-white/80 text-[12px]">
                  Gerenciar avaliações pedagógicas
                </p>
              </div>
            </div>
            <button
              onClick={handleNewDiagnostic}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span className="text-[13px] font-medium">Novo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 border-black/12 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700">Total</Badge>
            </div>
            <p className="text-[28px] font-bold text-blue-900">{diagnostics.length}</p>
            <p className="text-[12px] text-blue-700">Diagnósticos realizados</p>
          </Card>

          <Card className="p-5 border-black/12 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <Badge className="bg-green-100 text-green-700">Média</Badge>
            </div>
            <p className="text-[28px] font-bold text-green-900">75%</p>
            <p className="text-[12px] text-green-700">Score médio geral</p>
          </Card>

          <Card className="p-5 border-black/12 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-700">Recente</Badge>
            </div>
            <p className="text-[28px] font-bold text-purple-900">3</p>
            <p className="text-[12px] text-purple-700">Este mês</p>
          </Card>

          <Card className="p-5 border-black/12 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="flex items-center justify-between mb-2">
              <User className="h-5 w-5 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-700">Alunos</Badge>
            </div>
            <p className="text-[28px] font-bold text-orange-900">{students.length}</p>
            <p className="text-[12px] text-orange-700">Total cadastrados</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 border-black/12 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
              <input
                type="text"
                placeholder="Buscar por aluno..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 rounded-lg border border-black/20 text-[14px] focus:outline-none focus:border-[#0056b9] transition-colors"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px] h-[44px] rounded-lg border-black/20">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-black/40" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Completos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Diagnostics List */}
        {filteredDiagnostics.length === 0 ? (
          <Card className="p-12 border-black/12 text-center">
            <FileText className="h-12 w-12 text-black/20 mx-auto mb-4" />
            <p className="text-[16px] font-medium text-black/60 mb-2">
              Nenhum diagnóstico encontrado
            </p>
            <p className="text-[13px] text-black/40 mb-6">
              Comece realizando um novo diagnóstico pedagógico
            </p>
            <button
              onClick={handleNewDiagnostic}
              className="bg-[#0056b9] hover:bg-[#004494] text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Realizar Diagnóstico
            </button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDiagnostics.map((diagnostic) => (
              <Card
                key={diagnostic.id}
                className="p-5 border-black/12 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDiagnostic(diagnostic)}
              >
                <div className="flex items-start gap-4">
                  {/* Student Avatar */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-[16px]">
                      {diagnostic.studentName.charAt(0)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-[15px] font-semibold text-[#030213]">
                          {diagnostic.studentName}
                        </h3>
                        <p className="text-[12px] text-black/60">
                          {diagnostic.studentAge} anos
                        </p>
                      </div>
                      <Badge
                        className={`${
                          diagnostic.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {diagnostic.status === 'completed' ? 'Completo' : 'Pendente'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Date */}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-black/40" />
                        <span className="text-[12px] text-black/60">
                          {new Date(diagnostic.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 rounded-full px-3 py-1">
                          <span className="text-[13px] font-bold text-blue-700">
                            {diagnostic.score}%
                          </span>
                        </div>
                      </div>

                      {/* Trend */}
                      <div className="flex items-center gap-1">
                        {diagnostic.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : diagnostic.trend === 'down' ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-600" />
                        )}
                        <span
                          className={`text-[11px] font-medium ${
                            diagnostic.trend === 'up'
                              ? 'text-green-600'
                              : diagnostic.trend === 'down'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {diagnostic.trend === 'up'
                            ? 'Melhorou'
                            : diagnostic.trend === 'down'
                            ? 'Piorou'
                            : 'Estável'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <Eye className="h-5 w-5 text-[#0056b9]" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Floating Action Button for Mobile */}
        <button
          onClick={handleNewDiagnostic}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#0056b9] to-[#155dfc] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer lg:hidden"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
