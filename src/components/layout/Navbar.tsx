"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type NavbarProps = {
  onMenuClick(): void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/70 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="w-full max-w-md">
          <Input placeholder="Search patients, staff, visits..." />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-full border border-border/80 px-3 py-1">
          <span className="h-8 w-8 rounded-full bg-primary/10 text-center text-sm font-semibold leading-8 text-primary">
            AZ
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">Dr. Aye Zin</p>
            <p className="text-xs text-muted-foreground">Hospital Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
