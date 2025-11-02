import { useState } from 'react';
import { ChevronLeft, Calendar, Clock, FileText, BookOpen, Target, Users, MoreVertical, Eye, Pencil, Trash2, Play, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import EditActivityDialog from './EditActivityDialog';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface Activity {
  id: number;
  type: 'reading' | 'writing';
  title: string;
  description: string;
  studentIds: number[];
  scheduledDate?: Date;
  scheduledTime?: string;
  words?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ActivitiesListProps {
  onBack: () => void;
  activities: Activity[];
  students: Student[];
  onDeleteActivity: (id: number) => void;
  onUpdateActivity: (activity: Activity) => void;
  onCreateActivity?: () => void;
}

const activityTypeLabels = {
  'reading': 'Leitura',
  'writing': 'Escrita',
};

const activityTypeIcons = {
  'reading': BookOpen,
  'writing': FileText,
};

const difficultyLabels = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

const statusLabels = {
  pending: 'Pendente',
  'in-progress': 'Em Andamento',
  completed: 'Concluída',
};

const statusColors = {
  pending: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
};

export default function ActivitiesList({ 
  onBack, 
  activities, 
  students,
  onDeleteActivity,
  onUpdateActivity,
  onCreateActivity 
}: ActivitiesListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.status === filter;
  });

  const getStudentNames = (studentIds: number[]) => {
    return studentIds
      .map(id => students.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const handleDeleteClick = (activity: Activity) => {
    setActivityToDelete(activity);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (activityToDelete) {
      onDeleteActivity(activityToDelete.id);
      toast.success('Atividade excluída com sucesso');
      setShowDeleteDialog(false);
      setActivityToDelete(null);
    }
  };

  const handleStartActivity = (activity: Activity) => {
    const updatedActivity = { ...activity, status: 'in-progress' as const };
    onUpdateActivity(updatedActivity);
    toast.success('Atividade iniciada!');
  };

  const handleCompleteActivity = (activity: Activity) => {
    const updatedActivity = { ...activity, status: 'completed' as const };
    onUpdateActivity(updatedActivity);
    toast.success('Atividade marcada como concluída!');
  };

  const handleEditClick = (activity: Activity) => {
    setActivityToEdit(activity);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedActivity: Activity) => {
    onUpdateActivity(updatedActivity);
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
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <div>
                <h1 className="text-white font-semibold text-[17px] leading-tight">
                  Atividades
                </h1>
                <p className="text-white/80 text-[12px]">
                  Gerenciar atividades de leitura
                </p>
              </div>
            </div>
            {onCreateActivity && (
              <Button
                onClick={onCreateActivity}
                className="bg-white text-[#0056b9] hover:bg-white/90 h-10 px-4 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline text-[13px]">Nova Atividade</span>
                <span className="sm:hidden text-[13px]">Nova</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-[10px] border border-black/12 p-4">
            <p className="text-[12px] text-black/60 mb-1">Total</p>
            <p className="text-[24px] font-semibold text-[#0056b9]">{activities.length}</p>
          </div>
          <div className="bg-white rounded-[10px] border border-black/12 p-4">
            <p className="text-[12px] text-black/60 mb-1">Pendentes</p>
            <p className="text-[24px] font-semibold text-blue-600">
              {activities.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-[10px] border border-black/12 p-4">
            <p className="text-[12px] text-black/60 mb-1">Em Andamento</p>
            <p className="text-[24px] font-semibold text-purple-600">
              {activities.filter(a => a.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-white rounded-[10px] border border-black/12 p-4">
            <p className="text-[12px] text-black/60 mb-1">Concluídas</p>
            <p className="text-[24px] font-semibold text-green-600">
              {activities.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[10px] border border-black/12 p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                "h-9",
                filter === 'all' && "bg-[#0056b9] hover:bg-[#004494]"
              )}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
              className={cn(
                "h-9",
                filter === 'pending' && "bg-blue-600 hover:bg-blue-700"
              )}
            >
              Pendentes
            </Button>
            <Button
              variant={filter === 'in-progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('in-progress')}
              className={cn(
                "h-9",
                filter === 'in-progress' && "bg-purple-600 hover:bg-purple-700"
              )}
            >
              Em Andamento
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
              className={cn(
                "h-9",
                filter === 'completed' && "bg-green-600 hover:bg-green-700"
              )}
            >
              Concluídas
            </Button>
          </div>
        </div>

        {/* Activities List */}
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-[10px] border border-black/12 p-12 text-center">
            <FileText className="h-12 w-12 text-black/20 mx-auto mb-3" />
            <p className="text-[16px] text-black/60">Nenhuma atividade encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const Icon = activityTypeIcons[activity.type];
              
              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-[10px] border border-black/12 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="bg-blue-50 rounded-lg p-3 flex-shrink-0">
                      <Icon className="h-6 w-6 text-[#0056b9]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[16px] font-semibold text-black mb-1">
                            {activity.title}
                          </h3>
                          <p className="text-[13px] text-black/60">
                            {activityTypeLabels[activity.type]}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(activity)}
                            className="h-8 w-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(activity)}
                            className="h-8 w-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 text-[#FB2C36]" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      {activity.description && (
                        <p className="text-[13px] text-black/70 mb-3 line-clamp-2">
                          {activity.description}
                        </p>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className={statusColors[activity.status]}>
                          {statusLabels[activity.status]}
                        </Badge>
                        <Badge variant="secondary" className={difficultyColors[activity.difficulty]}>
                          {difficultyLabels[activity.difficulty]}
                        </Badge>
                        {activity.studentIds.length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <Users className="h-3 w-3" />
                            {activity.studentIds.length} aluno{activity.studentIds.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      {/* Students */}
                      {activity.studentIds.length > 0 && (
                        <p className="text-[12px] text-black/60 mb-2">
                          <span className="font-medium">Alunos:</span> {getStudentNames(activity.studentIds)}
                        </p>
                      )}

                      {/* Schedule Info */}
                      <div className="flex flex-wrap gap-4 text-[12px] text-black/60">
                        {activity.scheduledDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(activity.scheduledDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                        {activity.scheduledTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{activity.scheduledTime}</span>
                          </div>
                        )}
                      </div>

                      {/* Words count (for reading activities) */}
                      {activity.type === 'reading' && activity.words && activity.words.length > 0 && (
                        <p className="text-[12px] text-black/60 mt-2">
                          <span className="font-medium">{activity.words.length} item{activity.words.length > 1 ? 's' : ''}</span> de leitura
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Excluir Atividade</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a atividade "{activityToDelete?.title}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end mt-4">
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)} className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Excluir
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Activity Dialog */}
      {activityToEdit && (
        <EditActivityDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          activity={activityToEdit}
          students={students}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
