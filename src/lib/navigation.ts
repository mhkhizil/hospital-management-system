import {
  CalendarClock,
  LayoutDashboard,
  Settings,
  Users,
  UserPlus,
  UserCog,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  to: string;
  icon: LucideIcon;
  rootOnly?: boolean; // Only show for root users
};

export const mainNavigation: NavItem[] = [
  { title: "Overview", to: "/", icon: LayoutDashboard },
  { title: "Patients", to: "/patients", icon: Users },
  { title: "Admissions", to: "/admissions", icon: Activity },
  { title: "Appointments", to: "/appointments", icon: CalendarClock },
  { title: "Users", to: "/users", icon: UserCog, rootOnly: true },
  { title: "Register", to: "/register", icon: UserPlus, rootOnly: true },
  { title: "Settings", to: "/settings", icon: Settings },
];
