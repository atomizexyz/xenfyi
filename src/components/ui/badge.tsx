import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-xen-blue/20 bg-xen-blue/10 text-xen-blue",
        secondary: "border-white/10 bg-white/5 text-[var(--foreground)]",
        success: "border-success/20 bg-success/10 text-success",
        destructive: "border-error/20 bg-error/10 text-error",
        warning: "border-warning/20 bg-warning/10 text-warning",
        outline: "border-white/20 text-[var(--foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
