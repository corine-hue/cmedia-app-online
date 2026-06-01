import { notFound, redirect } from "next/navigation";
import { ProjectEditor } from "@/components/project-editor";
import { getProjectBundle } from "@/lib/projects";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const bundle = await getProjectBundle(id);
  if (!bundle) notFound();

  return <ProjectEditor bundle={bundle} />;
}
