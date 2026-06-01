import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border border-broadcast-gold/30 px-3 py-1 text-xs font-semibold text-broadcast-beige", className)}>
      {children}
    </span>
  );
}
