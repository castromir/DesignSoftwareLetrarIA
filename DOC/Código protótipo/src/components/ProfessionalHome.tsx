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
import StudentTracking from "./StudentTracking";
import ExportReports from "./ExportReports";
import EditStudentDialog from "./EditStudentDialog";
import AddStudentDialog from "./AddStudentDialog";
import CreateActivity from "./CreateActivity";
import ActivitiesList from "./ActivitiesList";
import ReportsAnalytics from "./ReportsAnalytics";
import DiagnosticsList from "./DiagnosticsList";
import TextReader from "./TextReader";
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
  const [showTextReader, setShowTextReader] = useState(false);
  const [selectedText, setSelectedText] = useState<{
    id: number;
    title: string;
    subtitle: string;
    content: string;
  } | null>(null);
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

  const textLibrary = [
    {
      id: 1,
      title: "O Gatinho Curioso",
      subtitle: "Letras trabalhadas: G, C, T, R",
      tags: [
        { name: "Histórias", color: "blue" },
        { name: "Iniciante", color: "green" },
      ],
      content: `Era uma vez um gatinho chamado Mimi. Mimi era muito curioso e adorava explorar.

Um dia, Mimi viu uma borboleta colorida no jardim. Ele correu atrás dela, pulando e brincando.

A borboleta voou até uma árvore alta. Mimi tentou subir, mas era difícil. Ele miou pedindo ajuda.

Sua dona Maria veio e o ajudou a descer. Mimi aprendeu que nem sempre é bom ser muito curioso.

Agora Mimi é mais cuidadoso em suas aventuras pelo jardim.`,
    },
    {
      id: 2,
      title: "O Jardim da Vovó",
      subtitle: "Letras trabalhadas: J, V, F, L",
      tags: [
        { name: "Natureza", color: "green" },
        { name: "Iniciante", color: "green" },
      ],
      content: `A vovó Lurdes tem um jardim lindo. Lá tem muitas flores coloridas.

Ela planta rosas vermelhas, margaridas brancas e girassóis amarelos.

Todo dia ela rega as plantas com seu regador verde. As flores crescem bonitas e alegres.

Os passarinhos gostam de visitar o jardim. Eles cantam e pulam de galho em galho.

A vovó fica feliz vendo seu jardim florido. É o lugar mais bonito da casa.`,
    },
    {
      id: 3,
      title: "O Dia da Chuva",
      subtitle: "Letras trabalhadas: CH, D, P, B",
      tags: [
        { name: "Cotidiano", color: "purple" },
        { name: "Iniciante", color: "green" },
      ],
      content: `Pedro acordou e olhou pela janela. O céu estava cinza e começou a chover.

As gotas de chuva batiam no vidro fazendo um barulho gostoso. Plim, plim, plim!

Pedro pegou sua capa de chuva amarela e suas botas de borracha vermelhas.

Ele saiu para brincar nas poças de água. Que divertido! Splash, splash!

A chuva parou e apareceu um lindo arco-íris no céu. Pedro ficou encantado.`,
    },
    {
      id: 4,
      title: "A Festa de Aniversário",
      subtitle: "Letras trabalhadas: F, N, S, B",
      tags: [
        { name: "Celebrações", color: "pink" },
        { name: "Intermediário", color: "orange" },
      ],
      content: `Hoje é o aniversário de Sofia. Ela está fazendo oito anos!

A casa está toda enfeitada com balões coloridos e bandeirinhas. Tem bolo de chocolate com morango.

Os amigos chegaram trazendo presentes. Eles brincaram de dança das cadeiras e corrida do saco.

Na hora do parabéns, todos cantaram bem alto. Sofia soprou as velinhas fazendo um pedido secreto.

Foi a melhor festa do ano! Sofia agradeceu a todos pela presença e pelos lindos presentes.`,
    },
    {
      id: 5,
      title: "O Passeio no Parque",
      subtitle: "Letras trabalhadas: P, C, R, QU",
      tags: [
        { name: "Natureza", color: "green" },
        { name: "Intermediário", color: "orange" },
      ],
      content: `No domingo, a família de Lucas foi ao parque. O sol brilhava no céu azul.

Lucas levou sua bola e sua bicicleta nova. Ele pedalou pelo caminho vendo as árvores e flores.

Encontrou seus amigos no parquinho. Eles subiram no escorregador e brincaram no balanço.

Depois, fizeram um piquenique na grama. Comeram sanduíches, frutas e suco gelado.

No fim da tarde, todos voltaram para casa cansados mas muito felizes com o passeio.`,
    },
    {
      id: 6,
      title: "A Escola Nova",
      subtitle: "Letras trabalhadas: SC, N, M, L",
      tags: [
        { name: "Escola", color: "blue" },
        { name: "Intermediário", color: "orange" },
      ],
      content: `Marina estava nervosa. Era seu primeiro dia na escola nova.

Ela colocou seu uniforme e arrumou a mochila com muito cuidado. Lápis, caderno e estojo novinho.

Ao chegar na escola, a professora Ana a recebeu com um sorriso. A sala era colorida e acolhedora.

Marina conheceu seus novos colegas. Eles foram muito gentis e a convidaram para brincar no recreio.

No final do dia, Marina estava feliz. Tinha feito novos amigos e adorado sua escola nova.`,
    },
    {
      id: 7,
      title: "O Cachorro Herói",
      subtitle: "Letras trabalhadas: CH, RR, LH, NH",
      tags: [
        { name: "Histórias", color: "blue" },
        { name: "Avançado", color: "red" },
      ],
      content: `Rex era um cachorro corajoso que morava com a família Silva. Ele sempre cuidava da casa.

Uma noite, Rex ouviu um barulho estranho. Ele latiu forte para acordar todos. Au! Au! Au!

Havia fumaça saindo da cozinha. Um pano de prato tinha pegado fogo perto do fogão.

O papai acordou rapidamente e apagou o fogo. Por sorte, ninguém se machucou.

Todos agradeceram ao Rex. Ele tinha salvado a família! Rex ganhou um osso especial de recompensa.

Desde então, Rex é conhecido no bairro como o cachorro herói que salvou sua família.`,
    },
    {
      id: 8,
      title: "A Viagem de Férias",
      subtitle: "Letras trabalhadas: GU, QU, ÇÃO, SS",
      tags: [
        { name: "Aventuras", color: "purple" },
        { name: "Avançado", color: "red" },
      ],
      content: `Nas férias de julho, Beatriz viajou com seus pais para a praia. Que emoção!

Eles fizeram uma viagem longa de carro. Passaram por montanhas, túneis e pequenas cidades.

Quando chegaram, Beatriz viu o mar pela primeira vez. Era enorme e brilhante!

Ela brincou na areia construindo castelos, procurou conchinhas e mergulhou nas ondas.

À noite, provaram comidas deliciosas em restaurantes à beira-mar. Tinha peixe fresco e camarão.

Beatriz tirou muitas fotos para guardar as lembranças. Foi a melhor viagem da sua vida!

Quando voltou para casa, ela já estava com saudade da praia e planejando a próxima aventura.`,
    },
  ];

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

  const handleBackFromRecordings = () => {
    setShowRecordings(false);
    setShowTrail(true);
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
        students={students}
        selectedStudentId={selectedStudent.id}
        onStudentChange={(studentId) => {
          const newStudent = students.find(s => s.id === studentId);
          if (newStudent) {
            setSelectedStudent(newStudent);
          }
        }}
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

  const handlePrintAllTexts = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const textContent = textLibrary
        .map((text, index) => {
          return `
            <div style="page-break-after: ${index === textLibrary.length - 1 ? 'auto' : 'always'}; padding: 20px;">
              <h2>${text.title}</h2>
              <p><strong>${text.subtitle}</strong></p>
              <p><strong>Tags:</strong> ${text.tags.map(t => t.name).join(', ')}</p>
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

  const handleReadText = (text: typeof textLibrary[0]) => {
    setSelectedText({
      id: text.id,
      title: text.title,
      subtitle: text.subtitle,
      content: text.content,
    });
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

  // Show Text Reader fullscreen
  if (showTextReader && selectedText) {
    return (
      <TextReader
        textId={selectedText.id}
        textTitle={selectedText.title}
        textSubtitle={selectedText.subtitle}
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
            {textLibrary.map((text) => (
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
                  {text.tags.map((tag, index) => {
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