import { useState, useCallback, useRef } from "react";
import { textLibraryApi } from "../services/api";
import type {
  TextLibrary,
  TextLibraryCreate,
  TextLibraryUpdate,
  TextLibraryListResponse,
} from "../types";

interface UseTextLibraryParams {
  difficulty?: string;
  is_public?: boolean;
  age_range_min?: number;
  age_range_max?: number;
  letters_focus?: string;
}

interface UseTextLibraryReturn {
  texts: TextLibrary[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchTexts: (params?: UseTextLibraryParams) => Promise<void>;
  createText: (data: TextLibraryCreate) => Promise<TextLibrary | undefined>;
  updateText: (id: string, data: TextLibraryUpdate) => Promise<TextLibrary | undefined>;
  deleteText: (id: string) => Promise<boolean>;
  getTextById: (id: string) => TextLibrary | undefined;
}

export const useTextLibrary = (
  initialParams?: UseTextLibraryParams
): UseTextLibraryReturn => {
  const [texts, setTexts] = useState<TextLibrary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialParamsRef = useRef(initialParams);

  initialParamsRef.current = initialParams;

  const fetchTexts = useCallback(async (fetchParams?: UseTextLibraryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const paramsToUse = fetchParams || initialParamsRef.current || undefined;
      const response = await textLibraryApi.list(paramsToUse);
      setTexts(response.texts);
      setTotal(response.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar textos";
      setError(message);
      console.error("Error fetching texts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createText = useCallback(async (data: TextLibraryCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const newText = await textLibraryApi.create(data);
      await fetchTexts(initialParamsRef.current);
      return newText;
    } catch (err: any) {
      const message = err.message || "Erro ao criar texto";
      setError(message);
      console.error("Error creating text:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTexts]);

  const updateText = useCallback(async (id: string, data: TextLibraryUpdate) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedText = await textLibraryApi.update(id, data);
      await fetchTexts(initialParamsRef.current);
      return updatedText;
    } catch (err: any) {
      const message = err.message || "Erro ao atualizar texto";
      setError(message);
      console.error("Error updating text:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTexts]);

  const deleteText = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await textLibraryApi.delete(id);
      await fetchTexts(initialParamsRef.current);
      return true;
    } catch (err: any) {
      const message = err.message || "Erro ao deletar texto";
      setError(message);
      console.error("Error deleting text:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTexts]);

  const getTextById = useCallback(
    (id: string) => {
      return texts.find((text) => text.id === id);
    },
    [texts]
  );

  return {
    texts,
    total,
    isLoading,
    error,
    fetchTexts,
    createText,
    updateText,
    deleteText,
    getTextById,
  };
};

