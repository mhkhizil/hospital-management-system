import {
  Activity,
  CalendarClock,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  to: string;
  icon: LucideIcon;
};

export const mainNavigation: NavItem[] = [
  { title: "Overview", to: "/", icon: LayoutDashboard },
  { title: "Patients", to: "/patients", icon: Users },
  { title: "Appointments", to: "/appointments", icon: CalendarClock },
  { title: "Staff", to: "/staff", icon: Activity },
  { title: "Settings", to: "/settings", icon: Settings },
];


