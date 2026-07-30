-- BuyMeAGoddie — initial schema
-- Creator payment profiles. The platform never holds money; we only store
-- payment identifiers (e.g. UPI VPAs) used to build client-side deep links.

-- ============================================================
-- profiles: one row per auth user
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  username text unique,
  email text not null,
  bio text,
  country text not null default 'IN',
  avatar_url text,
  -- Denormalized copy of the default payment method for one-query profile reads.
  payment_method text,
  payment_identifier text,
  theme text not null default 'midnight',
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint username_format check (
    username is null or username ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  constraint username_length check (
    username is null or char_length(username) between 3 and 30
  ),
  constraint name_length check (char_length(name) <= 60),
  constraint bio_length check (bio is null or char_length(bio) <= 280)
);

-- ============================================================
-- payment_methods: generic rails (UPI today; Pix/PayNow/... later)
-- ============================================================
create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null,
  identifier text not null,
  country text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),

  constraint provider_known check (
    provider in ('upi', 'pix', 'paynow', 'promptpay', 'qris', 'sepa_instant', 'aani')
  ),
  constraint identifier_length check (char_length(identifier) between 3 and 256)
);

-- Exactly one default rail per user.
create unique index payment_methods_one_default
  on public.payment_methods (user_id)
  where is_default;

create index payment_methods_user_idx on public.payment_methods (user_id);

-- ============================================================
-- social_links
-- ============================================================
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  platform text not null,
  url text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),

  constraint platform_known check (
    platform in ('instagram', 'twitter', 'youtube', 'github', 'linkedin', 'website')
  ),
  constraint url_https check (url like 'https://%'),
  constraint url_length check (char_length(url) <= 300),
  constraint one_link_per_platform unique (user_id, platform)
);

create index social_links_user_idx on public.social_links (user_id);

-- ============================================================
-- settings: per-creator page options
-- ============================================================
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  show_qr boolean not null default true,
  show_social_links boolean not null default true,
  allow_custom_amount boolean not null default true,
  theme text not null default 'midnight',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint theme_known check (
    theme in ('midnight', 'aurora', 'sunset', 'daylight')
  )
);

-- ============================================================
-- Reserved usernames (enforced in DB, mirrored in app code)
-- ============================================================
create table public.reserved_usernames (
  username text primary key
);

insert into public.reserved_usernames (username) values
  ('admin'), ('administrator'), ('api'), ('app'), ('auth'), ('blog'),
  ('compare'), ('contact'), ('cookies'), ('dashboard'), ('docs'),
  ('feedback'), ('help'), ('home'), ('legal'), ('login'), ('logout'),
  ('me'), ('onboarding'), ('pricing'), ('privacy'), ('profile'),
  ('refunds'), ('root'), ('security'), ('settings'), ('signin'),
  ('signout'), ('signup'), ('sitemap'), ('static'), ('status'),
  ('support'), ('terms'), ('www');

create or replace function public.is_username_available(candidate text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    candidate ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    and char_length(candidate) between 3 and 30
    and not exists (select 1 from reserved_usernames r where r.username = candidate)
    and not exists (select 1 from profiles p where p.username = candidate);
$$;

-- Block reserved names at write time too.
create or replace function public.check_username_not_reserved()
returns trigger
language plpgsql
as $$
begin
  if new.username is not null and exists (
    select 1 from public.reserved_usernames r where r.username = new.username
  ) then
    raise exception 'Username "%" is reserved', new.username;
  end if;
  return new;
end;
$$;

create trigger profiles_username_not_reserved
  before insert or update of username on public.profiles
  for each row execute function public.check_username_not_reserved();

-- ============================================================
-- updated_at maintenance
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- ============================================================
-- Auto-provision profile + settings on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  insert into public.settings (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.payment_methods enable row level security;
alter table public.social_links enable row level security;
alter table public.settings enable row level security;
alter table public.reserved_usernames enable row level security;

-- profiles: public pages are public; only the owner can write.
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- payment_methods: readable by everyone (identifiers are public by design —
-- they appear in the payment deep link); writable only by the owner.
create policy "Payment methods are viewable by everyone"
  on public.payment_methods for select
  using (true);

create policy "Users can insert own payment methods"
  on public.payment_methods for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own payment methods"
  on public.payment_methods for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own payment methods"
  on public.payment_methods for delete
  using ((select auth.uid()) = user_id);

-- social_links
create policy "Social links are viewable by everyone"
  on public.social_links for select
  using (true);

create policy "Users can insert own social links"
  on public.social_links for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own social links"
  on public.social_links for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own social links"
  on public.social_links for delete
  using ((select auth.uid()) = user_id);

-- settings
create policy "Settings are viewable by everyone"
  on public.settings for select
  using (true);

create policy "Users can update own settings"
  on public.settings for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- reserved_usernames: read-only for everyone.
create policy "Reserved usernames are viewable by everyone"
  on public.reserved_usernames for select
  using (true);

-- ============================================================
-- Storage: avatars bucket
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp']);

create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );
