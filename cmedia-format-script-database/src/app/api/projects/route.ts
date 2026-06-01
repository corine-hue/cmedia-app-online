import { NextRequest, NextResponse } from "next/server";
import { defaultsForType, tableForType } from "@/lib/projects";
import { createRouteSupabase } from "@/lib/supabase/server";
import type { ProjectType } from "@/lib/types";

export async function POST(request: NextRequest) {
  const supabase = await createRouteSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as { title: string; synopsis?: string; document_type: ProjectType };
  const { data: project, error } = await supabase.from("projects").insert({
    owner_id: user.id,
    title: body.title,
    synopsis: body.synopsis,
    document_type: body.document_type
  }).select("*").single();

  if (error || !project) return NextResponse.json({ error: error?.message ?? "Project creation failed" }, { status: 400 });

  const table = tableForType(body.document_type);
  const content = defaultsForType(body.document_type);
  const { data: typed } = await supabase.from(table).insert({ project_id: project.id, ...content }).select("*").single();

  if (body.document_type === "script" && typed?.id) {
    await supabase.from("scenes").insert({
      script_id: typed.id,
      scene_number: 1,
      title: "Opening",
      sort_order: 0
    });
  }

  return NextResponse.json(project);
}
