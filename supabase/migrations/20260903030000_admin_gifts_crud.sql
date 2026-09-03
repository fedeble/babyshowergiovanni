begin;

create policy "Authenticated users can create gifts"
on public.gifts
for insert
to authenticated
with check (true);

create policy "Authenticated users can update gifts"
on public.gifts
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete gifts"
on public.gifts
for delete
to authenticated
using (true);

grant insert (event_id, name, description, image, quantity)
on table public.gifts to authenticated;

grant update (name, description, image, quantity)
on table public.gifts to authenticated;

grant delete on table public.gifts to authenticated;

commit;