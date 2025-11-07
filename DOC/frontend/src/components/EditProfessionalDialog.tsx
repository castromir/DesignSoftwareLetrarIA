import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import imgAccountMale from "figma:asset/6fc471d91da85fe4fda398eb3bf23ec06bafe9a5.png";
import { X } from "lucide-react";
import type { Professional } from "../types";

interface EditProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional | null;
  onSave: (professional: Professional) => void | Promise<void>;
}

export function EditProfessionalDialog({
  open,
  onOpenChange,
  professional,
  onSave,
}: EditProfessionalDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    function: "",
    password: "",
    status: "Ativo",
  });

  useEffect(() => {
    if (professional) {
      const emailUsername = professional.email
        ? professional.email.split("@")[0]
        : "";
      const status =
        // prefer `status` if present, fall back to boolean `active` if available, default to "Ativo"
        professional.status ??
        (professional.active !== undefined
          ? professional.active
            ? "Ativo"
            : "Inativo"
          : "Ativo");
      setFormData({
        name: professional.name || "",
        email: professional.email || "",
        username: emailUsername,
        function: professional.function || "",
        password: "",
        status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        username: "",
        function: "",
        password: "",
        status: "Ativo",
      });
    }
  }, [professional]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (professional) {
      const updated: Professional & {
        username?: string;
        password?: string;
        status?: string;
        active?: boolean;
      } = {
        ...professional,
        name: formData.name,
        email: formData.email,
        function: formData.function || undefined,
      };

      if (formData.username) {
        updated.username = formData.username;
      }

      if (formData.password) {
        updated.password = formData.password;
      }

      // map the status string to fields that backend might expect
      if (formData.status !== undefined) {
        updated.status = formData.status;
        // also provide a boolean `active` for backends that use a boolean flag
        updated.active = formData.status === "Ativo";
      }

      await onSave(updated as Professional);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] bg-white rounded-lg border border-[#d9d9d9] shadow-[0px_16px_32px_-4px_rgba(12,12,13,0.1),0px_4px_4px_-4px_rgba(12,12,13,0.05)] p-4 sm:p-8 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-[20px] sm:text-[24px] leading-[1.2] tracking-[-0.48px] mb-4 sm:mb-6">
              Editar profissional
            </h2>

            <div className="space-y-4 sm:space-y-[18px]">
              {/* Nome completo */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-name"
                  className="text-[16px] text-[#1e1e1e]"
                >
                  Nome completo
                </Label>
                <div className="relative">
                  <div className="absolute left-[11.9px] top-[8px] w-5 h-5">
                    <img
                      src={imgAccountMale}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Input
                    id="edit-name"
                    placeholder="Nome do profissional"
                    className="h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-email"
                  className="text-[16px] text-[#1e1e1e]"
                >
                  E-mail
                </Label>
                <div className="relative">
                  <div className="absolute left-[11.9px] top-[8px] w-5 h-5">
                    <img
                      src={imgAccountMale}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="email@exemplo.com"
                    className="h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-username"
                  className="text-[16px] text-[#1e1e1e]"
                >
                  Username
                </Label>
                <div className="relative">
                  <div className="absolute left-[11.9px] top-[8px] w-5 h-5">
                    <img
                      src={imgAccountMale}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Input
                    id="edit-username"
                    placeholder="username"
                    className="h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Senha (opcional na edição) */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-password"
                  className="text-[14px] text-neutral-950"
                >
                  Senha (deixe em branco para não alterar)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-9 bg-[#f3f3f5] rounded-lg px-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              {/* Função/Cargo */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-function"
                  className="text-[14px] text-neutral-950"
                >
                  Função/Cargo
                </Label>
                <Select
                  value={formData.function}
                  onValueChange={(value) =>
                    setFormData({ ...formData, function: value })
                  }
                >
                  <SelectTrigger className="h-9 bg-[#f3f3f5] rounded-lg border-0 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pedagogo">Pedagogo</SelectItem>
                    <SelectItem value="Professora de Alfabetização">
                      Professora de Alfabetização
                    </SelectItem>
                    <SelectItem value="Professor de Alfabetização">
                      Professor de Alfabetização
                    </SelectItem>
                    <SelectItem value="Coordenador Pedagógico">
                      Coordenador Pedagógico
                    </SelectItem>
                    <SelectItem value="Professora de Reforço">
                      Professora de Reforço
                    </SelectItem>
                    <SelectItem value="Professor de Reforço">
                      Professor de Reforço
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-status"
                  className="text-[14px] text-neutral-950"
                >
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="h-9 bg-[#f3f3f5] rounded-lg border-0 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Ativo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[12px] text-[#6b7280]">
                  Profissionais inativos terão login desabilitado no sistema.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full cursor-pointer sm:w-auto px-3 py-2.5 sm:py-3 bg-[rgba(255,255,255,0.8)] border border-[#757575] rounded-lg text-[14px] sm:text-[16px] text-[#1e1e1e] hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full cursor-pointer sm:w-auto px-3 py-2.5 sm:py-3 bg-[#2c2c2c] border border-[#2c2c2c] rounded-lg text-[14px] sm:text-[16px] text-neutral-100 hover:bg-[#1a1a1a] transition-colors"
            >
              Salvar alterações
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
