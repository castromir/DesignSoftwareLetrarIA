import { useState } from 'react';
import { ChevronLeft, Calendar, Clock, FileText, Plus, X, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import { cn } from './ui/utils';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface CreateActivityProps {
  onBack: () => void;
  students: Student[];
  onCreateActivity: (activity: any) => void;
}

export default function CreateActivity({ onBack, students, onCreateActivity }: CreateActivityProps) {
  const [activityType, setActivityType] = useState<'reading' | 'writing'>('reading');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('');
  const [words, setWords] = useState<string[]>(['']);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleAddWord = () => {
    setWords([...words, '']);
  };

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const toggleStudent = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Por favor, adicione um título para a atividade');
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error('Selecione pelo menos um aluno');
      return;
    }

    if (activityType === 'reading' && words.filter(w => w.trim()).length === 0) {
      toast.error('Adicione pelo menos uma palavra ou texto');
      return;
    }

    const newActivity = {
      id: Date.now(),
      type: activityType,
      title,
      description,
      studentIds: selectedStudents,
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      words: words.filter(w => w.trim()),
      difficulty,
      createdAt: new Date(),
      status: 'pending' as const,
    };

    onCreateActivity(newActivity);
    toast.success('Atividade criada com sucesso!');
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#155dfc] to-[#0056b9] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <div>
                <h1 className="text-white font-semibold text-[17px] leading-tight">
                  Nova Atividade
                </h1>
                <p className="text-white/80 text-[12px]">
                  Criar atividade de leitura
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Atividade */}
          <div className="bg-white rounded-[10px] border border-black/12 p-6">
            <h2 className="text-[18px] font-semibold text-black mb-4">
              Tipo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActivityType('reading')}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left cursor-pointer",
                  activityType === 'reading'
                    ? "border-[#0056b9] bg-blue-50"
                    : "border-black/12 hover:border-black/30"
                )}
              >
                <BookOpen className={cn(
                  "h-5 w-5 mb-2",
                  activityType === 'reading' ? "text-[#0056b9]" : "text-black/60"
                )} />
                <p className="text-[14px] font-medium text-black">Leitura</p>
                <p className="text-[12px] text-black/60 mt-1">Atividades de leitura e compreensão</p>
              </button>

              <button
                type="button"
                onClick={() => setActivityType('writing')}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left cursor-pointer",
                  activityType === 'writing'
                    ? "border-[#0056b9] bg-blue-50"
                    : "border-black/12 hover:border-black/30"
                )}
              >
                <FileText className={cn(
                  "h-5 w-5 mb-2",
                  activityType === 'writing' ? "text-[#0056b9]" : "text-black/60"
                )} />
                <p className="text-[14px] font-medium text-black">Escrita</p>
                <p className="text-[12px] text-black/60 mt-1">Atividades de escrita e produção textual</p>
              </button>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="bg-white rounded-[10px] border border-black/12 p-6">
            <h2 className="text-[18px] font-semibold text-black mb-4">
              Informações da Atividade
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-[14px] text-black/80 mb-2 block">
                  Título *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Leitura de palavras com R"
                  className="h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-[14px] text-black/80 mb-2 block">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o objetivo e instruções da atividade..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div>
                <Label className="text-[14px] text-black/80 mb-2 block">
                  Nível de Dificuldade
                </Label>
                <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Agendamento */}
          <div className="bg-white rounded-[10px] border border-black/12 p-6">
            <h2 className="text-[18px] font-semibold text-black mb-4">
              Agendamento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[14px] text-black/80 mb-2 block">
                  Data
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left h-11",
                        !scheduledDate && "text-black/40"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {scheduledDate ? scheduledDate.toLocaleDateString('pt-BR') : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time" className="text-[14px] text-black/80 mb-2 block">
                  Horário
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="h-11 pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo (apenas para leitura) */}
          {activityType === 'reading' && (
            <div className="bg-white rounded-[10px] border border-black/12 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-semibold text-black">
                  Conteúdo de Leitura
                </h2>
                <Button
                  type="button"
                  onClick={handleAddWord}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar item
                </Button>
              </div>
              <div className="space-y-3">
                {words.map((word, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={word}
                      onChange={(e) => handleWordChange(index, e.target.value)}
                      placeholder={`Palavra ou frase ${index + 1}`}
                      className="h-10"
                    />
                    {words.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => handleRemoveWord(index)}
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
          )}

          {/* Selecionar Alunos */}
          <div className="bg-white rounded-[10px] border border-black/12 p-6">
            <h2 className="text-[18px] font-semibold text-black mb-4">
              Selecionar Alunos *
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {students.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => toggleStudent(student.id)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-left cursor-pointer",
                    selectedStudents.includes(student.id)
                      ? "border-[#0056b9] bg-blue-50"
                      : "border-black/12 hover:border-black/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      selectedStudents.includes(student.id)
                        ? "border-[#0056b9] bg-[#0056b9]"
                        : "border-black/30"
                    )}>
                      {selectedStudents.includes(student.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-black truncate">{student.name}</p>
                      <p className="text-[12px] text-black/60">{student.age} anos</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {selectedStudents.length > 0 && (
              <p className="text-[12px] text-black/60 mt-3">
                {selectedStudents.length} aluno{selectedStudents.length > 1 ? 's' : ''} selecionado{selectedStudents.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end">
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
              className="h-11 px-6 bg-[#0056b9] hover:bg-[#004494]"
            >
              Criar Atividade
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
