insert into public.property_types (code, name_en, name_ja)
values ('condominium_apartment', 'Condominium/Apartment', 'コンドミニアム / アパートメント')
on conflict (code) do update
set
  name_en = excluded.name_en,
  name_ja = excluded.name_ja,
  updated_at = now();
