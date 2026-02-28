-- Supabase schema for products, collections, homepage, and settings

-- Products table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text,
  price_from text,
  description text,
  tags text[],
  colors text[],
  sizes text[],
  featured boolean default false,
  images text[],
  created_at timestamptz default now()
);

-- Collections table
create table if not exists collections (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique,
  description text,
  product_ids uuid[],
  created_at timestamptz default now()
);

-- Homepage settings
create table if not exists homepage (
  id uuid default gen_random_uuid() primary key,
  hero_title text,
  hero_subtitle text,
  featured_products uuid[],
  updated_at timestamptz default now()
);

-- WhatsApp / settings
create table if not exists settings (
  id uuid default gen_random_uuid() primary key,
  key text unique,
  value jsonb,
  updated_at timestamptz default now()
);
