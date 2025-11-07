/**
 * Hook para gerenciar lista de estudantes
 */

import { useState, useCallback, useEffect } from "react";
import { studentsApi } from "../services/api";
import type { Student, StudentCreate, StudentUpdate, StudentListResponse } from "../types";

interface UseStudentsReturn {
  students: Student[];
  stats: { total: number; active: number; inactive: number };
  isLoading: boolean;
  error: string | null;
  fetchStudents: (professionalId?: string) => Promise<void>;
  createStudent: (data: StudentCreate) => Promise<Student | undefined>;
  updateStudent: (id: string, data: StudentUpdate) => Promise<Student | undefined>;
  deleteStudent: (id: string) => Promise<boolean>;
  getStudentById: (id: string) => Student | undefined;
}

export const useStudents = (professionalId?: string): UseStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar estudantes
  const fetchStudents = useCallback(async (filterProfessionalId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await studentsApi.list(filterProfessionalId || professionalId);
      setStudents(response.students);
      setStats({
        total: response.total,
        active: response.active,
        inactive: response.inactive,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar estudantes";
      setError(message);
      console.error("Error fetching students:", err);
    } finally {
      setIsLoading(false);
    }
  }, [professionalId]);

  // Adicionar estudante
  const createStudent = useCallback(async (data: StudentCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const newStudent = await studentsApi.create(data);
      await fetchStudents(professionalId); // Re-fetch to update list and stats
      return newStudent;
    } catch (err: any) {
      const message = err.message || "Erro ao criar estudante";
      setError(message);
      console.error("Error creating student:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [professionalId, fetchStudents]);

  // Atualizar estudante
  const updateStudent = useCallback(async (id: string, data: StudentUpdate) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedStudent = await studentsApi.update(id, data);
      await fetchStudents(professionalId); // Re-fetch to update list and stats
      return updatedStudent;
    } catch (err: any) {
      const message = err.message || "Erro ao atualizar estudante";
      setError(message);
      console.error("Error updating student:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [professionalId, fetchStudents]);

  // Deletar estudante
  const deleteStudent = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await studentsApi.delete(id);
      await fetchStudents(professionalId); // Re-fetch to update list and stats
      return true;
    } catch (err: any) {
      const message = err.message || "Erro ao deletar estudante";
      setError(message);
      console.error("Error deleting student:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [professionalId, fetchStudents]);

  // Buscar estudante por ID
  const getStudentById = useCallback(
    (id: string) => {
      return students.find((student) => student.id === id);
    },
    [students]
  );

  useEffect(() => {
    fetchStudents(professionalId);
  }, [fetchStudents, professionalId]);

  return {
    students,
    stats,
    isLoading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
  };
};
