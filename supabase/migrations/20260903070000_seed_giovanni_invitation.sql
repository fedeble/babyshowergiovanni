begin;

alter table public.events
  add column if not exists google_maps_url text,
  add column if not exists father_name text,
  add column if not exists mother_name text;

alter table public.gifts
  add column if not exists is_available boolean not null default true;

grant select (is_available) on table public.gifts to anon, authenticated;

do $$
declare
  current_event_id uuid;
begin
  select id
  into current_event_id
  from public.events
  where baby_name = 'Giovanni'
  order by created_at
  limit 1;

  update public.events
  set name = 'Baby Shower',
      baby_name = 'Giovanni',
      event_date = date '2026-09-19',
      event_time = time '15:00',
      address = 'Albert Einstein 7780',
      latitude = -34.44681074662121,
      longitude = -58.802460437204395,
      google_maps_url = 'https://maps.app.goo.gl/RrcTa6ANHCEikXt49',
      father_name = 'Jesús',
      mother_name = 'Celeste',
      welcome_message = '¡Estamos felices de compartir este momento tan especial!',
      is_public = true
  where id = current_event_id;

  if current_event_id is null then
    insert into public.events (
      name,
      baby_name,
      event_date,
      event_time,
      address,
      latitude,
      longitude,
      google_maps_url,
      father_name,
      mother_name,
      welcome_message,
      is_public
    )
    values (
      'Baby Shower',
      'Giovanni',
      date '2026-09-19',
      time '15:00',
      'Albert Einstein 7780',
      -34.44681074662121,
      -58.802460437204395,
      'https://maps.app.goo.gl/RrcTa6ANHCEikXt49',
      'Jesús',
      'Celeste',
      '¡Estamos felices de compartir este momento tan especial!',
      true
    )
    returning id into current_event_id;
  end if;

  create temporary table invitation_gift_seed (
    gift_name text,
    gift_description text,
    gift_quantity integer,
    is_available boolean
  ) on commit drop;

  insert into invitation_gift_seed (gift_name, gift_description, gift_quantity, is_available)
  values
    ('Pañales P, M en adelante', 'Paquetes para acompañar el crecimiento de Giovanni.', 20, true),
    ('Óleo calcario', 'Unidades para el cuidado diario del bebé.', 7, true),
    ('Algodón', 'Paquetes para el cuidado diario del bebé.', 10, true),
    ('Toallitas húmedas', 'Paquetes para la higiene diaria del bebé.', 6, true),
    ('Ropa recién nacido', 'Prendas para acompañar los primeros días de Giovanni.', 6, true),
    ('Mantitas de muselina o algodón', 'Mantitas suaves para Giovanni.', 4, true),
    ('Toallas', 'Toallas para el cuidado del bebé.', 4, true),
    ('Baberos', 'Baberos para las comidas de Giovanni.', 5, true),
    ('Almohadón de lactancia', 'Un almohadón para acompañar la lactancia.', 1, true),
    ('Baby call - monitor', 'Un monitor para acompañar el descanso del bebé.', 1, true),
    ('Calienta mamadera', 'Un equipo para templar la mamadera.', 1, true),
    ('Sábanas', 'Sábanas para la cuna de Giovanni.', 4, true),
    ('Frazadas', 'Frazadas para mantener abrigado al bebé.', 3, true),
    ('Chupetes', 'Chupetes para Giovanni.', 4, true),
    ('Mamaderas', 'Mamaderas para la alimentación del bebé.', 2, true),
    ('Medias', 'Medias suaves para Giovanni.', 3, true),
    ('Shampoo', 'Unidades para el baño del bebé.', 3, true),
    ('Acondicionador', 'Unidades para el cuidado del bebé.', 3, true),
    ('Jabón líquido', 'Unidades para la higiene de Giovanni.', 3, true),
    ('Manoplas', 'Manoplas suaves para el bebé.', 3, true),
    ('Aceite para bebé', 'Una unidad para el cuidado de la piel.', 1, true),
    ('Perfume de bebé', 'Perfumes suaves para Giovanni.', 2, true),
    ('Talco', 'Talco para el cuidado del bebé.', 2, true),
    ('Mecedor eléctrico', 'Un espacio de descanso para Giovanni.', 1, true),
    ('Mordedores', 'Mordedores para acompañar su crecimiento.', 3, true),
    ('Gimnasio', 'Un gimnasio de juegos para el bebé.', 1, true),
    ('Juguetes', 'Juguetes para acompañar sus primeros juegos.', 5, true),
    ('Bolso maternal', 'Este regalo ya está cubierto.', 1, false),
    ('Bañera', 'Este regalo ya está cubierto.', 1, false),
    ('Coche', 'Este regalo ya está cubierto.', 1, false),
    ('Butaca', 'Este regalo ya está cubierto.', 1, false),
    ('Extractor de leche', 'Este regalo ya está cubierto.', 1, false);

  update public.gifts as existing
  set description = seed.gift_description,
      image = null,
      quantity = case
        when existing.reserved_quantity = 0 then seed.gift_quantity
        else existing.quantity
      end,
      is_available = seed.is_available
  from invitation_gift_seed as seed
  where existing.event_id = current_event_id
    and existing.name = seed.gift_name;

  insert into public.gifts (
    event_id,
    name,
    description,
    image,
    quantity,
    reserved_quantity,
    is_available
  )
  select
    current_event_id,
    seed.gift_name,
    seed.gift_description,
    null,
    seed.gift_quantity,
    0,
    seed.is_available
  from invitation_gift_seed as seed
  where not exists (
    select 1
    from public.gifts as existing
    where existing.event_id = current_event_id
      and existing.name = seed.gift_name
  );
end;
$$;

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
    and gifts.is_available
  for update of gifts;

  if not found then
    raise exception 'El regalo no existe o no está disponible'
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