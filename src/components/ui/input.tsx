import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg hairline placeholder:text-subtle",
          "transition-[box-shadow] duration-150 ease-[var(--ease-out)]",
          "focus:outline-none focus:shadow-[0_0_0_1px_var(--color-accent)]",
          className,
        )}
        {...props}
      />
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-11 w-full resize-none rounded-md bg-elevated px-3 py-3 text-sm text-fg hairline placeholder:text-subtle",
        "transition-[box-shadow] duration-150 ease-[var(--ease-out)]",
        "focus:outline-none focus:shadow-[0_0_0_1px_var(--color-accent)]",
        className,
      )}
      {...props}
    />
  );
});
