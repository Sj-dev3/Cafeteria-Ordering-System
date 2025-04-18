import Layout from "./layouts/layout";
import { Routes, Navigate, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Home Page with Hero */}
            <Route path="/" element={<Layout showHero={true}><HomePage /></Layout>} />

            {/* Auth Callback Page without Hero */}
            <Route path="/auth-callback" element={<Layout showHero={false}><AuthCallbackPage /></Layout>} />

            <Route element={<ProtectedRoute/>}>
                <Route path="/user-profile" element={<Layout showHero={false}><UserProfilePage /></Layout>} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;