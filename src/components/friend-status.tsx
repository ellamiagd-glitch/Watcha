import Link from "next/link";
import type { ActivityView } from "@/lib/data";
import type { Profile } from "@/lib/types";
import { timeAgo } from "@/lib/ui";
import { Avatar } from "./avatar";

export function FriendStatus({
  user,
  latest,
}: {
  user: Profile;
  latest?: ActivityView;
}) {
  const watching = latest?.activity.status === "watching";
  return (
    <Link
      href={`/profile/${user.username}`}
      className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/[0.03]"
    >
      <Avatar profile={user} size="sm" live={watching} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{user.displayName}</div>
        {latest ? (
          <div className="truncate text-xs text-muted">
            {watching ? (
              <span className="text-live">Watching {latest.title.name}</span>
            ) : (
              <span>
                {latest.title.name} · {timeAgo(latest.activity.minutesAgo)}
              </span>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted">No recent activity</div>
        )}
      </div>
    </Link>
  );
}
