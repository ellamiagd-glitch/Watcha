-- WhosView — database schema (PostgreSQL / Supabase)
-- Run this in the Supabase SQL editor to create the tables the app expects.
-- The TypeScript types in src/lib/types.ts mirror these tables.

-- ---------------------------------------------------------------------------
-- Profiles (one row per user, linked to Supabase Auth)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     text unique not null,
  display_name text not null,
  bio          text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Friendships (symmetric: store one row per direction for simple queries)
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
-- Row Level Security — lock everything down, then open the safe paths.
-- (Start simple; tighten as the product grows.)
-- ---------------------------------------------------------------------------
alter table profiles    enable row level security;
alter table friendships enable row level security;
alter table activity    enable row level security;
alter table lists       enable row level security;
alter table list_items  enable row level security;
alter table list_likes  enable row level security;

-- Profiles: anyone signed in can read; you can only write your own.
create policy "profiles readable" on profiles for select using (true);
create policy "profiles self-write" on profiles for update using (auth.uid() = id);
create policy "profiles self-insert" on profiles for insert with check (auth.uid() = id);

-- Activity: readable by everyone signed in; you write only your own.
create policy "activity readable" on activity for select using (true);
create policy "activity self-write" on activity for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Lists: public lists readable by all; owners manage their own.
create policy "lists public readable" on lists for select
  using (is_public or owner_id = auth.uid());
create policy "lists owner-write" on lists for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "list items readable" on list_items for select using (true);
create policy "list items owner-write" on list_items for all
  using (exists (select 1 from lists l where l.id = list_id and l.owner_id = auth.uid()))
  with check (exists (select 1 from lists l where l.id = list_id and l.owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Realtime: broadcast activity changes so the "watching now" feed is live.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table activity;
