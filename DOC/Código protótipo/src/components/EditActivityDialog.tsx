import { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, Plus, X, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { cn } from './ui/utils';
import type { Activity, Student, ActivityUpdate } from '../types';

interface EditActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity;
  students: Student[];
  onSave: (activity: Activity) => Promise<void>;
}

export default function EditActivityDialog({ 
  open, 
  onOpenChange, 
  activity, 
  students,
  onSave 
}: EditActivityDialogProps) {
  const [activityType, setActivityType] = useState<'reading' | 'writing'>(activity.type);
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);
  const [selectedStudents, setSelectedStudents] = useState<string[]>(activity.student_ids || []);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    activity.scheduled_date ? new Date(activity.scheduled_date) : undefined
  );
  const [scheduledTime, setScheduledTime] = useState(activity.scheduled_time || '');
  const [words, setWords] = useState<string[]>(activity.words && activity.words.length > 0 ? activity.words : ['']);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(activity.difficulty || 'medium');

  useEffect(() => {
    if (open && activity) {
      setActivityType(activity.type);
      setTitle(activity.title);
      setDescription(activity.description || '');
      setSelectedStudents(activity.student_ids || []);
      setScheduledDate(activity.scheduled_date ? new Date(activity.scheduled_date) : undefined);
      setScheduledTime(activity.scheduled_time || '');
      setWords(activity.words && activity.words.length > 0 ? activity.words : ['']);
      setDifficulty(activity.difficulty || 'medium');
    }
  }, [open, activity]);

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

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const updatedActivity: Activity = {
      ...activity,
      type: activityType,
      title: title.trim(),
      description: description.trim() || undefined,
      student_ids: selectedStudents,
      scheduled_date: scheduledDate ? scheduledDate.toISOString().split('T')[0] : undefined,
      scheduled_time: scheduledTime || undefined,
      words: words.filter(w => w.trim()).length > 0 ? words.filter(w => w.trim()) : undefined,
      difficulty: difficulty,
    };

    try {
      await onSave(updatedActivity);
      toast.success('Atividade atualizada com sucesso!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao atualizar atividade');
      console.error('Error updating activity:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Atividade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Tipo de Atividade */}
          <div>
            <Label className="text-[14px] text-black/80 mb-3 block">
              Tipo
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActivityType('reading')}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all text-left cursor-pointer",
                  activityType === 'reading'
                    ? "border-[#0056b9] bg-blue-50"
                    : "border-black/12 hover:border-black/30"
                )}
              >
                <BookOpen className={cn(
                  "h-4 w-4 mb-1",
                  activityType === 'reading' ? "text-[#0056b9]" : "text-black/60"
                )} />
                <p className="text-[13px] font-medium text-black">Leitura</p>
              </button>

              <button
                type="button"
                onClick={() => setActivityType('writing')}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all text-left cursor-pointer",
                  activityType === 'writing'
                    ? "border-[#0056b9] bg-blue-50"
                    : "border-black/12 hover:border-black/30"
                )}
              >
                <FileText className={cn(
                  "h-4 w-4 mb-1",
                  activityType === 'writing' ? "text-[#0056b9]" : "text-black/60"
                )} />
                <p className="text-[13px] font-medium text-black">Escrita</p>
              </button>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title" className="text-[14px] text-black/80 mb-2 block">
                Título *
              </Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Leitura de palavras com R"
                className="h-11"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-[14px] text-black/80 mb-2 block">
                Descrição
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo e instruções da atividade..."
                className="min-h-[80px] resize-none"
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

          {/* Agendamento */}
          <div>
            <Label className="text-[14px] text-black/80 mb-3 block">
              Agendamento
            </Label>
            <div className="grid grid-cols-2 gap-3">
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

              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>

          {/* Conteúdo (apenas para leitura) */}
          {activityType === 'reading' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-[14px] text-black/80">
                  Conteúdo de Leitura
                </Label>
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
              <div className="space-y-2">
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
          <div>
            <Label className="text-[14px] text-black/80 mb-3 block">
              Alunos Selecionados *
            </Label>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-1">
              {students.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => toggleStudent(student.id)}
                  className={cn(
                    "p-2 rounded-lg border-2 transition-all text-left cursor-pointer",
                    selectedStudents.includes(student.id)
                      ? "border-[#0056b9] bg-blue-50"
                      : "border-black/12 hover:border-black/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0",
                      selectedStudents.includes(student.id)
                        ? "border-[#0056b9] bg-[#0056b9]"
                        : "border-black/30"
                    )}>
                      {selectedStudents.includes(student.id) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-black truncate">{student.name}</p>
                      <p className="text-[11px] text-black/60">{student.age || 0} anos</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {selectedStudents.length > 0 && (
              <p className="text-[12px] text-black/60 mt-2">
                {selectedStudents.length} aluno{selectedStudents.length > 1 ? 's' : ''} selecionado{selectedStudents.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-10 px-6 bg-[#0056b9] hover:bg-[#004494]"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
