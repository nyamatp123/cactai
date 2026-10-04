import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgetPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import SettingsPage from "./pages/settings/SettingsPage.jsx";
import WelcomePage from "./pages/onboarding/WelcomePage.jsx";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import PublicOnlyRoute from "./pages/auth/PublicOnlyRoute.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* only for logged-out users */}
            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* open to everyone */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* need a valid login */}
            <Route element={<ProtectedRoute />}>
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/:plantId" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}