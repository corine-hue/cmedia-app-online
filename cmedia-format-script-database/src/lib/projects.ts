import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import type { ProjectBundle, ProjectType } from "@/lib/types";

export async function getProjectBundle(id: string, admin = false): Promise<ProjectBundle | null> {
  const supabase = admin ? createAdminSupabase() : await createServerSupabase();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) return null;

  const [format, script, draaiboek, pitchdeck, images] = await Promise.all([
    supabase.from("formats").select("*").eq("project_id", id).maybeSingle(),
    supabase.from("scripts").select("*").eq("project_id", id).maybeSingle(),
    supabase.from("draaiboeken").select("*").eq("project_id", id).maybeSingle(),
    supabase.from("pitchdecks").select("*").eq("project_id", id).maybeSingle(),
    supabase.from("images").select("*").eq("project_id", id).order("sort_order")
  ]);

  let scenes = [];
  if (script.data?.id) {
    const result = await supabase
      .from("scenes")
      .select("*")
      .eq("script_id", script.data.id)
      .order("sort_order");
    scenes = result.data ?? [];
  }

  return {
    project,
    format: format.data,
    script: script.data,
    scenes,
    draaiboek: draaiboek.data,
    pitchdeck: pitchdeck.data,
    images: images.data ?? []
  };
}

export function tableForType(type: ProjectType) {
  return {
    tv_format: "formats",
    script: "scripts",
    draaiboek: "draaiboeken",
    pitchdeck: "pitchdecks"
  }[type];
}

export function defaultsForType(type: ProjectType) {
  if (type === "tv_format") return { logline: "", short_description: "" };
  if (type === "script") return { working_title: "", logline: "", notes: "" };
  if (type === "draaiboek") {
    return {
      rows: [
        { Tijd: "09:00", Onderdeel: "Calltime crew", Locatie: "", Verantwoordelijke: "", Techniek: "", Opmerkingen: "" }
      ]
    };
  }
  return {
    cover: "",
    logline: "",
    program_description: "",
    cast_description: "",
    episode_build: "",
    visual_style: "",
    why_now: "",
    commercial_opportunities: "",
    production: "",
    contact: "CMedia Productions"
  };
}
