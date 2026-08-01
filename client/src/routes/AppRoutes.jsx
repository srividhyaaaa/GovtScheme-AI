import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Profile from "../pages/student/Profile";
import Dashboard from "../pages/student/Dashboard";
import Chat from "../pages/student/Chat";
import Documents from "../pages/student/Documents";
import MyApplications from "../pages/student/MyApplications";
import SavedSchemes from "../pages/student/SavedSchemes";

import AIRecommendations from "../pages/AIRecommendations";
import CompareSchemes from "../pages/CompareSchemes";
import Roadmap from "../pages/Roadmap";

import Schemes from "../pages/scholarships/Schemes";
import SchemeDetails from "../pages/scholarships/SchemeDetails";
import ScholarshipDetails from "../pages/ScholarshipDetails";

import AdminDashboard from "../pages/admin/AdminDashboard";

import NotFound from "../pages/public/NotFound";


function AppRoutes(){

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/scheme/:id" element={<SchemeDetails />} />
            <Route path="/scholarship/:id" element={<ScholarshipDetails />} />
            <Route path="/recommendations" element={<AIRecommendations />} />
            <Route path="/compare" element={<CompareSchemes />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/chat"
                element={
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                }
            />
            <Route
                path="/documents"
                element={
                    <PrivateRoute>
                        <Documents />
                    </PrivateRoute>
                }
            />
            <Route
                path="/my-applications"
                element={
                    <PrivateRoute>
                        <MyApplications />
                    </PrivateRoute>
                }
            />
            <Route
                path="/applications"
                element={
                    <PrivateRoute>
                        <MyApplications />
                    </PrivateRoute>
                }
            />
            <Route
                path="/saved-schemes"
                element={
                    <PrivateRoute>
                        <SavedSchemes />
                    </PrivateRoute>
                }
            />
            <Route
                path="/saved"
                element={
                    <PrivateRoute>
                        <SavedSchemes />
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );

}


export default AppRoutes;