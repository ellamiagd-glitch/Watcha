import Link from "next/link";
import type { ActivityView } from "@/lib/data";
import { timeAgo } from "@/lib/ui";
import { Avatar } from "./avatar";
import { Poster } from "./poster";
import { Icon } from "./icon";

function episodeLabel(v: ActivityView): string | null {
  const { season, episode, episodeTitle } = v.activity;
  if (season && episode) {
    return `S${season}·E${episode}${episodeTitle ? ` — ${episodeTitle}` : ""}`;
  }
  return null;
}

// Big "watching now" card used in the live rail.
export function LiveCard({ view }: { view: ActivityView }) {
  const { user, title, activity } = view;
  const ep = episodeLabel(view);
  return (
    <div className="card w-[260px] shrink-0 overflow-hidden p-3">
      <div className="relative">
        <Poster title={title} size="sm" />
        <button
          className="absolute inset-0 m-auto grid h-12 w-12 place-items-center rounded-full bg-brand/90 text-white opacity-0 shadow-lg transition hover:bg-brand focus-visible:opacity-100 group-hover:opacity-100"
          aria-label={`Join ${user.displayName}'s watch party`}
        >
          <Icon name="play" size={22} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <Link href={`/profile/${user.username}`}>
          <Avatar profile={user} size="sm" live />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/profile/${user.username}`}
            className="block truncate text-sm font-semibold hover:underline"
          >
            {user.displayName}
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-live">
            <Icon name="dot" size={10} className="animate-livedot" />
            Watching now
          </div>
        </div>
      </div>

      {ep && <p className="mt-2 truncate text-xs text-muted">{ep}</p>}

      {/* progress */}
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-live" style={{ width: `${activity.progress}%` }} />
      </div>
    </div>
  );
}

// Compact feed row.
export function FeedItem({ view }: { view: ActivityView }) {
  const { user, title, activity } = view;
  const ep = episodeLabel(view);
  const watching = activity.status === "watching";
  return (
    <div className="flex items-center gap-3.5 rounded-xl px-2 py-2.5 transition hover:bg-white/[0.03]">
      <Link href={`/profile/${user.username}`} className="shrink-0">
        <Avatar profile={user} live={watching} />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">
          <Link href={`/profile/${user.username}`} className="font-semibold hover:underline">
            {user.displayName}
          </Link>{" "}
          <span className="text-muted">{watching ? "is watching" : "finished"}</span>{" "}
          <span className="font-medium text-txt">{title.name}</span>
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
          {ep && <span className="truncate">{ep}</span>}
          {ep && <span aria-hidden>·</span>}
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" size={12} />
            {timeAgo(activity.minutesAgo)}
          </span>
        </div>
      </div>

      <button
        className="hidden shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-line2 hover:text-txt sm:inline-flex"
        aria-label={`Add ${title.name} to a list`}
      >
        <Icon name="plus" size={14} />
        List
      </button>

      <Link href={`/lists`} className="w-11 shrink-0" aria-label={title.name}>
        <Poster title={title} art />
      </Link>
    </div>
  );
}
