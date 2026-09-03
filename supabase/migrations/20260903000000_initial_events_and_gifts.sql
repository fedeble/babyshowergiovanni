begin;

create extension if not exists pgcrypto;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  baby_name text not null check (char_length(trim(baby_name)) between 1 and 120),
  event_date date,
  event_time time,
  venue text,
  address text,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  welcome_message text,
  cover_image text,
  created_at timestamptz not null default now()
);

create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 160),
  description text,
  image text,
  quantity integer not null check (quantity > 0),
  reserved_quantity integer not null default 0,
  created_at timestamptz not null default now(),
  constraint gifts_reserved_quantity_valid check (
    reserved_quantity >= 0 and reserved_quantity <= quantity
  )
);

create table public.gift_reservations (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts(id) on delete restrict,
  guest_name text not null check (char_length(trim(guest_name)) between 2 and 120),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index gifts_event_id_idx on public.gifts(event_id);
create index gift_reservations_gift_id_idx on public.gift_reservations(gift_id);

alter table public.events enable row level security;
alter table public.gifts enable row level security;
alter table public.gift_reservations enable row level security;

create policy "Public events are readable"
on public.events
for select
to anon, authenticated
using (true);

create policy "Public gifts are readable"
on public.gifts
for select
to anon, authenticated
using (true);

revoke all on table public.events from anon, authenticated;
revoke all on table public.gifts from anon, authenticated;
revoke all on table public.gift_reservations from anon, authenticated;

grant select (
  id,
  name,
  baby_name,
  event_date,
  event_time,
  venue,
  address,
  latitude,
  longitude,
  welcome_message,
  cover_image
) on table public.events to anon, authenticated;

grant select (
  id,
  event_id,
  name,
  description,
  image,
  quantity,
  reserved_quantity
) on table public.gifts to anon, authenticated;

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

  select *
  into selected_gift
  from public.gifts
  where id = p_gift_id
  for update;

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

revoke all on function public.reserve_gift(uuid, text, integer) from public;
grant execute on function public.reserve_gift(uuid, text, integer) to anon, authenticated;

commit;
