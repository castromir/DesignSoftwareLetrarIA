import { ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import svgPaths from '../imports/svg-ud1jof4hiy';
import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { cn } from './ui/utils';
import EditStudentDialog from './EditStudentDialog';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface StudentProfileProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewTrail?: () => void;
  onViewProgress?: () => void;
  onViewTracking?: () => void;
  onViewDiagnostic?: () => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (studentId: number) => void;
  onExportReports?: () => void;
}

function StudentAvatar() {
  return (
    <div className="relative w-[81px] h-[81px] mx-auto">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 81 81">
        <g>
          <path d={svgPaths.p24b65b80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.pa0f6400} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p35ddc000} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function ProfileMenuItem({ 
  label, 
  onClick, 
  danger = false 
}: { 
  label: string; 
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-[#f6f6f6] rounded-[10px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.25)] h-[59px] w-full flex items-center justify-between px-4 hover:bg-gray-200 transition-colors cursor-pointer"
    >
      <span className={`text-[15px] font-medium ${danger ? 'text-[#a60000]' : 'text-black'}`}>
        {label}
      </span>
      <ChevronRight className={`h-[19px] w-[20px] ${danger ? 'text-[#a60000]' : 'text-[#616161]'}`} />
    </button>
  );
}

function ProfileContent({ 
  student, 
  onViewTrail, 
  onViewProgress,
  onViewTracking,
  onViewDiagnostic,
  onExportReports,
  onEditClick,
  onDeleteClick
}: { 
  student: Student; 
  onViewTrail?: () => void;
  onViewProgress?: () => void;
  onViewTracking?: () => void;
  onViewDiagnostic?: () => void;
  onExportReports?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}) {
  return (
    <div className="flex flex-col">
      {/* Avatar and Name */}
      <div className="flex flex-col items-center pt-6 pb-6">
        <StudentAvatar />
        <h2 className="text-[16px] font-semibold text-black mt-4">{student.name}</h2>
        <p className="text-[13px] text-black mt-1">{student.age} anos</p>
      </div>

      {/* Menu Items */}
      <div className="px-6 pb-6 space-y-3">
        <ProfileMenuItem label="Ver trilha de leitura" onClick={onViewTrail} />
        <ProfileMenuItem label="Visualizar Progresso de leitura" onClick={onViewProgress} />
        <ProfileMenuItem label="Visualizar Rastreamento de progresso" onClick={onViewTracking} />
        <ProfileMenuItem label="Ver Relatório de Diagnóstico" onClick={onViewDiagnostic} />
        <ProfileMenuItem label="Exportar informações" onClick={onExportReports} />

        {/* Divider */}
        <div className="h-px bg-black/30 my-6" />

        <ProfileMenuItem label="Editar informações do Perfil" onClick={onEditClick} />
        <ProfileMenuItem label="Deletar Perfil" danger onClick={onDeleteClick} />
      </div>
    </div>
  );
}

export default function StudentProfile({ 
  student, 
  open, 
  onOpenChange,
  onViewTrail,
  onViewProgress,
  onViewTracking,
  onViewDiagnostic,
  onEditStudent,
  onDeleteStudent,
  onExportReports
}: StudentProfileProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleDelete = () => {
    setShowDeleteAlert(true);
  };

  const handleExport = () => {
    onOpenChange(false);
    if (onExportReports) {
      onExportReports();
    }
  };

  const handleConfirmDelete = () => {
    if (student && onDeleteStudent) {
      onDeleteStudent(student.id);
      setShowDeleteAlert(false);
      onOpenChange(false);
    }
  };

  const handleSaveEdit = (updatedStudent: Student) => {
    if (onEditStudent) {
      onEditStudent(updatedStudent);
    }
  };

  if (!student) return null;

  return (
    <>
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
          <DialogPrimitive.Content
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state-closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
              "bg-white rounded-lg shadow-lg",
              "w-[calc(100%-2rem)] max-w-md",
              "max-h-[90vh] overflow-hidden flex flex-col gap-0"
            )}
            aria-describedby={undefined}
          >
            {/* Header */}
            <div className="border-b border-black/10 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <DialogPrimitive.Title className="text-[19px] font-semibold text-black flex-1 text-center">
                Perfil do aluno
              </DialogPrimitive.Title>
              <DialogPrimitive.Close className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <X className="h-5 w-5 text-black" />
              </DialogPrimitive.Close>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <ProfileContent 
                student={student} 
                onViewTrail={onViewTrail} 
                onViewProgress={onViewProgress}
                onViewTracking={onViewTracking}
                onViewDiagnostic={onViewDiagnostic}
                onExportReports={handleExport}
                onEditClick={handleEdit}
                onDeleteClick={handleDelete}
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Edit Student Dialog */}
      <EditStudentDialog
        student={student}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-white rounded-lg shadow-lg w-[calc(100%-2rem)] max-w-md p-6">
          <AlertDialogTitle className="text-[19px] font-semibold text-black mb-2">
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[14px] text-gray-600 mb-6">
            Tem certeza que deseja deletar o perfil de {student.name}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="h-[44px] px-6 bg-gray-200 rounded-[10px] text-[14px] font-semibold text-black hover:bg-gray-300 transition-colors border-0 cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="h-[44px] px-6 bg-[#d80000] rounded-[10px] text-[14px] font-semibold text-white hover:bg-[#c00000] transition-colors cursor-pointer"
            >
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
