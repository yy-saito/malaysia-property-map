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
