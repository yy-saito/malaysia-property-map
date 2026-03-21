insert into public.property_types (code, name_en, name_ja)
values ('condominium_apartment', 'Condominium/Apartment', 'コンドミニアム / アパートメント')
on conflict (code) do update
set
  name_en = excluded.name_en,
  name_ja = excluded.name_ja,
  updated_at = now();

delete from public.users
where id = 'f7dbff10-7286-4547-a027-4af6f2ed2f8d'::uuid
   or lower(email) = lower('yusei.yusry@gmail.com');

delete from auth.identities
where user_id = '33cc6a34-c24b-40ed-a9fc-0aa30281d585'::uuid
   or email = 'yusei.yusry@gmail.com';

delete from auth.users
where id = '33cc6a34-c24b-40ed-a9fc-0aa30281d585'::uuid
   or email = 'yusei.yusry@gmail.com';

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous
)
values (
  '00000000-0000-0000-0000-000000000000',
  '33cc6a34-c24b-40ed-a9fc-0aa30281d585'::uuid,
  'authenticated',
  'authenticated',
  'yusei.yusry@gmail.com',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '',
  '',
  '',
  '',
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"開発斉藤"}'::jsonb,
  false,
  now(),
  now(),
  false,
  false
);

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at,
  id
)
values (
  'yusei.yusry@gmail.com',
  '33cc6a34-c24b-40ed-a9fc-0aa30281d585'::uuid,
  format(
    '{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}',
    '33cc6a34-c24b-40ed-a9fc-0aa30281d585',
    'yusei.yusry@gmail.com'
  )::jsonb,
  'email',
  now(),
  now(),
  now(),
  '8f5b2bc2-53d5-4601-a914-72fe8a7bff41'
);

insert into public.users (
  id,
  auth_user_id,
  name,
  email,
  role,
  status
)
values (
  'f7dbff10-7286-4547-a027-4af6f2ed2f8d'::uuid,
  '33cc6a34-c24b-40ed-a9fc-0aa30281d585'::uuid,
  '開発斉藤',
  'yusei.yusry@gmail.com',
  'admin',
  'active'
);

insert into public.stations (
  code,
  name,
  line_name,
  operator_name,
  state_name,
  postal_code,
  latitude,
  longitude,
  is_major,
  display_order
)
values
  ('kl_sentral', 'KL Sentral', 'Interchange', 'Rapid KL / KTM', 'Kuala Lumpur', '50470', 3.13398, 101.68653, true, 10),
  ('pasar_seni', 'Pasar Seni', 'Kelana Jaya / Kajang', 'Rapid KL / MRT Corp', 'Kuala Lumpur', '50050', 3.14277, 101.69533, true, 20),
  ('bandaraya', 'Bandaraya', 'Ampang / Sri Petaling', 'Rapid KL', 'Kuala Lumpur', '50100', 3.14932, 101.69476, true, 30),
  ('kampung_baru', 'Kampung Baru', 'Putrajaya', 'MRT Corp', 'Kuala Lumpur', '50250', 3.16302, 101.70563, false, 35),
  ('bukit_bintang', 'Bukit Bintang', 'Monorail / Kajang', 'Rapid KL / MRT Corp', 'Kuala Lumpur', '55100', 3.14662, 101.71012, true, 40),
  ('trx', 'Tun Razak Exchange', 'Kajang / Putrajaya', 'MRT Corp', 'Kuala Lumpur', '55188', 3.14236, 101.71831, true, 50),
  ('ampang_park', 'Ampang Park', 'Kelana Jaya / Putrajaya', 'Rapid KL / MRT Corp', 'Kuala Lumpur', '50450', 3.16016, 101.71937, true, 60),
  ('titiwangsa', 'Titiwangsa', 'Interchange', 'Rapid KL / MRT Corp', 'Kuala Lumpur', '53200', 3.17364, 101.69686, true, 70),
  ('conlay', 'Conlay', 'Putrajaya', 'MRT Corp', 'Kuala Lumpur', '50450', 3.14993, 101.71993, false, 80),
  ('sentul_timur', 'Sentul Timur', 'Ampang / Sri Petaling', 'Rapid KL', 'Kuala Lumpur', '51100', 3.18871, 101.69579, false, 85),
  ('jinjang', 'Jinjang', 'Putrajaya', 'MRT Corp', 'Kuala Lumpur', '51200', 3.20554, 101.68153, false, 86),
  ('kepong_baru', 'Kepong Baru', 'Putrajaya', 'MRT Corp', 'Kuala Lumpur', '52100', 3.21262, 101.63553, false, 87),
  ('metro_prima', 'Metro Prima', 'Putrajaya', 'MRT Corp', 'Kuala Lumpur', '52200', 3.20216, 101.63585, false, 88),
  ('wangsa_mju', 'Wangsa Maju', 'Kelana Jaya', 'Rapid KL', 'Kuala Lumpur', '53100', 3.20535, 101.73139, false, 89),
  ('sri_rampai', 'Sri Rampai', 'Kelana Jaya', 'Rapid KL', 'Kuala Lumpur', '53300', 3.19916, 101.73717, false, 90),
  ('sungai_buloh', 'Sungai Buloh', 'Kajang / Putrajaya / KTM', 'MRT Corp / KTM', 'Selangor', '47000', 3.20614, 101.58064, true, 90),
  ('batu_arang', 'Batu Arang', 'KTM Komuter', 'KTM', 'Selangor', '48000', 3.31616, 101.47373, false, 92),
  ('setiawangsa', 'Setiawangsa', 'Kelana Jaya', 'Rapid KL', 'Kuala Lumpur', '54200', 3.17455, 101.73585, true, 94),
  ('bukit_antarabangsa', 'Bukit Antarabangsa', 'Landmark', 'Landmark', 'Selangor', '68000', 3.18084, 101.76081, false, 95),
  ('taman_melati', 'Taman Melati', 'Kelana Jaya', 'Rapid KL', 'Kuala Lumpur', '68100', 3.21995, 101.75437, false, 96),
  ('kota_damansara', 'Kota Damansara', 'Kajang', 'MRT Corp', 'Selangor', '47810', 3.15082, 101.56853, true, 100),
  ('mutiara_damansara', 'Mutiara Damansara', 'Kajang', 'MRT Corp', 'Selangor', '47820', 3.15521, 101.60973, false, 110),
  ('bandar_utama', 'Bandar Utama', 'Kajang', 'MRT Corp', 'Selangor', '47800', 3.14665, 101.61876, true, 120),
  ('damansara_perdana', 'Damansara Perdana', 'Landmark', 'Landmark', 'Selangor', '47820', 3.16672, 101.61166, false, 121),
  ('ttdi', 'TTDI', 'Kajang', 'MRT Corp', 'Kuala Lumpur', '60000', 3.13672, 101.62984, true, 122),
  ('tropicana', 'Tropicana', 'Landmark', 'Landmark', 'Selangor', '47410', 3.11877, 101.60364, false, 123),
  ('kelana_jaya', 'Kelana Jaya', 'Kelana Jaya / LRT', 'Rapid KL', 'Selangor', '47301', 3.11272, 101.60447, true, 124),
  ('asia_jaya', 'Asia Jaya', 'Kelana Jaya', 'Rapid KL', 'Selangor', '46200', 3.11122, 101.63582, true, 125),
  ('taman_jaya', 'Taman Jaya', 'Kelana Jaya', 'Rapid KL', 'Selangor', '46050', 3.10496, 101.64248, false, 126),
  ('saujana_golf', 'Saujana Golf & Country Club', 'Landmark', 'Landmark', 'Selangor', '40150', 3.11765, 101.54183, false, 127),
  ('subang_jaya', 'Subang Jaya', 'Kelana Jaya / KTM', 'Rapid KL / KTM', 'Selangor', '47500', 3.08274, 101.58505, true, 130),
  ('puchong_perdana', 'Puchong Perdana', 'Sri Petaling', 'Rapid KL', 'Selangor', '47100', 3.03271, 101.61881, false, 131),
  ('ioi_puchong_jaya', 'IOI Puchong Jaya', 'Landmark', 'Landmark', 'Selangor', '47170', 3.05021, 101.61567, false, 132),
  ('bandar_puteri', 'Bandar Puteri', 'Landmark', 'Landmark', 'Selangor', '47180', 3.03065, 101.61664, false, 133),
  ('usj_7', 'USJ 7', 'Kelana Jaya / BRT', 'Rapid KL', 'Selangor', '47610', 3.04448, 101.58174, false, 140),
  ('putra_heights', 'Putra Heights', 'Kelana Jaya / Sri Petaling', 'Rapid KL', 'Selangor', '47650', 2.99377, 101.57202, true, 150),
  ('kajang', 'Kajang', 'Kajang / KTM', 'MRT Corp / KTM', 'Selangor', '43000', 2.99358, 101.79066, true, 160),
  ('maluri', 'Maluri', 'Kajang / Ampang', 'MRT Corp / Rapid KL', 'Kuala Lumpur', '55100', 3.12394, 101.72766, true, 165),
  ('balakong', 'Balakong / Cheras Selatan', 'Landmark', 'Landmark', 'Selangor', '43300', 3.03250, 101.76450, false, 166),
  ('bukit_jalil', 'Bukit Jalil', 'Sri Petaling', 'Rapid KL', 'Kuala Lumpur', '57000', 3.05436, 101.69099, true, 167),
  ('salak_selatan', 'Salak Selatan', 'KTM / Sri Petaling', 'KTM / Rapid KL', 'Kuala Lumpur', '57100', 3.09895, 101.70673, false, 166),
  ('kerinchi', 'Kerinchi', 'Kelana Jaya', 'Rapid KL', 'Kuala Lumpur', '59200', 3.11395, 101.66835, false, 167),
  ('salak_tinggi', 'Salak Tinggi', 'KLIA Transit', 'ERL', 'Selangor', '43900', 2.82452, 101.70588, true, 168),
  ('dengkil', 'Dengkil', 'Landmark', 'Landmark', 'Selangor', '43800', 2.86058, 101.68182, false, 169),
  ('putrajaya_sentral', 'Putrajaya Sentral', 'Putrajaya / KLIA Transit', 'MRT Corp / ERL', 'Putrajaya', '62000', 2.92667, 101.69632, true, 170)
on conflict (code) do update
set
  name = excluded.name,
  line_name = excluded.line_name,
  operator_name = excluded.operator_name,
  state_name = excluded.state_name,
  postal_code = excluded.postal_code,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  is_major = excluded.is_major,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.postal_code_station_area_mappings (
  postal_code,
  station_id,
  station_area_name,
  state_name,
  assignment_method,
  notes
)
select
  mapping.postal_code,
  stations.id,
  mapping.station_area_name,
  mapping.state_name,
  'manual',
  mapping.notes
from (
  values
    ('50050', 'pasar_seni', 'Pasar Seni', 'Kuala Lumpur', 'Central heritage core'),
    ('50100', 'bandaraya', 'Bandaraya / Dang Wangi', 'Kuala Lumpur', 'City north core'),
    ('50250', 'kampung_baru', 'Kampung Baru', 'Kuala Lumpur', 'Provisional assignment for central KL west side'),
    ('50400', 'kampung_baru', 'Kampung Baru / KLCC West', 'Kuala Lumpur', 'Provisional assignment for embassy and city west corridor'),
    ('50450', 'ampang_park', 'Ampang Park / Conlay', 'Kuala Lumpur', 'KLCC east corridor'),
    ('50470', 'kl_sentral', 'KL Sentral', 'Kuala Lumpur', 'Primary transport hub'),
    ('50480', 'kl_sentral', 'KL Sentral / Brickfields', 'Kuala Lumpur', 'Brickfields residential cluster'),
    ('51100', 'sentul_timur', 'Sentul', 'Kuala Lumpur', 'Provisional assignment for Sentul cluster'),
    ('51200', 'jinjang', 'Jinjang', 'Kuala Lumpur', 'Provisional assignment for Jinjang cluster'),
    ('52100', 'kepong_baru', 'Kepong Baru', 'Kuala Lumpur', 'Provisional assignment for Kepong Baru cluster'),
    ('52200', 'metro_prima', 'Metro Prima / Kepong', 'Kuala Lumpur', 'Provisional assignment for northern Kepong cluster'),
    ('53100', 'wangsa_mju', 'Wangsa Maju', 'Kuala Lumpur', 'Provisional assignment for Wangsa Maju cluster'),
    ('53200', 'titiwangsa', 'Titiwangsa', 'Kuala Lumpur', 'Northern interchange cluster'),
    ('53300', 'sri_rampai', 'Sri Rampai / Setapak', 'Kuala Lumpur', 'Provisional assignment for Sri Rampai cluster'),
    ('54100', 'setiawangsa', 'Setiawangsa', 'Kuala Lumpur', 'Provisional assignment for Setiawangsa west cluster'),
    ('54200', 'setiawangsa', 'Setiawangsa', 'Kuala Lumpur', 'Setiawangsa cluster'),
    ('55000', 'bukit_bintang', 'Bukit Bintang', 'Kuala Lumpur', 'Provisional assignment for city core retail district'),
    ('55100', 'bukit_bintang', 'Bukit Bintang / TRX', 'Kuala Lumpur', 'Bukit Bintang core'),
    ('55188', 'trx', 'Tun Razak Exchange', 'Kuala Lumpur', 'TRX financial district'),
    ('56000', 'maluri', 'Maluri / Cheras', 'Kuala Lumpur', 'Provisional assignment for Cheras west cluster'),
    ('56100', 'maluri', 'Maluri / Cheras', 'Kuala Lumpur', 'Provisional assignment for Cheras central cluster'),
    ('57100', 'salak_selatan', 'Salak Selatan', 'Kuala Lumpur', 'Provisional assignment for southern KL rail cluster'),
    ('58200', 'kerinchi', 'Kerinchi / Bangsar South', 'Kuala Lumpur', 'Provisional assignment for Bangsar South cluster'),
    ('59200', 'kerinchi', 'Kerinchi / Bangsar South', 'Kuala Lumpur', 'Provisional assignment for Bangsar South south cluster'),
    ('43000', 'kajang', 'Kajang', 'Selangor', 'Kajang line terminus cluster'),
    ('43300', 'balakong', 'Balakong / Cheras Selatan', 'Selangor', 'Provisional assignment for Cheras Selatan cluster'),
    ('43800', 'dengkil', 'Dengkil', 'Selangor', 'Provisional assignment for Dengkil cluster'),
    ('43900', 'salak_tinggi', 'Salak Tinggi', 'Selangor', 'Salak Tinggi cluster'),
    ('46050', 'taman_jaya', 'PJ State / Taman Jaya', 'Selangor', 'Provisional assignment for central Petaling Jaya'),
    ('46200', 'asia_jaya', 'Asia Jaya / Section 13', 'Selangor', 'Provisional assignment for Section 13 cluster'),
    ('46300', 'asia_jaya', 'PJ New Town South', 'Selangor', 'Provisional assignment for southern PJ cluster'),
    ('47100', 'puchong_perdana', 'Puchong', 'Selangor', 'Provisional assignment for Puchong west cluster'),
    ('47170', 'ioi_puchong_jaya', 'IOI Puchong Jaya', 'Selangor', 'Provisional assignment for IOI mall cluster'),
    ('47180', 'bandar_puteri', 'Bandar Puteri Puchong', 'Selangor', 'Provisional assignment for Bandar Puteri cluster'),
    ('47301', 'kelana_jaya', 'Kelana Jaya / SS6', 'Selangor', 'Provisional assignment for Kelana Jaya cluster'),
    ('47400', 'tropicana', 'Tropicana / Ara Damansara Fringe', 'Selangor', 'Provisional assignment for Tropicana north cluster'),
    ('47410', 'tropicana', 'Tropicana', 'Selangor', 'Tropicana cluster'),
    ('47500', 'subang_jaya', 'Subang Jaya / Bandar Sunway', 'Selangor', 'Subang regional center'),
    ('47800', 'bandar_utama', 'Bandar Utama / Damansara', 'Selangor', 'Bandar Utama cluster'),
    ('47820', 'damansara_perdana', 'Damansara Perdana', 'Selangor', 'Damansara Perdana cluster'),
    ('48000', 'batu_arang', 'Batu Arang', 'Selangor', 'Provisional assignment for Batu Arang cluster'),
    ('60000', 'ttdi', 'TTDI / Damansara Heights', 'Kuala Lumpur', 'Provisional assignment for TTDI cluster'),
    ('63000', 'putrajaya_sentral', 'Cyberjaya / Putrajaya', 'Selangor', 'Provisional assignment for Cyberjaya cluster'),
    ('68000', 'bukit_antarabangsa', 'Bukit Antarabangsa', 'Selangor', 'Provisional assignment for hillside cluster'),
    ('68100', 'taman_melati', 'Taman Melati / Setapak', 'Selangor', 'Provisional assignment for Taman Melati cluster'),
    ('47000', 'sungai_buloh', 'Sungai Buloh', 'Selangor', 'Northern gateway cluster'),
    ('47610', 'usj_7', 'USJ 7', 'Selangor', 'USJ station corridor'),
    ('47650', 'putra_heights', 'Putra Heights', 'Selangor', 'Southwest interchange cluster'),
    ('47810', 'kota_damansara', 'Kota Damansara', 'Selangor', 'Kota Damansara cluster'),
    ('62000', 'putrajaya_sentral', 'Putrajaya Sentral', 'Putrajaya', 'Southern transport hub')
) as mapping(postal_code, station_code, station_area_name, state_name, notes)
join public.stations on stations.code = mapping.station_code
on conflict (postal_code) do update
set
  station_id = excluded.station_id,
  station_area_name = excluded.station_area_name,
  state_name = excluded.state_name,
  assignment_method = excluded.assignment_method,
  notes = excluded.notes,
  updated_at = now();

update public.areas
set station_area_mapping_id = mappings.id
from public.postal_code_station_area_mappings mappings
where public.areas.area_level = 2
  and public.areas.postal_code is not null
  and public.areas.postal_code = mappings.postal_code;
