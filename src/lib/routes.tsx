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
import AdmissionsPage from "@/pages/Admissions";
import TreatmentsPage from "@/pages/Treatments";
import AppointmentsPage from "@/pages/Appointments";
import SettingsPage from "@/pages/Settings";

/**
 * Application Router Configuration
 * Includes authentication protection for all routes
 *
 * Role-based access:
 * - root_user: Full access to all features
 * - admission: Patient management, admissions
 * - doctor: View assigned patients, medical records
 * - nurse: View assigned patients, nursing care
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
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["root_user", "admission"]}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "patients",
        element: (
          <ProtectedRoute
            allowedRoles={["root_user", "admission", "doctor", "nurse"]}
          >
            <PatientsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admissions",
        element: (
          <ProtectedRoute
            allowedRoles={["root_user", "admission", "doctor", "nurse"]}
          >
            <AdmissionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "treatments",
        element: (
          <ProtectedRoute
            allowedRoles={["root_user", "admission", "doctor", "nurse"]}
          >
            <TreatmentsPage />
          </ProtectedRoute>
        ),
      },
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
