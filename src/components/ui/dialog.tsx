import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-all",
        open ? "visible opacity-100" : "invisible opacity-0"
      )}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

export const DialogContent = ({ className, children }: DialogContentProps) => {
  return <div className={cn("space-y-4", className)}>{children}</div>;
};

interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const DialogHeader = ({ className, children }: DialogHeaderProps) => {
  return <div className={cn("space-y-1", className)}>{children}</div>;
};

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const DialogTitle = ({ className, children }: DialogTitleProps) => {
  return (
    <h2 className={cn("text-xl font-semibold leading-none", className)}>
      {children}
    </h2>
  );
};
interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const DialogFooter = ({ className, children }: DialogFooterProps) => {
  return (
    <div
      className={cn(
        "flex justify-end space-x-2 pt-4 border-t mt-4",
        className
      )}
    >
      {children}
    </div>
  );
};

