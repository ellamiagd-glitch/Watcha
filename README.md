# WhosView

See what your friends are watching in real time, build public lists of your
favourite shows and films, and (soon) sync up for watch parties.

Think **Spotify's friend activity** meets **Letterboxd's lists**, with a
**Teleparty-style** watch-along layered on top.

---

## What's built so far

A complete, running **social dashboard** (the web app), using realistic seed
data so you can see and feel the product before any backend is connected:

- **Home** — a live "Watching now" rail, a friend activity feed, a friends
  panel, and popular lists.
- **Lists** — browse public lists; open a list to see its titles.
- **Profiles** — a user's bio, what they're watching, their lists and history.
- **Watch party** — a roadmap page describing the synced-viewing feature.

Design system: black / white / blue / red, dark and cinematic. See
[`DESIGN.md`](./DESIGN.md).

## Tech

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** for styling
- **Supabase** (Postgres + Auth + Realtime) — schema ready, wiring optional

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. No environment variables are needed to run on
the seed data.

## Project structure

```
src/
  app/                 # pages (routes)
    page.tsx           #   / — dashboard
    lists/             #   /lists and /lists/[id]
    profile/[username] #   /profile/ella
    party/             #   /party
  components/          # UI building blocks (poster, avatar, feed, nav…)
  lib/
    types.ts           # domain types (mirror the Supabase tables)
    data.ts            # SEED DATA + accessor functions (swap point for Supabase)
    ui.ts              # presentation helpers (generated art, time-ago)
    supabase.ts        # Supabase client (used once credentials are added)
supabase/
  schema.sql           # database schema to run in Supabase
```

The accessor functions in `lib/data.ts` are deliberately `async`. Going live is
a matter of changing their bodies to query Supabase — **no UI code changes.**

## Going live (when you're ready)

1. **Create a Supabase project** at supabase.com.
2. In the Supabase **SQL editor**, run [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy `.env.local.example` to `.env.local` and fill in your project URL and
   anon key (Supabase → Project Settings → API).
4. Migrate the functions in `lib/data.ts` to read from Supabase, add email /
   social login, and subscribe the "Watching now" feed to Supabase Realtime.
5. **Deploy** by pushing to GitHub and importing the repo in
   [Vercel](https://vercel.com) — add the same two env vars there.

## Roadmap

- **Auth & real data** — Supabase login; lists, activity and friends persisted.
- **Live presence** — Realtime updates so the feed moves as friends watch.
- **Browser extension** — detects what you're watching on streaming services
  and powers the Teleparty-style synced watch parties. (Separate project; this
  app is the hub it reports into.)

> Note on watch parties: streaming video is DRM-protected, so everyone needs
> their own subscription — WhosView syncs *play/pause/seek*, never the video
> itself. This is how Teleparty works too.
