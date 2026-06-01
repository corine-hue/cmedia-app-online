import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  return <DashboardClient initialProjects={data ?? []} />;
}
