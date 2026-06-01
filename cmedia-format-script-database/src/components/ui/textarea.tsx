import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full resize-y rounded-md border border-broadcast-line bg-broadcast-ink px-3 py-3 text-sm text-broadcast-white outline-none ring-broadcast-gold/30 placeholder:text-slate-500 focus:border-broadcast-gold focus:ring-4",
        props.className
      )}
    />
  );
}
