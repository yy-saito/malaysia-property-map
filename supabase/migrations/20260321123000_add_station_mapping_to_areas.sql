alter table public.areas
add column if not exists station_area_mapping_id uuid references public.postal_code_station_area_mappings (id) on delete set null;

create index if not exists areas_station_area_mapping_id_idx
  on public.areas (station_area_mapping_id);

update public.areas
set station_area_mapping_id = mappings.id
from public.postal_code_station_area_mappings mappings
where public.areas.area_level = 2
  and public.areas.postal_code is not null
  and public.areas.postal_code = mappings.postal_code
  and public.areas.station_area_mapping_id is distinct from mappings.id;

grant update (station_area_mapping_id) on public.areas to authenticated;
