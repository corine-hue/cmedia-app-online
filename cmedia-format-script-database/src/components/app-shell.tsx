import Link from "next/link";
import Image from "next/image";
import { Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="studio-grid min-h-screen">
      <header className="border-b border-broadcast-line bg-broadcast-navy/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/brand/cmedia-logo-white.png"
              alt="CMedia Productions"
              width={193}
              height={60}
              priority
              className="h-12 w-auto"
            />
            <span className="hidden border-l border-broadcast-line pl-4 text-xs text-slate-400 sm:inline">
              Format & Script Database
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-broadcast-beige transition hover:bg-white/10" href="/dashboard">
              <Database size={16} />
              Database
            </Link>
            <Link href="/projects/new">
              <Button>
                <Plus size={16} />
                Nieuw project
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
