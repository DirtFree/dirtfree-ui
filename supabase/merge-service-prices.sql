-- Merge location-specific service prices into public.services
-- Run this after creating the updated public.services table and before dropping public.service_prices.

begin;

-- 0) Ensure the current services table has a location column
alter table public.services
  add column if not exists location text default 'all';

update public.services
set location = coalesce(location, 'all')
where location is null;

-- Ensure the unique index exists for city-specific rows
create unique index if not exists services_location_category_tier_idx
  on public.services (location, category, tier);

-- 1) Replicate each base "all" service into every city found in service_prices,
--    so every location has the same set of services.
with all_services as (
  select
    category,
    tier,
    name,
    title,
    price,
    duration,
    badge,
    image,
    description,
    details_summary,
    included,
    excluded,
    active,
    rating,
    reviews
  from public.services
  where lower(trim(coalesce(location, ''))) = 'all'
), city_locations as (
  select distinct trim(location) as location
  from public.service_prices
  where lower(trim(location)) != 'all'
), missing_city_rows as (
  select
    l.location,
    a.category,
    a.tier,
    a.name,
    a.title,
    a.price,
    a.duration,
    a.badge,
    a.image,
    a.description,
    a.details_summary,
    a.included,
    a.excluded,
    a.active,
    a.rating,
    a.reviews
  from all_services a
  cross join city_locations l
  where not exists (
    select 1
    from public.services s
    where lower(trim(coalesce(s.location, ''))) = lower(trim(l.location))
      and lower(trim(coalesce(s.category, ''))) = lower(trim(coalesce(a.category, '')))
      and lower(trim(coalesce(s.tier, ''))) = lower(trim(coalesce(a.tier, '')))
  )
)
insert into public.services (
  location,
  category,
  name,
  title,
  tier,
  price,
  duration,
  badge,
  image,
  description,
  details_summary,
  included,
  excluded,
  active,
  rating,
  reviews,
  created_at,
  updated_at
)
select
  location,
  category,
  name,
  title,
  tier,
  price,
  duration,
  badge,
  image,
  description,
  details_summary,
  included,
  excluded,
  active,
  rating,
  reviews,
  now(),
  now()
from missing_city_rows;

-- 2) Update existing service rows with location-specific prices from service_prices
update public.services s
set
  price = sp.price,
  updated_at = now()
from public.service_prices sp
where lower(trim(coalesce(s.location, ''))) = lower(trim(coalesce(sp.location, '')))
  and lower(trim(coalesce(s.category, ''))) = lower(trim(coalesce(sp.category, '')))
  and lower(trim(coalesce(s.tier, ''))) = lower(trim(coalesce(sp.tier, '')));

-- 3) Backfill missing metadata for city-specific rows from the base "all" row
update public.services s
set
  name = coalesce(nullif(trim(s.name), ''), nullif(trim(sa.name), '')),
  title = coalesce(nullif(trim(s.title), ''), nullif(trim(sa.title), '')),
  duration = coalesce(nullif(trim(s.duration), ''), nullif(trim(sa.duration), '')),
  badge = coalesce(nullif(trim(s.badge), ''), nullif(trim(sa.badge), '')),
  image = coalesce(nullif(trim(s.image), ''), nullif(trim(sa.image), '')),
  description = coalesce(nullif(trim(s.description), ''), nullif(trim(sa.description), '')),
  details_summary = coalesce(nullif(trim(s.details_summary), ''), nullif(trim(sa.details_summary), '')),
  included = coalesce(s.included, sa.included),
  excluded = coalesce(s.excluded, sa.excluded),
  active = coalesce(s.active, sa.active, true),
  rating = coalesce(s.rating, sa.rating),
  reviews = coalesce(nullif(trim(s.reviews), ''), nullif(trim(sa.reviews), '')),
  updated_at = now()
from public.services sa
where lower(trim(coalesce(sa.location, ''))) = 'all'
  and lower(trim(coalesce(sa.category, ''))) = lower(trim(coalesce(s.category, '')))
  and lower(trim(coalesce(sa.tier, ''))) = lower(trim(coalesce(s.tier, '')))
  and lower(trim(coalesce(s.location, ''))) != 'all'
  and (
    s.name is null or trim(s.name) = '' or
    s.title is null or trim(s.title) = '' or
    s.duration is null or trim(s.duration) = '' or
    s.badge is null or trim(s.badge) = '' or
    s.image is null or trim(s.image) = '' or
    s.description is null or trim(s.description) = '' or
    s.details_summary is null or trim(s.details_summary) = '' or
    s.included is null or
    s.excluded is null or
    s.active is null or
    s.rating is null or
    s.reviews is null or trim(s.reviews) = ''
  );

-- 4) Backfill missing prices on existing service rows from service_prices
update public.services s
set
  price = sp.price,
  updated_at = now()
from public.service_prices sp
where lower(trim(coalesce(s.location, ''))) = lower(trim(coalesce(sp.location, '')))
  and lower(trim(coalesce(s.category, ''))) = lower(trim(coalesce(sp.category, '')))
  and lower(trim(coalesce(s.tier, ''))) = lower(trim(coalesce(sp.tier, '')))
  and s.price is null;

-- 5) Remove base "all" rows once city-specific copies exist
delete from public.services s
where lower(trim(coalesce(s.location, ''))) = 'all'
  and exists (
    select 1
    from public.services s2
    where lower(trim(coalesce(s2.location, ''))) != 'all'
      and lower(trim(coalesce(s2.category, ''))) = lower(trim(coalesce(s.category, '')))
      and lower(trim(coalesce(s2.tier, ''))) = lower(trim(coalesce(s.tier, '')))
  );

-- 6) Optionally, remove the old service_prices table once validation is complete
-- drop table if exists public.service_prices;

commit;
