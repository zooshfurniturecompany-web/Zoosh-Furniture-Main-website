-- ========================================================
-- ZOOSH PRODUCT MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Relational schema for products, categories, collections,
-- materials, product variants, images, and settings.
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
  id uuid default gen_random_uuid() primary key,
  sku text unique not null,
  name text not null,
  slug text unique not null,
  category_id uuid references categories(id) on delete set null,
  category_name text not null default 'Three Seater Sofa',
  collection_id uuid references collections(id) on delete set null,
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

-- 8. Admin Users Table
create table if not exists admin_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text not null,
  role text not null default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Website Settings Table
create table if not exists website_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Indexes
create index if not exists idx_products_status on products (status);
create index if not exists idx_products_featured on products (featured);
create index if not exists idx_products_category on products (category_name);
create index if not exists idx_products_created_at on products (created_at desc);
