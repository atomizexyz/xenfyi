import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xen-blue/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-xen-blue to-[var(--color-gradient-end)] text-white shadow-lg shadow-xen-blue/20 hover:shadow-xl hover:shadow-xen-blue/30 hover:scale-[1.02]",
        secondary:
          "border border-white/10 bg-white/5 text-[var(--foreground)] hover:bg-white/10 hover:border-white/20",
        ghost:
          "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5",
        destructive:
          "bg-error/10 text-error border border-error/20 hover:bg-error/20",
        link: "text-xen-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2 rounded-full",
        sm: "h-8 px-4 text-xs rounded-full",
        lg: "h-12 px-8 text-base rounded-full",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
