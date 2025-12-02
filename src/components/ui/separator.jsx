// @/components/ui/separator.tsx (Alternative without Radix UI)
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} SeparatorProps
 * @property {"horizontal" | "vertical"} [orientation="horizontal"] - The orientation of the separator
 * @property {boolean} [decorative=true] - Whether the separator is decorative
 * @property {string} [className] - Additional CSS classes
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */

const Separator = React.forwardRef(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => {
    const orientationStyles = orientation === "horizontal" 
      ? "h-[1px] w-full" 
      : "h-full w-[1px]";

    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={orientation}
        className={cn(
          "shrink-0 bg-border",
          orientationStyles,
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };