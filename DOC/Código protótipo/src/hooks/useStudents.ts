/**
 * Hook para gerenciar lista de estudantes
 */

import { useState, useCallback, useEffect } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  professionalId: string;
  enrollmentDate: Date;
  status: string;
};

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar estudantes
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simular chamada de API
      // const response = await api.get('/students');
      // setStudents(response.data);

      // Mock para desenvolvimento
      setStudents([
        {
          id: "1",
          name: "João Silva",
          email: "joao@example.com",
          professionalId: "prof1",
          enrollmentDate: new Date(),
          status: "active",
        },
        {
          id: "2",
          name: "Maria Santos",
          email: "maria@example.com",
          professionalId: "prof1",
          enrollmentDate: new Date(),
          status: "active",
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar estudantes";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Adicionar estudante
  const addStudent = useCallback((student: Student) => {
    setStudents((prev) => [...prev, student]);
  }, []);

  // Atualizar estudante
  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updates } : student
      )
    );
  }, []);

  // Deletar estudante
  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  }, []);

  // Buscar estudante por ID
  const getStudentById = useCallback(
    (id: string) => {
      return students.find((student) => student.id === id);
    },
    [students]
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    isLoading,
    error,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
  };
};
