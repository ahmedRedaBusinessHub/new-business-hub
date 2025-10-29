import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-md",
    "text-sm",
    "font-medium",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
    "disabled:opacity-50",
    "disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--color-primary)]",
          "text-white",
          "hover:opacity-90",
        ],
        secondary: [
          "bg-[var(--color-secondary)]",
          "text-white",
          "hover:opacity-90",
        ],
        outline: [
          "border-2",
          "border-[var(--color-primary)]",
          "text-[var(--color-primary)]",
          "hover:bg-[var(--color-primary)]",
          "hover:text-white",
        ],
        ghost: [
          "hover:bg-[var(--color-primary)]",
          "hover:bg-opacity-10",
          "text-[var(--color-foreground)]",
        ],
      },
      size: {
        sm: ["h-9", "px-3", "text-xs"],
        md: ["h-10", "px-4", "py-2"],
        lg: ["h-11", "px-8", "text-base"],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
