-- Comprasur — Initial Schema
-- Run: supabase db push

-- Products
create table if not exists public.products (
  id            serial primary key,
  name          varchar(255) not null,
  price         decimal(10,2) not null,
  description   text,
  color_primary    varchar(20),
  color_background varchar(20),
  color_text       varchar(20),
  color_accent     varchar(20),
  created_at    timestamptz default now()
);

-- Orders
create table if not exists public.orders (
  id               serial primary key,
  user_name        varchar(255),
  user_location    varchar(255),
  total            decimal(10,2) not null,
  status           varchar(50) default 'pending',
  paypal_order_id  varchar(255),
  paypal_capture_id varchar(255),
  created_at       timestamptz default now()
);

-- Order items
create table if not exists public.order_items (
  id           serial primary key,
  order_id     integer references public.orders(id) on delete cascade,
  product_id   integer not null,
  product_name varchar(255) not null,
  price        decimal(10,2) not null,
  quantity     integer not null default 1
);

-- Seed products (idempotent)
insert into public.products (name, price, description, color_primary, color_background, color_text, color_accent)
select * from (values
  ('Guantes de Nitrilo',    15.00, 'Guantes desechables de alta resistencia para procedimientos clínicos.',       '#2B6CB0','#EBF8FF','#1A365D','#BEE3F8'),
  ('Mascarilla N95',        25.00, 'Mascarilla de protección respiratoria con filtro de partículas.',             '#276749','#F0FFF4','#1C4532','#C6F6D5'),
  ('Jeringa 10ml',           5.00, 'Jeringa desechable de precisión con émbolo suave.',                          '#C05621','#FFFAF0','#7B341E','#FEEBC8'),
  ('Bisturí Quirúrgico',    12.00, 'Instrumento de corte estéril con mango ergonómico.',                         '#702459','#FFF5F7','#521B41','#FED7E2'),
  ('Vendaje Elástico',       8.00, 'Vendaje adaptable para inmovilización y compresión muscular.',               '#D69E2E','#FFFFF0','#744210','#FEFCBF'),
  ('Catéter Intravenoso',   18.00, 'Catéter flexible para administración de fluidos y medicamentos.',            '#553C9A','#FAF5FF','#322659','#E9D8FD')
) as v(name, price, description, cp, cb, ct, ca)
where not exists (select 1 from public.products limit 1);

-- RLS: public read for products
alter table public.products enable row level security;
create policy "products_public_read" on public.products
  for select using (true);

-- RLS: authenticated users manage their orders
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
