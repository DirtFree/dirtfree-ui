-- Create a Supabase table for location-specific service pricing.
-- Run this in Supabase SQL Editor once, after creating the services table.

create table if not exists public.service_prices (
  id bigint generated always as identity primary key,
  location text not null,
  category text not null,
  tier text not null,
  price bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists service_prices_unique_location_category_tier_idx
  on public.service_prices (location, category, tier);
