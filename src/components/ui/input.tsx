import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm",
        "placeholder:text-gray-400",
        "focus:border-ffh-blue focus:outline-none focus:ring-1 focus:ring-ffh-blue",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:border-ffh-border-dark dark:bg-ffh-surface-dark dark:text-gray-100 dark:placeholder:text-gray-500",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
