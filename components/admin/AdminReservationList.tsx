"use client";

import { useActionState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import {
  cancelReservation,
  type ReservationActionState,
} from "@/app/admin/reservations/actions";

export type AdminReservation = {
  id: string;
  guestName: string;
  giftName: string;
  quantity: number;
  reservedAt: string;
};

const initialState: ReservationActionState = { status: "idle", message: "" };

function CancelButton() {
  const { pending } = useFormStatus();

  return (
    <button className="admin-danger-button" type="submit" disabled={pending}>
      {pending ? "Anulando..." : "Anular reserva"}
    </button>
  );
}

function ReservationItem({ reservation }: { reservation: AdminReservation }) {
  const [state, formAction] = useActionState(cancelReservation, initialState);

  function confirmCancellation(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`¿Anular la reserva de ${reservation.guestName}?`)) {
      event.preventDefault();
    }
  }

  return (
    <article className="admin-reservation-item">
      <div className="admin-reservation-main">
        <div>
          <p className="admin-section-label">Invitado</p>
          <h2>{reservation.guestName}</h2>
        </div>
        <dl className="admin-reservation-details">
          <div><dt>Regalo</dt><dd>{reservation.giftName}</dd></div>
          <div><dt>Cantidad</dt><dd>{reservation.quantity}</dd></div>
          <div><dt>Fecha</dt><dd>{reservation.reservedAt}</dd></div>
        </dl>
      </div>
      <div className="admin-reservation-actions">
        {state.status !== "idle" && (
          <p
            className={`admin-action-message admin-action-message-${state.status}`}
            role={state.status === "error" ? "alert" : "status"}
          >
            {state.message}
          </p>
        )}
        <form action={formAction} onSubmit={confirmCancellation}>
          <input name="reservationId" type="hidden" value={reservation.id} />
          <CancelButton />
        </form>
      </div>
    </article>
  );
}

export default function AdminReservationList({
  reservations,
}: {
  reservations: AdminReservation[];
}) {
  if (!reservations.length) {
    return (
      <section className="admin-state admin-state-spaced">
        <h2>Todavía no hay reservas</h2>
        <p>Las nuevas reservas aparecerán en esta sección.</p>
      </section>
    );
  }

  return (
    <section className="admin-reservations-list" aria-label="Reservas del evento">
      {reservations.map((reservation) => (
        <ReservationItem reservation={reservation} key={reservation.id} />
      ))}
    </section>
  );
}