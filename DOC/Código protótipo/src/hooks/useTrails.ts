import { useState, useCallback, useRef } from "react";
import { trailsApi } from "../services/api";
import type {
  Trail,
  TrailCreate,
  TrailUpdate,
  TrailListResponse,
  TrailStory,
  TrailStoryCreate,
  TrailStoryUpdate,
} from "../types";

interface UseTrailsParams {
  difficulty?: string;
  is_default?: boolean;
  age_range_min?: number;
  age_range_max?: number;
}

interface UseTrailsReturn {
  trails: Trail[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchTrails: (params?: UseTrailsParams) => Promise<void>;
  createTrail: (data: TrailCreate) => Promise<Trail | undefined>;
  updateTrail: (id: string, data: TrailUpdate) => Promise<Trail | undefined>;
  deleteTrail: (id: string) => Promise<boolean>;
  getTrailById: (id: string) => Trail | undefined;
  createStory: (trailId: string, data: TrailStoryCreate) => Promise<TrailStory | undefined>;
  updateStory: (storyId: string, data: TrailStoryUpdate) => Promise<TrailStory | undefined>;
  deleteStory: (storyId: string) => Promise<boolean>;
}

export const useTrails = (
  initialParams?: UseTrailsParams
): UseTrailsReturn => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialParamsRef = useRef(initialParams);

  initialParamsRef.current = initialParams;

  const fetchTrails = useCallback(async (fetchParams?: UseTrailsParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const paramsToUse = fetchParams || initialParamsRef.current || undefined;
      const response = await trailsApi.list(paramsToUse);
      setTrails(response.trails);
      setTotal(response.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar trilhas";
      setError(message);
      console.error("Error fetching trails:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTrail = useCallback(async (data: TrailCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTrail = await trailsApi.create(data);
      await fetchTrails(initialParamsRef.current);
      return newTrail;
    } catch (err: any) {
      const message = err.message || "Erro ao criar trilha";
      setError(message);
      console.error("Error creating trail:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTrails]);

  const updateTrail = useCallback(async (id: string, data: TrailUpdate) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTrail = await trailsApi.update(id, data);
      await fetchTrails(initialParamsRef.current);
      return updatedTrail;
    } catch (err: any) {
      const message = err.message || "Erro ao atualizar trilha";
      setError(message);
      console.error("Error updating trail:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTrails]);

  const deleteTrail = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await trailsApi.delete(id);
      await fetchTrails(initialParamsRef.current);
      return true;
    } catch (err: any) {
      const message = err.message || "Erro ao deletar trilha";
      setError(message);
      console.error("Error deleting trail:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTrails]);

  const getTrailById = useCallback(
    (id: string) => {
      return trails.find((trail) => trail.id === id);
    },
    [trails]
  );

  const createStory = useCallback(async (trailId: string, data: TrailStoryCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const newStory = await trailsApi.createStory(trailId, data);
      await fetchTrails(initialParamsRef.current);
      return newStory;
    } catch (err: any) {
      const message = err.message || "Erro ao criar história";
      setError(message);
      console.error("Error creating story:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTrails]);

  const updateStory = useCallback(async (storyId: string, data: TrailStoryUpdate) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedStory = await trailsApi.updateStory(storyId, data);
      await fetchTrails(initialParamsRef.current);
      return updatedStory;
    } catch (err: any) {
      const message = err.message || "Erro ao atualizar história";
      setError(message);
      console.error("Error updating story:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTrails]);

  const deleteStory = useCallback(async (storyId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await trailsApi.deleteStory(storyId);
      await fetchTrails(initialParamsRef.current);
      return true;
    } catch (err: any) {
      const message = err.message || "Erro ao deletar história";
      setError(message);
      console.error("Error deleting story:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTrails]);

  return {
    trails,
    total,
    isLoading,
    error,
    fetchTrails,
    createTrail,
    updateTrail,
    deleteTrail,
    getTrailById,
    createStory,
    updateStory,
    deleteStory,
  };
};

