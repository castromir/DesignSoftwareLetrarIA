import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import imgAccountMale from 'figma:asset/6fc471d91da85fe4fda398eb3bf23ec06bafe9a5.png';
import { X } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface EditProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional | null;
  onSave: (professional: Professional) => void;
}

export function EditProfessionalDialog({
  open,
  onOpenChange,
  professional,
  onSave,
}: EditProfessionalDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    if (professional) {
      setFormData({
        name: professional.name,
        username: professional.username,
        role: professional.role,
        password: '',
      });
    }
  }, [professional]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (professional) {
      onSave({
        ...professional,
        name: formData.name,
        username: formData.username,
        role: formData.role,
        email: `${formData.username}@letraria.com`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] bg-white rounded-lg border border-[#d9d9d9] shadow-[0px_16px_32px_-4px_rgba(12,12,13,0.1),0px_4px_4px_-4px_rgba(12,12,13,0.05)] p-4 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-2 top-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-[#1e1e1e]" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-[20px] sm:text-[24px] leading-[1.2] tracking-[-0.48px] mb-4 sm:mb-6">
              Editar profissional
            </h2>

            <div className="space-y-4 sm:space-y-[18px]">
              {/* Nome completo */}
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-[16px] text-[#1e1e1e]">
                  Nome completo
                </Label>
                <div className="relative">
                  <div className="absolute left-[11.9px] top-[8px] w-5 h-5">
                    <img src={imgAccountMale} alt="" className="w-full h-full object-contain" />
                  </div>
                  <Input
                    id="edit-name"
                    placeholder="Nome do profissional"
                    className="h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="edit-username" className="text-[16px] text-[#1e1e1e]">
                  Username
                </Label>
                <div className="relative">
                  <div className="absolute left-[11.9px] top-[8px] w-5 h-5">
                    <img src={imgAccountMale} alt="" className="w-full h-full object-contain" />
                  </div>
                  <Input
                    id="edit-username"
                    placeholder="username"
                    className="h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Senha (opcional na edição) */}
              <div className="space-y-2">
                <Label htmlFor="edit-password" className="text-[14px] text-neutral-950">
                  Senha (deixe em branco para não alterar)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-9 bg-[#f3f3f5] rounded-lg px-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {/* Função/Cargo */}
              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-[14px] text-neutral-950">
                  Função/Cargo
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="h-9 bg-[#f3f3f5] rounded-lg border-0 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pedagogo">Pedagogo</SelectItem>
                    <SelectItem value="Professora de Alfabetização">Professora de Alfabetização</SelectItem>
                    <SelectItem value="Professor de Alfabetização">Professor de Alfabetização</SelectItem>
                    <SelectItem value="Coordenador Pedagógico">Coordenador Pedagógico</SelectItem>
                    <SelectItem value="Professora de Reforço">Professora de Reforço</SelectItem>
                    <SelectItem value="Professor de Reforço">Professor de Reforço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto px-3 py-2.5 sm:py-3 bg-[rgba(255,255,255,0.8)] border border-[#757575] rounded-lg text-[14px] sm:text-[16px] text-[#1e1e1e] hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-3 py-2.5 sm:py-3 bg-[#2c2c2c] border border-[#2c2c2c] rounded-lg text-[14px] sm:text-[16px] text-neutral-100 hover:bg-[#1a1a1a] transition-colors"
            >
              Salvar alterações
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
