"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projectTypes } from "@/lib/constants";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import type { ProjectType } from "@/lib/types";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [documentType, setDocumentType] = useState<ProjectType>("tv_format");
  const [loading, setLoading] = useState(false);

  async function createProject() {
    setLoading(true);
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, synopsis, document_type: documentType })
    });
    const result = await response.json();
    router.push(`/projects/${result.id}`);
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-6 py-10">
        <Card>
          <CardHeader>
            <p className="text-sm font-semibold tracking-[0.3em] text-broadcast-gold">NIEUW PROJECT</p>
            <h1 className="mt-3 text-4xl font-bold">Kies het documenttype en start een nieuw format.</h1>
          </CardHeader>
          <CardContent className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-broadcast-beige">Document type</span>
              <Select value={documentType} onChange={(event) => setDocumentType(event.target.value as ProjectType)}>
                {projectTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </Select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-broadcast-beige">Titel</span>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Bijv. De Nieuwe Makers" />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-broadcast-beige">Korte synopsis</span>
              <Textarea value={synopsis} onChange={(event) => setSynopsis(event.target.value)} placeholder="Waar gaat het project over?" />
            </label>
            <Button disabled={!title || loading} onClick={createProject}>Project aanmaken</Button>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
