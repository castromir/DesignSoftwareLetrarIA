import React from "react";
import { RouteObject, Navigate } from "react-router-dom";
import { LoginPage } from "../components/LoginPage";
import { AdminDashboard } from "../components/AdminDashboard";
import { ProfessionalHome } from "../components/ProfessionalHome";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthLayout } from "./layouts/AuthLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProfessionalLayout } from "./layouts/ProfessionalLayout";
import { useAuth } from "../contexts/AuthContext";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        <a href="/login" className="text-blue-600 hover:underline">
          Voltar para login
        </a>
      </div>
    </div>
  );
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <AdminDashboardWithProps />,
      },
    ],
  },
  {
    path: "/professional",
    element: (
      <ProtectedRoute requiredRole="professional">
        <ProfessionalLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <ProfessionalHomeWithProps />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

// Helper components to inject props from context
function AdminDashboardWithProps() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <AdminDashboard
      user={{
        email: currentUser.email,
        type: "admin",
        name: currentUser.name,
      }}
      onLogout={logout}
    />
  );
}

function ProfessionalHomeWithProps() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <ProfessionalHome
      user={{
        email: currentUser.email,
        type: "professional",
        name: currentUser.name,
      }}
      onLogout={logout}
    />
  );
}
