begin;

create or replace function public.gift_reservation_exists(p_reservation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.gift_reservations
    where id = p_reservation_id
  );
$$;

revoke all on function public.gift_reservation_exists(uuid) from public;
grant execute on function public.gift_reservation_exists(uuid) to anon, authenticated;

commit;
