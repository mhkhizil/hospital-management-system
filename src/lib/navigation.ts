import {
  CalendarClock,
  LayoutDashboard,
  Settings,
  Users,
  UserPlus,
  UserCog,
  Activity,
  Stethoscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/core/domain/entities/User";

export type NavItem = {
  title: string;
  to: string;
  icon: LucideIcon;
  rootOnly?: boolean; // Only show for root users (deprecated, use allowedRoles instead)
  allowedRoles?: UserRole[]; // Only show for specified roles
};

export const mainNavigation: NavItem[] = [
  {
    title: "Overview",
    to: "/",
    icon: LayoutDashboard,
    allowedRoles: ["root_user", "admission"],
  },
  { title: "Patients", to: "/patients", icon: Users },
  { title: "Admissions", to: "/admissions", icon: Activity },
  { title: "Treatments", to: "/treatments", icon: Stethoscope },
  { title: "Appointments", to: "/appointments", icon: CalendarClock },
  { title: "Users", to: "/users", icon: UserCog, rootOnly: true },
  { title: "Register", to: "/register", icon: UserPlus, rootOnly: true },
  { title: "Settings", to: "/settings", icon: Settings },
];
