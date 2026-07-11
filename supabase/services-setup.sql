-- Create a Supabase table for the admin-managed service catalog.
-- Run this in Supabase SQL Editor once.

create table if not exists public.services (
  id bigint generated always as identity primary key,
  location text not null,
  category text not null,
  name text not null,
  title text,
  tier text not null,
  price bigint,
  duration text,
  badge text,
  image text,
  description text,
  details_summary text,
  included jsonb,
  excluded jsonb,
  active boolean default true,
  rating numeric,
  reviews text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists services_location_category_tier_idx on public.services (location, category, tier);
