import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/Dashboard";
import PatientsPage from "@/pages/Patients";
import AppointmentsPage from "@/pages/Appointments";
import StaffPage from "@/pages/Staff";
import SettingsPage from "@/pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "patients", element: <PatientsPage /> },
      { path: "appointments", element: <AppointmentsPage /> },
      { path: "staff", element: <StaffPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);


