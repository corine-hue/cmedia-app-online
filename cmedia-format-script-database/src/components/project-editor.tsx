"use client";

import { useState } from "react";
import { Download, GripVertical, ImagePlus, Plus, Save, Trash2, Copy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { draaiboekColumns, formatFields, pitchdeckFields, projectStatuses, sceneFields } from "@/lib/constants";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import type { DraaiboekRow, ProjectBundle, ProjectStatus, Scene } from "@/lib/types";

type Draft = ProjectBundle & {
  format: Record<string, string | number | null>;
  pitchdeck: Record<string, string | null>;
  draaiboek: { rows: DraaiboekRow[] };
  scenes: Scene[];
};

export function ProjectEditor({ bundle }: { bundle: ProjectBundle }) {
  const [draft, setDraft] = useState<Draft>({
    ...bundle,
    format: bundle.format ?? {},
    pitchdeck: bundle.pitchdeck ?? {},
    draaiboek: bundle.draaiboek ?? { rows: [] },
    scenes: bundle.scenes ?? []
  });
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [imageDragIndex, setImageDragIndex] = useState<number | null>(null);

  function setProject(key: "title" | "synopsis" | "status", value: string) {
    setDraft((current) => ({ ...current, project: { ...current.project, [key]: value } }));
  }

  function updateScene(index: number, key: string, value: string) {
    setDraft((current) => ({
      ...current,
      scenes: current.scenes.map((scene, sceneIndex) => sceneIndex === index ? { ...scene, [key]: value } : scene)
    }));
  }

  function renumberScenes(scenes: Scene[]) {
    return scenes.map((scene, index) => ({ ...scene, scene_number: index + 1, sort_order: index }));
  }

  function addScene() {
    setDraft((current) => ({
      ...current,
      scenes: renumberScenes([...current.scenes, { scene_number: current.scenes.length + 1, title: "Nieuwe scene", sort_order: current.scenes.length }])
    }));
  }

  function duplicateScene(index: number) {
    setDraft((current) => {
      const scene = { ...current.scenes[index], id: undefined, title: `${current.scenes[index].title ?? "Scene"} kopie` };
      const scenes = [...current.scenes.slice(0, index + 1), scene, ...current.scenes.slice(index + 1)];
      return { ...current, scenes: renumberScenes(scenes) };
    });
  }

  function removeScene(index: number) {
    setDraft((current) => ({ ...current, scenes: renumberScenes(current.scenes.filter((_, sceneIndex) => sceneIndex !== index)) }));
  }

  function dropScene(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    setDraft((current) => {
      const next = [...current.scenes];
      const [scene] = next.splice(dragIndex, 1);
      next.splice(index, 0, scene);
      return { ...current, scenes: renumberScenes(next) };
    });
    setDragIndex(null);
  }

  function dropImage(index: number) {
    if (imageDragIndex === null || imageDragIndex === index) return;
    setDraft((current) => {
      const next = [...current.images];
      const [image] = next.splice(imageDragIndex, 1);
      next.splice(index, 0, image);
      return {
        ...current,
        images: next.map((item, sortOrder) => ({ ...item, sort_order: sortOrder }))
      };
    });
    setImageDragIndex(null);
  }

  function updateDraaiboek(index: number, key: keyof DraaiboekRow, value: string) {
    setDraft((current) => ({
      ...current,
      draaiboek: {
        rows: current.draaiboek.rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row)
      }
    }));
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    const supabase = createBrowserSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    for (const file of Array.from(files)) {
      const path = `${draft.project.id}/${crypto.randomUUID()}-${file.name}`;
      const upload = await supabase.storage.from("project-images").upload(path, file);
      if (!upload.error) {
        const { data } = supabase.storage.from("project-images").getPublicUrl(path);
        const result = await supabase.from("images").insert({
          project_id: draft.project.id,
          uploader_id: user.id,
          storage_path: path,
          public_url: data.publicUrl,
          alt_text: file.name,
          sort_order: draft.images.length
        }).select("*").single();
        if (result.data) setDraft((current) => ({ ...current, images: [...current.images, result.data] }));
      }
    }
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/projects/${draft.project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    setSaving(false);
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-broadcast-gold">PROJECT EDITOR</p>
            <Input className="mt-4 h-auto border-0 bg-transparent px-0 text-5xl font-bold lg:text-6xl" value={draft.project.title} onChange={(event) => setProject("title", event.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={saving}><Save size={16} />{saving ? "Opslaan..." : "Opslaan"}</Button>
            <a href={`/api/projects/${draft.project.id}/export?type=pdf`}><Button variant="secondary"><Download size={16} />PDF</Button></a>
            <a href={`/api/projects/${draft.project.id}/export?type=docx`}><Button variant="secondary">Word</Button></a>
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card>
              <CardHeader><h2 className="text-xl font-bold">Projectinformatie</h2></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-broadcast-beige">Synopsis</span>
                  <Textarea value={draft.project.synopsis ?? ""} onChange={(event) => setProject("synopsis", event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-broadcast-beige">Status</span>
                  <Select value={draft.project.status} onChange={(event) => setProject("status", event.target.value as ProjectStatus)}>
                    {projectStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </Select>
                </label>
              </CardContent>
            </Card>
            {draft.project.document_type === "tv_format" && (
              <Card>
                <CardHeader><h2 className="text-xl font-bold">TV Format Template</h2></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {formatFields.map(([key, label]) => (
                    <label key={key} className={String(key).includes("description") || String(key).includes("dna") || String(key).includes("works") ? "space-y-2 md:col-span-2" : "space-y-2"}>
                      <span className="text-sm font-semibold text-broadcast-beige">{label}</span>
                      {key === "episode_count" ? (
                        <Input type="number" value={String(draft.format[key] ?? "")} onChange={(event) => setDraft((current) => ({ ...current, format: { ...current.format, [key]: Number(event.target.value) } }))} />
                      ) : (
                        <Textarea value={String(draft.format[key] ?? "")} onChange={(event) => setDraft((current) => ({ ...current, format: { ...current.format, [key]: event.target.value } }))} />
                      )}
                    </label>
                  ))}
                </CardContent>
              </Card>
            )}
            {draft.project.document_type === "pitchdeck" && (
              <Card>
                <CardHeader><h2 className="text-xl font-bold">Broadcaster Pitchdeck</h2></CardHeader>
                <CardContent className="grid gap-4">
                  {pitchdeckFields.map(([key, label]) => (
                    <label key={key} className="space-y-2">
                      <span className="text-sm font-semibold text-broadcast-beige">{label}</span>
                      <Textarea value={String(draft.pitchdeck[key] ?? "")} onChange={(event) => setDraft((current) => ({ ...current, pitchdeck: { ...current.pitchdeck, [key]: event.target.value } }))} />
                    </label>
                  ))}
                </CardContent>
              </Card>
            )}
            {draft.project.document_type === "script" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-bold">Script scènes</h2>
                  <Button onClick={addScene}><Plus size={16} />Scene toevoegen</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {draft.scenes.map((scene, index) => (
                    <div key={`${scene.id}-${index}`} draggable onDragStart={() => setDragIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropScene(index)} className="rounded-lg border border-broadcast-line bg-broadcast-ink p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <GripVertical className="text-broadcast-gold" size={18} />
                          <span className="font-bold">Scene {scene.scene_number}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="secondary" onClick={() => duplicateScene(index)}><Copy size={14} /></Button>
                          <Button variant="danger" onClick={() => removeScene(index)}><Trash2 size={14} /></Button>
                        </div>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {sceneFields.map(([key, label]) => (
                          <label key={key} className="space-y-2">
                            <span className="text-xs font-semibold text-broadcast-beige">{label}</span>
                            <Textarea value={String(scene[key as keyof Scene] ?? "")} onChange={(event) => updateScene(index, key, event.target.value)} />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {draft.project.document_type === "draaiboek" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-bold">Draaiboek</h2>
                  <Button onClick={() => setDraft((current) => ({ ...current, draaiboek: { rows: [...current.draaiboek.rows, Object.fromEntries(draaiboekColumns.map((column) => [column, ""])) as DraaiboekRow] } }))}>Regel toevoegen</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {draft.draaiboek.rows.map((row, index) => (
                    <div key={index} className="grid gap-3 rounded-lg border border-broadcast-line bg-broadcast-ink p-4 md:grid-cols-3">
                      {draaiboekColumns.map((column) => (
                        <label key={column} className="space-y-2">
                          <span className="text-xs font-semibold text-broadcast-beige">{column}</span>
                          <Input value={row[column]} onChange={(event) => updateDraaiboek(index, column, event.target.value)} />
                        </label>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          <aside className="space-y-6">
            <Card>
              <CardHeader><h2 className="text-xl font-bold">Beeldbank</h2></CardHeader>
              <CardContent className="space-y-4">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-broadcast-gold/60 p-6 text-sm font-semibold text-broadcast-beige">
                  <ImagePlus size={18} />
                  Foto's uploaden
                  <input className="hidden" type="file" multiple accept="image/*" onChange={(event) => uploadImages(event.target.files)} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {draft.images.map((image, index) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => setImageDragIndex(index)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => dropImage(index)}
                      className="overflow-hidden rounded-md border border-broadcast-line bg-broadcast-ink"
                    >
                      {image.public_url ? <img className="h-32 w-full object-cover" src={image.public_url} alt={image.alt_text ?? ""} /> : null}
                      <p className="truncate px-3 py-2 text-xs text-slate-400">{image.alt_text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
