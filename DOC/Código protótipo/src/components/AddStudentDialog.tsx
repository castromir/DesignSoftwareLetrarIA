import { useState } from "react";
import { Calendar, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStudent: (student: {
    name: string;
    registration: string;
    gender: string;
    birthDate: string;
    observations: string;
  }) => void;
}

export default function AddStudentDialog({
  open,
  onOpenChange,
  onAddStudent,
}: AddStudentDialogProps) {
  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [observations, setObservations] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !registration.trim()) {
      alert("Por favor, preencha os campos obrigatórios: Nome e Matrícula");
      return;
    }

    onAddStudent({
      name: name.trim(),
      registration: registration.trim(),
      gender,
      birthDate,
      observations: observations.trim(),
    });

    // Reset form
    setName("");
    setRegistration("");
    setGender("");
    setBirthDate("");
    setObservations("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setName("");
    setRegistration("");
    setGender("");
    setBirthDate("");
    setObservations("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[10px] shadow-lg w-[calc(100%-2rem)] max-w-md p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-4 pb-3 border-b border-black/30">
          <DialogTitle className="text-[19px] font-semibold text-black text-center">
            Cadastrar novo aluno
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para cadastrar um novo aluno no sistema
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Registration */}
            <div className="space-y-2">
              <Label htmlFor="registration" className="text-[13px] font-semibold text-black/70">
                Matrícula *
              </Label>
              <input
                id="registration"
                type="text"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                placeholder="Digite a matrícula"
                className="w-full h-[52px] px-4 bg-white border border-gray-300 rounded-[10px] text-[16px] font-semibold text-black placeholder:text-black/40 focus:outline-none focus:border-[#3184e3] focus:ring-2 focus:ring-[#3184e3]/20 transition-all shadow-sm"
                required
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[13px] font-semibold text-black/70">
                Nome completo *
              </Label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome completo"
                className="w-full h-[52px] px-4 bg-white border border-gray-300 rounded-[10px] text-[16px] font-semibold text-black placeholder:text-black/40 focus:outline-none focus:border-[#3184e3] focus:ring-2 focus:ring-[#3184e3]/20 transition-all shadow-sm"
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-[13px] font-semibold text-black/70">
                Gênero
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full h-[52px] px-4 bg-white border border-gray-300 rounded-[10px] text-[16px] font-semibold text-black data-[placeholder]:text-black/40 focus:outline-none focus:border-[#3184e3] focus:ring-2 focus:ring-[#3184e3]/20 transition-all shadow-sm">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                  <SelectItem value="masculino" className="text-[15px] font-medium">
                    Masculino
                  </SelectItem>
                  <SelectItem value="feminino" className="text-[15px] font-medium">
                    Feminino
                  </SelectItem>
                  <SelectItem value="outro" className="text-[15px] font-medium">
                    Outro
                  </SelectItem>
                  <SelectItem value="preferir-nao-informar" className="text-[15px] font-medium">
                    Prefiro não informar
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-[13px] font-semibold text-black/70">
                Data de nascimento
              </Label>
              <div className="relative">
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-[52px] px-4 pr-12 bg-white border border-gray-300 rounded-[10px] text-[16px] font-semibold text-black focus:outline-none focus:border-[#3184e3] focus:ring-2 focus:ring-[#3184e3]/20 transition-all shadow-sm"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-[24px] w-[24px] text-[#979797] pointer-events-none" />
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="observations" className="text-[13px] font-semibold text-black/70">
                  Observações
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-white text-[12px] max-w-[200px] p-2 rounded">
                      <p>
                        Adicione informações relevantes sobre o aluno, como necessidades
                        especiais, preferências de aprendizado, etc.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Digite observações sobre o aluno (opcional)"
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[10px] text-[15px] font-medium text-black placeholder:text-black/40 focus:outline-none focus:border-[#3184e3] focus:ring-2 focus:ring-[#3184e3]/20 transition-all shadow-sm resize-none"
              />
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="px-6 py-4 border-t border-[#2A7AF2]/60 bg-gray-50/50 flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 h-[52px] bg-gray-200 rounded-[10px] text-[16px] font-semibold text-black hover:bg-gray-300 transition-colors text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-[52px] bg-[#3184e3] rounded-[10px] text-[16px] font-semibold text-white hover:bg-[#2a73d1] transition-colors shadow-sm text-center"
            >
              Cadastrar aluno
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
