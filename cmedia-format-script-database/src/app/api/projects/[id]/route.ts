import { NextRequest, NextResponse } from "next/server";
import { tableForType } from "@/lib/projects";
import { createRouteSupabase } from "@/lib/supabase/server";
import type { ProjectBundle } from "@/lib/types";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createRouteSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as ProjectBundle;
  const project = body.project;
  const { error } = await supabase
    .from("projects")
    .update({
      title: project.title,
      synopsis: project.synopsis,
      status: project.status,
      cover_image_id: project.cover_image_id,
      metadata: project.metadata
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (project.document_type === "tv_format") {
    await supabase.from("formats").upsert({ project_id: id, ...body.format }, { onConflict: "project_id" });
  }

  if (project.document_type === "pitchdeck") {
    await supabase.from("pitchdecks").upsert({ project_id: id, ...body.pitchdeck }, { onConflict: "project_id" });
  }

  if (project.document_type === "draaiboek") {
    await supabase.from("draaiboeken").upsert({ project_id: id, rows: body.draaiboek?.rows ?? [] }, { onConflict: "project_id" });
  }

  if (project.document_type === "script") {
    const { data: script } = await supabase.from("scripts").select("*").eq("project_id", id).single();
    if (script) {
      await supabase.from("scenes").delete().eq("script_id", script.id);
      const scenes = (body.scenes ?? []).map((scene, index) => ({
        script_id: script.id,
        scene_number: index + 1,
        title: scene.title,
        location: scene.location,
        day_night: scene.day_night,
        interior_exterior: scene.interior_exterior,
        cast: scene.cast,
        voice_over: scene.voice_over,
        interview_questions: scene.interview_questions,
        direction_notes: scene.direction_notes,
        camera_angles: scene.camera_angles,
        audio: scene.audio,
        music: scene.music,
        notes: scene.notes,
        sort_order: index
      }));
      if (scenes.length) await supabase.from("scenes").insert(scenes);
    }
  }

  if (body.images?.length) {
    await Promise.all(body.images.map((image, index) => (
      supabase.from("images").update({ sort_order: index }).eq("id", image.id)
    )));
  }

  return NextResponse.json({ ok: true, table: tableForType(project.document_type) });
}
