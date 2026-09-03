import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

export default async function AdminLoginPage() {
  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="admin-page">
      <section className="admin-login-panel" aria-labelledby="admin-login-title">
        <p className="eyebrow">Baby Shower Giovanni</p>
        <h1 id="admin-login-title" className="admin-title">Administración</h1>
        <p className="admin-copy">Ingresá con tu cuenta para acceder al panel.</p>
        <LoginForm />
      </section>
    </main>
  );
}