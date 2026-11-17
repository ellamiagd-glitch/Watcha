import type { Activity, List, Profile, Service, Title } from "./types";
import { createClient } from "./supabase/server";

// ---------------------------------------------------------------------------
// DATA ACCESS LAYER — backed by Supabase.
// Function signatures match what the UI already expects; only the bodies query
// the database. When logged out (or for the demo fallback), reads use the anon
// publishable key, which the "readable" RLS policies allow.
// ---------------------------------------------------------------------------

type Db = Awaited<ReturnType<typeof createClient>>;

// --- DB row shapes (untyped client, so we describe what we select) ----------
interface DbProfile {
  id: string;
  auth_id: string | null;
  username: string;
  display_name: string;
  bio: string | null;
}
interface DbTitle {
  id: string;
  name: string;
  type: "movie" | "show";
  year: number;
  service: string;
  runtime_mins: number | null;
  genres: string[] | null;
  tagline: string | null;
}
interface DbActivity {
  id: string;
  user_id: string;
  title_id: string;
  status: "watching" | "finished";
  progress: number;
  season: number | null;
  episode: number | null;
  episode_title: string | null;
  updated_at: string;
  user?: DbProfile;
  title?: DbTitle;
}
interface DbListItem {
  rank: number;
  titles: DbTitle;
}
interface DbList {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  likes: number;
  owner?: DbProfile;
  list_items?: DbListItem[];
}

// --- Mappers (DB snake_case → app camelCase view types) ---------------------
function mapTitle(r: DbTitle): Title {
  return {
    id: r.id,
    name: r.name,
    type: r.type,
    year: r.year,
    service: r.service as Service,
    runtimeMins: r.runtime_mins ?? undefined,
    genres: r.genres ?? [],
    tagline: r.tagline ?? undefined,
  };
}

function mapProfile(r: DbProfile, friendIds: string[] = []): Profile {
  return {
    id: r.id,
    username: r.username,
    displayName: r.display_name,
    bio: r.bio ?? undefined,
    friendIds,
  };
}

function minutesSince(ts: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(ts).getTime()) / 60000));
}

function mapActivity(r: DbActivity): Activity {
  return {
    id: r.id,
    userId: r.user_id,
    titleId: r.title_id,
    status: r.status,
    progress: r.progress,
    minutesAgo: minutesSince(r.updated_at),
    season: r.season ?? undefined,
    episode: r.episode ?? undefined,
    episodeTitle: r.episode_title ?? undefined,
  };
}

export interface ActivityView {
  activity: Activity;
  user: Profile;
  title: Title;
}

function mapActivityView(r: DbActivity): ActivityView {
  return {
    activity: mapActivity(r),
    user: mapProfile(r.user!),
    title: mapTitle(r.title!),
  };
}

export interface ListView extends List {
  owner: Profile;
  titles: Title[];
}

function mapListView(r: DbList): ListView {
  const items = (r.list_items ?? []).slice().sort((a, b) => a.rank - b.rank);
  const titles = items.map((li) => mapTitle(li.titles));
  return {
    id: r.id,
    ownerId: r.owner_id,
    title: r.title,
    description: r.description ?? "",
    isPublic: r.is_public,
    likes: r.likes,
    titleIds: titles.map((t) => t.id),
    owner: mapProfile(r.owner!),
    titles,
  };
}

// --- Current user resolution ------------------------------------------------
async function currentProfileRow(db: Db): Promise<DbProfile | null> {
  const {
    data: { user },
  } = await db.auth.getUser();
  if (user) {
    const { data } = await db
      .from("profiles")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();
    if (data) return data as DbProfile;
  }
  // Demo fallback so the app is populated before anyone signs in.
  const { data } = await db
    .from("profiles")
    .select("*")
    .eq("username", "ella")
    .maybeSingle();
  return (data as DbProfile) ?? null;
}

async function currentProfileId(db: Db): Promise<string | null> {
  const row = await currentProfileRow(db);
  return row?.id ?? null;
}

async function friendIdsOf(db: Db, profileId: string): Promise<string[]> {
  const { data } = await db
    .from("friendships")
    .select("friend_id")
    .eq("user_id", profileId);
  return (data ?? []).map((r: { friend_id: string }) => r.friend_id);
}

const ACTIVITY_SELECT = "*, user:profiles(*), title:titles(*)";
const LIST_SELECT = "*, owner:profiles(*), list_items(rank, titles(*))";

// --- Public API -------------------------------------------------------------
export async function getCurrentUser(): Promise<Profile | null> {
  const db = await createClient();
  const row = await currentProfileRow(db);
  if (!row) return null;
  const friendIds = await friendIdsOf(db, row.id);
  return mapProfile(row, friendIds);
}

export async function getProfileByUsername(username: string): Promise<Profile | undefined> {
  const db = await createClient();
  const { data } = await db
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (!data) return undefined;
  const friendIds = await friendIdsOf(db, data.id);
  return mapProfile(data as DbProfile, friendIds);
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  const db = await createClient();
  const { data } = await db.from("profiles").select("*").eq("id", id).maybeSingle();
  return data ? mapProfile(data as DbProfile) : undefined;
}

export async function getTitle(id: string): Promise<Title | undefined> {
  const db = await createClient();
  const { data } = await db.from("titles").select("*").eq("id", id).maybeSingle();
  return data ? mapTitle(data as DbTitle) : undefined;
}

// Friends' activity, newest first (falls back to everyone when you have no
// friends yet, so a brand-new account still sees a living feed).
export async function getFriendFeed(userId?: string): Promise<ActivityView[]> {
  const db = await createClient();
  const uid = userId ?? (await currentProfileId(db));
  if (!uid) return [];
  const friendIds = await friendIdsOf(db, uid);

  let query = db.from("activity").select(ACTIVITY_SELECT).order("updated_at", { ascending: false }).limit(25);
  query = friendIds.length ? query.in("user_id", friendIds) : query.neq("user_id", uid);

  const { data } = await query;
  return (data ?? []).map((r) => mapActivityView(r as DbActivity));
}

export async function getLiveNow(userId?: string): Promise<ActivityView[]> {
  const db = await createClient();
  const uid = userId ?? (await currentProfileId(db));
  if (!uid) return [];
  const friendIds = await friendIdsOf(db, uid);

  let query = db
    .from("activity")
    .select(ACTIVITY_SELECT)
    .eq("status", "watching")
    .order("updated_at", { ascending: false });
  query = friendIds.length ? query.in("user_id", friendIds) : query.neq("user_id", uid);

  const { data } = await query;
  return (data ?? []).map((r) => mapActivityView(r as DbActivity));
}

export async function getFriends(userId?: string): Promise<Profile[]> {
  const db = await createClient();
  const uid = userId ?? (await currentProfileId(db));
  if (!uid) return [];
  const friendIds = await friendIdsOf(db, uid);
  if (!friendIds.length) return [];
  const { data } = await db.from("profiles").select("*").in("id", friendIds);
  return (data ?? []).map((p) => mapProfile(p as DbProfile));
}

export async function getFriendStatuses(
  userId?: string,
): Promise<{ user: Profile; latest?: ActivityView }[]> {
  const db = await createClient();
  const uid = userId ?? (await currentProfileId(db));
  if (!uid) return [];
  const friends = await getFriends(uid);
  if (!friends.length) return [];

  const { data } = await db
    .from("activity")
    .select(ACTIVITY_SELECT)
    .in("user_id", friends.map((f) => f.id))
    .order("updated_at", { ascending: false });
  const rows = (data ?? []) as DbActivity[];

  return friends.map((user) => {
    const latest = rows.find((r) => r.user_id === user.id);
    return { user, latest: latest ? mapActivityView(latest) : undefined };
  });
}

export async function getPublicLists(): Promise<ListView[]> {
  const db = await createClient();
  const { data } = await db
    .from("lists")
    .select(LIST_SELECT)
    .eq("is_public", true)
    .order("likes", { ascending: false });
  return (data ?? []).map((r) => mapListView(r as DbList));
}

export async function getList(id: string): Promise<ListView | undefined> {
  const db = await createClient();
  const { data } = await db.from("lists").select(LIST_SELECT).eq("id", id).maybeSingle();
  return data ? mapListView(data as DbList) : undefined;
}

export async function getListsByOwner(ownerId: string): Promise<ListView[]> {
  const db = await createClient();
  const { data } = await db
    .from("lists")
    .select(LIST_SELECT)
    .eq("owner_id", ownerId)
    .order("likes", { ascending: false });
  return (data ?? []).map((r) => mapListView(r as DbList));
}

export async function getUserActivity(userId?: string): Promise<ActivityView[]> {
  const db = await createClient();
  const uid = userId ?? (await currentProfileId(db));
  if (!uid) return [];
  const { data } = await db
    .from("activity")
    .select(ACTIVITY_SELECT)
    .eq("user_id", uid)
    .order("updated_at", { ascending: false });
  return (data ?? []).map((r) => mapActivityView(r as DbActivity));
}
