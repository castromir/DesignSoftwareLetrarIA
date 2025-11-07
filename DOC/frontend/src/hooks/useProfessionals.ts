import { useState, useEffect } from "react";
import { professionalsApi } from "../services/api";
import type {
  Professional,
  ProfessionalCreate,
  ProfessionalUpdate,
  ProfessionalListResponse,
} from "../types";

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await professionalsApi.list();
      setProfessionals(response.professionals);
      setStats({
        total: response.total,
        active: response.active,
        inactive: response.inactive,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar profissionais"
      );
    } finally {
      setLoading(false);
    }
  };

  const createProfessional = async (data: ProfessionalCreate) => {
    try {
      setLoading(true);
      setError(null);
      const newProfessional = await professionalsApi.create(data);
      await loadProfessionals();
      return newProfessional;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar profissional";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfessional = async (
    id: string,
    data: ProfessionalUpdate
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await professionalsApi.update(id, data);
      await loadProfessionals();
      return updated;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar profissional";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await professionalsApi.delete(id);
      await loadProfessionals();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar profissional";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfessionals();
  }, []);

  return {
    professionals,
    stats,
    loading,
    error,
    reload: loadProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
  };
}

