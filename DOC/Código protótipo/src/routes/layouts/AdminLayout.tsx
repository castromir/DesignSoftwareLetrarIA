import { Outlet } from "react-router-dom";
import { Toaster } from "../../components/ui/sonner";

export function AdminLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
