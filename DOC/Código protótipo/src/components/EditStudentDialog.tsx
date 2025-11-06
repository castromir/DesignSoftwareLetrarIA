import { useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog@1.1.6';
import { X } from 'lucide-react';
import { cn } from './ui/utils';
import type { Student, StudentUpdate } from '../types';

interface EditStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (student: Student) => void | Promise<void>;
}

export default function EditStudentDialog({
  student,
  open,
  onOpenChange,
  onSave,
}: EditStudentDialogProps) {
  const [name, setName] = useState(student?.name || '');
  const [age, setAge] = useState<number | undefined>(student?.age);
  const [registration, setRegistration] = useState(student?.registration || '');
  const [birthDate, setBirthDate] = useState(
    student?.birth_date ? student.birth_date.split('T')[0] : ''
  );
  const [observations, setObservations] = useState(student?.observations || '');

  // Atualiza os campos quando o student mudar ou o dialog abrir
  useEffect(() => {
    if (open && student) {
      setName(student.name);
      setAge(student.age);
      setRegistration(student.registration || '');
      setBirthDate(student.birth_date ? student.birth_date.split('T')[0] : '');
      setObservations(student.observations || '');
    }
  }, [open, student]);

  const handleSave = async () => {
    if (student && name) {
      const updated: Student = {
        ...student,
        name: name.trim(),
        age: age,
        registration: registration.trim() || undefined,
        birth_date: birthDate || undefined,
        observations: observations.trim() || undefined,
      };
      await onSave(updated);
      onOpenChange(false);
    }
  };

  if (!student) return null;

  return (
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
              Editar aluno
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5 text-black" />
            </DialogPrimitive.Close>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  Nome do aluno *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[55px] px-4 bg-white border border-[#c7c7c7] rounded-[22px] text-[14px] font-semibold text-black focus:outline-none focus:border-[#418DF0] transition-colors"
                  placeholder="Digite o nome"
                  required
                />
              </div>

              {/* Registration Input */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  Matrícula
                </label>
                <input
                  type="text"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  className="w-full h-[55px] px-4 bg-white border border-[#c7c7c7] rounded-[22px] text-[14px] font-semibold text-black focus:outline-none focus:border-[#418DF0] transition-colors"
                  placeholder="Digite a matrícula"
                />
              </div>

              {/* Age Input */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  Idade
                </label>
                <input
                  type="number"
                  value={age || ''}
                  onChange={(e) => setAge(parseInt(e.target.value) || undefined)}
                  className="w-full h-[55px] px-4 bg-white border border-[#c7c7c7] rounded-[22px] text-[14px] font-semibold text-black focus:outline-none focus:border-[#418DF0] transition-colors"
                  placeholder="Digite a idade"
                  min="0"
                  max="150"
                />
              </div>

              {/* Birth Date Input */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-[55px] px-4 bg-white border border-[#c7c7c7] rounded-[22px] text-[14px] font-semibold text-black focus:outline-none focus:border-[#418DF0] transition-colors"
                />
              </div>

              {/* Observations Input */}
              <div>
                <label className="block text-[14px] font-semibold text-black mb-2">
                  Observações
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full min-h-[100px] px-4 py-3 bg-white border border-[#c7c7c7] rounded-[22px] text-[14px] font-semibold text-black focus:outline-none focus:border-[#418DF0] transition-colors resize-none"
                  placeholder="Digite observações sobre o aluno"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-black/10 px-6 py-4 flex gap-3 flex-shrink-0">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-[44px] bg-gray-200 rounded-[10px] text-[14px] font-semibold text-black hover:bg-gray-300 transition-colors text-center"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 h-[44px] bg-[#3b73ed] rounded-[10px] text-[14px] font-semibold text-white hover:bg-[#2d62dc] transition-colors text-center"
            >
              Salvar
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
