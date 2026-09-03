begin;

alter table public.events
add column is_public boolean not null default false;

update public.events
set is_public = true
where id = (
  select id
  from public.events
  order by created_at
  limit 1
);

create unique index events_single_public_idx
on public.events (is_public)
where is_public;

create table public.event_admins (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

alter table public.event_admins enable row level security;
revoke all on table public.event_admins from anon, authenticated;
grant select (user_id, event_id) on table public.event_admins to authenticated;

create policy "Users can read their own admin assignments"
on public.event_admins
for select
to authenticated
using (user_id = (select auth.uid()));

create or replace function public.is_event_admin(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.event_admins
    where user_id = (select auth.uid())
      and event_id = p_event_id
  );
$$;

create or replace function public.is_gift_admin(p_gift_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.gifts
    where id = p_gift_id
      and public.is_event_admin(event_id)
  );
$$;

revoke all on function public.is_event_admin(uuid) from public;
revoke all on function public.is_gift_admin(uuid) from public;
grant execute on function public.is_event_admin(uuid) to authenticated;
grant execute on function public.is_gift_admin(uuid) to authenticated;

drop policy if exists "Public events are readable" on public.events;
create policy "Public event is readable"
on public.events
for select
to anon
using (is_public);

create policy "Admins can read their event"
on public.events
for select
to authenticated
using (is_public or public.is_event_admin(id));

drop policy if exists "Public gifts are readable" on public.gifts;
create policy "Public event gifts are readable"
on public.gifts
for select
to anon
using (
  exists (
    select 1 from public.events
    where id = gifts.event_id and is_public
  )
);

create policy "Admins can read their event gifts"
on public.gifts
for select
to authenticated
using (
  exists (
    select 1 from public.events
    where id = gifts.event_id and is_public
  )
  or public.is_event_admin(event_id)
);

drop policy if exists "Authenticated users can create gifts" on public.gifts;
drop policy if exists "Authenticated users can update gifts" on public.gifts;
drop policy if exists "Authenticated users can delete gifts" on public.gifts;

create policy "Admins can create gifts for their event"
on public.gifts
for insert
to authenticated
with check (public.is_event_admin(event_id));

create policy "Admins can update their event gifts"
on public.gifts
for update
to authenticated
using (public.is_event_admin(event_id))
with check (public.is_event_admin(event_id));

create policy "Admins can delete their event gifts"
on public.gifts
for delete
to authenticated
using (public.is_event_admin(event_id));

drop policy if exists "Authenticated users can count reservations" on public.gift_reservations;
create policy "Admins can read their event reservations"
on public.gift_reservations
for select
to authenticated
using (public.is_gift_admin(gift_id));

alter table public.gifts
add constraint gifts_description_length check (
  description is null or char_length(description) <= 1000
) not valid;

alter table public.gifts
add constraint gifts_image_https check (
  image is null or (
    char_length(image) <= 2048
    and image ~* '^https://'
  )
) not valid;

alter table public.gifts validate constraint gifts_description_length;
alter table public.gifts validate constraint gifts_image_https;

create or replace function public.reserve_gift(
  p_gift_id uuid,
  p_guest_name text,
  p_requested_quantity integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_gift public.gifts%rowtype;
  reservation_id uuid;
begin
  if p_guest_name is null or char_length(trim(p_guest_name)) not between 2 and 120 then
    raise exception 'El nombre del invitado no es válido'
      using errcode = '22023';
  end if;

  if p_requested_quantity is null or p_requested_quantity <= 0 then
    raise exception 'La cantidad solicitada debe ser mayor que cero'
      using errcode = '22023';
  end if;

  select gifts.*
  into selected_gift
  from public.gifts
  join public.events on events.id = gifts.event_id
  where gifts.id = p_gift_id
    and events.is_public
  for update of gifts;

  if not found then
    raise exception 'El regalo no existe'
      using errcode = 'P0002';
  end if;

  if selected_gift.reserved_quantity + p_requested_quantity > selected_gift.quantity then
    raise exception 'La cantidad solicitada ya no está disponible'
      using errcode = 'P0001';
  end if;

  insert into public.gift_reservations (gift_id, guest_name, quantity)
  values (p_gift_id, trim(p_guest_name), p_requested_quantity)
  returning id into reservation_id;

  update public.gifts
  set reserved_quantity = reserved_quantity + p_requested_quantity
  where id = p_gift_id;

  return reservation_id;
end;
$$;

drop function if exists public.cancel_gift_reservation(uuid, uuid);

create function public.cancel_gift_reservation(p_reservation_id uuid)
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
  for update;

  if not found or not public.is_event_admin(selected_gift.event_id) then
    raise exception 'No autorizado'
      using errcode = '42501';
  end if;

  if selected_gift.reserved_quantity < selected_reservation.quantity then
    raise exception 'Las cantidades de la reserva son inconsistentes'
      using errcode = '23514';
  end if;

  update public.gifts
  set reserved_quantity = reserved_quantity - selected_reservation.quantity
  where id = selected_gift.id;

  delete from public.gift_reservations
  where id = selected_reservation.id;

  return selected_gift.id;
end;
$$;

revoke all on function public.cancel_gift_reservation(uuid) from public;
grant execute on function public.cancel_gift_reservation(uuid) to authenticated;

commit;