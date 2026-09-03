import AdminHeader from "@/components/admin/AdminHeader";
import AdminGiftManager from "@/components/admin/AdminGiftManager";
import AdminRealtimeRefresh from "@/components/admin/AdminRealtimeRefresh";
import { requireAdminContext } from "@/lib/supabase/admin-auth";

export default async function AdminGiftsPage() {
  const { supabase, eventId } = await requireAdminContext();
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  const giftsResult = event
    ? await supabase
        .from("gifts")
        .select("id,name,description,image,quantity,reserved_quantity")
        .eq("event_id", event.id)
        .order("name")
    : { data: null, error: null };

  const hasError = Boolean(eventError || giftsResult.error);

  return (
    <main className="admin-dashboard-page">
      <AdminHeader active="gifts" />
      <section className="admin-dashboard-content">
        <p className="eyebrow">Administración</p>
        <h1 className="admin-title">Regalos</h1>
        <p className="admin-copy">Creá y actualizá los regalos disponibles para la invitación.</p>

        {hasError && (
          <div className="admin-state admin-state-spaced" role="alert">
            <h2>No pudimos cargar los regalos</h2>
            <p>Intentá actualizar la página en unos minutos.</p>
          </div>
        )}

        {!hasError && !event && (
          <div className="admin-state admin-state-spaced">
            <h2>Todavía no hay un evento</h2>
            <p>Los regalos podrán administrarse cuando exista un evento.</p>
          </div>
        )}

        {!hasError && event && (
          <>
            <AdminRealtimeRefresh
              eventId={event.id}
              giftIds={(giftsResult.data ?? []).map((gift) => gift.id)}
              scope="gifts"
            />
            <AdminGiftManager gifts={giftsResult.data ?? []} />
          </>
        )}
      </section>
    </main>
  );
}