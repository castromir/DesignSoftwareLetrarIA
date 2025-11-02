/**
 * Hook para gerenciar autenticação
 */

import { useState, useCallback } from "react";
import { User, UserRole, RegisterData } from "../types";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simular chamada de API
      // const response = await api.post('/auth/login', { email, password });
      // setCurrentUser(response.data.user);

      // Mock para desenvolvimento
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: "professional" as UserRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentUser(mockUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setError(null);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simular chamada de API
      // const response = await api.post('/auth/register', data);
      // setCurrentUser(response.data.user);

      // Mock para desenvolvimento
      const mockUser: User = {
        id: "1",
        email: data.email,
        name: data.name,
        role: data.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentUser(mockUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao registrar";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentUser,
    isLoading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser,
  };
};
