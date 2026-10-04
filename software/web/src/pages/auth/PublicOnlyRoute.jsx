import { Navigate, Outlet } from "react-router-dom";
import useAuthStatus from "./useAuthStatus";

export default function PublicOnlyRoute() {
  const status = useAuthStatus();

  if (status === "checking") return null; // TODO: loading spinner
  if (status === "in") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}