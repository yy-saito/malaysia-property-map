create table if not exists public.stations (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  line_name text,
  operator_name text,
  state_name text,
  postal_code text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  is_major boolean not null default false,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stations_code_key unique (code)
);

create index if not exists stations_is_active_idx
  on public.stations (is_active);

create index if not exists stations_state_name_idx
  on public.stations (state_name);

create index if not exists stations_is_major_idx
  on public.stations (is_major);

create table if not exists public.postal_code_station_area_mappings (
  id uuid primary key default gen_random_uuid(),
  postal_code text not null,
  station_id uuid references public.stations (id) on delete set null,
  station_area_name text not null,
  state_name text,
  assignment_method text not null default 'manual',
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint postal_code_station_area_mappings_postal_code_key unique (postal_code),
  constraint postal_code_station_area_mappings_assignment_method_check check (
    assignment_method in ('manual', 'nearest_station', 'derived_from_area_name')
  )
);

create index if not exists postal_code_station_area_mappings_station_id_idx
  on public.postal_code_station_area_mappings (station_id);

create index if not exists postal_code_station_area_mappings_station_area_name_idx
  on public.postal_code_station_area_mappings (station_area_name);

create index if not exists postal_code_station_area_mappings_state_name_idx
  on public.postal_code_station_area_mappings (state_name);

drop trigger if exists set_updated_at_stations on public.stations;
create trigger set_updated_at_stations
before update on public.stations
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_postal_code_station_area_mappings on public.postal_code_station_area_mappings;
create trigger set_updated_at_postal_code_station_area_mappings
before update on public.postal_code_station_area_mappings
for each row
execute function public.set_updated_at();

grant select on public.stations to anon, authenticated;
grant select on public.postal_code_station_area_mappings to anon, authenticated;
