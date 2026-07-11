-- Matches the existing DirtFree schema confirmed in Supabase:
-- public."user".id and public.orders.id are both int8 (bigint), and
-- public.orders.cart_items is varchar.
--
-- Run once in Supabase Dashboard -> SQL Editor.

alter table public.orders
  add column if not exists user_id bigint;

alter table public.orders
  add column if not exists customer_name text;

alter table public.orders
  add column if not exists customer_phone text;

alter table public.orders
  add column if not exists address text;

-- Link each future order to its customer. Existing orders remain valid with
-- a NULL user_id because they were created before accounts were added.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_user_id_fkey'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_user_id_fkey
      foreign key (user_id) references public."user"(id)
      on delete set null;
  end if;
end $$;

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

-- Do not make user_id NOT NULL until every older order has been assigned to
-- a user. The website always supplies user_id for every newly placed order.
