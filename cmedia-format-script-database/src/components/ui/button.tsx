import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-broadcast-gold text-broadcast-navy hover:bg-broadcast-beige",
        variant === "secondary" && "border border-broadcast-line bg-broadcast-panel text-broadcast-white hover:border-broadcast-gold",
        variant === "ghost" && "text-broadcast-beige hover:bg-white/10",
        variant === "danger" && "bg-red-500/15 text-red-200 hover:bg-red-500/25",
        className
      )}
      {...props}
    />
  );
}
