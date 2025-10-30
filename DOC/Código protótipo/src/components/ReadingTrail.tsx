import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import svgPaths from "../imports/svg-zrbw3wzc3o";
import ReadingStory from "./ReadingStory";
import { cn } from "./ui/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Checkbox } from "./ui/checkbox";

interface Student {
  id: number;
  name: string;
  age: number;
}

interface ReadingTrailProps {
  student: Student | null;
  onBack: () => void;
  onViewRecordings?: (story: Story) => void;
}

interface Story {
  id: number;
  title: string;
  description: string;
  subtitle: string;
  content: string;
  status: "completed" | "pending";
}

function BookIcon() {
  return (
    <div className="relative w-[31px] h-[31px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 31 31"
      >
        <circle cx="15.5" cy="15.5" fill="#1CA8F3" r="15.5" />
        <path d={svgPaths.p2705c880} fill="white" />
      </svg>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="9" fill="none" viewBox="0 0 16 9">
      <path d={svgPaths.p154e44f0} fill="black" />
    </svg>
  );
}

interface StoryCardProps {
  story: Story;
  position: "left" | "center" | "right";
  onStart?: () => void;
  onViewRecordings?: (story: Story) => void;
}

function StoryCard({
  story,
  position,
  onStart,
  onViewRecordings,
}: StoryCardProps) {
  const isCompleted = story.status === "completed";

  return (
    <div
      className="relative w-full max-w-[331px] mx-auto h-full flex flex-col"
    >
      {/* Card */}
      <div className="bg-white rounded-[10px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col h-full">
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-[19px] font-semibold text-black">
              {story.title}
            </h3>
            <BookIcon />
          </div>
          <p className="text-[14px] font-medium text-black mb-4 line-clamp-2 flex-1">
            {story.description}
          </p>
        </div>

        {/* Action buttons or status */}
        {isCompleted ? (
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={onStart}
              className="flex-1 bg-[#9dc3ff] rounded-[10px] h-[37px] flex items-center justify-center font-semibold text-[14px] text-[#141414] hover:bg-[#8db3ef] transition-colors"
            >
              Refazer
            </button>
            <button 
              onClick={() => onViewRecordings?.(story)}
              className="flex-1 bg-[#ffbdbb] rounded-[10px] h-[37px] flex items-center justify-center font-semibold text-[14px] text-black hover:bg-[#ffadab] transition-colors">
              Ver gravações
            </button>
          </div>
        ) : (
          <button
            onClick={onStart}
            className="w-full bg-[#9fe9f5] h-[37px] flex items-center justify-center font-semibold text-[15px] text-black hover:bg-[#8fd9e5] transition-colors"
          >
            Iniciar
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReadingTrail({
  student,
  onBack,
  onViewRecordings,
}: ReadingTrailProps) {
  const [selectedStory, setSelectedStory] =
    useState<Story | null>(null);
  const [filterRead, setFilterRead] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);

  if (!student) return null;

  // Sample stories data
  const stories: Story[] = [
    {
      id: 1,
      title: "Parte 1",
      description: "O rato roeu a ropa do rei de roma...",
      subtitle: "Letras trabalhadas: R",
      content:
        "O rato roeu a ropa do rei de roma. Era um rato muito esperto que vivia no castelo real. Todos os dias ele procurava por pedaços de queijo e pão. O rei ficava muito bravo com o rato, mas nunca conseguia pegá-lo.",
      status: "completed",
    },
    {
      id: 2,
      title: "História curta",
      description:
        "O rio que corta a cidade sempre esteve presente...",
      subtitle: "Letras trabalhadas: R e L",
      content: `O rio que corta a cidade sempre esteve presente na vida das pessoas.
Suas margens já foram locais de encontro, de trabalho e de descanso.
Nas manhãs, é comum observar remadores, caminhantes e estudantes atravessando as pontes.
À noite, as luzes dos prédios refletem na água e criam um cenário que mistura movimento e tranquilidade.
Ler sobre o rio é também lembrar como a natureza e a rotina urbana convivem lado a lado.

Ao longo do dia, o rio recebe diferentes visitantes. Alguns jogam sementes para os patos, outros apenas se sentam à beira da água para descansar ou conversar. É um espaço que mistura silêncio e movimento, onde cada pessoa encontra seu próprio ritmo.
As árvores que margeiam o rio oferecem sombra e refúgio, e em algumas épocas do ano florescem, colorindo a paisagem e atraindo pássaros que cantam sobre a água.

Além da beleza, o rio carrega histórias antigas. Antigamente, suas águas eram usadas para transporte e pequenas embarcações cruzavam suas margens carregando mercadorias. Hoje, ele ainda lembra aos moradores que a cidade cresceu ao seu redor, mas que a presença da natureza continua essencial.

Caminhar por suas margens é perceber detalhes que passam despercebidos no dia a dia: pequenas conchas, folhas levadas pela correnteza e peixes que surgem de vez em quando. É também um convite à reflexão, mostrando como a vida urbana e os elementos naturais podem coexistir de forma harmoniosa, criando um espaço de encontro entre passado e presente.`,
      status: "pending",
    },
    {
      id: 3,
      title: "Parte 2",
      description:
        "O xerife xereta xeretou o xaxim do xisto...",
      subtitle: "Letras trabalhadas: X",
      content:
        "O xerife xereta xeretou o xaxim do xisto. Ele gostava muito de xadrez e xixi de xale. Todas as quintas-feiras ele tocava xilofone na praça da cidade.",
      status: "pending",
    },
    {
      id: 4,
      title: "História curta",
      description: "Neque porro quisquam est, qui dolorem...",
      subtitle: "Letras trabalhadas: R e L",
      content:
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      status: "pending",
    },
    {
      id: 5,
      title: "Texto 3",
      description: "Sed ut perspiciatis unde omnis iste natus...",
      subtitle: "Letras trabalhadas: S e T",
      content:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      status: "pending",
    },
    {
      id: 6,
      title: "História curta",
      description: "Lorem ipsum dolor sit amet, consectetur...",
      subtitle: "Letras trabalhadas: L e M",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      status: "pending",
    },
  ];

  const handleStartStory = (story: Story) => {
    setSelectedStory(story);
  };

  const handleBackFromStory = () => {
    setSelectedStory(null);
  };

  // Sort stories based on filters
  const sortedStories = [...stories].sort((a, b) => {
    // If both filters are active or none are active, keep original order
    if ((filterRead && filterUnread) || (!filterRead && !filterUnread)) {
      return 0;
    }

    // If only "read" filter is active
    if (filterRead && !filterUnread) {
      if (a.status === "completed" && b.status === "pending") return -1;
      if (a.status === "pending" && b.status === "completed") return 1;
      return 0;
    }

    // If only "unread" filter is active
    if (filterUnread && !filterRead) {
      if (a.status === "pending" && b.status === "completed") return -1;
      if (a.status === "completed" && b.status === "pending") return 1;
      return 0;
    }

    return 0;
  });

  // Show Reading Story
  if (selectedStory) {
    return (
      <ReadingStory
        student={student}
        storyTitle={selectedStory.title}
        storySubtitle={selectedStory.subtitle}
        storyContent={selectedStory.content}
        onBack={handleBackFromStory}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-black/30 px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-lg transition-colors -ml-2 cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-[19px] font-semibold text-black flex-1">
          Trilha de leitura - {student.name}
        </h1>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Section Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[20px] font-semibold text-black">
              Histórias
            </h2>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 text-[14px] font-medium text-black hover:bg-gray-200 rounded-lg px-3 py-1 transition-colors">
                  Filtros
                  <FilterIcon />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-4">
                  <h3 className="font-semibold text-black">Filtrar por:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-read"
                        checked={filterRead}
                        onCheckedChange={(checked) => {
                          setFilterRead(checked as boolean);
                          if (checked) setFilterUnread(false);
                        }}
                      />
                      <label
                        htmlFor="filter-read"
                        className="text-[14px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Textos já lidos
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-unread"
                        checked={filterUnread}
                        onCheckedChange={(checked) => {
                          setFilterUnread(checked as boolean);
                          if (checked) setFilterRead(false);
                        }}
                      />
                      <label
                        htmlFor="filter-unread"
                        className="text-[14px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Textos não lidos
                      </label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="h-px bg-black/30" />
        </div>

        {/* Stories Timeline */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-x-[9px] gap-y-10 max-w-6xl mx-auto">
          {sortedStories.map((story, index) => (
            <StoryCard
              key={story.id}
              story={story}
              position={
                index === 1
                  ? "center"
                  : index === 0
                    ? "left"
                    : "right"
              }
              onStart={() => handleStartStory(story)}
              onViewRecordings={onViewRecordings}
            />
          ))}
        </div>
      </div>
    </div>
  );
}