import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import svgPaths from '../imports/svg-zrbw3wzc3o';
import ReadingStory from './ReadingStory';
import { cn } from './ui/utils';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface ReadingTrailProps {
  student: Student | null;
  onBack: () => void;
}

interface Story {
  id: number;
  title: string;
  description: string;
  subtitle: string;
  content: string;
  status: 'completed' | 'pending';
}

function BookIcon() {
  return (
    <div className="relative w-[31px] h-[31px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
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
  position: 'left' | 'center' | 'right';
  onStart?: () => void;
}

function StoryCard({ story, position, onStart }: StoryCardProps) {
  const isCompleted = story.status === 'completed';
  
  return (
    <div className={cn(
      "relative w-full max-w-[331px] mx-auto",
      position === 'center' && "md:max-w-[248px]"
    )}>
      {/* Card */}
      <div className="bg-white rounded-[10px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-[19px] font-semibold text-black">{story.title}</h3>
            <BookIcon />
          </div>
          <p className="text-[14px] font-medium text-black mb-4 line-clamp-2">
            {story.description}
          </p>
        </div>

        {/* Action buttons or status */}
        {isCompleted ? (
          <div className="flex gap-2 px-4 pb-4">
            <button 
              onClick={onStart}
              className="flex-1 bg-[#9dc3ff] rounded-[10px] h-[31px] flex items-center justify-center font-semibold text-[14px] text-[#141414] hover:bg-[#8db3ef] transition-colors"
            >
              Refazer
            </button>
            <button className="flex-1 bg-[#ffbdbb] rounded-[10px] h-[31px] flex items-center justify-center font-semibold text-[14px] text-black hover:bg-[#ffadab] transition-colors">
              Ver gravações
            </button>
          </div>
        ) : (
          <button 
            onClick={onStart}
            className="w-full bg-[#9fe9f5] h-[31px] flex items-center justify-center font-semibold text-[15px] text-black hover:bg-[#8fd9e5] transition-colors"
          >
            Iniciar
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReadingTrail({ student, onBack }: ReadingTrailProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  if (!student) return null;

  // Sample stories data
  const stories: Story[] = [
    {
      id: 1,
      title: "Parte 1",
      description: "O rato roeu a ropa do rei de roma...",
      subtitle: "Letras trabalhadas: R",
      content: "O rato roeu a ropa do rei de roma. Era um rato muito esperto que vivia no castelo real. Todos os dias ele procurava por pedaços de queijo e pão. O rei ficava muito bravo com o rato, mas nunca conseguia pegá-lo.",
      status: 'completed'
    },
    {
      id: 2,
      title: "História curta",
      description: "O rio que corta a cidade sempre esteve presente...",
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
      status: 'pending'
    },
    {
      id: 3,
      title: "Parte 2",
      description: "O xerife xereta xeretou o xaxim do xisto...",
      subtitle: "Letras trabalhadas: X",
      content: "O xerife xereta xeretou o xaxim do xisto. Ele gostava muito de xadrez e xixi de xale. Todas as quintas-feiras ele tocava xilofone na praça da cidade.",
      status: 'pending'
    }
  ];

  const handleStartStory = (story: Story) => {
    setSelectedStory(story);
  };

  const handleBackFromStory = () => {
    setSelectedStory(null);
  };

  // Show Reading Story
  if (selectedStory) {
    return (
      <ReadingStory
        student={student}
        storyTitle={`${selectedStory.title} - O rio da cidade`}
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
            <h2 className="text-[20px] font-semibold text-black">Histórias</h2>
            <button className="flex items-center gap-2 text-[14px] font-medium text-black hover:bg-gray-200 rounded-lg px-3 py-1 transition-colors">
              Filtros
              <FilterIcon />
            </button>
          </div>
          <div className="h-px bg-black/30" />
        </div>

        {/* Stories Timeline */}
        <div className="px-4 space-y-6 max-w-md mx-auto">
          {stories.map((story, index) => (
            <div key={story.id} className="relative">
              <StoryCard
                story={story}
                position={index === 1 ? 'center' : index === 0 ? 'left' : 'right'}
                onStart={() => handleStartStory(story)}
              />
              {/* Connecting line - not for last item */}
              {index < stories.length - 1 && (
                <div className="absolute left-1/2 top-full h-12 w-px border-l border-dashed border-black/30 -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
