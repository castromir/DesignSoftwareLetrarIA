import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { authApi, getAuthData, clearAuthData } from "../services/api";

// Função auxiliar para verificar se o token está expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // Se não conseguir decodificar, considerar expirado
  }
};

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserFromStorage = () => {
    const { user, token } = getAuthData();
    if (user && token) {
      // Verificar se o token está expirado
      if (isTokenExpired(token)) {
        console.log(
          "[AuthContext] Token expirado, limpando dados de autenticação",
        );
        clearAuthData();
        setCurrentUser(null);
        return;
      }

      const parsedUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "admin" | "professional",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentUser(parsedUser);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password);
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as "admin" | "professional",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentUser(user);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao fazer login. Verifique suas credenciais.";
      setError(message);
      clearAuthData();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setCurrentUser(null);
    setError(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as "admin" | "professional",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentUser(user);
    } catch (err) {
      clearAuthData();
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
