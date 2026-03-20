create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  area_level smallint not null,
  country text not null default 'Malaysia',
  state_name text,
  postal_code text,
  postal_area_name text,
  display_name text not null,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint areas_area_level_check check (area_level in (1, 2)),
  constraint areas_state_required_check check (
    (area_level = 1 and state_name is not null and postal_code is null)
    or (area_level = 2 and postal_code is not null)
  )
);

create unique index if not exists areas_level_1_state_name_key
  on public.areas (lower(state_name))
  where area_level = 1 and state_name is not null;

create unique index if not exists areas_level_2_postal_code_key
  on public.areas (postal_code)
  where area_level = 2 and postal_code is not null;

create index if not exists areas_display_name_idx
  on public.areas (display_name);

create table if not exists public.property_types (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name_en text not null,
  name_ja text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_types_code_key unique (code)
);

create table if not exists public.developers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description_ja text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint developers_slug_key unique (slug)
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  role text not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_role_check check (role in ('guest', 'member', 'premium', 'admin')),
  constraint users_status_check check (status in ('active', 'invited', 'disabled'))
);

create unique index if not exists users_email_lower_key
  on public.users (lower(email));

create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  executed_by_user_id uuid not null references public.users (id) on delete restrict,
  source_file_name text not null,
  total_rows integer not null default 0,
  imported_rows integer not null default 0,
  skipped_rows integer not null default 0,
  new_areas_count integer not null default 0,
  new_properties_count integer not null default 0,
  unresolved_addresses_count integer not null default 0,
  unresolved_coordinates_count integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint imports_status_check check (status in ('pending', 'processing', 'completed', 'failed'))
);

create index if not exists imports_executed_by_user_id_idx
  on public.imports (executed_by_user_id);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  area_id uuid references public.areas (id) on delete set null,
  property_type_id uuid references public.property_types (id) on delete set null,
  developer_id uuid references public.developers (id) on delete set null,
  scheme_name text not null,
  resolved_address text,
  postal_code text,
  tenure text,
  completed_year integer,
  note text,
  is_data_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint properties_completed_year_check check (
    completed_year is null or completed_year between 1800 and 2100
  )
);

create unique index if not exists properties_scheme_name_lower_key
  on public.properties (lower(trim(scheme_name)));

create index if not exists properties_area_id_idx
  on public.properties (area_id);

create index if not exists properties_property_type_id_idx
  on public.properties (property_type_id);

create index if not exists properties_developer_id_idx
  on public.properties (developer_id);

create index if not exists properties_postal_code_idx
  on public.properties (postal_code);

create index if not exists properties_is_data_complete_idx
  on public.properties (is_data_complete);

create table if not exists public.property_transactions (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas (id) on delete restrict,
  property_type_id uuid not null references public.property_types (id) on delete restrict,
  property_id uuid not null references public.properties (id) on delete restrict,
  import_id uuid references public.imports (id) on delete set null,
  transaction_month date not null,
  land_area numeric(14, 2),
  land_area_unit text,
  floor_area numeric(14, 2),
  floor_area_unit text,
  unit_level integer,
  transaction_price numeric(14, 2) not null,
  source_file_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_transactions_price_check check (transaction_price >= 0)
);

create index if not exists property_transactions_area_id_idx
  on public.property_transactions (area_id);

create index if not exists property_transactions_property_type_id_idx
  on public.property_transactions (property_type_id);

create index if not exists property_transactions_property_id_idx
  on public.property_transactions (property_id);

create index if not exists property_transactions_import_id_idx
  on public.property_transactions (import_id);

create index if not exists property_transactions_transaction_month_idx
  on public.property_transactions (transaction_month);

create or replace function public.set_property_data_complete()
returns trigger
language plpgsql
as $$
begin
  new.is_data_complete = (nullif(trim(new.scheme_name), '') is not null and nullif(trim(new.postal_code), '') is not null);
  return new;
end;
$$;

drop trigger if exists set_updated_at_areas on public.areas;
create trigger set_updated_at_areas
before update on public.areas
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_property_types on public.property_types;
create trigger set_updated_at_property_types
before update on public.property_types
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_developers on public.developers;
create trigger set_updated_at_developers
before update on public.developers
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_users on public.users;
create trigger set_updated_at_users
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_imports on public.imports;
create trigger set_updated_at_imports
before update on public.imports
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_properties on public.properties;
create trigger set_updated_at_properties
before update on public.properties
for each row
execute function public.set_updated_at();

drop trigger if exists set_property_data_complete_on_properties on public.properties;
create trigger set_property_data_complete_on_properties
before insert or update on public.properties
for each row
execute function public.set_property_data_complete();

drop trigger if exists set_updated_at_property_transactions on public.property_transactions;
create trigger set_updated_at_property_transactions
before update on public.property_transactions
for each row
execute function public.set_updated_at();
