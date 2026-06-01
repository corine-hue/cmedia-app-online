"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { projectStatuses, projectTypes } from "@/lib/constants";
import type { Project, ProjectStatus, ProjectType } from "@/lib/types";

export function DashboardClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ProjectType | "all">("all");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");

  const visible = useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery = [project.title, project.synopsis].join(" ").toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (type === "all" || project.document_type === type) && (status === "all" || project.status === status);
    });
  }, [projects, query, type, status]);

  async function duplicateProject(id: string) {
    await fetch(`/api/projects/${id}/duplicate`, { method: "POST" });
    window.location.reload();
  }

  async function deleteProject(id: string) {
    const supabase = createBrowserSupabase();
    await supabase.from("projects").delete().eq("id", id);
    setProjects((current) => current.filter((project) => project.id !== id));
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-broadcast-gold">BROADCAST DEVELOPMENT SUITE</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight text-broadcast-white lg:text-7xl">Centrale database voor formats, scripts en decks.</h1>
          </div>
          <Link href="/projects/new">
            <Button className="h-12 px-6">Nieuw project</Button>
          </Link>
        </div>
        <div className="mt-10 grid gap-3 rounded-lg border border-broadcast-line bg-broadcast-panel p-4 lg:grid-cols-[1fr_220px_220px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 text-slate-500" size={18} />
            <Input className="pl-10" placeholder="Zoek op titel, synopsis of concept..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-3 text-slate-500" size={18} />
            <Select className="pl-10" value={type} onChange={(event) => setType(event.target.value as ProjectType | "all")}>
              <option value="all">Alle types</option>
              {projectTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
          </label>
          <Select value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus | "all")}>
            <option value="all">Alle statussen</option>
            {projectStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
        </div>
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} onDuplicate={duplicateProject} onDelete={deleteProject} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
