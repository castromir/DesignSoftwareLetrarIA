import { useState } from "react";
import {
  Settings,
  BookOpen,
  User,
  Search,
  TrendingUp,
  CheckCircle2,
  LogOut,
  Clock,
  FileText,
  AlertCircle,
  Calendar,
  Award,
  BarChart3,
  Target,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import svgPaths from "../imports/svg-0ldat5mxwn";
import StudentProfile from "./StudentProfile";
import ReadingTrail from "./ReadingTrail";
import ReadingProgress from "./ReadingProgress";
import RecordingsList from "./RecordingsList";
import StudentTracking from "./StudentTracking";
import ExportReports from "./ExportReports";
import EditStudentDialog from "./EditStudentDialog";
import AddStudentDialog from "./AddStudentDialog";
import CreateActivity from "./CreateActivity";
import ActivitiesList from "./ActivitiesList";
import ReportsAnalytics from "./ReportsAnalytics";
import DiagnosticsList from "./DiagnosticsList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface User {
  email: string;
  type: "admin" | "professional";
  name: string;
}

interface ProfessionalHomeProps {
  user: User;
  onLogout: () => void;
}

interface Student {
  id: number;
  name: string;
  age: number;
  progress?: number;
  needsAttention?: boolean;
}

interface Activity {
  id: number;
  title: string;
  date: string;
  completed: number;
  total: number;
}

interface FullActivity {
  id: number;
  type: "reading" | "writing";
  title: string;
  description: string;
  studentIds: number[];
  scheduledDate?: Date;
  scheduledTime?: string;
  words?: string[];
  difficulty: "easy" | "medium" | "hard";
  createdAt: Date;
  status: "pending" | "in-progress" | "completed";
}

interface RecentReading {
  id: number;
  studentName: string;
  bookTitle: string;
  timeAgo: string;
  progress: number;
}

export function ProfessionalHome({
  user,
  onLogout,
}: ProfessionalHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showTrail, setShowTrail] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showRecordings, setShowRecordings] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [studentToEdit, setStudentToEdit] =
    useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] =
    useState<Student | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCreateActivity, setShowCreateActivity] =
    useState(false);
  const [showActivitiesList, setShowActivitiesList] =
    useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [returnToActivitiesList, setReturnToActivitiesList] =
    useState(false);
  const [fullActivities, setFullActivities] = useState<
    FullActivity[]
  >([
    {
      id: 1,
      type: "reading",
      title: "Leitura de palavras com R",
      description:
        "Prática de leitura focada em palavras que contêm a letra R em diferentes posições.",
      studentIds: [1, 2, 3],
      scheduledDate: new Date(2025, 9, 28),
      scheduledTime: "14:00",
      words: ["rato", "porta", "carro", "terra"],
      difficulty: "medium",
      createdAt: new Date(2025, 9, 26),
      status: "pending",
    },
    {
      id: 2,
      type: "writing",
      title: "Escrita criativa - Minha família",
      description:
        "Produção de texto descritivo sobre a família.",
      studentIds: [4, 5],
      scheduledDate: new Date(2025, 9, 29),
      scheduledTime: "10:30",
      difficulty: "easy",
      createdAt: new Date(2025, 9, 25),
      status: "in-progress",
    },
  ]);
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "João Augusto",
      age: 12,
      progress: 85,
      needsAttention: false,
    },
    {
      id: 2,
      name: "Ana Clara",
      age: 11,
      progress: 92,
      needsAttention: false,
    },
    {
      id: 3,
      name: "Júlia",
      age: 11,
      progress: 45,
      needsAttention: true,
    },
    {
      id: 4,
      name: "Manuela Oliveira",
      age: 10,
      progress: 78,
      needsAttention: false,
    },
    {
      id: 5,
      name: "Pedro Santos",
      age: 12,
      progress: 38,
      needsAttention: true,
    },
    {
      id: 6,
      name: "Beatriz Lima",
      age: 11,
      progress: 88,
      needsAttention: false,
    },
  ]);

  const activities: Activity[] = [
    {
      id: 1,
      title: "Reconhecimento de Sílabas",
      date: "2025-10-26",
      completed: 14,
      total: 19,
    },
    {
      id: 2,
      title: "Leitura de Palavras",
      date: "2025-10-25",
      completed: 19,
      total: 19,
    },
    {
      id: 3,
      title: "Formação de Frases",
      date: "2025-10-24",
      completed: 12,
      total: 19,
    },
  ];

  const recentReadings: RecentReading[] = [
    {
      id: 1,
      studentName: "Ana Clara",
      bookTitle: "O Gato de Botas",
      timeAgo: "há 15 min",
      progress: 100,
    },
    {
      id: 2,
      studentName: "João Augusto",
      bookTitle: "Chapeuzinho Vermelho",
      timeAgo: "há 32 min",
      progress: 75,
    },
    {
      id: 3,
      studentName: "Beatriz Lima",
      bookTitle: "Os Três Porquinhos",
      timeAgo: "há 1 hora",
      progress: 100,
    },
  ];

  const filteredStudents = students.filter((student) =>
    student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const studentsNeedingAttention = students.filter(
    (s) => s.needsAttention,
  );

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setProfileOpen(true);
  };

  const handleViewTrail = () => {
    setProfileOpen(false);
    setShowTrail(true);
  };

  const handleViewProgress = () => {
    setProfileOpen(false);
    setShowProgress(true);
  };

  const handleViewTracking = () => {
    setProfileOpen(false);
    setShowTracking(true);
  };

  const handleViewDiagnosticFromProfile = () => {
    setProfileOpen(false);
    setShowDiagnostic(true);
  };

  const handleViewRecordings = (story: any) => {
    setSelectedStory(story);
    setShowProgress(false);
    setShowRecordings(true);
  };

  const handleBackFromTrail = () => {
    setShowTrail(false);
    setProfileOpen(true);
  };

  const handleBackFromProgress = () => {
    setShowProgress(false);
    setProfileOpen(true);
  };

  const handleBackFromTracking = () => {
    setShowTracking(false);
    setProfileOpen(true);
  };

  const handleBackFromRecordings = () => {
    setShowRecordings(false);
    setShowProgress(true);
  };

  const handleBackFromExport = () => {
    setShowExport(false);
    setProfileOpen(true);
  };

  const handleEditStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === updatedStudent.id ? updatedStudent : s,
      ),
    );
    setSelectedStudent(updatedStudent);
  };

  const handleDeleteStudent = (studentId: number) => {
    setStudents((prev) =>
      prev.filter((s) => s.id !== studentId),
    );
    setSelectedStudent(null);
  };

  const handleViewExport = () => {
    setProfileOpen(false);
    setShowExport(true);
  };

  // Show Export Reports fullscreen
  if (showExport && selectedStudent) {
    return (
      <ExportReports
        student={selectedStudent}
        onBack={handleBackFromExport}
      />
    );
  }

  const handleEditFromList = (
    student: Student,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setStudentToEdit(student);
    setShowEditDialog(true);
  };

  const handleDeleteFromList = (
    student: Student,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setStudentToDelete(student);
    setShowDeleteAlert(true);
  };

  const handleConfirmDeleteFromList = () => {
    if (studentToDelete) {
      setStudents((prev) =>
        prev.filter((s) => s.id !== studentToDelete.id),
      );
      setStudentToDelete(null);
      setShowDeleteAlert(false);
    }
  };

  const handleSaveEditFromList = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === updatedStudent.id ? updatedStudent : s,
      ),
    );
  };

  const handleAddStudent = (newStudentData: {
    name: string;
    registration: string;
    gender: string;
    birthDate: string;
    observations: string;
  }) => {
    const birthYear = newStudentData.birthDate
      ? new Date(newStudentData.birthDate).getFullYear()
      : new Date().getFullYear() - 10;
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    const newStudent: Student = {
      id: Math.max(...students.map((s) => s.id), 0) + 1,
      name: newStudentData.name,
      age: age > 0 ? age : 10,
      progress: 0,
      needsAttention: false,
    };

    setStudents((prev) => [...prev, newStudent]);
  };

  const handleBackToHome = () => {
    setProfileOpen(false);
    setShowTrail(false);
    setShowProgress(false);
    setShowRecordings(false);
    setShowTracking(false);
    setShowExport(false);
    setShowCreateActivity(false);
    setShowActivitiesList(false);
    setSelectedStudent(null);
    setSelectedStory(null);
  };

  const handleCreateActivity = (activity: FullActivity) => {
    setFullActivities((prev) => [...prev, activity]);
  };

  const handleDeleteActivity = (id: number) => {
    setFullActivities((prev) =>
      prev.filter((a) => a.id !== id),
    );
  };

  const handleUpdateActivity = (
    updatedActivity: FullActivity,
  ) => {
    setFullActivities((prev) =>
      prev.map((a) =>
        a.id === updatedActivity.id ? updatedActivity : a,
      ),
    );
  };

  // Show Recordings List fullscreen
  if (showRecordings && selectedStudent && selectedStory) {
    return (
      <RecordingsList
        student={selectedStudent}
        storyTitle={selectedStory.title}
        onBack={handleBackFromRecordings}
      />
    );
  }

  // Show Reading Progress fullscreen
  if (showProgress && selectedStudent) {
    return (
      <ReadingProgress
        student={selectedStudent}
        onBack={handleBackFromProgress}
        onViewRecordings={handleViewRecordings}
      />
    );
  }

  // Show Student Tracking fullscreen
  if (showTracking && selectedStudent) {
    return (
      <StudentTracking
        student={selectedStudent}
        onBack={handleBackFromTracking}
      />
    );
  }

  // Show Reading Trail fullscreen
  if (showTrail && selectedStudent) {
    return (
      <ReadingTrail
        student={selectedStudent}
        onBack={handleBackFromTrail}
      />
    );
  }

  // Show Create Activity fullscreen
  if (showCreateActivity) {
    return (
      <CreateActivity
        onBack={() => {
          setShowCreateActivity(false);
          if (returnToActivitiesList) {
            setShowActivitiesList(true);
            setReturnToActivitiesList(false);
          }
        }}
        students={students}
        onCreateActivity={handleCreateActivity}
      />
    );
  }

  // Show Activities List fullscreen
  if (showActivitiesList) {
    return (
      <ActivitiesList
        onBack={() => setShowActivitiesList(false)}
        activities={fullActivities}
        students={students}
        onDeleteActivity={handleDeleteActivity}
        onUpdateActivity={handleUpdateActivity}
        onCreateActivity={() => {
          setReturnToActivitiesList(true);
          setShowActivitiesList(false);
          setShowCreateActivity(true);
        }}
      />
    );
  }

  // Show Reports Analytics fullscreen
  if (showReports) {
    return (
      <ReportsAnalytics onBack={() => setShowReports(false)} />
    );
  }

  // Show Diagnostics List fullscreen
  if (showDiagnostic) {
    return (
      <DiagnosticsList
        onBack={() => setShowDiagnostic(false)}
        students={students}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#155dfc] to-[#0056b9] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo e título */}
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold text-[17px] leading-tight">
                  Letrar IA
                </h1>
                <p className="text-white/80 text-[12px]">
                  Painel do Professor
                </p>
              </div>
            </button>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <button
                onClick={onLogout}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {/* Page Title - Desktop */}
        <h2 className="hidden lg:block text-[20px] font-semibold text-black mb-6">
          Visão geral
        </h2>

        {/* Quick Actions - Mobile/Tablet */}
        <section className="mb-5 lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowCreateActivity(true)}
              className="bg-white rounded-[10px] border border-black/12 p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="bg-blue-50 rounded-lg p-3">
                <FileText className="h-6 w-6 text-[#0056b9]" />
              </div>
              <span className="text-[13px] font-medium text-black">
                Nova Atividade
              </span>
            </button>

            <button
              onClick={() => setShowActivitiesList(true)}
              className="bg-white rounded-[10px] border border-black/12 p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="bg-blue-50 rounded-lg p-3">
                <BarChart3 className="h-6 w-6 text-[#0056b9]" />
              </div>
              <span className="text-[13px] font-medium text-black">
                Atividades
              </span>
            </button>

            <button
              onClick={() => {
                setShowDiagnostic(true);
              }}
              className="bg-white rounded-[10px] border border-black/12 p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="bg-blue-50 rounded-lg p-3">
                <ClipboardCheck className="h-6 w-6 text-[#0056b9]" />
              </div>
              <span className="text-[13px] font-medium text-black">
                Diagnóstico
              </span>
            </button>
          </div>
        </section>

        {/* Desktop Stats - Resumos da turma */}
        <section className="mb-6 hidden lg:block">
          <div className="bg-white rounded-[10px] border border-black/12 p-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Alunos ativos */}
              <div className="flex items-center gap-3 border-r border-black/8 pr-4">
                <div className="bg-blue-50 rounded-lg p-2">
                  <svg
                    className="w-6 h-7"
                    fill="none"
                    viewBox="0 0 29 32"
                  >
                    <path
                      d={svgPaths.p26f16c00}
                      fill="#0056B9"
                    />
                    <path
                      d={svgPaths.p15e5eb80}
                      fill="#0056B9"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-black/60">
                    Alunos ativos
                  </p>
                  <p className="text-[24px] font-semibold text-[#0056b9]">
                    19
                  </p>
                </div>
              </div>

              {/* Leituras concluídas hoje */}
              <div className="flex items-center gap-3 border-r border-black/8 px-4">
                <div className="bg-blue-50 rounded-lg p-2">
                  <svg
                    className="w-7 h-6"
                    fill="none"
                    viewBox="0 0 30 29"
                  >
                    <path
                      d={svgPaths.p31cef00}
                      stroke="#0056B9"
                      strokeMiterlimit="10"
                      strokeWidth="1.5"
                    />
                    <path
                      d={svgPaths.p1a700100}
                      stroke="#0056B9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-black/60">
                    Concluídas hoje
                  </p>
                  <p className="text-[24px] font-semibold text-[#0056b9]">
                    5
                  </p>
                </div>
              </div>

              {/* Taxa de engajamento */}
              <div className="flex items-center gap-3 pl-4">
                <div className="bg-blue-50 rounded-lg p-2">
                  <BarChart3 className="w-6 h-6 text-[#0056b9]" />
                </div>
                <div>
                  <p className="text-[12px] text-black/60">
                    Engajamento
                  </p>
                  <p className="text-[24px] font-semibold text-[#0056b9]">
                    87%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ações rápidas - Desktop */}
        <section className="mb-6 hidden lg:block">
          <h3 className="text-[15px] font-semibold text-black mb-3">
            Ações rápidas
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowCreateActivity(true)}
              className="bg-white rounded-[10px] border border-black/12 p-4 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FileText className="h-4 w-4 text-[#0056b9]" />
              <span className="text-[13px] text-black">
                Nova Atividade
              </span>
            </button>
            <button
              onClick={() => setShowReports(true)}
              className="bg-white rounded-[10px] border border-black/12 p-4 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <BarChart3 className="h-4 w-4 text-[#0056b9]" />
              <span className="text-[13px] text-black">
                Métricas Gerais
              </span>
            </button>
            <button
              onClick={() => setShowDiagnostic(true)}
              className="bg-white rounded-[10px] border border-black/12 p-4 flex flex-col items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ClipboardCheck className="h-4 w-4 text-[#0056b9]" />
              <span className="text-[13px] text-black">
                Diagnóstico
              </span>
            </button>
          </div>
        </section>

        {/* Insights da IA - simplified on mobile */}
        <section className="mb-5">
          <div className="bg-blue-50 rounded-[10px] border border-[rgba(0,40,173,0.25)] p-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#155dfc] rounded-lg p-2 flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-black mb-2">
                  Insights da IA
                </h4>
                {/* Mobile: only show first insight */}
                <p className="text-[13px] text-black/80 lg:hidden">
                  2 alunos apresentam dificuldade com sílabas
                  complexas. Sugerimos atividades de reforço.
                </p>
                {/* Desktop: show all insights */}
                <ul className="hidden lg:block space-y-2 text-[13px] text-black/80">
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-[#155dfc] flex-shrink-0 mt-0.5" />
                    <span>
                      2 alunos apresentam dificuldade com
                      sílabas complexas. Sugerimos atividades de
                      reforço.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-[#155dfc] flex-shrink-0 mt-0.5" />
                    <span>
                      Ana Clara e Beatriz Lima estão prontas
                      para atividades de nível avançado.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#155dfc] flex-shrink-0 mt-0.5" />
                    <span>
                      A turma teve 87% de engajamento nas
                      atividades interativas esta semana!
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Atividades em andamento - Desktop */}
        <section className="hidden lg:block mb-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Atividades */}
            <div className="col-span-2">
              <h3 className="text-[15px] font-semibold text-black mb-3">
                Atividades em andamento
              </h3>
              <div className="bg-white rounded-[10px] border border-black/12 p-4">
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="pb-3 border-b border-black/8 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-2 flex-1">
                          <FileText className="h-4 w-4 text-[#0056b9] flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[14px] font-medium text-black truncate">
                              {activity.title}
                            </h4>
                            <p className="text-[12px] text-black/60">
                              {new Date(
                                activity.date,
                              ).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <span className="text-[13px] text-[#0056b9] font-medium">
                          {activity.completed}/{activity.total}
                        </span>
                      </div>
                      <Progress
                        value={
                          (activity.completed /
                            activity.total) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 text-[13px] h-9"
                  onClick={() => setShowActivitiesList(true)}
                >
                  Ver todas as atividades
                </Button>
              </div>
            </div>

            {/* Alunos que precisam de atenção */}
            <div className="col-span-1">
              {studentsNeedingAttention.length > 0 && (
                <div>
                  <h3 className="text-[15px] font-semibold text-black mb-3">
                    Atenção necessária
                  </h3>
                  <div className="bg-amber-50 rounded-[10px] border border-amber-200 p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[12px] text-amber-800">
                        {studentsNeedingAttention.length}{" "}
                        {studentsNeedingAttention.length === 1
                          ? "aluno com"
                          : "alunos com"}{" "}
                        progresso baixo
                      </p>
                    </div>
                    <div className="space-y-2">
                      {studentsNeedingAttention.map(
                        (student) => (
                          <div
                            key={student.id}
                            className="bg-white rounded-lg p-2.5"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[13px] font-medium text-black truncate">
                                {student.name}
                              </span>
                              <span className="text-[12px] text-amber-700 font-medium">
                                {student.progress}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500"
                                style={{
                                  width: `${student.progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Meus alunos */}
        <section>
          <h3 className="text-[15px] font-semibold text-black mb-3">
            Meus alunos
          </h3>

          {/* Search and Add Button */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 lg:flex-initial lg:w-[60%]">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-black/60" />
              </div>
              <input
                type="text"
                placeholder="Buscar aluno"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[41px] bg-white rounded-[25px] border border-black/10 pl-11 pr-4 text-[13px] text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#155dfc] text-white rounded-[10px] h-[41px] px-4 hover:bg-[#155dfc]/90 flex items-center justify-between gap-2 flex-shrink-0 text-left"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline text-[13px]">
                Cadastrar aluno
              </span>
              <span className="sm:hidden text-[13px]">
                Novo
              </span>
            </Button>
          </div>

          {/* Students List */}
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-[10px] border border-black/12 p-3.5 flex items-center gap-3"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-[40px] h-[40px] rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#0056b9]" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-black truncate">
                    {student.name}
                  </p>
                  <p className="text-[12px] text-black/60">
                    {student.age} anos
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Ver detalhes"
                    onClick={() => handleViewStudent(student)}
                  >
                    <Eye className="h-4 w-4 text-[#0056b9]" />
                  </button>
                  <button
                    className="p-2 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                    title="Realizar diagnóstico"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDiagnostic(true);
                    }}
                  >
                    <ClipboardCheck className="h-4 w-4 text-purple-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Editar"
                    onClick={(e) =>
                      handleEditFromList(student, e)
                    }
                  >
                    <Pencil className="h-4 w-4 text-[#0056b9]" />
                  </button>
                  <button
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Excluir"
                    onClick={(e) =>
                      handleDeleteFromList(student, e)
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-black/60 text-[14px]">
              Nenhum aluno encontrado
            </div>
          )}
        </section>
      </main>

      {/* Student Profile Modal */}
      <StudentProfile
        student={selectedStudent}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        onViewTrail={handleViewTrail}
        onViewProgress={handleViewProgress}
        onViewTracking={handleViewTracking}
        onViewDiagnostic={handleViewDiagnosticFromProfile}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
        onExportReports={handleViewExport}
      />

      {/* Edit Student Dialog (from list) */}
      <EditStudentDialog
        student={studentToEdit}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveEditFromList}
      />

      {/* Delete Confirmation Alert (from list) */}
      <AlertDialog
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
      >
        <AlertDialogContent className="bg-white rounded-lg shadow-lg w-[calc(100%-2rem)] max-w-md p-6">
          <AlertDialogTitle className="text-[19px] font-semibold text-black mb-2">
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[14px] text-gray-600 mb-6">
            {studentToDelete &&
              `Tem certeza que deseja deletar o perfil de ${studentToDelete.name}? Esta ação não pode ser desfeita.`}
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="h-[44px] px-6 bg-gray-200 rounded-[10px] text-[14px] font-semibold text-black hover:bg-gray-300 transition-colors border-0">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteFromList}
              className="h-[44px] px-6 bg-[#d80000] rounded-[10px] text-[14px] font-semibold text-white hover:bg-[#c00000] transition-colors"
            >
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
}