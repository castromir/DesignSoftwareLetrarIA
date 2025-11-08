/**
 * Hook para gerenciar lista de estudantes.
 * - Faz fetch da lista (opcionalmente filtrada por professionalId)
 * - Cria, atualiza e remove estudantes
 * - Mantém estatísticas agregadas
 * - Captura mensagem de sucesso ao deletar (lastDeleteMessage)
 */

import { useState, useCallback, useEffect } from "react";
import { studentsApi } from "../services/api";
import type {
  Student,
  StudentCreate,
  StudentUpdate,
  StudentListResponse,
} from "../types";

interface UseStudentsReturn {
  students: Student[];
  stats: { total: number; active: number; inactive: number };
  isLoading: boolean;
  error: string | null;
  lastDeleteMessage: string | null;
  fetchStudents: (professionalIdOverride?: string) => Promise<void>;
  createStudent: (data: StudentCreate) => Promise<Student | undefined>;
  updateStudent: (
    id: string,
    data: StudentUpdate,
  ) => Promise<Student | undefined>;
  deleteStudent: (id: string) => Promise<boolean>;
  getStudentById: (id: string) => Student | undefined;
  clearLastDeleteMessage: () => void;
}

export const useStudents = (professionalId?: string): UseStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDeleteMessage, setLastDeleteMessage] = useState<string | null>(
    null,
  );

  /**
   * Limpa a mensagem de exclusão (útil para toasts)
   */
  const clearLastDeleteMessage = useCallback(() => {
    setLastDeleteMessage(null);
  }, []);

  /**
   * Busca lista de estudantes (pode receber override de professionalId)
   */
  const fetchStudents = useCallback(
    async (professionalIdOverride?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response: StudentListResponse = await studentsApi.list(
          professionalIdOverride || professionalId,
        );
        setStudents(response.students);
        setStats({
          total: response.total,
          active: response.active,
          inactive: response.inactive,
        });
      } catch (err: any) {
        const message =
          err?.message ||
          (err?.data?.detail as string) ||
          "Erro ao buscar estudantes";
        setError(message);
        // Em caso de erro, não zeramos a lista já carregada anteriormente.
        console.error("Error fetching students:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [professionalId],
  );

  /**
   * Cria um novo estudante
   */
  const createStudent = useCallback(
    async (data: StudentCreate) => {
      setIsLoading(true);
      setError(null);
      try {
        const newStudent = await studentsApi.create(data);
        await fetchStudents(professionalId);
        return newStudent;
      } catch (err: any) {
        const message =
          err?.message ||
          (err?.data?.detail as string) ||
          "Erro ao criar estudante";
        setError(message);
        console.error("Error creating student:", err);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [professionalId, fetchStudents],
  );

  /**
   * Atualiza estudante existente
   */
  const updateStudent = useCallback(
    async (id: string, data: StudentUpdate) => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await studentsApi.update(id, data);
        await fetchStudents(professionalId);
        return updated;
      } catch (err: any) {
        const message =
          err?.message ||
          (err?.data?.detail as string) ||
          "Erro ao atualizar estudante";
        setError(message);
        console.error("Error updating student:", err);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [professionalId, fetchStudents],
  );

  /**
   * Deleta estudante (soft delete) e captura mensagem de sucesso
   */
  const deleteStudent = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      setLastDeleteMessage(null);
      try {
        const resp = await studentsApi.delete(id); // { message: string }
        setLastDeleteMessage(resp?.message || "Aluno removido com sucesso");
        await fetchStudents(professionalId);
        return true;
      } catch (err: any) {
        const message =
          err?.message ||
          (err?.data?.detail as string) ||
          "Erro ao deletar estudante";
        setError(message);
        setLastDeleteMessage(null);
        console.error("Error deleting student:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [professionalId, fetchStudents],
  );

  /**
   * Busca estudante em memória pelo ID
   */
  const getStudentById = useCallback(
    (id: string) => students.find((s) => s.id === id),
    [students],
  );

  /**
   * Carrega lista inicial ao montar ou quando professionalId muda
   */
  useEffect(() => {
    fetchStudents(professionalId);
  }, [fetchStudents, professionalId]);

  return {
    students,
    stats,
    isLoading,
    error,
    lastDeleteMessage,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    clearLastDeleteMessage,
  };
};
