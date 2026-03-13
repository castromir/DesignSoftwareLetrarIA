import { useState } from "react";
import { ChevronLeft, Plus, X, BookOpen, Sparkles, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";
import { useTrails } from "../hooks/useTrails";
import type { TrailDifficulty, TrailCreate } from "../types";

interface Student {
  id: number | string;
  name: string;
  age?: number;
}

interface CreateTrailModalProps {
  student: Student | null;
  onBack: () => void;
  onCreated: () => void;
}

interface StoryDraft {
  title: string;
  subtitle: string;
  content: string;
  letters_focus: string[];
  order_position: number;
}

const DIFFICULTY_OPTIONS: {
  value: TrailDifficulty;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "beginner",
    label: "Iniciante",
    description: "Textos curtos e vocabulário simples",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    value: "intermediate",
    label: "Intermediário",
    description: "Textos médios com maior complexidade",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    value: "advanced",
    label: "Avançado",
    description: "Textos longos e vocabulário elaborado",
    icon: <GraduationCap className="h-5 w-5" />,
  },
];

const emptyStory = (position: number): StoryDraft => ({
  title: "",
  subtitle: "",
  content: "",
  letters_focus: [""],
  order_position: position,
});

const wordCount = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

export default function CreateTrailModal({
  student,
  onBack,
  onCreated,
}: CreateTrailModalProps) {
  const { createTrail, isLoading } = useTrails();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<TrailDifficulty>("beginner");
  const [ageMin, setAgeMin] = useState(student?.age ? String(student.age) : "");
  const [ageMax, setAgeMax] = useState(student?.age ? String(student.age) : "");
  const [isDefault, setIsDefault] = useState(false);

  const [stories, setStories] = useState<StoryDraft[]>([emptyStory(1)]);
  const [expandedStory, setExpandedStory] = useState<number>(0);

  // ── Stories helpers ──────────────────────────────────────────────────────

  const addStory = () => {
    const next = [...stories, emptyStory(stories.length + 1)];
    setStories(next);
    setExpandedStory(next.length - 1);
  };

  const removeStory = (index: number) => {
    if (stories.length === 1) {
      toast.error("A trilha precisa ter pelo menos uma história");
      return;
    }
    setStories(
      stories
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, order_position: i + 1 }))
    );
    setExpandedStory((prev) =>
      Math.max(0, prev > index ? prev - 1 : Math.min(prev, stories.length - 2))
    );
  };

  const updateStory = <K extends keyof StoryDraft>(
    index: number,
    field: K,
    value: StoryDraft[K]
  ) => {
    setStories((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  // ── Letters focus helpers ────────────────────────────────────────────────

  const addLetter = (storyIdx: number) => {
    const current = stories[storyIdx].letters_focus;
    updateStory(storyIdx, "letters_focus", [...current, ""]);
  };

  const removeLetter = (storyIdx: number, letterIdx: number) => {
    const updated = stories[storyIdx].letters_focus.filter(
      (_, i) => i !== letterIdx
    );
    updateStory(storyIdx, "letters_focus", updated.length > 0 ? updated : [""]);
  };

  const updateLetter = (storyIdx: number, letterIdx: number, value: string) => {
    const updated = [...stories[storyIdx].letters_focus];
    updated[letterIdx] = value;
    updateStory(storyIdx, "letters_focus", updated);
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Informe o título da trilha");
      return;
    }

    const invalidIdx = stories.findIndex(
      (s) => !s.title.trim() || !s.content.trim()
    );
    if (invalidIdx !== -1) {
      toast.error(`A história ${invalidIdx + 1} precisa de título e texto`);
      setExpandedStory(invalidIdx);
      return;
    }

    const payload: TrailCreate = {
      title: title.trim(),
      description: description.trim() || undefined,
      difficulty,
      is_default: isDefault,
      age_range_min: ageMin ? Number(ageMin) : undefined,
      age_range_max: ageMax ? Number(ageMax) : undefined,
      stories: stories.map((s) => ({
        title: s.title.trim(),
        subtitle: s.subtitle.trim() || undefined,
        content: s.content.trim(),
        letters_focus: s.letters_focus.map((l) => l.trim()).filter(Boolean),
        order_position: s.order_position,
      })),
    };

    const result = await createTrail(payload);
    if (result) {
      toast.success("Trilha criada com sucesso!");
      onCreated();
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#155dfc] to-[#0056b9] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-4">
            <button
              type="button"
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <div>
              <h1 className="text-white font-semibold text-[17px] leading-tight">
                Nova Trilha de Leitura
              </h1>
              {student && (
                <p className="text-white/80 text-[12px]">
                  para {student.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Informações básicas */}
          <div className="bg-white rounded-[10px] border border-black/12 p-6">
            <h2 className="text-[18px] font-semibold text-black mb-4">
              Informações da Trilha
            </h2>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="trail-title"
                  className="text-[14px] text-black/80 mb-2 block"
                >
                  Título *
                </Label>
                <Input
                  id="trail-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Trilha das vogais"
                  className="h-11"
                />
              </div>

              <div>
                <Label
                  htmlFor="trail-desc"
                  className="text-[14px] text-black/80 mb-2 block"
                >
                  Descrição
                </Label>
                <Textarea
                  id="trail-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o objetivo desta trilha..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Dificuldade — card selectors */}
          <div className="bg-white rounded-[10px] border border-black/12 p-6">
            <h2 className="text-[18px] font-semibold text-black mb-4">
              Nível de Dificuldade
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficulty(opt.value)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all text-left cursor-pointer",
                    difficulty === opt.value
                      ? "border-[#0056b9] bg-blue-50"
                      : "border-black/12 hover:border-black/30"
                  )}
                >
                  <span
                    className={cn(
                      "block mb-2",
                      difficulty === opt.value
                        ? "text-[#0056b9]"
                        : "text-black/60"
                    )}
                  >
                    {opt.icon}
                  </span>
                  <p className="text-[14px] font-medium text-black">
                    {opt.label}
                  </p>
                  <p className="text-[12px] text-black/60 mt-1">
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Configurações */}
          <div className="bg-white rounded-[10px] border border-black/12 p-6">
            <h2 className="text-[18px] font-semibold text-black mb-4">
              Configurações
            </h2>
            <div className="space-y-4">
              <div>
                <Label className="text-[14px] text-black/80 mb-2 block">
                  Faixa etária recomendada
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={3}
                    max={18}
                    placeholder="Mín"
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    className="h-11 w-28"
                  />
                  <span className="text-black/40 text-sm">até</span>
                  <Input
                    type="number"
                    min={3}
                    max={18}
                    placeholder="Máx"
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    className="h-11 w-28"
                  />
                  <span className="text-[13px] text-black/40">anos</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDefault(!isDefault)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 transition-all text-left cursor-pointer",
                  isDefault
                    ? "border-[#0056b9] bg-blue-50"
                    : "border-black/12 hover:border-black/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                      isDefault
                        ? "border-[#0056b9] bg-[#0056b9]"
                        : "border-black/30"
                    )}
                  >
                    {isDefault && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-black">
                      Trilha padrão
                    </p>
                    <p className="text-[12px] text-black/60">
                      Atribuir automaticamente a novos alunos
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Histórias */}
          <div className="bg-white rounded-[10px] border border-black/12 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-semibold text-black">
                Histórias
                <span className="ml-2 text-[14px] font-normal text-black/40">
                  ({stories.length})
                </span>
              </h2>
              <Button
                type="button"
                onClick={addStory}
                variant="outline"
                size="sm"
                className="h-8 gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar história
              </Button>
            </div>

            <div className="space-y-3">
              {stories.map((story, idx) => {
                const isExpanded = expandedStory === idx;
                const filled = story.title.trim() && story.content.trim();

                return (
                  <div
                    key={idx}
                    className={cn(
                      "border-2 rounded-[10px] overflow-hidden transition-colors",
                      isExpanded
                        ? "border-[#0056b9]"
                        : filled
                          ? "border-green-300"
                          : "border-black/12"
                    )}
                  >
                    {/* Header row */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedStory(isExpanded ? -1 : idx)
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0",
                          isExpanded
                            ? "bg-[#0056b9] text-white"
                            : filled
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-black/40"
                        )}
                      >
                        {idx + 1}
                      </span>

                      <span className="flex-1 text-[14px] font-medium text-black truncate">
                        {story.title || (
                          <span className="text-black/40 italic">
                            Sem título
                          </span>
                        )}
                      </span>

                      {story.content && (
                        <span className="text-[11px] text-black/40 flex-shrink-0 mr-1">
                          {wordCount(story.content)} palavras
                        </span>
                      )}

                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-black/40 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-black/40 flex-shrink-0" />
                      )}

                      {stories.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeStory(idx);
                          }}
                          className="p-1 hover:bg-red-50 rounded transition-colors flex-shrink-0 ml-1"
                        >
                          <X className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                    </button>

                    {/* Expanded fields */}
                    {isExpanded && (
                      <div className="px-4 pb-5 pt-4 space-y-4 border-t border-black/8">
                        <div>
                          <Label className="text-[14px] text-black/80 mb-2 block">
                            Título da história *
                          </Label>
                          <Input
                            placeholder="Ex: A casa da vovó"
                            value={story.title}
                            onChange={(e) =>
                              updateStory(idx, "title", e.target.value)
                            }
                            className="h-11"
                          />
                        </div>

                        <div>
                          <Label className="text-[14px] text-black/80 mb-2 block">
                            Subtítulo / tema
                          </Label>
                          <Input
                            placeholder="Ex: Família e rotina"
                            value={story.subtitle}
                            onChange={(e) =>
                              updateStory(idx, "subtitle", e.target.value)
                            }
                            className="h-11"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-[14px] text-black/80">
                              Texto da história *
                            </Label>
                            {story.content && (
                              <span className="text-[11px] text-black/40">
                                {wordCount(story.content)} palavras
                              </span>
                            )}
                          </div>
                          <Textarea
                            placeholder="Digite o texto que o aluno vai ler..."
                            value={story.content}
                            onChange={(e) =>
                              updateStory(idx, "content", e.target.value)
                            }
                            className="min-h-[120px] resize-none"
                          />
                        </div>

                        {/* Letras em foco — mesmo padrão que palavras em CreateActivity */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-[14px] text-black/80">
                              Letras em foco
                            </Label>
                            <Button
                              type="button"
                              onClick={() => addLetter(idx)}
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1 text-[12px]"
                            >
                              <Plus className="h-3 w-3" />
                              Adicionar letra
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {story.letters_focus.map((letter, lIdx) => (
                              <div key={lIdx} className="flex gap-2">
                                <Input
                                  value={letter}
                                  onChange={(e) =>
                                    updateLetter(idx, lIdx, e.target.value)
                                  }
                                  placeholder={`Letra ou sílaba ${lIdx + 1}`}
                                  className="h-10"
                                />
                                {story.letters_focus.length > 1 && (
                                  <Button
                                    type="button"
                                    onClick={() => removeLetter(idx, lIdx)}
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 flex-shrink-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="h-11 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 px-6 bg-[#0056b9] hover:bg-[#004494]"
            >
              {isLoading ? "Criando..." : "Criar Trilha"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
