"use client";

import { useActionState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import type { Database } from "@/lib/supabase/database.types";
import {
  createGift,
  deleteGift,
  updateGift,
  type GiftActionState,
} from "@/app/admin/gifts/actions";

type AdminGift = Pick<
  Database["public"]["Tables"]["gifts"]["Row"],
  "id" | "name" | "description" | "image" | "quantity" | "reserved_quantity"
>;

type AdminGiftManagerProps = {
  gifts: AdminGift[];
};

const initialState: GiftActionState = { status: "idle", message: "" };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="admin-primary-button" type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

function GiftFields({ gift }: { gift?: AdminGift }) {
  return (
    <div className="admin-gift-fields">
      <label className="admin-field">
        <span>Nombre</span>
        <input name="name" defaultValue={gift?.name} maxLength={160} required />
      </label>
      <label className="admin-field admin-field-wide">
        <span>Descripción</span>
        <textarea name="description" defaultValue={gift?.description ?? ""} maxLength={1000} rows={3} />
      </label>
      <label className="admin-field admin-field-wide">
        <span>URL HTTPS de imagen</span>
        <input
          name="image"
          type="url"
          defaultValue={gift?.image ?? ""}
          maxLength={2048}
          pattern="https://.*"
        />
      </label>
      <label className="admin-field">
        <span>Cantidad total</span>
        <input name="quantity" type="number" defaultValue={gift?.quantity ?? 1} min={1} step={1} required />
      </label>
    </div>
  );
}

function ActionMessage({ state }: { state: GiftActionState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <p
      className={`admin-action-message admin-action-message-${state.status}`}
      role={state.status === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}

function CreateGiftForm() {
  const [state, formAction] = useActionState(createGift, initialState);

  return (
    <section className="admin-create-gift" aria-labelledby="create-gift-title">
      <div>
        <p className="admin-section-label">Nuevo</p>
        <h2 id="create-gift-title">Crear regalo</h2>
      </div>
      <form action={formAction}>
        <GiftFields />
        <div className="admin-form-actions">
          <ActionMessage state={state} />
          <SubmitButton label="Crear regalo" pendingLabel="Creando..." />
        </div>
      </form>
    </section>
  );
}

function AdminGiftItem({ gift }: { gift: AdminGift }) {
  const [updateState, updateAction] = useActionState(updateGift, initialState);
  const [deleteState, deleteAction] = useActionState(deleteGift, initialState);
  const availableQuantity = Math.max(0, gift.quantity - gift.reserved_quantity);

  function confirmDeletion(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`¿Eliminar “${gift.name}”? Esta acción no se puede deshacer.`)) {
      event.preventDefault();
    }
  }

  return (
    <article className="admin-gift-item">
      <div
        className="admin-gift-image"
        style={gift.image ? { backgroundImage: `url(${gift.image})` } : undefined}
        role={gift.image ? "img" : undefined}
        aria-label={gift.image ? `Imagen de ${gift.name}` : undefined}
      />
      <div className="admin-gift-main">
        <div className="admin-gift-summary">
          <div>
            <h2>{gift.name}</h2>
            <p>{gift.description || "Sin descripción"}</p>
          </div>
          <dl className="admin-gift-quantities">
            <div><dt>Total</dt><dd>{gift.quantity}</dd></div>
            <div><dt>Reservadas</dt><dd>{gift.reserved_quantity}</dd></div>
            <div><dt>Disponibles</dt><dd>{availableQuantity}</dd></div>
          </dl>
        </div>

        <details className="admin-gift-editor">
          <summary>Editar regalo</summary>
          <form action={updateAction}>
            <input name="giftId" type="hidden" value={gift.id} />
            <GiftFields gift={gift} />
            <div className="admin-form-actions">
              <ActionMessage state={updateState} />
              <SubmitButton label="Guardar cambios" pendingLabel="Guardando..." />
            </div>
          </form>
        </details>

        <div className="admin-gift-delete">
          <ActionMessage state={deleteState} />
          <form action={deleteAction} onSubmit={confirmDeletion}>
            <input name="giftId" type="hidden" value={gift.id} />
            <SubmitButton label="Eliminar" pendingLabel="Eliminando..." />
          </form>
        </div>
      </div>
    </article>
  );
}

export default function AdminGiftManager({ gifts }: AdminGiftManagerProps) {
  return (
    <>
      <CreateGiftForm />
      {gifts.length ? (
        <section className="admin-gifts-list" aria-label="Regalos del evento">
          {gifts.map((gift) => <AdminGiftItem gift={gift} key={gift.id} />)}
        </section>
      ) : (
        <section className="admin-state">
          <h2>Todavía no hay regalos</h2>
          <p>Creá el primero usando el formulario superior.</p>
        </section>
      )}
    </>
  );
}