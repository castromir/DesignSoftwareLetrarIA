import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { ProfessionalHome } from "./components/ProfessionalHome";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { currentUser, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  if (currentUser.role === "admin") {
    return (
      <>
        <AdminDashboard
          user={{
            email: currentUser.email,
            type: "admin",
            name: currentUser.name,
          }}
          onLogout={logout}
        />
        <Toaster />
      </>
    );
  }

  if (currentUser.role === "professional") {
    return (
      <>
        <ProfessionalHome
          user={{
            email: currentUser.email,
            type: "professional",
            name: currentUser.name,
          }}
          onLogout={logout}
        />
        <Toaster />
      </>
    );
  }

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}