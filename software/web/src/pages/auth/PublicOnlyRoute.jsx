import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../../api/auth";

export default function PublicOnlyRoute() {
    if (isLoggedIn()) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
}