begin;

grant select (
  id,
  event_date,
  event_time,
  venue,
  address,
  latitude,
  longitude
) on table public.events to anon;

grant select (
  id,
  name,
  baby_name,
  event_date,
  event_time,
  venue,
  address,
  is_public
) on table public.events to authenticated;

drop policy if exists "Public events are readable" on public.events;
drop policy if exists "Public event is readable" on public.events;

create policy "Public event is readable"
on public.events
for select
to anon
using (is_public = true);

commit;