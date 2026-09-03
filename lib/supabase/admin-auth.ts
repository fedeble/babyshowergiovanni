import "server-only";

import { redirect } from "next/navigation";
import { createAuthServerClient } from "./auth-server";

export async function requireAdminContext() {
  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: assignment, error } = await supabase
    .from("event_admins")
    .select("event_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error || !assignment) {
    redirect("/admin/unauthorized");
  }

  return { supabase, user, eventId: assignment.event_id };
}