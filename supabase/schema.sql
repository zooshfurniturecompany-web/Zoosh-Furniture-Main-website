-- Create Products table (Reference Catalogue)
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  product_code text unique not null,
  name text not null,
  category text not null,
  wood_type text not null,
  features text[] default '{}',
  price numeric not null,
  image_url text,
  dimensions jsonb, -- e.g. {"length": 180, "width": 90, "height": 75} in cm
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Estimates table (Sales Estimation History)
create table if not exists estimates (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- Email or Sales Representative identifier
  image_url text not null,
  category text not null,
  wood_type text not null,
  dimensions jsonb not null, -- e.g. {"length": 80, "width": 80, "height": 75}
  features text[] default '{}',
  complexity text not null, -- 'Simple', 'Medium', 'Premium', 'Luxury'
  estimated_price jsonb not null, -- {"min": 18000, "recommended": 21500, "max": 24000}
  confidence_score numeric not null, -- e.g. 87 for 87%
  reasoning jsonb not null, -- Detailed calculations & matching reference details
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexing for fast search
create index if not exists products_category_idx on products (category);
create index if not exists estimates_user_id_idx on estimates (user_id);
create index if not exists estimates_created_at_idx on estimates (created_at desc);
