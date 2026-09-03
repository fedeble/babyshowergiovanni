import { logout } from "../login/actions";

export default function AdminUnauthorizedPage() {
  return (
    <main className="admin-page">
      <section className="admin-login-panel">
        <p className="eyebrow">Acceso restringido</p>
        <h1 className="admin-title">Sin permisos</h1>
        <p className="admin-copy">Tu cuenta no está asignada a este evento.</p>
        <form action={logout} className="admin-login-form">
          <button className="admin-primary-button" type="submit">Cerrar sesión</button>
        </form>
      </section>
    </main>
  );
}