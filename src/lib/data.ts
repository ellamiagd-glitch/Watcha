import type { Activity, List, Profile, Title } from "./types";

// ---------------------------------------------------------------------------
// SEED DATA
// This is stand-in data so the product runs and looks real before Supabase is
// connected. Accessor functions at the bottom are async on purpose: swapping to
// Supabase later means changing only their bodies, not any UI code.
// ---------------------------------------------------------------------------

export const CURRENT_USER_ID = "u_ella";

export const profiles: Profile[] = [
  {
    id: "u_ella",
    username: "ella",
    displayName: "Ella",
    bio: "Slow TV, fast gin. Lover of a limited series and a good twist.",
    friendIds: ["u_mia", "u_theo", "u_sana", "u_jon", "u_priya", "u_leo"],
  },
  {
    id: "u_mia",
    username: "mia",
    displayName: "Mia Chen",
    bio: "Horror in October, rom-coms the rest of the year.",
    friendIds: ["u_ella", "u_theo", "u_leo"],
  },
  {
    id: "u_theo",
    username: "theo",
    displayName: "Theo Park",
    bio: "If it has a heist, I'm in.",
    friendIds: ["u_ella", "u_mia", "u_sana"],
  },
  {
    id: "u_sana",
    username: "sana",
    displayName: "Sana Ali",
    bio: "Prestige drama apologist.",
    friendIds: ["u_ella", "u_theo", "u_priya"],
  },
  {
    id: "u_jon",
    username: "jon",
    displayName: "Jon Reyes",
    bio: "Documentaries & anything with a map on the poster.",
    friendIds: ["u_ella", "u_priya"],
  },
  {
    id: "u_priya",
    username: "priya",
    displayName: "Priya Nair",
    bio: "Comfort shows on loop. Ask me about my rewatch count.",
    friendIds: ["u_ella", "u_jon", "u_sana"],
  },
  {
    id: "u_leo",
    username: "leo",
    displayName: "Leo Fontaine",
    bio: "Sci-fi, sport docs, and exactly one cooking show.",
    friendIds: ["u_ella", "u_mia"],
  },
];

export const titles: Title[] = [
  { id: "t1", name: "The Silent Harbor", type: "show", year: 2025, service: "Netflix", genres: ["Thriller", "Mystery"], tagline: "Everyone in town is lying.", runtimeMins: 52 },
  { id: "t2", name: "Neon Avenue", type: "movie", year: 2024, service: "Max", genres: ["Sci-Fi", "Action"], tagline: "The future has a pulse.", runtimeMins: 128 },
  { id: "t3", name: "Last Orders", type: "show", year: 2026, service: "Prime Video", genres: ["Drama", "Comedy"], tagline: "A pub. A family. A reckoning.", runtimeMins: 44 },
  { id: "t4", name: "Paper Kingdom", type: "show", year: 2025, service: "Apple TV+", genres: ["Drama"], tagline: "Power is a paper crown.", runtimeMins: 58 },
  { id: "t5", name: "Midnight Cartographer", type: "movie", year: 2023, service: "Netflix", genres: ["Adventure", "Drama"], tagline: "Some maps lead inward.", runtimeMins: 117 },
  { id: "t6", name: "Glasshouse", type: "show", year: 2024, service: "Hulu", genres: ["Horror", "Mystery"], tagline: "Nothing stays hidden in the light.", runtimeMins: 49 },
  { id: "t7", name: "The Understudy", type: "movie", year: 2026, service: "Disney+", genres: ["Comedy", "Romance"], tagline: "Second billing, first love.", runtimeMins: 104 },
  { id: "t8", name: "Ironwood", type: "show", year: 2022, service: "Max", genres: ["Western", "Drama"], tagline: "The frontier keeps its debts.", runtimeMins: 55 },
  { id: "t9", name: "Saltwater", type: "movie", year: 2025, service: "Apple TV+", genres: ["Drama", "Romance"], tagline: "The tide always comes back.", runtimeMins: 112 },
  { id: "t10", name: "Protocol Seven", type: "show", year: 2026, service: "Prime Video", genres: ["Sci-Fi", "Thriller"], tagline: "Trust the system. It's listening.", runtimeMins: 47 },
  { id: "t11", name: "Honey & Smoke", type: "show", year: 2025, service: "Netflix", genres: ["Comedy"], tagline: "A kitchen at war with itself.", runtimeMins: 31 },
  { id: "t12", name: "The Long Field", type: "movie", year: 2021, service: "Hulu", genres: ["Drama"], tagline: "Home is a direction, not a place.", runtimeMins: 134 },
  { id: "t13", name: "Cold Open", type: "show", year: 2024, service: "Max", genres: ["Comedy", "Drama"], tagline: "Live from the edge of a breakdown.", runtimeMins: 38 },
  { id: "t14", name: "Verdigris", type: "movie", year: 2026, service: "Disney+", genres: ["Fantasy", "Adventure"], tagline: "The green runs deep.", runtimeMins: 141 },
  { id: "t15", name: "Static Bloom", type: "show", year: 2025, service: "Apple TV+", genres: ["Sci-Fi", "Drama"], tagline: "Love in a signal that won't die.", runtimeMins: 51 },
  { id: "t16", name: "Nightmarket", type: "show", year: 2023, service: "Netflix", genres: ["Crime", "Thriller"], tagline: "Everything's for sale after dark.", runtimeMins: 46 },
];

export const activities: Activity[] = [
  // Currently watching (live)
  { id: "a1", userId: "u_mia", titleId: "t1", status: "watching", progress: 38, minutesAgo: 2, season: 2, episode: 4, episodeTitle: "The Fog Returns" },
  { id: "a2", userId: "u_leo", titleId: "t10", status: "watching", progress: 61, minutesAgo: 5, season: 1, episode: 7, episodeTitle: "Failsafe" },
  { id: "a3", userId: "u_priya", titleId: "t11", status: "watching", progress: 12, minutesAgo: 1, season: 3, episode: 2, episodeTitle: "The Sous-Chef Incident" },
  { id: "a4", userId: "u_theo", titleId: "t2", status: "watching", progress: 74, minutesAgo: 9 },
  // Recently finished
  { id: "a5", userId: "u_sana", titleId: "t4", status: "finished", progress: 100, minutesAgo: 48, season: 1, episode: 10, episodeTitle: "Coronation" },
  { id: "a6", userId: "u_jon", titleId: "t5", status: "finished", progress: 100, minutesAgo: 95 },
  { id: "a7", userId: "u_mia", titleId: "t6", status: "finished", progress: 100, minutesAgo: 190, season: 1, episode: 6, episodeTitle: "Daylight" },
  { id: "a8", userId: "u_priya", titleId: "t3", status: "finished", progress: 100, minutesAgo: 320, season: 2, episode: 1, episodeTitle: "Reopening" },
  { id: "a9", userId: "u_theo", titleId: "t16", status: "finished", progress: 100, minutesAgo: 540, season: 1, episode: 8 },
  { id: "a10", userId: "u_leo", titleId: "t15", status: "finished", progress: 100, minutesAgo: 1510, season: 1, episode: 3, episodeTitle: "Carrier Wave" },
  { id: "a11", userId: "u_ella", titleId: "t9", status: "finished", progress: 100, minutesAgo: 60 },
  { id: "a12", userId: "u_ella", titleId: "t1", status: "watching", progress: 20, minutesAgo: 1400, season: 2, episode: 2, episodeTitle: "Low Tide" },
];

export const lists: List[] = [
  { id: "l1", ownerId: "u_ella", title: "Twist endings that earned it", description: "No cheap gotchas — finales that recontextualise everything you watched.", isPublic: true, titleIds: ["t1", "t6", "t10", "t16", "t4"], likes: 214 },
  { id: "l2", ownerId: "u_sana", title: "Prestige drama starter pack", description: "If you're new to the good stuff, start here.", isPublic: true, titleIds: ["t4", "t8", "t9", "t12"], likes: 388 },
  { id: "l3", ownerId: "u_priya", title: "Comfort rewatches", description: "Low stakes, high warmth. On in the background, in my heart forever.", isPublic: true, titleIds: ["t11", "t3", "t13", "t7"], likes: 176 },
  { id: "l4", ownerId: "u_leo", title: "Sci-fi that respects you", description: "Big ideas, no hand-holding.", isPublic: true, titleIds: ["t2", "t10", "t15", "t14"], likes: 452 },
  { id: "l5", ownerId: "u_theo", title: "One perfect heist", description: "Films and shows built around a single beautiful job.", isPublic: true, titleIds: ["t2", "t16", "t5"], likes: 129 },
  { id: "l6", ownerId: "u_mia", title: "Lights off, volume up", description: "Horror and dread, best watched between your fingers.", isPublic: true, titleIds: ["t6", "t1", "t16"], likes: 301 },
];

// ---------------------------------------------------------------------------
// ACCESSORS (async to match the future Supabase data layer)
// ---------------------------------------------------------------------------

export async function getCurrentUser(): Promise<Profile> {
  return profiles.find((p) => p.id === CURRENT_USER_ID)!;
}

export async function getProfileByUsername(username: string): Promise<Profile | undefined> {
  return profiles.find((p) => p.username === username);
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  return profiles.find((p) => p.id === id);
}

export async function getTitle(id: string): Promise<Title | undefined> {
  return titles.find((t) => t.id === id);
}

export interface ActivityView {
  activity: Activity;
  user: Profile;
  title: Title;
}

function toView(a: Activity): ActivityView {
  return {
    activity: a,
    user: profiles.find((p) => p.id === a.userId)!,
    title: titles.find((t) => t.id === a.titleId)!,
  };
}

// Friends' activity, newest first.
export async function getFriendFeed(userId: string = CURRENT_USER_ID): Promise<ActivityView[]> {
  const me = profiles.find((p) => p.id === userId)!;
  return activities
    .filter((a) => me.friendIds.includes(a.userId))
    .sort((a, b) => a.minutesAgo - b.minutesAgo)
    .map(toView);
}

// Friends currently watching something.
export async function getLiveNow(userId: string = CURRENT_USER_ID): Promise<ActivityView[]> {
  const me = profiles.find((p) => p.id === userId)!;
  return activities
    .filter((a) => me.friendIds.includes(a.userId) && a.status === "watching")
    .sort((a, b) => a.minutesAgo - b.minutesAgo)
    .map(toView);
}

export async function getFriends(userId: string = CURRENT_USER_ID): Promise<Profile[]> {
  const me = profiles.find((p) => p.id === userId)!;
  return me.friendIds.map((id) => profiles.find((p) => p.id === id)!);
}

// Most recent activity for each friend (for the friends rail).
export async function getFriendStatuses(userId: string = CURRENT_USER_ID): Promise<
  { user: Profile; latest?: ActivityView }[]
> {
  const friends = await getFriends(userId);
  return friends.map((user) => {
    const latest = activities
      .filter((a) => a.userId === user.id)
      .sort((a, b) => a.minutesAgo - b.minutesAgo)[0];
    return { user, latest: latest ? toView(latest) : undefined };
  });
}

export interface ListView extends List {
  owner: Profile;
  titles: Title[];
}

function toListView(l: List): ListView {
  return {
    ...l,
    owner: profiles.find((p) => p.id === l.ownerId)!,
    titles: l.titleIds.map((id) => titles.find((t) => t.id === id)!),
  };
}

export async function getPublicLists(): Promise<ListView[]> {
  return lists.filter((l) => l.isPublic).sort((a, b) => b.likes - a.likes).map(toListView);
}

export async function getList(id: string): Promise<ListView | undefined> {
  const l = lists.find((x) => x.id === id);
  return l ? toListView(l) : undefined;
}

export async function getListsByOwner(ownerId: string): Promise<ListView[]> {
  return lists.filter((l) => l.ownerId === ownerId).map(toListView);
}

export async function getUserActivity(userId: string): Promise<ActivityView[]> {
  return activities
    .filter((a) => a.userId === userId)
    .sort((a, b) => a.minutesAgo - b.minutesAgo)
    .map(toView);
}
