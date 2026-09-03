import AdminHeader from "@/components/admin/AdminHeader";
import AdminRealtimeRefresh from "@/components/admin/AdminRealtimeRefresh";
import { requireAdminContext } from "@/lib/supabase/admin-auth";
import { getAdminDashboardData } from "@/lib/supabase/admin-dashboard";

export default async function AdminPage() {
  const { supabase, eventId } = await requireAdminContext();
  const result = await getAdminDashboardData(supabase, eventId);

  return (
    <main className="admin-dashboard-page">
      <AdminHeader active="dashboard" />
      <div className="admin-dashboard-content">
        <section className="admin-dashboard-heading" aria-labelledby="admin-title">
          <p className="eyebrow">Baby Shower Giovanni</p>
          <h1 id="admin-title" className="admin-title">Panel administrativo</h1>
          <p className="admin-copy">Resumen general de la invitación y sus regalos.</p>
        </section>

        {result.status === "error" && (
          <section className="admin-state" role="alert">
            <h2>No pudimos cargar el resumen</h2>
            <p>Intentá actualizar la página en unos minutos.</p>
          </section>
        )}

        {result.status === "empty" && (
          <section className="admin-state">
            <h2>Todavía no hay un evento</h2>
            <p>El resumen aparecerá cuando exista información del evento.</p>
          </section>
        )}

        {result.status === "ready" && (
          <>
            <AdminRealtimeRefresh
              eventId={result.data.event.id}
              giftIds={result.data.giftIds}
              scope="dashboard"
            />
            <section className="admin-event-summary" aria-labelledby="event-summary-title">
              <div>
                <p className="admin-section-label">Evento</p>
                <h2 id="event-summary-title">{result.data.event.name}</h2>
                <p>Baby Shower de {result.data.event.baby_name}</p>
              </div>
              <span className={result.data.isEventComplete ? "admin-status admin-status-ready" : "admin-status"}>
                {result.data.isEventComplete ? "Información completa" : "Configuración pendiente"}
              </span>
            </section>

            <section className="admin-stats" aria-label="Estadísticas generales">
              {[
                ["Regalos", result.data.gifts],
                ["Unidades totales", result.data.totalUnits],
                ["Reservadas", result.data.reservedUnits],
                ["Disponibles", result.data.availableUnits],
                ["Reservas", result.data.reservations],
              ].map(([label, value]) => (
                <article className="admin-stat" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}