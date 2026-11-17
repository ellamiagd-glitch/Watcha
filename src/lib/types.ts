// Domain types for WhosView.
// These mirror the planned Supabase tables so the data layer can be swapped
// from seed data to the real database without changing the UI.

export type Service =
  | "Netflix"
  | "Disney+"
  | "Prime Video"
  | "Max"
  | "Apple TV+"
  | "Hulu";

export type TitleType = "movie" | "show";

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  // Friends are modelled as a simple list of profile ids for the seed.
  friendIds: string[];
}

export interface Title {
  id: string;
  name: string;
  type: TitleType;
  year: number;
  service: Service;
  runtimeMins?: number;
  genres: string[];
  tagline?: string;
}

export interface Activity {
  id: string;
  userId: string;
  titleId: string;
  status: "watching" | "finished";
  // percent through the current title/episode
  progress: number;
  // minutes before "now" — keeps the demo feed stable without date math
  minutesAgo: number;
  // for shows
  season?: number;
  episode?: number;
  episodeTitle?: string;
}

export interface List {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  isPublic: boolean;
  titleIds: string[];
  likes: number;
}
