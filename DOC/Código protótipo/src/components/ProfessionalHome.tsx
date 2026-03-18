import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Printer,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import svgPaths from "../imports/svg-0ldat5mxwn";
import StudentProfile from "./StudentProfile";
import ReadingTrail from "./ReadingTrail";
import ReadingProgress from "./ReadingProgress";
import RecordingsList from "./RecordingsList";
import RecordingsTimeline from "./RecordingsTimeline";
import StudentTracking from "./StudentTracking";
import ExportReports from "./ExportReports";
import EditStudentDialog from "./EditStudentDialog";
import AddStudentDialog from "./AddStudentDialog";
import CreateActivity from "./CreateActivity";
import ActivitiesList from "./ActivitiesList";
import ReportsAnalytics from "./ReportsAnalytics";
import DiagnosticsList from "./DiagnosticsList";
import TextReader from "./TextReader";
import StudentActivitiesPanel from "./StudentActivitiesPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useStudents } from "../hooks/useStudents";
import { useActivities } from "../hooks/useActivities";
import { useTextLibrary } from "../hooks/useTextLibrary";
import { useAuth } from "../contexts/AuthContext";
import type { Student as StudentType, Activity, ActivityCreate, ActivityUpdate, TextLibrary } from "../types";
import { Alert, AlertDescription } from "./ui/alert";

interface User {
  email: string;
  type: "admin" | "professional";
  name: string;
}

interface ProfessionalHomeProps {
  user: User;
  onLogout: () => void;
}

export function ProfessionalHome({
  user,
  onLogout,
}: ProfessionalHomeProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const professionalId = currentUser?.id;

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  const {
    students,
    stats,
    isLoading: studentsLoading,
    error: studentsError,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudents(professionalId);

  const {
    activities,
    stats: activitiesStats,
    isLoading: activitiesLoading,
    error: activitiesError,
    createActivity,
    updateActivity,
    deleteActivity,
  } = useActivities(professionalId);

  const { texts, fetchTexts } = useTextLibrary();
  useEffect(() => { fetchTexts(); }, [fetchTexts]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentType | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showTrail, setShowTrail] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showRecordings, setShowRecordings] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showStudentActivities, setShowStudentActivities] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [studentToEdit, setStudentToEdit] =
    useState<StudentType | null>(null);
  const [studentToDelete, setStudentToDelete] =
    useState<StudentType | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCreateActivity, setShowCreateActivity] =
    useState(false);
  const [showActivitiesList, setShowActivitiesList] =
    useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [returnToActivitiesList, setReturnToActivitiesList] =
    useState(false);
  const [showTextReader, setShowTextReader] = useState(false);
  const [selectedText, setSelectedText] = useState<TextLibrary | null>(null);

  const activitiesSummary = activities
    .filter(a => a.status === 'in_progress')
    .slice(0, 3)
    .map(activity => ({
      id: activity.id,
      title: activity.title,
      date: activity.scheduled_date || activity.created_at.split('T')[0],
      completed: 0,
      total: activity.student_ids?.length || 0,
    }));


  const filteredStudents = students.filter((student) =>
    student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // Calculate age from birth_date for display
  const getStudentAge = (student: StudentType): number => {
    if (student.age) return student.age;
    if (student.birth_date) {
      const birthDate = new Date(student.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return 0;
  };

  const studentsNeedingAttention = students.filter(
    (s) => s.status === "inactive",
  );

  const handleViewStudent = (student: StudentType) => {
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

  const handleViewStudentActivities = () => {
    setProfileOpen(false);
    setShowStudentActivities(true);
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

  const handleViewRecordingsFromTrail = (story: any) => {
    setSelectedStory(story);
    setShowTrail(false);
    setShowRecordings(true);
  };

  const handleBackFromProgress = () => {
    setShowProgress(false);
    setProfileOpen(true);
  };

  const handleBackFromTracking = () => {
    setShowTracking(false);
    setProfileOpen(true);
  };

  const handleBackFromStudentActivities = () => {
    setShowStudentActivities(false);
    setProfileOpen(true);
  };

  const handleBackFromRecordings = () => {
    setShowRecordings(false);
    setShowTrail(true);
  };

  const handleBackFromExport = () => {
    setShowExport(false);
    setProfileOpen(true);
  };

  const handleEditStudent = async (updatedStudent: StudentType) => {
    if (!updatedStudent.id) return;
    try {
      await updateStudent(updatedStudent.id, {
        name: updatedStudent.name,
        age: updatedStudent.age,
        birth_date: updatedStudent.birth_date,
        gender: updatedStudent.gender,
        registration: updatedStudent.registration,
        observations: updatedStudent.observations,
        status: updatedStudent.status,
      });
      const refreshed = students.find(s => s.id === updatedStudent.id);
      if (refreshed) {
        setSelectedStudent(refreshed);
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteStudent(studentId);
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleViewExport = () => {
    setProfileOpen(false);
    setShowExport(true);
  };

  // Show Export Reports fullscreen
  if (showExport && selectedStudent) {
    return (
      <ExportReports
        students={students}
        selectedStudentId={selectedStudent.id}
        onStudentChange={(studentId) => {
          const newStudent = students.find((student) => student.id === studentId);
          if (newStudent) {
            setSelectedStudent(newStudent);
          }
        }}
        onBack={handleBackFromExport}
        onReportCreated={() => {
          setShowExport(false);
          setShowReports(true);
        }}
      />
    );
  }

  const handleEditFromList = (
    student: StudentType,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setStudentToEdit(student);
    setShowEditDialog(true);
  };

  const handleDeleteFromList = (
    student: StudentType,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setStudentToDelete(student);
    setShowDeleteAlert(true);
  };

  const handleConfirmDeleteFromList = async () => {
    if (studentToDelete?.id) {
      try {
        await deleteStudent(studentToDelete.id);
        setStudentToDelete(null);
        setShowDeleteAlert(false);
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleSaveEditFromList = async (updatedStudent: StudentType) => {
    if (!updatedStudent.id) return;
    try {
      await updateStudent(updatedStudent.id, {
        name: updatedStudent.name,
        age: updatedStudent.age,
        birth_date: updatedStudent.birth_date,
        gender: updatedStudent.gender,
        registration: updatedStudent.registration,
        observations: updatedStudent.observations,
        status: updatedStudent.status,
      });
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleAddStudent = async (newStudentData: {
    name: string;
    registration: string;
    gender: string;
    birthDate: string;
    observations: string;
  }) => {
    if (!professionalId) {
      alert("Erro: ID do profissional não encontrado");
      return;
    }

    try {
      // Calculate age from birth date
      let age: number | undefined;
      if (newStudentData.birthDate) {
        const birthDate = new Date(newStudentData.birthDate);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      // Map gender to backend format
      const genderMap: Record<string, "male" | "female" | "other" | undefined> = {
        "masculino": "male",
        "feminino": "female",
        "outro": "other",
        "preferir-nao-informar": undefined,
      };

      await createStudent({
        name: newStudentData.name,
        professional_id: professionalId,
        registration: newStudentData.registration || undefined,
        gender: genderMap[newStudentData.gender],
        birth_date: newStudentData.birthDate || undefined,
        age: age,
        observations: newStudentData.observations || undefined,
        status: "active",
      });
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Erro ao cadastrar aluno. Tente novamente.");
    }
  };

  const handlePrintAllTexts = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const textContent = texts
        .map((text, index) => {
          return `
            <div style="page-break-after: ${index === texts.length - 1 ? 'auto' : 'always'}; padding: 20px;">
              <h2>${text.title}</h2>
              <p><strong>${text.subtitle}</strong></p>
              <p><strong>Tags:</strong> ${(text.tags ?? []).map(t => t.name).join(', ')}</p>
              <hr />
              <div style="margin-top: 20px; white-space: pre-line;">${text.content}</div>
            </div>
          `;
        })
        .join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Biblioteca de Textos - Imprimir Todos</title>
            <style>
              body { font-family: Arial, sans-serif; }
              h2 { color: #0056b9; }
            </style>
          </head>
          <body>
            <h1 style="text-align: center; color: #0056b9;">Biblioteca de Textos</h1>
            ${textContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleReadText = (text: TextLibrary) => {
    setSelectedText(text);
    setShowTextReader(true);
  };

  const handleBackFromTextReader = () => {
    setShowTextReader(false);
    setSelectedText(null);
  };

  const getTagColor = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700' },
      green: { bg: 'bg-green-50', text: 'text-green-700' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-700' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700' },
      red: { bg: 'bg-red-50', text: 'text-red-700' },
    };
    return colors[color] || colors.blue;
  };

  const handleBackToHome = () => {
    setProfileOpen(false);
    setShowTrail(false);
    setShowProgress(false);
    setShowRecordings(false);
    setShowTracking(false);
    setShowExport(false);
    setShowStudentActivities(false);
    setShowCreateActivity(false);
    setShowActivitiesList(false);
    setSelectedStudent(null);
    setSelectedStory(null);
  };

  const handleCreateActivity = async (activityData: ActivityCreate) => {
    try {
      await createActivity(activityData);
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteActivity(id);
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  };

  const handleUpdateActivity = async (updatedActivity: Activity) => {
    try {
      const updateData: ActivityUpdate = {
        title: updatedActivity.title,
        description: updatedActivity.description,
        type: updatedActivity.type,
        difficulty: updatedActivity.difficulty,
        scheduled_date: updatedActivity.scheduled_date,
        scheduled_time: updatedActivity.scheduled_time,
        words: updatedActivity.words,
        status: updatedActivity.status,
        student_ids: updatedActivity.student_ids,
      };
      await updateActivity(updatedActivity.id, updateData);
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  };

  // Show Recordings Timeline fullscreen
  if (showTimeline && selectedStudent && selectedStory) {
    return (
      <RecordingsTimeline
        student={selectedStudent}
        storyId={selectedStory.id || selectedStory.storyId || ""}
        storyTitle={selectedStory.title || selectedStory.storyTitle || ""}
        onBack={() => {
          setShowTimeline(false);
          setShowRecordings(true);
        }}
      />
    );
  }

  // Show Recordings List fullscreen
  if (showRecordings && selectedStudent && selectedStory) {
    return (
      <RecordingsList
        student={selectedStudent}
        storyId={selectedStory.id || selectedStory.storyId || ""}
        storyTitle={selectedStory.title || selectedStory.storyTitle || ""}
        storyContent={selectedStory.content || ""}
        onBack={handleBackFromRecordings}
        onCompare={() => {
          setShowRecordings(false);
          setShowTimeline(true);
        }}
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

  if (showStudentActivities && selectedStudent) {
    return (
      <StudentActivitiesPanel
        student={selectedStudent}
        onBack={handleBackFromStudentActivities}
      />
    );
  }

  // Show Reading Trail fullscreen
  if (showTrail && selectedStudent) {
    return (
      <ReadingTrail
        student={selectedStudent}
        onBack={handleBackFromTrail}
        onViewRecordings={handleViewRecordingsFromTrail}
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
        activities={activities}
        students={students}
        stats={activitiesStats}
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

  // Show Text Reader fullscreen
  if (showTextReader && selectedText) {
    return (
      <TextReader
        textId={selectedText.id}
        textTitle={selectedText.title}
        textSubtitle={selectedText.subtitle ?? ''}
        textContent={selectedText.content}
        onBack={handleBackFromTextReader}
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
                onClick={handleLogout}
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
        {/* Error Alerts */}
        {studentsError && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {studentsError}
            </AlertDescription>
          </Alert>
        )}

        {activitiesError && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {activitiesError}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading Alerts */}
        {studentsLoading && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              Carregando alunos...
            </AlertDescription>
          </Alert>
        )}

        {activitiesLoading && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              Carregando atividades...
            </AlertDescription>
          </Alert>
        )}

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
                    {stats.active}
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
                {activitiesSummary.length === 0 ? (
                  <div className="text-center py-8 text-black/60 text-[14px]">
                    Nenhuma atividade em andamento
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activitiesSummary.map((activity) => (
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
                            activity.total > 0
                              ? (activity.completed / activity.total) * 100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                )}
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
                                Inativo
                              </span>
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

        {/* Biblioteca de Textos */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-black">
              Biblioteca de Textos
            </h3>
            <button
              onClick={handlePrintAllTexts}
              className="flex items-center gap-2 text-[#0056b9] hover:text-[#004080] transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span className="text-[13px]">Imprimir Todos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {texts.map((text) => (
              <div
                key={text.id}
                className="bg-white rounded-[10px] border border-black/12 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-50 rounded-lg p-2 flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-[#0056b9]" />
                  </div>
                  <h4 className="text-[14px] font-medium text-black flex-1 line-clamp-2">
                    {text.title}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {(text.tags ?? []).map((tag, index) => {
                    const tagColors = getTagColor(tag.color);
                    return (
                      <span
                        key={index}
                        className={`${tagColors.bg} ${tagColors.text} px-2 py-1 rounded text-[11px] font-medium`}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleReadText(text)}
                  className="w-full flex items-center justify-between text-[#0056b9] hover:text-[#004080] transition-colors cursor-pointer group"
                >
                  <span className="text-[13px]">Ler texto</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
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
                    {getStudentAge(student)} anos
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
        onViewStudentActivities={handleViewStudentActivities}
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