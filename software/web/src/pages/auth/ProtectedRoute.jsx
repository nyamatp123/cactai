import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStatus from "./useAuthStatus";

export default function ProtectedRoute() {
  const location = useLocation();
  const status = useAuthStatus();

  if (status === "checking") return null; // TODO: loading spinner
  if (status === "out") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}