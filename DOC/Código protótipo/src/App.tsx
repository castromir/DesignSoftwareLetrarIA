import { AuthProvider } from "./contexts/AuthContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes/routes";

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}