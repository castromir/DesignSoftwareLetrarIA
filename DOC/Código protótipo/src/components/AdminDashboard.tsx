import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookOpen, LogOut, UserPlus, Shield, Trash2, Edit, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { EditProfessionalDialog } from './EditProfessionalDialog';
import svgPaths from '../imports/svg-eh8lwci7vt';
import imgAccountMale from 'figma:asset/6fc471d91da85fe4fda398eb3bf23ec06bafe9a5.png';

interface User {
  email: string;
  type: 'admin' | 'professional';
  name: string;
}

interface Professional {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [professionals, setProfessionals] = useState<Professional[]>([
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria.silva@letraria.com',
      username: 'maria.silva',
      role: 'Professora de Alfabetização',
      status: 'active',
      createdAt: '2025-01-14',
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao.santos@letraria.com',
      username: 'joao.santos',
      role: 'Coordenador Pedagógico',
      status: 'active',
      createdAt: '2025-01-09',
    },
    {
      id: '3',
      name: 'Ana Paula',
      email: 'ana.paula@letraria.com',
      username: 'ana.paula',
      role: 'Professora de Reforço',
      status: 'inactive',
      createdAt: '2024-12-19',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProfessional, setNewProfessional] = useState({
    name: '',
    username: '',
    role: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddProfessional = (e: React.FormEvent) => {
    e.preventDefault();
    
    const professional: Professional = {
      id: Date.now().toString(),
      name: newProfessional.name,
      username: newProfessional.username,
      email: `${newProfessional.username}@letraria.com`,
      role: newProfessional.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProfessionals([...professionals, professional]);
    setNewProfessional({ name: '', username: '', role: '', password: '' });
    setIsDialogOpen(false);
    setSuccessMessage(`Profissional ${professional.name} cadastrado com sucesso!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditProfessional = (professional: Professional) => {
    setEditingProfessional(professional);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedProfessional: Professional) => {
    setProfessionals(professionals.map(p => 
      p.id === updatedProfessional.id ? updatedProfessional : p
    ));
    setSuccessMessage(`Profissional ${updatedProfessional.name} atualizado com sucesso!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteProfessional = (id: string) => {
    const prof = professionals.find(p => p.id === id);
    setProfessionals(professionals.filter(p => p.id !== id));
    setSuccessMessage(`Profissional ${prof?.name} removido com sucesso!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleStatus = (id: string) => {
    setProfessionals(professionals.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'inactive' as const : 'active' as const }
        : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="px-4 sm:px-6 lg:px-[167.5px] h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 32 32">
              <path 
                d="M16 9.33333V28" 
                stroke="#155DFC" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2.66667" 
              />
              <path 
                d={svgPaths.p308d0700}
                stroke="#155DFC" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2.66667" 
              />
            </svg>
            <div>
              <h1 className="text-[16px] sm:text-[20px] leading-5 sm:leading-[28px] text-[#155dfc]">Letrar IA</h1>
              <p className="text-[10px] sm:text-[12px] leading-3 sm:leading-4 text-[#6a7282] hidden sm:block">Painel Administrativo</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[14px] leading-5">{user.name}</p>
              <Badge variant="secondary" className="text-[12px] leading-4 bg-[#eceef2] text-[#030213] h-[22px]">
                <Shield className="h-3 w-3 mr-1" />
                Administrador
              </Badge>
            </div>
            <button
              onClick={onLogout}
              className="h-8 px-2 sm:px-4 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg text-[12px] sm:text-[14px] leading-5 hover:bg-gray-50 transition-colors flex items-center gap-1 sm:gap-2"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1280px] mx-auto">
        <div className="mb-6">
          <h2 className="text-[24px] sm:text-[30px] leading-8 sm:leading-9 mb-2">Gerenciar Profissionais da Educação</h2>
          <p className="text-[14px] sm:text-[16px] leading-5 sm:leading-6 text-[#4a5565]">
            Cadastre e gerencie os profissionais que terão acesso ao sistema Letrar IA
          </p>
        </div>

        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <Card className="border-[rgba(0,0,0,0.1)]">
            <CardHeader className="p-4 sm:p-6">
              <CardDescription className="text-[14px] sm:text-[16px] leading-5 sm:leading-6 text-[#717182]">Total de Profissionais</CardDescription>
              <CardTitle className="text-[28px] sm:text-[36px] leading-8 sm:leading-10">{professionals.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[rgba(0,0,0,0.1)]">
            <CardHeader className="p-4 sm:p-6">
              <CardDescription className="text-[14px] sm:text-[16px] leading-5 sm:leading-6 text-[#717182]">Profissionais Ativos</CardDescription>
              <CardTitle className="text-[28px] sm:text-[36px] leading-8 sm:leading-10 text-[#00a63e]">
                {professionals.filter(p => p.status === 'active').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-[rgba(0,0,0,0.1)]">
            <CardHeader className="p-4 sm:p-6">
              <CardDescription className="text-[14px] sm:text-[16px] leading-5 sm:leading-6 text-[#717182]">Profissionais Inativos</CardDescription>
              <CardTitle className="text-[28px] sm:text-[36px] leading-8 sm:leading-10 text-[#99a1af]">
                {professionals.filter(p => p.status === 'inactive').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Professionals Table */}
        <Card className="border-[rgba(0,0,0,0.1)]">
          <div className="p-4 sm:p-[25px]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-[30px]">
              <div>
                <h3 className="text-[14px] sm:text-[16px] leading-4 mb-1">Profissionais Cadastrados</h3>
                <p className="text-[14px] sm:text-[16px] leading-5 sm:leading-6 text-[#717182]">
                  Lista de todos os profissionais da educação no sistema
                </p>
              </div>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="h-9 px-3 sm:px-4 bg-[#030213] text-white rounded-lg text-[12px] sm:text-[14px] leading-5 hover:bg-[#030213]/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Adicionar Profissional</span>
                <span className="sm:hidden">Adicionar</span>
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-lg border border-[rgba(0,0,0,0.1)] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                    <TableHead className="text-[14px] leading-5 h-10">Nome</TableHead>
                    <TableHead className="text-[14px] leading-5 h-10">E-mail</TableHead>
                    <TableHead className="text-[14px] leading-5 h-10">Função</TableHead>
                    <TableHead className="text-[14px] leading-5 h-10">Status</TableHead>
                    <TableHead className="text-[14px] leading-5 h-10">Data de Cadastro</TableHead>
                    <TableHead className="text-[14px] leading-5 h-10 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {professionals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum profissional cadastrado ainda
                      </TableCell>
                    </TableRow>
                  ) : (
                    professionals.map((professional) => (
                      <TableRow key={professional.id} className="border-b border-[rgba(0,0,0,0.1)]">
                        <TableCell className="text-[14px] leading-5">{professional.name}</TableCell>
                        <TableCell className="text-[14px] leading-5">{professional.email}</TableCell>
                        <TableCell className="text-[14px] leading-5">{professional.role}</TableCell>
                        <TableCell>
                          <Badge
                            variant={professional.status === 'active' ? 'default' : 'secondary'}
                            className={`cursor-pointer h-[22px] text-[12px] leading-4 ${
                              professional.status === 'active' 
                                ? 'bg-[#030213] text-white' 
                                : 'bg-[#eceef2] text-[#030213]'
                            }`}
                            onClick={() => toggleStatus(professional.id)}
                          >
                            {professional.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[14px] leading-5">
                          {new Date(professional.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditProfessional(professional)}
                              className="h-8 w-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProfessional(professional.id)}
                              className="h-8 w-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-[#FB2C36]" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {professionals.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border border-[rgba(0,0,0,0.1)] rounded-lg">
                  Nenhum profissional cadastrado ainda
                </div>
              ) : (
                professionals.map((professional) => (
                  <div key={professional.id} className="border border-[rgba(0,0,0,0.1)] rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-[14px] mb-1">{professional.name}</h4>
                        <p className="text-[12px] text-[#717182] mb-2">{professional.email}</p>
                        <p className="text-[12px] text-[#4a5565]">{professional.role}</p>
                      </div>
                      <Badge
                        variant={professional.status === 'active' ? 'default' : 'secondary'}
                        className={`cursor-pointer h-[22px] text-[12px] leading-4 ${
                          professional.status === 'active' 
                            ? 'bg-[#030213] text-white' 
                            : 'bg-[#eceef2] text-[#030213]'
                        }`}
                        onClick={() => toggleStatus(professional.id)}
                      >
                        {professional.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[rgba(0,0,0,0.1)]">
                      <span className="text-[12px] text-[#717182]">
                        {new Date(professional.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProfessional(professional)}
                          className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProfessional(professional.id)}
                          className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-[#FB2C36]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </main>

      {/* Add Professional Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[600px] bg-white rounded-lg border border-[#d9d9d9] shadow-[0px_16px_32px_-4px_rgba(12,12,13,0.1),0px_4px_4px_-4px_rgba(12,12,13,0.05)] p-4 sm:p-8 max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setIsDialogOpen(false)}
            className="absolute right-2 top-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#1e1e1e]" />
          </button>

          <form onSubmit={handleAddProfessional} className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-[20px] sm:text-[24px] leading-[1.2] tracking-[-0.48px] mb-4 sm:mb-6">
                Cadastrar novo profissional
              </h2>

              <div className="space-y-4 sm:space-y-[18px]">
                {/* Nome completo */}
                <div className="space-y-2">
                  <Label htmlFor="prof-name" className="text-[16px] text-[#1e1e1e]">
                    Nome completo
                  </Label>
                  <div className="relative">
                    <div className="absolute left-[11.9px] top-[8px] w-5 h-5">
                      <img src={imgAccountMale} alt="" className="w-full h-full object-contain" />
                    </div>
                    <Input
                      id="prof-name"
                      placeholder="Nome do profissional"
                      className="h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                      value={newProfessional.name}
                      onChange={(e) => setNewProfessional({ ...newProfessional, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="prof-username" className="text-[16px] text-[#1e1e1e]">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute left-[11.9px] top-[8px] w-5 h-5">
                      <img src={imgAccountMale} alt="" className="w-full h-full object-contain" />
                    </div>
                    <Input
                      id="prof-username"
                      placeholder="username"
                      className="h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                      value={newProfessional.username}
                      onChange={(e) => setNewProfessional({ ...newProfessional, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="prof-password" className="text-[14px] text-neutral-950">
                    Senha
                  </Label>
                  <Input
                    id="prof-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-9 bg-[#f3f3f5] rounded-lg px-3 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                    value={newProfessional.password}
                    onChange={(e) => setNewProfessional({ ...newProfessional, password: e.target.value })}
                    required
                  />
                </div>

                {/* Função/Cargo */}
                <div className="space-y-2">
                  <Label htmlFor="prof-role" className="text-[14px] text-neutral-950">
                    Função/Cargo
                  </Label>
                  <Select value={newProfessional.role} onValueChange={(value) => setNewProfessional({ ...newProfessional, role: value })}>
                    <SelectTrigger className="h-9 bg-[#f3f3f5] rounded-lg border-0 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Pedagogo" />
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
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto px-3 py-2.5 sm:py-3 bg-[rgba(255,255,255,0.8)] border border-[#757575] rounded-lg text-[14px] sm:text-[16px] text-[#1e1e1e] hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-3 py-2.5 sm:py-3 bg-[#2c2c2c] border border-[#2c2c2c] rounded-lg text-[14px] sm:text-[16px] text-neutral-100 hover:bg-[#1a1a1a] transition-colors"
              >
                Cadastrar
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Professional Dialog */}
      <EditProfessionalDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        professional={editingProfessional}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
