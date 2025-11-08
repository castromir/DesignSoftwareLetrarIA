import { useState, useCallback, useEffect } from "react";
import { activitiesApi } from "../services/api";
import type { Activity, ActivityCreate, ActivityUpdate, ActivityListResponse } from "../types";

interface UseActivitiesReturn {
  activities: Activity[];
  stats: { total: number; pending: number; in_progress: number; completed: number };
  isLoading: boolean;
  error: string | null;
  fetchActivities: (professionalId?: string, status?: string) => Promise<void>;
  createActivity: (data: ActivityCreate) => Promise<Activity | undefined>;
  updateActivity: (id: string, data: ActivityUpdate) => Promise<Activity | undefined>;
  deleteActivity: (id: string) => Promise<boolean>;
  getActivityById: (id: string) => Activity | undefined;
}

export const useActivities = (professionalId?: string): UseActivitiesReturn => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async (filterProfessionalId?: string, status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await activitiesApi.list(filterProfessionalId || professionalId, status);
      setActivities(response.activities);
      setStats({
        total: response.total,
        pending: response.pending,
        in_progress: response.in_progress,
        completed: response.completed,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar atividades";
      setError(message);
      console.error("Error fetching activities:", err);
    } finally {
      setIsLoading(false);
    }
  }, [professionalId]);

  const createActivity = useCallback(async (data: ActivityCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const newActivity = await activitiesApi.create(data);
      await fetchActivities(professionalId);
      return newActivity;
    } catch (err: any) {
      const message = err.message || "Erro ao criar atividade";
      setError(message);
      console.error("Error creating activity:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [professionalId, fetchActivities]);

  const updateActivity = useCallback(async (id: string, data: ActivityUpdate) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedActivity = await activitiesApi.update(id, data);
      await fetchActivities(professionalId);
      return updatedActivity;
    } catch (err: any) {
      const message = err.message || "Erro ao atualizar atividade";
      setError(message);
      console.error("Error updating activity:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [professionalId, fetchActivities]);

  const deleteActivity = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await activitiesApi.delete(id);
      await fetchActivities(professionalId);
      return true;
    } catch (err: any) {
      const message = err.message || "Erro ao deletar atividade";
      setError(message);
      console.error("Error deleting activity:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [professionalId, fetchActivities]);

  const getActivityById = useCallback(
    (id: string) => {
      return activities.find((activity) => activity.id === id);
    },
    [activities]
  );

  useEffect(() => {
    fetchActivities(professionalId);
  }, [fetchActivities, professionalId]);

  return {
    activities,
    stats,
    isLoading,
    error,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivityById,
  };
};
