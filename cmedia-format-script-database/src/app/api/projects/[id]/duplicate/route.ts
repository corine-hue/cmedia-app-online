import { NextResponse } from "next/server";
import { getProjectBundle, tableForType } from "@/lib/projects";
import { createRouteSupabase } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createRouteSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bundle = await getProjectBundle(id);
  if (!bundle) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: project, error } = await supabase.from("projects").insert({
    owner_id: user.id,
    title: `${bundle.project.title} kopie`,
    document_type: bundle.project.document_type,
    status: "concept",
    synopsis: bundle.project.synopsis,
    metadata: bundle.project.metadata
  }).select("*").single();

  if (error || !project) return NextResponse.json({ error: error?.message ?? "Duplicate failed" }, { status: 400 });

  if (bundle.project.document_type === "tv_format") {
    const { id: _old, project_id: _project, ...content } = (bundle.format ?? {}) as Record<string, unknown>;
    await supabase.from("formats").insert({ project_id: project.id, ...content });
  }

  if (bundle.project.document_type === "pitchdeck") {
    const { id: _old, project_id: _project, ...content } = (bundle.pitchdeck ?? {}) as Record<string, unknown>;
    await supabase.from("pitchdecks").insert({ project_id: project.id, ...content });
  }

  if (bundle.project.document_type === "draaiboek") {
    await supabase.from("draaiboeken").insert({ project_id: project.id, rows: bundle.draaiboek?.rows ?? [] });
  }

  if (bundle.project.document_type === "script") {
    const { data: script } = await supabase.from("scripts").insert({
      project_id: project.id,
      working_title: bundle.script?.working_title,
      logline: bundle.script?.logline,
      notes: bundle.script?.notes
    }).select("*").single();
    if (script && bundle.scenes?.length) {
      await supabase.from("scenes").insert(bundle.scenes.map((scene, index) => ({
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
      })));
    }
  }

  if (bundle.images.length) {
    await supabase.from("images").insert(bundle.images.map((image, index) => ({
      project_id: project.id,
      uploader_id: user.id,
      storage_path: image.storage_path,
      public_url: image.public_url,
      alt_text: image.alt_text,
      sort_order: index
    })));
  }

  return NextResponse.json({ id: project.id, table: tableForType(bundle.project.document_type) });
}
