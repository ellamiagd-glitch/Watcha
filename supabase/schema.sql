-- WhosView — database schema (PostgreSQL / Supabase)
-- Run this FIRST in the Supabase SQL editor, then run seed.sql for demo data.
-- The TypeScript types in src/lib/types.ts mirror these tables.

-- ---------------------------------------------------------------------------
-- Profiles
-- id is the profile's own key so demo profiles can exist without a login.
-- auth_id links a profile to a real signed-in user (null for demo accounts).
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id           uuid primary key default gen_random_uuid(),
  auth_id      uuid unique references auth.users (id) on delete set null,
  username     text unique not null,
  display_name text not null,
  bio          text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Friendships (store one row per direction for simple queries)
-- ---------------------------------------------------------------------------
create table if not exists friendships (
  user_id    uuid not null references profiles (id) on delete cascade,
  friend_id  uuid not null references profiles (id) on delete cascade,
  status     text not null default 'accepted',  -- 'pending' | 'accepted'
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id)
);

-- ---------------------------------------------------------------------------
-- Titles (movies & shows). Later, back this with a movie-database API sync.
-- ---------------------------------------------------------------------------
create table if not exists titles (
  id           uuid primary key default gen_random_uuid(),
  external_id  text,                       -- e.g. TMDB id, when synced
  name         text not null,
  type         text not null,              -- 'movie' | 'show'
  year         int,
  service      text,                       -- Netflix, Disney+, ...
  runtime_mins int,
  genres       text[] default '{}',
  tagline      text
);

-- ---------------------------------------------------------------------------
-- Activity / presence (what people are watching)
-- ---------------------------------------------------------------------------
create table if not exists activity (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles (id) on delete cascade,
  title_id      uuid not null references titles (id) on delete cascade,
  status        text not null default 'watching',  -- 'watching' | 'finished'
  progress      int  not null default 0,           -- 0..100
  season        int,
  episode       int,
  episode_title text,
  started_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists activity_user_idx on activity (user_id, updated_at desc);

-- ---------------------------------------------------------------------------
-- Lists & list items (Letterboxd-style public collections)
-- ---------------------------------------------------------------------------
create table if not exists lists (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references profiles (id) on delete cascade,
  title       text not null,
  description text,
  is_public   boolean not null default true,
  likes       int  not null default 0,   -- denormalized count for display
  created_at  timestamptz not null default now()
);

create table if not exists list_items (
  list_id  uuid not null references lists (id) on delete cascade,
  title_id uuid not null references titles (id) on delete cascade,
  rank     int  not null default 0,
  note     text,
  primary key (list_id, title_id)
);

create table if not exists list_likes (
  list_id uuid not null references lists (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  primary key (list_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Auto-create a profile whenever a new auth user signs up.
-- Username/display name come from the sign-up metadata when provided.
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (auth_id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (username) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security — readable publicly, writable only by the owner.
-- "mine(uuid)" checks whether a profile row belongs to the current auth user.
-- ---------------------------------------------------------------------------
create or replace function mine(profile uuid)
returns boolean
language sql stable
as $$
  select exists (
    select 1 from profiles p where p.id = profile and p.auth_id = auth.uid()
  );
$$;

alter table profiles    enable row level security;
alter table friendships enable row level security;
alter table activity    enable row level security;
alter table titles       enable row level security;
alter table lists       enable row level security;
alter table list_items  enable row level security;
alter table list_likes  enable row level security;

create policy "profiles readable"   on profiles   for select using (true);
create policy "profiles self-write" on profiles   for update using (auth_id = auth.uid());

create policy "titles readable"     on titles     for select using (true);

create policy "friendships readable" on friendships for select using (true);
create policy "friendships self"     on friendships for all
  using (mine(user_id)) with check (mine(user_id));

create policy "activity readable"   on activity   for select using (true);
create policy "activity self-write" on activity   for all
  using (mine(user_id)) with check (mine(user_id));

create policy "lists readable"      on lists      for select using (is_public or mine(owner_id));
create policy "lists owner-write"   on lists      for all
  using (mine(owner_id)) with check (mine(owner_id));

create policy "list items readable" on list_items for select using (true);
create policy "list items owner"    on list_items for all
  using (exists (select 1 from lists l where l.id = list_id and mine(l.owner_id)))
  with check (exists (select 1 from lists l where l.id = list_id and mine(l.owner_id)));

create policy "list likes readable" on list_likes for select using (true);
create policy "list likes self"     on list_likes for all
  using (mine(user_id)) with check (mine(user_id));

-- ---------------------------------------------------------------------------
-- Realtime: broadcast activity changes so the "watching now" feed is live.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table activity;
