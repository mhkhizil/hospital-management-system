import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  ProtectedRoute,
  PublicRoute,
} from "@/core/presentation/components/ProtectedRoute";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import UserManagementPage from "@/pages/UserManagement";
import ProfilePage from "@/pages/Profile";
import DashboardPage from "@/pages/Dashboard";
import PatientsPage from "@/pages/Patients";
import AppointmentsPage from "@/pages/Appointments";
import SettingsPage from "@/pages/Settings";

/**
 * Application Router Configuration
 * Includes authentication protection for all routes
 */
export const router = createBrowserRouter([
  // Public routes (only accessible when NOT logged in)
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute allowedRoles={["root_user"]}>
        <RegisterPage />
      </ProtectedRoute>
    ),
  },

  // Protected routes (require authentication)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "patients", element: <PatientsPage /> },
      { path: "appointments", element: <AppointmentsPage /> },
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={["root_user"]}>
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  // Catch all - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
