import * as React from "react";
import { cn } from "@/lib/utils";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-md border border-broadcast-line bg-broadcast-ink px-3 text-sm text-broadcast-white outline-none ring-broadcast-gold/30 focus:border-broadcast-gold focus:ring-4",
        props.className
      )}
    />
  );
}
