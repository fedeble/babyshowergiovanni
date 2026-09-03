begin;

grant select (id, gift_id, guest_name, quantity, created_at)
on table public.gift_reservations to authenticated;

create or replace function public.cancel_gift_reservation(
  p_reservation_id uuid,
  p_event_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_reservation public.gift_reservations%rowtype;
  selected_gift public.gifts%rowtype;
begin
  if auth.uid() is null then
    raise exception 'No autorizado'
      using errcode = '42501';
  end if;

  select *
  into selected_reservation
  from public.gift_reservations
  where id = p_reservation_id
  for update;

  if not found then
    raise exception 'La reserva no existe'
      using errcode = 'P0002';
  end if;

  select *
  into selected_gift
  from public.gifts
  where id = selected_reservation.gift_id
    and event_id = p_event_id
  for update;

  if not found then
    raise exception 'La reserva no pertenece al evento'
      using errcode = '42501';
  end if;

  update public.gifts
  set reserved_quantity = reserved_quantity - selected_reservation.quantity
  where id = selected_gift.id;

  delete from public.gift_reservations
  where id = selected_reservation.id;

  return selected_gift.id;
end;
$$;

revoke all on function public.cancel_gift_reservation(uuid, uuid) from public;
grant execute on function public.cancel_gift_reservation(uuid, uuid) to authenticated;

commit;