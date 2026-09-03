begin;

create policy "Authenticated users can count reservations"
on public.gift_reservations
for select
to authenticated
using (true);

grant select (id, gift_id) on table public.gift_reservations to authenticated;

commit;