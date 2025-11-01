import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { ProfessionalHome } from "./components/ProfessionalHome";
import { Toaster } from "./components/ui/sonner";

type UserType = "admin" | "professional" | null;

interface User {
  email: string;
  type: UserType;
  name: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Renderiza a página baseada no tipo de usuário
  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (currentUser.type === "admin") {
    return (
      <>
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  if (currentUser.type === "professional") {
    return (
      <>
        <ProfessionalHome
          user={currentUser}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  return null;
}