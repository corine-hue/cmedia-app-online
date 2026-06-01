import { NextRequest, NextResponse } from "next/server";
import { renderProjectDocx } from "@/lib/export/docx";
import { renderProjectPdf } from "@/lib/export/pdf";
import { getProjectBundle } from "@/lib/projects";
import { createRouteSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createRouteSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type") === "docx" ? "docx" : "pdf";
  const bundle = await getProjectBundle(id);
  if (!bundle) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = type === "docx" ? await renderProjectDocx(bundle) : await renderProjectPdf(bundle);
  await supabase.from("exports").insert({
    project_id: id,
    requested_by: user.id,
    export_type: type
  });

  const extension = type === "docx" ? "docx" : "pdf";
  const contentType = type === "docx"
    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "application/pdf";

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${slugify(bundle.project.title)}.${extension}"`
    }
  });
}
