import AdminHeader from "@/components/admin/AdminHeader";
import AdminReservationList, {
  type AdminReservation,
} from "@/components/admin/AdminReservationList";
import AdminRealtimeRefresh from "@/components/admin/AdminRealtimeRefresh";
import { requireAdminContext } from "@/lib/supabase/admin-auth";

export default async function AdminReservationsPage() {
  const { supabase, eventId } = await requireAdminContext();
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  let reservations: AdminReservation[] = [];
  let giftIds: string[] = [];
  let hasError = Boolean(eventError);

  if (event && !hasError) {
    const { data: gifts, error: giftsError } = await supabase
      .from("gifts")
      .select("id,name")
      .eq("event_id", event.id);

    if (giftsError) {
      hasError = true;
    } else if (gifts.length) {
      giftIds = gifts.map((gift) => gift.id);
      const giftNames = new Map(gifts.map((gift) => [gift.id, gift.name]));
      const { data, error } = await supabase
        .from("gift_reservations")
        .select("id,gift_id,guest_name,quantity,created_at")
        .in("gift_id", gifts.map((gift) => gift.id))
        .order("created_at", { ascending: false });

      if (error) {
        hasError = true;
      } else {
        const formatter = new Intl.DateTimeFormat("es", {
          dateStyle: "medium",
          timeStyle: "short",
        });
        reservations = data.map((reservation) => ({
          id: reservation.id,
          guestName: reservation.guest_name,
          giftName: giftNames.get(reservation.gift_id) ?? "Regalo",
          quantity: reservation.quantity,
          reservedAt: formatter.format(new Date(reservation.created_at)),
        }));
      }
    }
  }

  return (
    <main className="admin-dashboard-page">
      <AdminHeader active="reservations" />
      <section className="admin-dashboard-content">
        <p className="eyebrow">Administración</p>
        <h1 className="admin-title">Reservas</h1>
        <p className="admin-copy">Consultá y administrá las reservas del evento.</p>

        {hasError && (
          <div className="admin-state admin-state-spaced" role="alert">
            <h2>No pudimos cargar las reservas</h2>
            <p>Intentá actualizar la página en unos minutos.</p>
          </div>
        )}

        {!hasError && !event && (
          <div className="admin-state admin-state-spaced">
            <h2>Todavía no hay un evento</h2>
            <p>Las reservas aparecerán cuando exista un evento.</p>
          </div>
        )}

        {!hasError && event && (
          <>
            <AdminRealtimeRefresh
              eventId={event.id}
              giftIds={giftIds}
              scope="reservations"
            />
            <AdminReservationList reservations={reservations} />
          </>
        )}
      </section>
    </main>
  );
}