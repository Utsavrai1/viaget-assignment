import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/zustand/auth";

const PublicRoute = () => {
  const token = useAuthStore((state) => state.token);

  return !token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;
