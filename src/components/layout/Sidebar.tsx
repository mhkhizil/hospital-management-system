"use client";

import { NavLink } from "react-router-dom";
import { mainNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAuth } from "@/core/presentation/context/AuthContext";

type SidebarProps = {
  isMobileOpen: boolean;
  onClose(): void;
};

export function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const isRootUser = user?.isRootUser() ?? false;

  // Filter navigation items based on user role
  const visibleNavigation = mainNavigation.filter(
    (item) => !item.rootOnly || isRootUser
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-30 w-72 border-r border-border bg-card/80 backdrop-blur",
        "transition-transform duration-300 lg:static",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Hospital
            </p>
            <h1 className="text-2xl font-semibold">CareFlow</h1>
          </div>
          <ThemeToggle />
        </div>

        <nav className="mt-10 space-y-1">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-dashed border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Capacity
          </p>
          <div className="mt-2 text-2xl font-bold">82%</div>
          <p className="text-xs text-muted-foreground">
            Beds occupied across all departments
          </p>
        </div>
      </div>
    </aside>
  );
}
