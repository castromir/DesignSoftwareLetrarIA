/**
 * EXEMPLO: Como usar a nova estrutura do projeto
 * Este arquivo demonstra os padrões e convenções a seguir
 */

// ============ IMPORTS CORRETOS ============

// ✅ PREFERIDO - Usar alias @/
import { useAuth, useStudents, useActivities } from "@/hooks";
import { formatDate, isValidEmail, getErrorMessage } from "@/utils";
import { User, Activity, Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

// ❌ EVITAR - Importações relativas longas
// import { useAuth } from "../../hooks/useAuth";
// import { formatDate } from "../../../utils/format";

// ============ EXEMPLO DE COMPONENTE ============

import { useState } from "react";

interface ExampleComponentProps {
  studentId: string;
  onSubmit?: (data: Activity) => void;
}

/**
 * Componente de exemplo que demonstra as boas práticas
 */
export function ExampleComponent({ studentId, onSubmit }: ExampleComponentProps) {
  // ✅ Usar hooks customizados
  const { currentUser, isAuthenticated } = useAuth();
  const { students, addStudent } = useStudents();
  const { activities } = useActivities();

  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Usar funções utilitárias
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validar
      if (!isValidEmail(currentUser?.email || "")) {
        throw new Error("Email inválido");
      }

      if (!title.trim()) {
        throw new Error("Título é obrigatório");
      }

      // Simular chamada de API
      const newActivity: Activity = {
        id: String(Date.now()),
        title,
        description: "",
        type: "reading",
        createdBy: currentUser?.id || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "draft",
      };

      onSubmit?.(newActivity);

      // ✅ Usar formatação apropriada
      console.log(`Atividade criada em ${formatDate(new Date())}`);
    } catch (err) {
      // ✅ Usar tratamento de erro consistente
      const message = getErrorMessage(err);
      setError(message);
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <p>Você precisa estar autenticado</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title">Título da Atividade</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título..."
          disabled={isLoading}
        />
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Criando..." : "Criar Atividade"}
      </Button>

      {/* Debug info - remover em produção */}
      {import.meta.env.DEV && (
        <pre className="text-xs bg-gray-100 p-2 rounded">
          {JSON.stringify(
            {
              currentUser: currentUser?.name,
              totalStudents: students.length,
              totalActivities: activities.length,
            },
            null,
            2
          )}
        </pre>
      )}
    </form>
  );
}

// ============ EXEMPLO DE HOOK CUSTOMIZADO ============

import { useCallback } from "react";

/**
 * Hook customizado para gerenciar formulário
 */
export const useFormState = (initialValues: Record<string, string> = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      // Limpar erro do campo
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    setFieldError,
    reset,
  };
};

// ============ EXEMPLO DE FUNÇÃO UTILITÁRIA ============

/**
 * Exemplo de função utilitária que deveria estar em utils/helpers.ts
 */
export const calculateReadingTime = (wordCount: number): number => {
  // Média de 200 palavras por minuto
  return Math.ceil(wordCount / 200);
};

// ============ EXEMPLO DE TIPO ============

/**
 * Exemplo de tipo que deveria estar em types/index.ts
 */
export interface FormData {
  email: string;
  password: string;
  name: string;
  role: "admin" | "professional" | "student";
}

// ============ BOM EXEMPLO DE COMPONENTE COMPLETO ============

/**
 * Componente de card de estudante com boas práticas
 */
export function StudentCard({ student }: { student: Student }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // await deleteStudent(student.id);
      console.log(`Estudante ${student.name} deletado`);
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-lg">{student.name}</h3>
      <p className="text-gray-600 text-sm">{student.email}</p>
      <p className="text-gray-500 text-xs mt-2">
        Inscrito em: {formatDate(student.enrollmentDate)}
      </p>
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        {isLoading ? "Deletando..." : "Deletar"}
      </button>
    </div>
  );
}

export default ExampleComponent;
