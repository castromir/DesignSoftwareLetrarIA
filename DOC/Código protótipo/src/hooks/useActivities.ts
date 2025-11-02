/**
 * Hook para gerenciar atividades
 */

import { useState, useCallback, useEffect } from "react";

type Activity = {
  id: string;
  title: string;
  description?: string;
  type: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
};

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar atividades
  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simular chamada de API
      // const response = await api.get('/activities');
      // setActivities(response.data);

      // Mock para desenvolvimento
      setActivities([
        {
          id: "1",
          title: "Leitura - Nivel 1",
          description: "Leitura básica para iniciantes",
          type: "reading",
          createdBy: "prof1",
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "published",
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao buscar atividades";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Adicionar atividade
  const addActivity = useCallback((activity: Activity) => {
    setActivities((prev) => [...prev, activity]);
  }, []);

  // Atualizar atividade
  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  }, []);

  // Deletar atividade
  const deleteActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
  }, []);

  // Buscar atividade por ID
  const getActivityById = useCallback(
    (id: string) => {
      return activities.find((activity) => activity.id === id);
    },
    [activities]
  );

  // Filtrar por tipo
  const getActivitiesByType = useCallback(
    (type: string) => {
      return activities.filter((activity) => activity.type === type);
    },
    [activities]
  );

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    error,
    fetchActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivityById,
    getActivitiesByType,
  };
};
