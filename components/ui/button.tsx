"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "gradient-primary text-on-accent shadow-lg shadow-accent-primary/20 hover:shadow-xl hover:shadow-accent-primary/30 hover:scale-[1.02]",
        secondary:
          "bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary/10 hover:scale-[1.02]",
        ghost:
          "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
        outline:
          "border border-border-subtle bg-transparent text-text-primary hover:bg-bg-tertiary hover:border-border-strong",
        destructive: "bg-error text-white hover:bg-error/90 hover:scale-[1.02]",
        link: "underline-offset-4 hover:underline text-accent-primary p-0 h-auto active:scale-100",
      },
      size: {
        default: "h-10 px-5 py-2.5 text-sm",
        sm: "h-8 px-3 py-1.5 text-sm rounded-lg",
        lg: "h-12 px-7 py-3.5 text-base rounded-xl",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref,
  ) => {
    // Slot needs exactly one child, so asChild skips the icon/loader wrappers
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size }), className)}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const Comp = "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          iconLeft && <span>{iconLeft}</span>
        )}
        {children}
        {iconRight && !isLoading && <span>{iconRight}</span>}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
