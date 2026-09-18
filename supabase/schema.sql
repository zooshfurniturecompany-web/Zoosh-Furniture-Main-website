-- ========================================================
-- ZOOSH PRODUCT MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Run this in your Supabase SQL Editor (supabase.com)
-- ========================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Categories Table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  room_slug text not null default 'living', -- 'living', 'dining', 'bedroom', 'entryway', 'custom'
  description text default '',
  image_url text default '',
  display_order integer default 0,
  status text not null default 'active', -- 'active', 'archived'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Collections Table
create table if not exists collections (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text default '',
  image_url text default '',
  display_order integer default 0,
  status text not null default 'active', -- 'active', 'archived'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Wood Types Table
create table if not exists wood_types (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text default '',
  image_url text default '',
  is_available boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Fabric Types Table
create table if not exists fabric_types (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text default '',
  image_url text default '',
  is_available boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Other Materials Table
create table if not exists other_materials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  category text not null default 'Hardware',
  description text default '',
  image_url text default '',
  is_available boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Products Table (Master Product Catalog)
create table if not exists products (
  id text primary key,
  sku text unique not null,
  name text not null,
  slug text unique not null,
  category_id text,
  category_name text not null default 'Three Seater Sofa',
  collection_id text,
  collection_name text,
  short_description text default '',
  full_description text default '',
  status text not null default 'published', -- 'published', 'draft', 'archived'
  featured boolean default false,
  
  -- Pricing configuration
  pricing_type text not null default 'fixed', -- 'fixed', 'starting_from', 'on_request'
  price numeric default 0,
  starting_price numeric,
  display_price boolean default true,
  price_breakdown jsonb default '[]'::jsonb,
  
  -- Dimensions & Specifications
  dimensions text default '',
  dimension_breakdown jsonb default '[]'::jsonb,
  custom_dimensions_available boolean default true,
  customisation_available boolean default true,
  material text default 'Solid Wood',
  finish text default 'Matt Polish',
  
  -- Options & Customization
  wood_options jsonb default '[]'::jsonb,
  fabric_options jsonb default '[]'::jsonb,
  finish_options jsonb default '[]'::jsonb,
  size_options jsonb default '[]'::jsonb,
  specs jsonb default '{}'::jsonb,
  
  -- Primary & Gallery Images
  images text[] default '{}',
  
  -- SEO Metadata
  seo_title text default '',
  seo_description text default '',
  keywords text[] default '{}',
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Website Settings Table
create table if not exists website_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Enable Row Level Security (RLS) & Policies
alter table categories enable row level security;
alter table collections enable row level security;
alter table wood_types enable row level security;
alter table fabric_types enable row level security;
alter table other_materials enable row level security;
alter table products enable row level security;
alter table website_settings enable row level security;

-- Public read access for storefront
create policy "Public read categories" on categories for select using (true);
create policy "Public read collections" on collections for select using (true);
create policy "Public read wood_types" on wood_types for select using (true);
create policy "Public read fabric_types" on fabric_types for select using (true);
create policy "Public read other_materials" on other_materials for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read website_settings" on website_settings for select using (true);

-- Full management access for admin backend
create policy "Full access categories" on categories for all using (true) with check (true);
create policy "Full access collections" on collections for all using (true) with check (true);
create policy "Full access wood_types" on wood_types for all using (true) with check (true);
create policy "Full access fabric_types" on fabric_types for all using (true) with check (true);
create policy "Full access other_materials" on other_materials for all using (true) with check (true);
create policy "Full access products" on products for all using (true) with check (true);
create policy "Full access website_settings" on website_settings for all using (true) with check (true);

-- 10. Performance Indexes
create index if not exists idx_products_status on products (status);
create index if not exists idx_products_featured on products (featured);
create index if not exists idx_products_category on products (category_name);
create index if not exists idx_products_created_at on products (created_at desc);
